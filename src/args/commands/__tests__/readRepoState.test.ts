import { execSync } from 'child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import { readRepoState } from '../upload_ai_blame'

/**
 * Regression coverage for the AI-blame repo-attribution gap: events from
 * self-hosted / enterprise SCM hosts (which parseScmURL classifies as scmType
 * "Unknown") used to have their remote URL discarded to null, which both broke
 * attribution for those orgs and forced their events into the slow
 * "repository_url IS NULL" query branch. readRepoState must now keep the
 * (canonical) URL for Unknown hosts and only return null when no remote exists.
 */
describe('readRepoState', () => {
  let repoPath: string

  const initRepo = (remoteUrl?: string) => {
    repoPath = mkdtempSync(join(tmpdir(), 'read-repo-state-'))
    execSync('git init --initial-branch=main', {
      cwd: repoPath,
      stdio: 'ignore',
    })
    execSync('git config user.name "Test User"', {
      cwd: repoPath,
      stdio: 'ignore',
    })
    execSync('git config user.email "test@example.com"', {
      cwd: repoPath,
      stdio: 'ignore',
    })
    if (remoteUrl) {
      execSync(`git remote add origin ${remoteUrl}`, {
        cwd: repoPath,
        stdio: 'ignore',
      })
    }
    writeFileSync(join(repoPath, 'file.txt'), 'content')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync('git commit -m "init"', { cwd: repoPath, stdio: 'ignore' })
  }

  afterEach(() => {
    try {
      rmSync(repoPath, { recursive: true, force: true })
    } catch {
      // ignore cleanup errors
    }
  })

  it('keeps the URL for a self-hosted / enterprise remote (scmType "Unknown")', async () => {
    initRepo('https://gitlab.acme-internal.com/group/sub/repo.git')

    const state = await readRepoState(repoPath)

    // The bug: this used to be null. It must now be the canonical self-hosted URL.
    expect(state.repositoryUrl).toBeTruthy()
    expect(state.repositoryUrl).toContain('gitlab.acme-internal.com')
    expect(state.repositoryUrl).not.toContain('.git')
    expect(state.branch).toBe('main')
    expect(state.commitSha).toMatch(/^[0-9a-f]{40}$/)
  })

  it('keeps the canonical URL for a recognized cloud remote (GitHub)', async () => {
    initRepo('git@github.com:Mobb-Dev/example.git')

    const state = await readRepoState(repoPath)

    expect(state.repositoryUrl).toBe('https://github.com/mobb-dev/example')
  })

  it('returns a null repositoryUrl but real git state when there is no remote', async () => {
    initRepo()

    const state = await readRepoState(repoPath)

    expect(state.repositoryUrl).toBeNull()
    expect(state.branch).toBe('main')
    expect(state.commitSha).toMatch(/^[0-9a-f]{40}$/)
  })

  it('resolves an unparseable remote (e.g. a local path) to null, symmetric with the query side', async () => {
    // A local-filesystem remote is not an SCM URL parseScmURL can canonicalize.
    // The write side must store null (not the raw string) so it matches how the
    // AI-blame query canonicalizes the commit URL (parseScmURL().canonicalUrl ?? null).
    initRepo('/tmp/some/local/bare-repo.git')

    const state = await readRepoState(repoPath)

    expect(state.repositoryUrl).toBeNull()
    expect(state.branch).toBe('main')
    expect(state.commitSha).toMatch(/^[0-9a-f]{40}$/)
  })

  it('returns all-null for a non-existent directory (never throws)', async () => {
    const state = await readRepoState(join(tmpdir(), 'does-not-exist-xyz'))

    expect(state).toEqual({
      repositoryUrl: null,
      branch: null,
      commitSha: null,
      repoUrlCause: 'dir-missing',
    })
  })

  // T-538 Phase 3b: the three ways `repositoryUrl` can come back null were
  // previously indistinguishable in the uploaded data, which left a measured
  // 22.5% of null-repo events (git worked, only the remote lookup failed)
  // without an actionable diagnosis. Each needs a different fix, or none.
  describe('repoUrlCause', () => {
    it('reports ok when the remote resolves', async () => {
      initRepo('https://github.com/org/repo.git')

      const state = await readRepoState(repoPath)

      expect(state.repositoryUrl).not.toBeNull()
      expect(state.repoUrlCause).toBe('ok')
    })

    it('reports not-a-repo for a directory that is not a checkout', async () => {
      // The distinction that makes the histogram readable: `git config --get`
      // resolves outside a repository rather than throwing, so without an
      // explicit check this would report `no-remote` and label the dominant
      // 77.5% "cwd is not a git repo" bucket as the 22.5% one.
      repoPath = mkdtempSync(join(tmpdir(), 'read-repo-state-nongit-'))

      const state = await readRepoState(repoPath)

      expect(state.repositoryUrl).toBeNull()
      expect(state.repoUrlCause).toBe('not-a-repo')
      expect(state.branch).toBeNull()
      expect(state.commitSha).toBeNull()
    })

    it('does not relabel a broken-git environment as not-a-repo', async () => {
      // `remote-error` means git itself failed (missing binary, permissions), and
      // both HEAD reads fail too — so a looser not-a-repo override would file
      // these under "cwd is not a git repo", whose fix cannot help them. The
      // override is deliberately restricted to `no-remote` so they stay visible.
      const state = await readRepoState(join(tmpdir(), 'does-not-exist-xyz'))

      expect(state.repoUrlCause).not.toBe('not-a-repo')
      expect(state.repoUrlCause).toBe('dir-missing')
    })

    it('reports no-remote for a git repo with no origin configured', async () => {
      // `getRemoteUrl` reads `remote.origin.url` only, so a repo whose remote is
      // named anything else lands here too — indistinguishable until now.
      initRepo()

      const state = await readRepoState(repoPath)

      expect(state.repositoryUrl).toBeNull()
      expect(state.repoUrlCause).toBe('no-remote')
      // git itself still worked: this is the tractable half of the null
      // population, where a repo was found and only the URL lookup failed.
      expect(state.branch).toBe('main')
      expect(state.commitSha).toMatch(/^[0-9a-f]{40}$/)
    })

    it('reports unparseable for a remote parseScmURL cannot canonicalise', async () => {
      // Single-segment path: parseScmURL's unknown-host branch requires at least
      // two, so Gerrit-style remotes silently resolve to null today.
      initRepo('ssh://git@gerrit.example.com:29418/project')

      const state = await readRepoState(repoPath)

      expect(state.repositoryUrl).toBeNull()
      expect(state.repoUrlCause).toBe('unparseable')
    })
  })
})
