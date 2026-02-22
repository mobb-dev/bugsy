import { execSync } from 'child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GitService } from '../GitService'

describe('GitService.getLocalCommitData', () => {
  let repoPath: string
  let gitService: GitService
  const logSpy = vi.fn()

  beforeEach(() => {
    // Create a temporary directory for each test
    repoPath = mkdtempSync(join(tmpdir(), 'git-local-commit-test-'))

    // Initialize git repo
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

    logSpy.mockClear()
  })

  afterEach(() => {
    // Clean up the temporary directory
    try {
      rmSync(repoPath, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
  })

  it('should return commit data with diff and timestamp', async () => {
    // Create initial commit
    writeFileSync(join(repoPath, 'file1.txt'), 'initial content')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync('git commit -m "Initial commit"', {
      cwd: repoPath,
      stdio: 'ignore',
    })

    // Create second commit (will have parent)
    writeFileSync(join(repoPath, 'file1.txt'), 'modified content')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync('git commit -m "Second commit"', {
      cwd: repoPath,
      stdio: 'ignore',
    })

    gitService = new GitService(repoPath, logSpy)
    const commitHash = await gitService.getCurrentCommitHash()
    const commitData = await gitService.getLocalCommitData(commitHash)

    expect(commitData).not.toBeNull()
    expect(commitData!.diff).toContain('modified content')
    expect(commitData!.timestamp).toBeInstanceOf(Date)
    expect(commitData!.author).toEqual({
      name: 'Test User',
      email: 'test@example.com',
    })
    expect(commitData!.committer).toEqual({
      name: 'Test User',
      email: 'test@example.com',
    })
    expect(commitData!.coAuthors).toEqual([])
  })

  it('should return null for non-existent commit', async () => {
    // Create at least one commit so the repo is valid
    writeFileSync(join(repoPath, 'file1.txt'), 'content')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync('git commit -m "Initial commit"', {
      cwd: repoPath,
      stdio: 'ignore',
    })

    gitService = new GitService(repoPath, logSpy)
    const commitData = await gitService.getLocalCommitData(
      '0000000000000000000000000000000000000000'
    )

    expect(commitData).toBeNull()
  })

  it('should return null when diff exceeds size limit', async () => {
    // Create a commit with some content
    writeFileSync(join(repoPath, 'file1.txt'), 'some content here')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync('git commit -m "Initial commit"', {
      cwd: repoPath,
      stdio: 'ignore',
    })

    gitService = new GitService(repoPath, logSpy)
    const commitHash = await gitService.getCurrentCommitHash()

    // Use a very small size limit to trigger the check
    const commitData = await gitService.getLocalCommitData(commitHash, 1)

    expect(commitData).toBeNull()
    expect(logSpy).toHaveBeenCalledWith(
      '[GitService] Commit diff exceeds size limit',
      'warning',
      expect.objectContaining({
        commitSha: commitHash,
        maxDiffSizeBytes: 1,
      })
    )
  })

  it('should include diff content in the output', async () => {
    // Create commit with specific content we can verify
    const testContent = 'unique-test-content-12345'
    mkdirSync(join(repoPath, 'src'), { recursive: true })
    writeFileSync(join(repoPath, 'src', 'test.ts'), testContent)
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync('git commit -m "Add test file"', {
      cwd: repoPath,
      stdio: 'ignore',
    })

    gitService = new GitService(repoPath, logSpy)
    const commitHash = await gitService.getCurrentCommitHash()
    const commitData = await gitService.getLocalCommitData(commitHash)

    expect(commitData).not.toBeNull()
    expect(commitData!.diff).toContain(testContent)
    expect(commitData!.diff).toContain('src/test.ts')
  })
})

/**
 * Integration tests for commit identity parsing in getLocalCommitData.
 *
 * Sets up a real git repo with commits containing:
 *   1. A simple commit (author == committer, no co-authors)
 *   2. A commit with one Co-authored-by trailer
 *   3. A commit with multiple Co-authored-by trailers
 *   4. A commit where author != committer
 */
describe('GitService.getLocalCommitData — identity parsing', () => {
  let repoPath: string
  let gitService: GitService
  const logSpy = vi.fn()
  const commitShas: string[] = []

  beforeEach(() => {
    repoPath = mkdtempSync(join(tmpdir(), 'git-identity-test-'))
    commitShas.length = 0

    execSync('git init --initial-branch=main', {
      cwd: repoPath,
      stdio: 'ignore',
    })
    execSync('git config user.name "Default User"', {
      cwd: repoPath,
      stdio: 'ignore',
    })
    execSync('git config user.email "default@test.com"', {
      cwd: repoPath,
      stdio: 'ignore',
    })

    // Commit 0: simple commit, no co-authors
    writeFileSync(join(repoPath, 'file.txt'), 'change 0')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync(
      'git commit -m "feat: first change" --author="Alice Dev <alice@dev.com>"',
      { cwd: repoPath, stdio: 'ignore' }
    )
    commitShas.push(
      execSync('git rev-parse HEAD', { cwd: repoPath }).toString().trim()
    )

    // Commit 1: one co-author
    writeFileSync(join(repoPath, 'file.txt'), 'change 1')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync(
      `git commit -m "feat: second change${'\n\n'}Co-authored-by: Bob Helper <bob@helper.com>" --author="Alice Dev <alice@dev.com>"`,
      { cwd: repoPath, stdio: 'ignore' }
    )
    commitShas.push(
      execSync('git rev-parse HEAD', { cwd: repoPath }).toString().trim()
    )

    // Commit 2: multiple co-authors
    writeFileSync(join(repoPath, 'file.txt'), 'change 2')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync(
      `git commit -m "feat: third change${'\n\n'}Co-authored-by: Carol <carol@test.com>${'\n'}Co-authored-by: Dave <dave@test.com>" --author="Alice Dev <alice@dev.com>"`,
      { cwd: repoPath, stdio: 'ignore' }
    )
    commitShas.push(
      execSync('git rev-parse HEAD', { cwd: repoPath }).toString().trim()
    )

    // Commit 3: different author and committer
    writeFileSync(join(repoPath, 'file.txt'), 'change 3')
    execSync('git add .', { cwd: repoPath, stdio: 'ignore' })
    execSync(
      'git commit -m "feat: fourth change" --author="Eve Author <eve@author.com>"',
      {
        cwd: repoPath,
        stdio: 'ignore',
        env: {
          ...process.env,
          GIT_COMMITTER_NAME: 'Committer Pat',
          GIT_COMMITTER_EMAIL: 'pat@committer.com',
        },
      }
    )
    commitShas.push(
      execSync('git rev-parse HEAD', { cwd: repoPath }).toString().trim()
    )

    gitService = new GitService(repoPath, logSpy)
    logSpy.mockClear()
  })

  afterEach(() => {
    try {
      rmSync(repoPath, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }
  })

  it('simple commit — author, committer, diff, timestamp, no co-authors', async () => {
    const data = await gitService.getLocalCommitData(commitShas[0]!)

    expect(data).not.toBeNull()
    expect(data!.author).toEqual({ name: 'Alice Dev', email: 'alice@dev.com' })
    // Committer is the git config default (no GIT_COMMITTER_* override)
    expect(data!.committer).toEqual({
      name: 'Default User',
      email: 'default@test.com',
    })
    expect(data!.coAuthors).toEqual([])
    expect(data!.diff).toContain('change 0')
    expect(data!.diff).toContain('file.txt')
    expect(data!.timestamp).toBeInstanceOf(Date)
    const now = Date.now()
    expect(data!.timestamp.getTime()).toBeLessThanOrEqual(now)
    expect(data!.timestamp.getTime()).toBeGreaterThan(now - 60_000)
  })

  it('single co-author trailer — all fields', async () => {
    const data = await gitService.getLocalCommitData(commitShas[1]!)

    expect(data).not.toBeNull()
    expect(data!.author).toEqual({ name: 'Alice Dev', email: 'alice@dev.com' })
    expect(data!.committer).toEqual({
      name: 'Default User',
      email: 'default@test.com',
    })
    expect(data!.coAuthors).toEqual([
      { name: 'Bob Helper', email: 'bob@helper.com' },
    ])
    expect(data!.diff).toContain('change 1')
    expect(data!.timestamp).toBeInstanceOf(Date)
  })

  it('multiple co-author trailers — all fields', async () => {
    const data = await gitService.getLocalCommitData(commitShas[2]!)

    expect(data).not.toBeNull()
    expect(data!.author).toEqual({ name: 'Alice Dev', email: 'alice@dev.com' })
    expect(data!.committer).toEqual({
      name: 'Default User',
      email: 'default@test.com',
    })
    expect(data!.coAuthors).toEqual([
      { name: 'Carol', email: 'carol@test.com' },
      { name: 'Dave', email: 'dave@test.com' },
    ])
    expect(data!.diff).toContain('change 2')
    expect(data!.timestamp).toBeInstanceOf(Date)
  })

  it('different author and committer — all fields', async () => {
    const data = await gitService.getLocalCommitData(commitShas[3]!)

    expect(data).not.toBeNull()
    expect(data!.author).toEqual({
      name: 'Eve Author',
      email: 'eve@author.com',
    })
    expect(data!.committer).toEqual({
      name: 'Committer Pat',
      email: 'pat@committer.com',
    })
    expect(data!.coAuthors).toEqual([])
    expect(data!.diff).toContain('change 3')
    expect(data!.timestamp).toBeInstanceOf(Date)
  })
})
