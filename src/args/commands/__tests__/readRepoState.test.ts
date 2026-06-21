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
    })
  })
})
