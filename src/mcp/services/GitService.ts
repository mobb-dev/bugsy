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

  constructor(repositoryPath: string) {
    this.git = simpleGit(repositoryPath, { binary: 'git' })
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
      const files = status.files.map((file) => file.path)

      logInfo('Git status retrieved', {
        fileCount: files.length,
        files: files.slice(0, 10), // Log first 10 files to avoid spam
      })

      return { files, status }
    } catch (error) {
      const errorMessage = `Failed to get git status: ${(error as Error).message}`
      logError(errorMessage, { error })
      throw new Error(errorMessage)
    }
  }
}
