import { execSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { readRepoState } from '@mobb/bugsy/args/commands/upload_ai_blame'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const SHA40 = /^[0-9a-f]{40}$/
const REMOTE_URL = 'https://github.com/test-org/test-repo.git'

function git(repoDir: string, args: string): string {
  return execSync(`git ${args}`, {
    cwd: repoDir,
    stdio: ['ignore', 'pipe', 'ignore'],
  })
    .toString()
    .trim()
}

async function makeRepo(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tracy-readrepo-'))
  git(dir, 'init -q -b main')
  git(dir, 'config user.email "test@test.test"')
  git(dir, 'config user.name "Test"')
  git(dir, 'config commit.gpgsign false')
  await fs.writeFile(path.join(dir, 'a.txt'), 'hello\n')
  git(dir, 'add a.txt')
  git(dir, 'commit -q -m "init"')
  git(dir, `remote add origin ${REMOTE_URL}`)
  return dir
}

describe('readRepoState', () => {
  const dirs: string[] = []

  beforeAll(() => {
    // Sanity check that git is available; tests will silently fall back to
    // null-everything otherwise, masking regressions.
    execSync('git --version', { stdio: 'ignore' })
  })

  afterAll(async () => {
    await Promise.all(
      dirs.map((d) => fs.rm(d, { recursive: true, force: true }))
    )
  })

  it('returns full state for a normal repo with a recognized remote', async () => {
    const dir = await makeRepo()
    dirs.push(dir)

    const state = await readRepoState(dir)

    expect(state.branch).toBe('main')
    expect(state.commitSha).toMatch(SHA40)
    expect(state.repositoryUrl).toBeTruthy()
    // Canonicalized form drops the .git suffix; keep this loose so future
    // changes to parseScmURL.canonicalUrl stay compatible.
    expect(state.repositoryUrl?.toLowerCase()).toContain(
      'github.com/test-org/test-repo'
    )
  })

  it('returns null branch in detached-HEAD state, never the literal "HEAD"', async () => {
    const dir = await makeRepo()
    dirs.push(dir)

    const sha = git(dir, 'rev-parse HEAD')
    git(dir, `checkout -q --detach ${sha}`)

    const state = await readRepoState(dir)

    // The whole point of using `git symbolic-ref --short -q HEAD` over
    // `git rev-parse --abbrev-ref HEAD` is that the latter prints "HEAD"
    // here, which would silently corrupt branch attribution.
    expect(state.branch).toBeNull()
    expect(state.commitSha).toMatch(SHA40)
    expect(state.commitSha?.toLowerCase()).toBe(sha.toLowerCase())
  })

  it('returns null repositoryUrl when there is no remote configured', async () => {
    const dir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'tracy-readrepo-noremote-')
    )
    dirs.push(dir)
    git(dir, 'init -q -b main')
    git(dir, 'config user.email "test@test.test"')
    git(dir, 'config user.name "Test"')
    git(dir, 'config commit.gpgsign false')
    await fs.writeFile(path.join(dir, 'a.txt'), 'hello\n')
    git(dir, 'add a.txt')
    git(dir, 'commit -q -m "init"')

    const state = await readRepoState(dir)

    expect(state.repositoryUrl).toBeNull()
    // branch + commit are still readable — only the URL is missing.
    expect(state.branch).toBe('main')
    expect(state.commitSha).toMatch(SHA40)
  })

  it('returns all-null for a non-git directory without throwing', async () => {
    const dir = await fs.mkdtemp(
      path.join(os.tmpdir(), 'tracy-readrepo-nongit-')
    )
    dirs.push(dir)

    const state = await readRepoState(dir)

    expect(state).toEqual({
      repositoryUrl: null,
      branch: null,
      commitSha: null,
    })
  })

  it('returns all-null for a non-existent directory without throwing', async () => {
    // simpleGit() throws synchronously for missing dirs; readRepoState must
    // catch so the daemon hot path can rely on a value rather than a throw.
    const state = await readRepoState('/does/not/exist/anywhere/i/hope')

    expect(state).toEqual({
      repositoryUrl: null,
      branch: null,
      commitSha: null,
    })
  })
})
