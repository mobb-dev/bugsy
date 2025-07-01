import { execSync } from 'child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import simpleGit from 'simple-git'

import { benignFileContent } from './fileContents'
import { log } from './log'

/**
 * MockRepo encapsulates helper methods for creating and cleaning up
 * temporary Git / non-Git repositories that are used throughout the test
 * suites. All methods are instance methods (not static) so that the helper can
 * maintain internal state, namely the list of repositories that were created
 * during a test run.
 */
export class MockRepo {
  /** Holds a single repo path managed by this instance (null until created) */
  private createdRepoPath: string | null = null

  /** Default set of sample files used by multiple helpers */
  private readonly sampleFiles: string[] = [
    'sample1.py',
    'dir/sample2.py',
    'dir/dir2/sample3.py',
  ]

  constructor() {
    // Cleanup is triggered manually by tests to avoid accumulating listeners.
  }

  /**
   * Creates an empty git repository in a temporary directory.
   * @returns Path to the created git repository
   */
  async createEmptyGitRepo(): Promise<string> {
    if (this.createdRepoPath !== null) {
      throw new Error('MockRepo instance already manages a repository')
    }

    try {
      // Create temp directory and initialize a git repo
      const repoPath = mkdtempSync(join(tmpdir(), 'mcp-test-empty-repo-'))
      log('Created empty repo at:', repoPath)

      // Track for cleanup
      this.createdRepoPath = repoPath

      // Initialize git repo in the empty directory with quiet flag and explicit branch name
      const git = simpleGit(repoPath)
      try {
        await git.raw(['init', '--initial-branch=main', '--quiet'])
      } catch (error) {
        // Fallback for older git versions lacking --initial-branch
        log('Git init with --initial-branch failed, trying without it')
        await git.raw(['init', '--quiet'])
      }

      // Make an initial commit so the repo has a HEAD
      try {
        await git.addConfig('user.name', 'Test User')
        await git.addConfig('user.email', 'test@example.com')
        await git.raw(['commit', '--allow-empty', '-m', 'Initial commit'])
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
   * Creates a git repository with modified files in the working directory.
   * Files are committed once, then modified so they appear as changed.
   */
  async createActiveGitRepo(): Promise<string> {
    const files = this.sampleFiles

    try {
      // First create an empty repo
      const repoPath = await this.createEmptyGitRepo()

      // Create each file, ensuring directories exist
      files.forEach((file) => {
        const filePath = join(repoPath, file)
        const dirPath = dirname(filePath)
        mkdirSync(dirPath, { recursive: true })

        writeFileSync(filePath, benignFileContent)
        log(`Created file ${file} in repo`)
      })

      try {
        // Stage all files and commit them
        const git = simpleGit(repoPath)
        await git.add('.')
        log('Added all files to git staging')

        await git.commit('Add sample files')
        log('Committed sample files to HEAD')

        // Add a remote origin URL for testing
        await git.addRemote(
          'origin',
          'https://github.com/test-org/test-repo.git'
        )
        log('Added remote origin URL')

        // Modify each file so they appear as changed in git status
        files.forEach((file) => {
          const filePath = join(repoPath, file)
          writeFileSync(filePath, benignFileContent + ' ')
          log(`Modified ${file} to create changes`)
        })
      } catch (error) {
        log('Error in git operations:', error)
        // Continue even if git operations fail
      }

      return repoPath
    } catch (error) {
      console.error('Error creating active git repo:', error)
      const fallbackPath = join(
        tmpdir(),
        'mcp-test-fallback-active-' + Date.now()
      )
      log('Using fallback path:', fallbackPath)
      return fallbackPath
    }
  }

  /**
   * Creates a filesystem directory structure with files but **without** a Git repository.
   */
  async createActiveNonGitRepo(): Promise<string> {
    if (this.createdRepoPath !== null) {
      throw new Error('MockRepo instance already manages a repository')
    }
    const files = this.sampleFiles
    try {
      const repoPath = mkdtempSync(join(tmpdir(), 'mcp-test-non-repo-active'))
      this.createdRepoPath = repoPath

      // Create each file, ensuring parent directories exist first
      files.forEach((file) => {
        const filePath = join(repoPath, file)
        const dirPath = dirname(filePath)
        mkdirSync(dirPath, { recursive: true })

        writeFileSync(filePath, benignFileContent)
        log(`Created file ${file} in repo`)
      })

      return repoPath
    } catch (error) {
      console.error('Error creating active non-git repo:', error)
      const fallbackPath = join(
        tmpdir(),
        'mcp-test-fallback-non-git-' + Date.now()
      )
      log('Using fallback path:', fallbackPath)
      return fallbackPath
    }
  }

  /**
   * Creates a repository with no outstanding changes after commit.
   */
  async createActiveNoChangesGitRepo(): Promise<string> {
    const files = this.sampleFiles

    const repoPath = await this.createEmptyGitRepo()

    files.forEach((file) => {
      const filePath = join(repoPath, file)
      const dirPath = dirname(filePath)
      mkdirSync(dirPath, { recursive: true })

      writeFileSync(filePath, benignFileContent)
      log(`Created file ${file} in repo`)
    })

    const git = simpleGit(repoPath)
    await git.add('.')
    log('Added all files to git staging')

    await git.commit('Add sample files')
    log('Committed sample files to HEAD')

    return repoPath
  }

  /**
   * Deletes a repository from disk and internal tracking list.
   */
  deleteGitRepo(repoPath: string): void {
    try {
      if (existsSync(repoPath)) {
        // Try to clean up git hooks if they exist
        try {
          const hooksDir = join(repoPath, '.git', 'hooks')
          if (existsSync(hooksDir)) {
            execSync(`chmod -R 755 ${hooksDir}`, { stdio: 'ignore' })
          }
        } catch (e) {
          log(`Warning: Could not clean up git hooks: ${e}`)
        }

        rmSync(repoPath, { recursive: true, force: true })
        log(`Cleaned up repo at: ${repoPath}`)

        this.createdRepoPath = null
      }
    } catch (e) {
      console.error(
        `Error cleaning up repo at ${String(repoPath).replace(/\n|\r/g, '')}:`,
        e
      )
    }
  }

  /** Remove any leftover repositories this helper knows about */
  cleanupAll(): void {
    log(`Cleaning up ${this.createdRepoPath ? 1 : 0} remaining repos`)
    if (this.createdRepoPath) {
      try {
        if (existsSync(this.createdRepoPath)) {
          rmSync(this.createdRepoPath, { recursive: true, force: true })
          log(`Cleaned up repo at: ${this.createdRepoPath}`)
        }
      } catch (e) {
        console.error(
          `Error cleaning up repo at ${String(this.createdRepoPath).replace(/\n|\r/g, '')}:`,
          e
        )
      }
    }
    this.createdRepoPath = null
  }

  /**
   * Overwrite an existing sample file (by its index in sampleFiles) with new content.
   * @param fileIndex Index into this.sampleFiles (0-based)
   * @param content   New file contents
   */
  updateFileContent(fileIndex: number, content: string): void {
    if (this.createdRepoPath === null) {
      throw new Error('No repository managed by this MockRepo instance')
    }
    if (fileIndex < 0 || fileIndex >= this.sampleFiles.length) {
      throw new RangeError('fileIndex out of bounds')
    }

    const relativeFilePath = this.sampleFiles[fileIndex] as string
    const repoRoot = this.createdRepoPath!
    try {
      const filePath = join(repoRoot, relativeFilePath)
      const dirPath = dirname(filePath)
      mkdirSync(dirPath, { recursive: true })
      writeFileSync(filePath, content)
      log(`Updated file ${relativeFilePath} in repo ${repoRoot}`)
    } catch (error) {
      console.error('Error updating file content:', error)
    }
  }
}
