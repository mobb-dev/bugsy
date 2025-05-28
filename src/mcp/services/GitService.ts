import * as path from 'path'
import { SimpleGit, simpleGit, StatusResult } from 'simple-git'

import { logDebug, logError, logInfo } from '../Logger'

export type GitValidationResult = {
  isValid: boolean
  error?: string
}

export type GitStatusResult = {
  files: string[]
  status: StatusResult
}

export class GitService {
  private git: SimpleGit
  private repositoryPath: string

  constructor(repositoryPath: string) {
    this.git = simpleGit(repositoryPath, { binary: 'git' })
    this.repositoryPath = repositoryPath
    logDebug('Git service initialized', { repositoryPath })
  }

  /**
   * Validates that the path is a valid git repository
   */
  public async validateRepository(): Promise<GitValidationResult> {
    logDebug('Validating git repository')

    try {
      const isRepo = await this.git.checkIsRepo()
      if (!isRepo) {
        const error = 'Path is not a valid git repository'
        logError(error)
        return { isValid: false, error }
      }

      logDebug('Git repository validation successful')
      return { isValid: true }
    } catch (error) {
      const errorMessage = `Failed to verify git repository: ${(error as Error).message}`
      logError(errorMessage, { error })
      return { isValid: false, error: errorMessage }
    }
  }

  /**
   * Gets the current git status and returns changed files
   */
  public async getChangedFiles(): Promise<GitStatusResult> {
    logDebug('Getting git status')

    try {
      const status = await this.git.status()

      // Get the git repository root
      const gitRoot = await this.git.revparse(['--show-toplevel'])

      // Calculate the relative path from git root to our working directory
      const relativePathFromGitRoot = path.relative(
        gitRoot,
        this.repositoryPath
      )

      // Adjust file paths to be relative to our working directory instead of git root
      const files = status.files.map((file) => {
        const gitRelativePath = file.path

        // If our working directory is the git root, return paths as-is
        if (relativePathFromGitRoot === '') {
          return gitRelativePath
        }

        // If the file path starts with our relative path, remove that prefix
        if (gitRelativePath.startsWith(relativePathFromGitRoot + '/')) {
          return gitRelativePath.substring(relativePathFromGitRoot.length + 1)
        }

        // If the file is outside our working directory, use relative path from working dir
        return path.relative(
          this.repositoryPath,
          path.join(gitRoot, gitRelativePath)
        )
      })

      logInfo('Git status retrieved', {
        fileCount: files.length,
        files: files.slice(0, 10), // Log first 10 files to avoid spam
        gitRoot,
        workingDir: this.repositoryPath,
        relativePathFromGitRoot,
      })

      return { files, status }
    } catch (error) {
      const errorMessage = `Failed to get git status: ${(error as Error).message}`
      logError(errorMessage, { error })
      throw new Error(errorMessage)
    }
  }
}
