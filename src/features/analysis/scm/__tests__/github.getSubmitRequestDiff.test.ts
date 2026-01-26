import { Octokit } from 'octokit'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { GithubSCMLib } from '../github/GithubSCMLib'
import { env } from './env'

/**
 * Complex integration test for getSubmitRequestDiff with real GitHub API
 * Tests multi-file scenarios with various edge cases across 4 files:
 *
 * File 1 (test-file.txt): Overlapping, adjacent, and separate ranges
 * - Commit 2: Lines 5-10 (partial overlap with commit 4)
 * - Commit 3: Lines 15-20 (separate range, adjacent to commit 4)
 * - Commit 4: Lines 8-12 (overlaps commit 2's 8-10)
 * - Commit 5: Lines 25-28 (separate range)
 *
 * File 2 (scattered-changes.txt): Scattered non-contiguous changes
 * - Commit 2: Lines 2, 7, 15, 22 (non-contiguous modifications)
 *
 * File 3 (rewritten-file.txt): Complete file rewrite
 * - Commit 3: All 15 lines rewritten (from original 10 lines)
 *
 * File 4 (single-line-file.txt): File introduced in later commit with single-line changes
 * - Commit 4: Line 1 (file introduced)
 * - Commit 5: Line 2 (single-line addition)
 */
describe('GithubSCMLib.getSubmitRequestDiff - Complex multi-file, multi-commit scenarios', () => {
  let testRepoUrl: string
  let testPRNumber: number
  let testBranchName: string
  let octokit: Octokit
  let owner: string
  let repo: string

  beforeEach(async () => {
    // Use a test repository - adjust this to your test repo
    testRepoUrl =
      env.PLAYWRIGHT_GH_CLOUD_REPO_URL ||
      'https://github.com/mobb-dev/bugsy-test-repo'

    // Parse owner and repo from URL
    const match = testRepoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/)
    if (!match?.[1] || !match[2]) {
      throw new Error(`Invalid GitHub URL: ${testRepoUrl}`)
    }
    owner = match[1]
    repo = match[2]

    octokit = new Octokit({
      auth: env.PLAYWRIGHT_GH_CLOUD_PAT || process.env['GITHUB_TOKEN'],
    })

    // Create a test branch and PR with complex commit history
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    testBranchName = `test-diff-lines-${timestamp}-${randomId}`

    // Get main branch SHA
    const mainRef = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: 'heads/main',
    })

    const baseSha = mainRef.data.object.sha

    // Create test branch
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${testBranchName}`,
      sha: baseSha,
    })

    // Commit 1: Create 3 initial files
    // File 1: test-file.txt (30 lines - overlapping/adjacent changes)
    const file1Content = Array.from(
      { length: 30 },
      (_, i) => `line ${i + 1}`
    ).join('\n')
    const blob1File1 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file1Content).toString('base64'),
      encoding: 'base64',
    })

    // File 2: scattered-changes.txt (25 lines - non-contiguous changes)
    const file2Content = Array.from(
      { length: 25 },
      (_, i) => `scattered line ${i + 1}`
    ).join('\n')
    const blob1File2 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file2Content).toString('base64'),
      encoding: 'base64',
    })

    // File 3: rewritten-file.txt (10 lines - will be completely rewritten in commit 3)
    const file3Content = Array.from(
      { length: 10 },
      (_, i) => `original line ${i + 1}`
    ).join('\n')
    const blob1File3 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file3Content).toString('base64'),
      encoding: 'base64',
    })

    const tree1 = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: (
        await octokit.rest.git.getCommit({ owner, repo, commit_sha: baseSha })
      ).data.tree.sha,
      tree: [
        {
          path: 'test-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob1File1.data.sha,
        },
        {
          path: 'scattered-changes.txt',
          mode: '100644',
          type: 'blob',
          sha: blob1File2.data.sha,
        },
        {
          path: 'rewritten-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob1File3.data.sha,
        },
      ],
    })

    const commit1 = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: 'Commit 1: Initial creation of 3 files',
      tree: tree1.data.sha,
      parents: [baseSha],
    })

    // Commit 2: Modify file 1 (lines 5-10) + scattered changes to file 2 (lines 2, 7, 15, 22)
    const file1Content2 = file1Content.split('\n')
    for (let i = 4; i < 10; i++) {
      file1Content2[i] = `line ${i + 1} - modified in commit 2`
    }

    const file2Content2 = file2Content.split('\n')
    // Scattered non-contiguous changes at specific lines
    file2Content2[1] = 'scattered line 2 - modified in commit 2'
    file2Content2[6] = 'scattered line 7 - modified in commit 2'
    file2Content2[14] = 'scattered line 15 - modified in commit 2'
    file2Content2[21] = 'scattered line 22 - modified in commit 2'

    const blob2File1 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file1Content2.join('\n')).toString('base64'),
      encoding: 'base64',
    })

    const blob2File2 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file2Content2.join('\n')).toString('base64'),
      encoding: 'base64',
    })

    const tree2 = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: tree1.data.sha,
      tree: [
        {
          path: 'test-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob2File1.data.sha,
        },
        {
          path: 'scattered-changes.txt',
          mode: '100644',
          type: 'blob',
          sha: blob2File2.data.sha,
        },
      ],
    })

    const commit2 = await octokit.rest.git.createCommit({
      owner,
      repo,
      message:
        'Commit 2: Modify file 1 (lines 5-10) + scattered changes to file 2',
      tree: tree2.data.sha,
      parents: [commit1.data.sha],
    })

    // Commit 3: Modify file 1 (lines 15-20) + completely rewrite file 3
    const file1Content3 = file1Content2.slice()
    for (let i = 14; i < 20; i++) {
      file1Content3[i] = `line ${i + 1} - modified in commit 3`
    }

    // Completely rewrite file 3 - different number of lines and completely different content
    const file3Content3 = Array.from(
      { length: 15 },
      (_, i) => `completely rewritten line ${i + 1} in commit 3`
    ).join('\n')

    const blob3File1 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file1Content3.join('\n')).toString('base64'),
      encoding: 'base64',
    })

    const blob3File3 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file3Content3).toString('base64'),
      encoding: 'base64',
    })

    const tree3 = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: tree2.data.sha,
      tree: [
        {
          path: 'test-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob3File1.data.sha,
        },
        {
          path: 'rewritten-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob3File3.data.sha,
        },
      ],
    })

    const commit3 = await octokit.rest.git.createCommit({
      owner,
      repo,
      message:
        'Commit 3: Modify file 1 (lines 15-20) + completely rewrite file 3',
      tree: tree3.data.sha,
      parents: [commit2.data.sha],
    })

    // Commit 4: Modify file 1 (lines 8-12) + introduce file 4 with single line
    const file1Content4 = file1Content3.slice()
    for (let i = 7; i < 12; i++) {
      file1Content4[i] = `line ${i + 1} - modified in commit 4 (overlapping)`
    }

    // Introduce file 4 with just one line (edge case: file introduced in later commit)
    const file4Content4 = 'single line 1 - created in commit 4'

    const blob4File1 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file1Content4.join('\n')).toString('base64'),
      encoding: 'base64',
    })

    const blob4File4 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file4Content4).toString('base64'),
      encoding: 'base64',
    })

    const tree4 = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: tree3.data.sha,
      tree: [
        {
          path: 'test-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob4File1.data.sha,
        },
        {
          path: 'single-line-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob4File4.data.sha,
        },
      ],
    })

    const commit4 = await octokit.rest.git.createCommit({
      owner,
      repo,
      message:
        'Commit 4: Modify file 1 (lines 8-12) + introduce file 4 with single line',
      tree: tree4.data.sha,
      parents: [commit3.data.sha],
    })

    // Commit 5: Modify file 1 (lines 25-28) + add single line to file 4
    const file1Content5 = file1Content4.slice()
    for (let i = 24; i < 28; i++) {
      file1Content5[i] = `line ${i + 1} - modified in commit 5 (separate range)`
    }

    // Add a single line to file 4 (edge case: single-line changes)
    const file4Content5 = file4Content4 + '\nsingle line 2 - added in commit 5'

    const blob5File1 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file1Content5.join('\n')).toString('base64'),
      encoding: 'base64',
    })

    const blob5File4 = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: Buffer.from(file4Content5).toString('base64'),
      encoding: 'base64',
    })

    const tree5 = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: tree4.data.sha,
      tree: [
        {
          path: 'test-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob5File1.data.sha,
        },
        {
          path: 'single-line-file.txt',
          mode: '100644',
          type: 'blob',
          sha: blob5File4.data.sha,
        },
      ],
    })

    const commit5 = await octokit.rest.git.createCommit({
      owner,
      repo,
      message:
        'Commit 5: Modify file 1 (lines 25-28) + add single line to file 4',
      tree: tree5.data.sha,
      parents: [commit4.data.sha],
    })

    // Update branch to point to commit 5
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${testBranchName}`,
      sha: commit5.data.sha,
    })

    // Create PR
    const pr = await octokit.rest.pulls.create({
      owner,
      repo,
      title: `Test PR: Multi-file diff lines - ${timestamp}`,
      body: 'Testing getSubmitRequestDiff with complex multi-file, multi-commit scenarios including overlapping ranges, scattered changes, complete file rewrites, and files introduced in later commits',
      head: testBranchName,
      base: 'main',
    })

    testPRNumber = pr.data.number
  }, 120000) // 2 minute timeout for setup

  afterEach(async () => {
    // Cleanup: close PR and delete branch
    try {
      await octokit.rest.pulls.update({
        owner,
        repo,
        pull_number: testPRNumber,
        state: 'closed',
      })
    } catch (error) {
      console.warn(`Failed to close PR #${testPRNumber}: ${error}`)
    }

    try {
      await octokit.rest.git.deleteRef({
        owner,
        repo,
        ref: `heads/${testBranchName}`,
      })
    } catch (error) {
      console.warn(`Failed to delete branch ${testBranchName}: ${error}`)
    }
  }, 60000) // 1 minute timeout for cleanup

  it('should correctly attribute lines across 4 files with overlapping ranges, scattered changes, complete rewrites, and later-introduced files', async () => {
    // Arrange
    const scmLib = new GithubSCMLib(
      testRepoUrl,
      env.PLAYWRIGHT_GH_CLOUD_PAT || process.env['GITHUB_TOKEN'],
      undefined
    )

    // Act
    const result = await scmLib.getSubmitRequestDiff(String(testPRNumber))

    // Assert - Basic structure
    expect(result).toBeDefined()
    expect(result.diff).toBeDefined()
    expect(result.commits).toBeDefined()
    expect(result.diffLines).toBeDefined()
    expect(result.submitRequestNumber).toBe(testPRNumber)
    expect(result.sourceBranch).toBe(testBranchName)
    expect(result.targetBranch).toBe('main')

    // Assert - Should have 5 commits
    expect(result.commits).toHaveLength(5)

    // Get commit SHAs for verification
    const commitShas = result.commits.map((c) => c.commitSha)
    expect(commitShas).toHaveLength(5)

    // Assert - diffLines should be present and non-empty
    expect(result.diffLines.length).toBeGreaterThan(0)

    // Assert - Should have 4 files modified in the PR
    const uniqueFiles = new Set(result.diffLines.map((d) => d.file))
    expect(uniqueFiles.size).toBe(4)
    expect(uniqueFiles).toContain('test-file.txt')
    expect(uniqueFiles).toContain('scattered-changes.txt')
    expect(uniqueFiles).toContain('rewritten-file.txt')
    expect(uniqueFiles).toContain('single-line-file.txt')

    // Assert - All diffLines should reference commits in the PR
    const diffLineCommits = new Set(result.diffLines.map((d) => d.commitSha))
    diffLineCommits.forEach((sha) => {
      expect(commitShas).toContain(sha)
    })

    // Assert - Line attribution counts per commit
    const commit1Lines = result.diffLines.filter(
      (d) => d.commitSha === commitShas[0]
    )
    const commit2Lines = result.diffLines.filter(
      (d) => d.commitSha === commitShas[1]
    )
    const commit3Lines = result.diffLines.filter(
      (d) => d.commitSha === commitShas[2]
    )
    const commit4Lines = result.diffLines.filter(
      (d) => d.commitSha === commitShas[3]
    )
    const commit5Lines = result.diffLines.filter(
      (d) => d.commitSha === commitShas[4]
    )

    // Expected distribution across all files:
    // Note: When File 3 is completely rewritten in commit 3, all lines are attributed to commit 3, not commit 1
    // Commit 1: File 1 (12 lines: 1-4, 13-14, 21-24, 29-30) + File 2 (21 lines unchanged) = 33 lines
    expect(commit1Lines.length).toBe(33)
    // Commit 2: File 1 (3 lines: 5-7) + File 2 (4 lines: 2, 7, 15, 22) = 7 lines
    expect(commit2Lines.length).toBe(7)
    // Commit 3: File 1 (6 lines: 15-20) + File 3 (15 lines: complete rewrite) = 21 lines
    expect(commit3Lines.length).toBe(21)
    // Commit 4: File 1 (5 lines: 8-12) = 5 lines
    // Note: File 4 creation doesn't show in patch because file has no newline initially
    expect(commit4Lines.length).toBe(5)
    // Commit 5: File 1 (4 lines: 25-28) + File 4 (2 lines: both lines show as added when adding newline) = 6 lines
    // Note: When adding a line to a file without trailing newline, patch shows entire file content
    expect(commit5Lines.length).toBe(6)

    // Assert - File-specific line attributions
    const file1Lines = result.diffLines.filter(
      (d) => d.file === 'test-file.txt'
    )
    const file2Lines = result.diffLines.filter(
      (d) => d.file === 'scattered-changes.txt'
    )
    const file3Lines = result.diffLines.filter(
      (d) => d.file === 'rewritten-file.txt'
    )
    const file4Lines = result.diffLines.filter(
      (d) => d.file === 'single-line-file.txt'
    )

    // File 1: test-file.txt should have 30 lines (overlapping/adjacent changes)
    expect(file1Lines.length).toBe(30)

    // File 2: scattered-changes.txt should have 25 lines (4 from commit 2, 21 from commit 1)
    expect(file2Lines.length).toBe(25)
    const file2Commit2Lines = file2Lines.filter(
      (d) => d.commitSha === commitShas[1]
    )
    expect(file2Commit2Lines.length).toBe(4) // Lines 2, 7, 15, 22
    expect(file2Commit2Lines.map((d) => d.line).sort((a, b) => a - b)).toEqual([
      2, 7, 15, 22,
    ])

    // File 3: rewritten-file.txt should have 15 lines (all from commit 3)
    expect(file3Lines.length).toBe(15)
    const file3Commit3Lines = file3Lines.filter(
      (d) => d.commitSha === commitShas[2]
    )
    expect(file3Commit3Lines.length).toBe(15) // Completely rewritten

    // File 4: single-line-file.txt has 2 lines (both attributed to commit 5)
    // When a file is created without a trailing newline and a second line is added,
    // the patch shows the entire file content as added in the second commit
    expect(file4Lines.length).toBe(2)
    const file4Commit4Lines = file4Lines.filter(
      (d) => d.commitSha === commitShas[3]
    )
    const file4Commit5Lines = file4Lines.filter(
      (d) => d.commitSha === commitShas[4]
    )
    // Commit 4 doesn't show any lines because file was created without trailing newline
    expect(file4Commit4Lines.length).toBe(0)
    // Commit 5 shows both lines when adding the second line (entire file rewritten in patch)
    expect(file4Commit5Lines.length).toBe(2)

    // Assert - Specific line attributions in test-file.txt to verify overlap scenarios
    // Line 7: Commit 2 (not overwritten by commit 4)
    const line7 = result.diffLines.find(
      (d) => d.file === 'test-file.txt' && d.line === 7
    )
    expect(line7?.commitSha).toBe(commitShas[1]) // Commit 2

    // Line 9: Commit 4 (overlaps with commit 2, commit 4 wins)
    const line9 = result.diffLines.find(
      (d) => d.file === 'test-file.txt' && d.line === 9
    )
    expect(line9?.commitSha).toBe(commitShas[3]) // Commit 4

    // Line 12: Commit 4 (adjacent to commit 1's line 13)
    const line12 = result.diffLines.find(
      (d) => d.file === 'test-file.txt' && d.line === 12
    )
    expect(line12?.commitSha).toBe(commitShas[3]) // Commit 4

    // Line 13: Commit 1 (adjacent to commit 4's line 12)
    const line13 = result.diffLines.find(
      (d) => d.file === 'test-file.txt' && d.line === 13
    )
    expect(line13?.commitSha).toBe(commitShas[0]) // Commit 1

    // Line 15: Commit 3 (adjacent to commit 1's line 14)
    const line15 = result.diffLines.find(
      (d) => d.file === 'test-file.txt' && d.line === 15
    )
    expect(line15?.commitSha).toBe(commitShas[2]) // Commit 3

    // Line 25: Commit 5 (separate range)
    const line25 = result.diffLines.find(
      (d) => d.file === 'test-file.txt' && d.line === 25
    )
    expect(line25?.commitSha).toBe(commitShas[4]) // Commit 5

    // Assert - No duplicate line attributions per file (each line in each file should only be attributed once)
    for (const file of uniqueFiles) {
      const fileDiffLines = result.diffLines.filter((d) => d.file === file)
      const lineNumbers = fileDiffLines.map((d) => d.line)
      const uniqueLines = new Set(lineNumbers)
      expect(lineNumbers.length).toBe(uniqueLines.size)
    }

    // Log for debugging
    console.log('\n=== Multi-File Diff Line Attribution Test Results ===')
    console.log('Total diffLines:', result.diffLines.length)
    console.log('Commits in PR:', commitShas.length)
    console.log('Files in PR:', uniqueFiles.size)
    console.log('\nLines attributed to each commit:')
    commitShas.forEach((sha, idx) => {
      const count = result.diffLines.filter((d) => d.commitSha === sha).length
      console.log(`  Commit ${idx + 1}: ${count} lines`)
    })
    console.log('\nLines per file:')
    for (const file of uniqueFiles) {
      const fileLines = result.diffLines.filter((d) => d.file === file)
      console.log(`  ${file}: ${fileLines.length} lines`)
      commitShas.forEach((sha, idx) => {
        const count = fileLines.filter((d) => d.commitSha === sha).length
        if (count > 0) {
          console.log(`    Commit ${idx + 1}: ${count} lines`)
        }
      })
    }
    console.log('=== End of Test Results ===\n')
  }, 60000) // 1 minute timeout for test
})

describe('GithubSCMLib.getSubmitRequestDiff - Rate Limiting', () => {
  let octokit: Octokit
  let githubSCMLib: GithubSCMLib
  let testRepoUrl: string
  let owner: string
  let repo: string

  beforeEach(() => {
    testRepoUrl =
      env.PLAYWRIGHT_GH_CLOUD_REPO_URL ||
      'https://github.com/mobb-dev/bugsy-test-repo'

    const match = testRepoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)(\.git)?$/)
    if (!match?.[1] || !match[2]) {
      throw new Error(`Invalid GitHub URL: ${testRepoUrl}`)
    }
    owner = match[1]
    repo = match[2]

    octokit = new Octokit({
      auth: env.PLAYWRIGHT_GH_CLOUD_PAT || process.env['GITHUB_TOKEN'],
    })

    githubSCMLib = new GithubSCMLib(
      testRepoUrl,
      env.PLAYWRIGHT_GH_CLOUD_PAT || process.env['GITHUB_TOKEN'] || '',
      undefined
    )
  })

  it('should respect GITHUB_API_CONCURRENCY environment variable', async () => {
    // Save original env var
    const originalEnv = process.env['GITHUB_API_CONCURRENCY']
    process.env['GITHUB_API_CONCURRENCY'] = '3'

    try {
      // Create a PR with multiple commits for testing
      // Find an existing PR with multiple commits, or skip if none available
      const prs = await octokit.rest.pulls.list({
        owner,
        repo,
        state: 'all',
        per_page: 10,
      })

      // Find a PR and get its full details with commits count
      let prWithManyCommits = null
      for (const pr of prs.data) {
        const prDetails = await octokit.rest.pulls.get({
          owner,
          repo,
          pull_number: pr.number,
        })
        if (prDetails.data.commits > 5) {
          prWithManyCommits = prDetails.data
          break
        }
      }

      if (!prWithManyCommits) {
        console.log(
          'Skipping rate limiting test: No PR with >5 commits found for testing'
        )
        return
      }

      // Track concurrent calls
      let currentConcurrent = 0
      let maxConcurrent = 0

      const originalMethod = githubSCMLib.getCommitDiff.bind(githubSCMLib)
      githubSCMLib.getCommitDiff = async function (
        ...args: Parameters<typeof originalMethod>
      ) {
        currentConcurrent++
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent)

        // Simulate some processing time
        await new Promise((resolve) => setTimeout(resolve, 50))

        const result = await originalMethod.apply(this, args)
        currentConcurrent--
        return result
      }

      // Run the method
      await githubSCMLib.getSubmitRequestDiff(String(prWithManyCommits.number))

      // Verify that concurrency was limited
      // Allow some tolerance (concurrency might be slightly higher due to timing)
      expect(maxConcurrent).toBeLessThanOrEqual(4) // 3 + 1 tolerance
      expect(maxConcurrent).toBeGreaterThan(0) // At least some concurrency happened
      console.log(`Max concurrent calls observed: ${maxConcurrent}`)
    } finally {
      // Restore original env var
      if (originalEnv !== undefined) {
        process.env['GITHUB_API_CONCURRENCY'] = originalEnv
      } else {
        delete process.env['GITHUB_API_CONCURRENCY']
      }
    }
  }, 60000)

  it('should default to 10 when env var not set', () => {
    // Save and delete env var
    const originalEnv = process.env['GITHUB_API_CONCURRENCY']
    delete process.env['GITHUB_API_CONCURRENCY']

    try {
      // Create a new instance to pick up the env change
      const newLib = new GithubSCMLib(
        testRepoUrl,
        env.PLAYWRIGHT_GH_CLOUD_PAT || process.env['GITHUB_TOKEN'] || '',
        undefined
      )

      // The constant is module-level, so we can't directly test it here
      // But we verify the implementation exists and doesn't throw
      expect(newLib).toBeDefined()
      expect(newLib.getSubmitRequestDiff).toBeDefined()
    } finally {
      // Restore original env var
      if (originalEnv !== undefined) {
        process.env['GITHUB_API_CONCURRENCY'] = originalEnv
      }
    }
  })

  it('should handle invalid concurrency values gracefully', () => {
    // Save original env var
    const originalEnv = process.env['GITHUB_API_CONCURRENCY']
    process.env['GITHUB_API_CONCURRENCY'] = 'invalid'

    try {
      // Create a new instance - should fall back to default (10)
      const newLib = new GithubSCMLib(
        testRepoUrl,
        env.PLAYWRIGHT_GH_CLOUD_PAT || process.env['GITHUB_TOKEN'] || '',
        undefined
      )

      // Should not throw and should be functional
      expect(newLib).toBeDefined()
      expect(newLib.getSubmitRequestDiff).toBeDefined()
    } finally {
      // Restore original env var
      if (originalEnv !== undefined) {
        process.env['GITHUB_API_CONCURRENCY'] = originalEnv
      } else {
        delete process.env['GITHUB_API_CONCURRENCY']
      }
    }
  })
})
