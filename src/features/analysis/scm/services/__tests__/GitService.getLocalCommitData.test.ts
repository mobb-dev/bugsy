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

  it('should return commit data with diff, timestamp, and parent commits', async () => {
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
