import { execSync } from 'child_process'
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import { log } from './log'

// Keep track of all created repos for cleanup
const createdRepoPaths: string[] = []

/**
 * Creates an empty git repository in a temporary directory
 * @returns Path to the created git repository
 */
export function createEmptyGitRepo(): string {
  try {
    // Create temp directory and initialize a git repo
    const repoPath = mkdtempSync(join(tmpdir(), 'mcp-test-empty-repo-'))
    log('Created empty repo at:', repoPath)

    // Add to tracked repos for cleanup
    createdRepoPaths.push(repoPath)

    // Initialize git repo in the empty directory with quiet flag and explicit branch name
    try {
      execSync('git init -q --initial-branch=main', {
        cwd: repoPath,
        stdio: 'pipe',
      })
    } catch (error) {
      // If --initial-branch fails (older git versions), try without it
      log('Git init with --initial-branch failed, trying without it')
      execSync('git init -q', {
        cwd: repoPath,
        stdio: 'pipe',
      })
    }

    // Make an initial commit so the repo has a HEAD
    try {
      execSync('git config user.name "Test User"', {
        cwd: repoPath,
        stdio: 'pipe',
      })
      execSync('git config user.email "test@example.com"', {
        cwd: repoPath,
        stdio: 'pipe',
      })
      execSync('git commit --allow-empty -m "Initial commit"', {
        cwd: repoPath,
        stdio: 'pipe',
      })
      log('Git repository initialized with empty commit')
    } catch (error) {
      log('Error making initial commit:', error)
      // Even if commit fails, we should return the repo path
    }

    return repoPath
  } catch (error) {
    console.error('Error creating empty git repo:', error)
    // Return a fallback path in case of error
    const fallbackPath = join(tmpdir(), 'mcp-test-fallback-' + Date.now())
    log('Using fallback path:', fallbackPath)
    return fallbackPath
  }
}

/**
 * Creates a git repository with a staged file (but not committed)
 * @param filename Optional filename to create, defaults to 'sample.js'
 * @param content Optional content for the file, defaults to code with a vulnerability
 * @returns Path to the created git repository
 */
export function createActiveGitRepo(
  filename = 'sample.js',
  content = 'function test() { eval(userInput); }' // Vulnerable code
): string {
  try {
    // First create an empty repo
    const repoPath = createEmptyGitRepo()

    // Create a sample file in the repository
    const filePath = join(repoPath, filename)
    writeFileSync(filePath, content)
    log(`Created file ${filename} in repo`)

    // Add the file to git staging
    try {
      execSync(`git add ${filename}`, { cwd: repoPath, stdio: 'pipe' })
      log(`Added ${filename} to git staging`)

      // Commit the file so it exists in HEAD (required for pack function)
      execSync(`git commit -m "Add ${filename}"`, {
        cwd: repoPath,
        stdio: 'pipe',
      })
      log(`Committed ${filename} to HEAD`)

      // Now modify the file so it shows up in git status as changed
      writeFileSync(filePath, content + '\n// Modified for testing')
      log(`Modified ${filename} to create changes`)
    } catch (error) {
      log('Error in git operations:', error)
      // Continue even if git operations fail
    }

    return repoPath
  } catch (error) {
    console.error('Error creating active git repo:', error)
    // Return a fallback path in case of error
    const fallbackPath = join(
      tmpdir(),
      'mcp-test-fallback-active-' + Date.now()
    )
    log('Using fallback path:', fallbackPath)
    return fallbackPath
  }
}

/**
 * Creates a git repository with a staged file (but not committed)
 * @param filename Optional filename to create, defaults to 'sample.js'
 * @param content Optional content for the file, defaults to code with a vulnerability
 * @returns Path to the created git repository
 */
export function createActiveNonGitRepo(
  filename = 'sample.js',
  content = 'function test() { eval(userInput); }' // Vulnerable code
): string {
  try {
    const repoPath = mkdtempSync(join(tmpdir(), 'mcp-test-non-repo-active'))
    // Add to tracked repos for cleanup
    createdRepoPaths.push(repoPath)

    // Create a sample file in the repository
    const filePath = join(repoPath, filename)
    writeFileSync(filePath, content)
    log(`Created file ${filename} in repo`)

    writeFileSync(filePath, content + '\n// Modified for testing')
    log(`Modified ${filename} to create changes`)

    return repoPath
  } catch (error) {
    console.error('Error creating active non-git repo:', error)
    // Return a fallback path in case of error
    const fallbackPath = join(
      tmpdir(),
      'mcp-test-fallback-non-git-' + Date.now()
    )
    log('Using fallback path:', fallbackPath)
    return fallbackPath
  }
}

/**
 * Deletes a git repository
 * @param repoPath Path to the git repository to delete
 */
export function deleteGitRepo(repoPath: string): void {
  try {
    if (existsSync(repoPath)) {
      // Try to clean up git hooks if they exist
      try {
        const hooksDir = join(repoPath, '.git', 'hooks')
        if (existsSync(hooksDir)) {
          // Make sure hooks are readable/writable before deletion
          execSync(`chmod -R 755 ${hooksDir}`, { stdio: 'ignore' })
        }
      } catch (e) {
        // Ignore errors when trying to clean up hooks
        log(`Warning: Could not clean up git hooks: ${e}`)
      }

      // Remove the directory with force
      rmSync(repoPath, { recursive: true, force: true })
      log(`Cleaned up repo at: ${repoPath}`)

      // Remove from tracked repos
      const index = createdRepoPaths.indexOf(repoPath)
      if (index !== -1) {
        createdRepoPaths.splice(index, 1)
      }
    }
  } catch (e) {
    // Log but don't throw to prevent test failures due to cleanup issues
    console.error(`Error cleaning up repo at ${repoPath}:`, e)
  }
}

// Ensure all created repos are cleaned up on process exit
process.on('exit', () => {
  log(`Cleaning up ${createdRepoPaths.length} remaining repos on exit`)
  for (const repoPath of createdRepoPaths) {
    try {
      if (existsSync(repoPath)) {
        rmSync(repoPath, { recursive: true, force: true })
        log(`Cleaned up repo at: ${repoPath} on exit`)
      }
    } catch (e) {
      console.error(`Error cleaning up repo at ${repoPath} on exit:`, e)
    }
  }
})

// Also clean up on SIGTERM
process.on('SIGTERM', () => {
  log('SIGTERM received, cleaning up repos')
  for (const repoPath of createdRepoPaths) {
    try {
      if (existsSync(repoPath)) {
        rmSync(repoPath, { recursive: true, force: true })
        log(`Cleaned up repo at: ${repoPath} on SIGTERM`)
      }
    } catch (e) {
      console.error(`Error cleaning up repo at ${repoPath} on SIGTERM:`, e)
    }
  }
})

/**
 * Creates a git repository with no changes in `git status`. Create a commit with the file.
 * @param filename Optional filename to create, defaults to 'sample.js'
 * @param content Optional content for the file, defaults to code with a vulnerability
 * @returns Path to the created git repository
 */
export function createActiveNoChangesGitRepo(
  filename = 'sample.js',
  content = 'function test() { eval(userInput); }' // Vulnerable code
): string {
  // First create an empty repo
  const repoPath = createEmptyGitRepo()

  // Create a sample file in the repository
  const filePath = join(repoPath, filename)
  writeFileSync(filePath, content)
  log(`Created file ${filename} in repo`)

  // Add the file to git staging
  execSync(`git add ${filename}`, { cwd: repoPath })
  log(`Added ${filename} to git staging`)

  // Commit the file so it exists in HEAD (required for pack function)
  execSync(`git commit -m "Add ${filename}"`, { cwd: repoPath })
  log(`Committed ${filename} to HEAD`)

  return repoPath
}
