import fs from 'node:fs'

import ignore, { Ignore } from 'ignore'
import * as path from 'path'
import { SimpleGit, simpleGit, StatusResult } from 'simple-git'

import { MCP_DEFAULT_MAX_FILES_TO_SCAN } from '../../../../mcp/core/configs'
import { FileUtils } from './FileUtils'

export type GitValidationResult = {
  isValid: boolean
  error?: string
}

export type GitStatusResult = {
  files: string[]
  deletedFiles: string[]
  status: StatusResult
}

export type GitInfo = {
  repoUrl: string
  hash: string
  reference: string
}

export type RecentFilesResult = {
  files: string[]
  commitCount: number
}

export class GitService {
  private git: SimpleGit
  private repositoryPath: string
  private log: (message: string, level: string, data?: unknown) => void

  constructor(
    repositoryPath: string,
    log?: (message: string, level: string, data?: unknown) => void
  ) {
    // No-op logging function that satisfies the linter
    const noopLog = (
      _message: string,
      _level: string,
      _data?: unknown
    ): void => {
      // Intentionally empty - satisfies linter by having explicit return type and no empty arrow function
    }
    this.log = log || noopLog
    this.git = simpleGit(repositoryPath, { binary: 'git' })
    this.repositoryPath = repositoryPath
    this.log('Git service initialized', 'debug', { repositoryPath })
  }

  /**
   * Validates that the path is a valid git repository
   */
  public async validateRepository(): Promise<GitValidationResult> {
    this.log('Validating git repository', 'debug')

    try {
      const isRepo = await this.git.checkIsRepo()
      if (!isRepo) {
        const error = 'Path is not a valid git repository'
        this.log(error, 'error')
        return { isValid: false, error }
      }

      this.log('Git repository validation successful', 'debug')
      return { isValid: true }
    } catch (error) {
      const errorMessage = `Failed to verify git repository: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      return { isValid: false, error: errorMessage }
    }
  }

  /**
   * Gets the current git status and returns changed files
   */
  public async getChangedFiles(): Promise<GitStatusResult> {
    this.log('Getting git status', 'debug')

    try {
      const status = await this.git.status()

      // Get the git repository root
      const gitRoot = await this.git.revparse(['--show-toplevel'])

      // Calculate the relative path from git root to our working directory
      const relativePathFromGitRoot = path.relative(
        gitRoot,
        this.repositoryPath
      )

      // Identify deleted files first
      const deletedFiles = status.files
        .filter((file) => file.index === 'D' || file.working_dir === 'D')
        .map((file) => file.path)

      // Adjust file paths to be relative, excluding deleted ones
      const files = status.files
        .filter((file) => {
          return !(file.index === 'D' || file.working_dir === 'D')
        })
        .map((file) => {
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

      this.log('Git status retrieved', 'info', {
        fileCount: files.length,
        files: files.slice(0, 10), // Log first 10 files to avoid spam
        deletedFileCount: deletedFiles.length,
        deletedFiles: deletedFiles.slice(0, 10),
        gitRoot,
        workingDir: this.repositoryPath,
        relativePathFromGitRoot,
      })

      return { files, deletedFiles, status }
    } catch (error) {
      const errorMessage = `Failed to get git status: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Gets git repository information including remote URL, current commit hash, and branch name
   */
  public async getGitInfo(): Promise<GitInfo> {
    this.log('Getting git repository information', 'debug')

    try {
      const [repoUrl, hash, reference] = await Promise.all([
        this.git.getConfig('remote.origin.url'),
        this.git.revparse(['HEAD']),
        this.git.revparse(['--abbrev-ref', 'HEAD']),
      ])

      let normalizedRepoUrl = repoUrl.value || ''
      // Normalize git URL
      if (normalizedRepoUrl.endsWith('.git')) {
        normalizedRepoUrl = normalizedRepoUrl.slice(0, -'.git'.length)
      }
      if (normalizedRepoUrl.startsWith('git@github.com:')) {
        normalizedRepoUrl = normalizedRepoUrl.replace(
          'git@github.com:',
          'https://github.com/'
        )
      }

      this.log('Git repository information retrieved', 'debug', {
        repoUrl: normalizedRepoUrl,
        hash,
        reference,
      })

      return {
        repoUrl: normalizedRepoUrl,
        hash,
        reference,
      }
    } catch (error) {
      const errorMessage = `Failed to get git repository information: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Validates if a branch name is valid according to git's rules
   */
  public async isValidBranchName(branchName: string): Promise<boolean> {
    this.log('Validating branch name', 'debug', { branchName })

    try {
      const result = await this.git.raw([
        'check-ref-format',
        '--branch',
        branchName,
      ])
      const isValid = Boolean(result)
      this.log('Branch name validation result', 'debug', {
        branchName,
        isValid,
      })
      return isValid
    } catch (error) {
      this.log('Branch name validation failed', 'debug', { branchName, error })
      return false
    }
  }

  /**
   * Gets the current branch name
   */
  public async getCurrentBranch(): Promise<string> {
    this.log('Getting current branch name', 'debug')

    try {
      const branch = await this.git.revparse(['--abbrev-ref', 'HEAD'])
      this.log('Current branch retrieved', 'debug', { branch })
      return branch
    } catch (error) {
      const errorMessage = `Failed to get current branch: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Gets the current commit hash
   */
  public async getCurrentCommitHash(): Promise<string> {
    this.log('Getting current commit hash', 'debug')

    try {
      const hash = await this.git.revparse(['HEAD'])
      this.log('Current commit hash retrieved', 'debug', { hash })
      return hash
    } catch (error) {
      const errorMessage = `Failed to get current commit hash: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Gets both the current commit hash and current branch name
   */
  public async getCurrentCommitAndBranch(): Promise<{
    hash: string
    branch: string
  }> {
    this.log('Getting current commit hash and branch', 'debug')

    try {
      const [hash, branch] = await Promise.all([
        this.git.revparse(['HEAD']),
        this.git.revparse(['--abbrev-ref', 'HEAD']),
      ])

      this.log('Current commit hash and branch retrieved', 'debug', {
        hash,
        branch,
      })

      return { hash, branch }
    } catch (error) {
      const errorMessage = `Failed to get current commit hash and branch: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      return { hash: '', branch: '' }
    }
  }

  /**
   * Gets the remote repository URL
   */
  public async getRemoteUrl(): Promise<string> {
    this.log('Getting remote repository URL', 'debug')

    try {
      const remoteUrl = await this.git.getConfig('remote.origin.url')
      const url = remoteUrl.value || ''
      let normalizedUrl = url
      // Normalize git URL
      if (normalizedUrl.endsWith('.git')) {
        normalizedUrl = normalizedUrl.slice(0, -'.git'.length)
      }
      if (normalizedUrl.startsWith('git@github.com:')) {
        normalizedUrl = normalizedUrl.replace(
          'git@github.com:',
          'https://github.com/'
        )
      }

      this.log('Remote repository URL retrieved', 'debug', {
        url: normalizedUrl,
      })
      return normalizedUrl
    } catch (error) {
      const errorMessage = `Failed to get remote repository URL: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Gets the maxFiles most recently changed files, starting with current changes and then from commit history
   */
  public async getRecentlyChangedFiles({
    maxFiles = MCP_DEFAULT_MAX_FILES_TO_SCAN,
  }: {
    maxFiles?: number
  }): Promise<RecentFilesResult> {
    this.log(
      `Getting the ${maxFiles} most recently changed files, starting with current changes`,
      'debug'
    )

    try {
      // Start with files from current changes (staged/unstaged)
      const currentChanges = await this.getChangedFiles()

      // Get the git repository root
      const gitRoot = await this.git.revparse(['--show-toplevel'])

      // Calculate the relative path from git root to our working directory
      const relativePathFromGitRoot = path.relative(
        gitRoot,
        this.repositoryPath
      )

      // Track files we've already seen and the order they were found
      const fileSet = new Set<string>()
      let commitsProcessed = 0

      // Add current changed files first
      for (const file of currentChanges.files) {
        if (fileSet.size >= maxFiles) {
          break
        }

        // Check if file should be included (using same logic as commit history files)
        const fullPath = path.join(this.repositoryPath, file)
        if (
          (await FileUtils.shouldPackFile(fullPath)) &&
          !file.startsWith('..')
        ) {
          fileSet.add(file)
        }
      }

      this.log(`Added ${fileSet.size} files from current changes`, 'debug', {
        filesFromCurrentChanges: fileSet.size,
        currentChangesTotal: currentChanges.files.length,
      })

      // Get a reasonable number of recent commits to search through
      const logResult = await this.git.log({
        maxCount: maxFiles * 5, // 5 times the max files to scan to ensure we find enough files
        format: {
          hash: '%H',
          date: '%ai',
          message: '%s',
          //the field name author_name can't follow the naming convention as we are using the git log command
          author_name: '%an',
        },
      })

      // Process commits in chronological order (most recent first)
      for (const commit of logResult.all) {
        if (fileSet.size >= maxFiles) {
          break
        }

        commitsProcessed++

        try {
          // Use git show to get the list of files changed in this commit
          const filesOutput = await this.git.show([
            '--name-only',
            '--pretty=format:',
            commit.hash,
          ])

          // Split the output by lines and filter out empty lines
          const commitFiles = filesOutput
            .split('\n')
            .filter((file) => file.trim() !== '')

          for (const file of commitFiles) {
            if (fileSet.size >= maxFiles) {
              break
            }

            const gitRelativePath = file.trim()

            // Adjust file paths to be relative to our working directory instead of git root
            let adjustedPath: string

            // If our working directory is the git root, return paths as-is
            if (relativePathFromGitRoot === '') {
              adjustedPath = gitRelativePath
            } else if (
              gitRelativePath.startsWith(relativePathFromGitRoot + '/')
            ) {
              // If the file path starts with our relative path, remove that prefix
              adjustedPath = gitRelativePath.substring(
                relativePathFromGitRoot.length + 1
              )
            } else {
              // If the file is outside our working directory, use relative path from working dir
              adjustedPath = path.relative(
                this.repositoryPath,
                path.join(gitRoot, gitRelativePath)
              )
            }

            this.log(`Considering file: ${adjustedPath}`, 'debug')

            // Only add if we haven't seen this file before and it passes our filters
            if (
              !fileSet.has(adjustedPath) &&
              (await FileUtils.shouldPackFile(
                path.join(gitRoot, gitRelativePath)
              )) &&
              !adjustedPath.startsWith('..')
            ) {
              fileSet.add(adjustedPath)
            }
          }
        } catch (showError) {
          // If we can't get files for this commit, continue with the next one
          this.log(`Could not get files for commit ${commit.hash}`, 'debug', {
            error: showError,
          })
        }
      }

      const files = Array.from(fileSet)

      this.log('Recently changed files retrieved', 'info', {
        fileCount: files.length,
        commitsProcessed,
        totalCommitsAvailable: logResult.all.length,
        files: files.slice(0, maxFiles), // Log the files (should be all of them since we limit to maxFiles)
        gitRoot,
        workingDir: this.repositoryPath,
        relativePathFromGitRoot,
      })

      return {
        files,
        commitCount: commitsProcessed,
      }
    } catch (error) {
      const errorMessage = `Failed to get recently changed files: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Normalizes a Git URL to HTTPS format for various Git hosting platforms
   * @param url The Git URL to normalize
   * @returns The normalized HTTPS URL
   */
  private normalizeGitUrl(url: string): string {
    let normalizedUrl = url

    // Remove .git suffix if present
    if (normalizedUrl.endsWith('.git')) {
      normalizedUrl = normalizedUrl.slice(0, -'.git'.length)
    }

    // Convert SSH URLs to HTTPS for various platforms
    const sshToHttpsMappings = [
      // GitHub
      { pattern: 'git@github.com:', replacement: 'https://github.com/' },
      // GitLab
      { pattern: 'git@gitlab.com:', replacement: 'https://gitlab.com/' },
      // Bitbucket
      { pattern: 'git@bitbucket.org:', replacement: 'https://bitbucket.org/' },
      // Azure DevOps (SSH format)
      {
        pattern: 'git@ssh.dev.azure.com:',
        replacement: 'https://dev.azure.com/',
      },
      // Azure DevOps (alternative SSH format)
      {
        pattern: /git@([^:]+):v3\/([^/]+)\/([^/]+)\/([^/]+)/,
        replacement: 'https://$1/$2/_git/$4',
      },
    ]

    for (const mapping of sshToHttpsMappings) {
      if (typeof mapping.pattern === 'string') {
        if (normalizedUrl.startsWith(mapping.pattern)) {
          normalizedUrl = normalizedUrl.replace(
            mapping.pattern,
            mapping.replacement
          )
          break
        }
      } else {
        // Handle regex patterns
        const match = normalizedUrl.match(mapping.pattern)
        if (match) {
          normalizedUrl = normalizedUrl.replace(
            mapping.pattern,
            mapping.replacement
          )
          break
        }
      }
    }

    return normalizedUrl
  }

  /**
   * Gets all remote repository URLs (equivalent to 'git remote -v')
   */
  public async getRepoUrls(): Promise<
    Record<string, { fetch: string; push: string }>
  > {
    this.log('Getting all remote repository URLs', 'debug')

    try {
      const remotes = await this.git.remote(['-v'])
      if (!remotes) {
        return {}
      }

      const remoteMap: Record<string, { fetch: string; push: string }> = {}

      // Parse the output of 'git remote -v'
      // Format is: "remote_name\turl (fetch)\nremote_name\turl (push)"
      remotes.split('\n').forEach((line: string) => {
        if (!line.trim()) return

        const [remoteName, url, type] = line.split(/\s+/)
        if (!remoteName || !url || !type) return

        // Initialize the remote entry if it doesn't exist
        if (!remoteMap[remoteName]) {
          remoteMap[remoteName] = { fetch: '', push: '' }
        }

        // Normalize URL using the helper method
        const normalizedUrl = this.normalizeGitUrl(url)

        // At this point we know remoteMap[remoteName] exists because we initialized it above
        const remote = remoteMap[remoteName]!
        if (type === '(fetch)') {
          remote.fetch = normalizedUrl
        } else if (type === '(push)') {
          remote.push = normalizedUrl
        }
      })

      this.log('Remote repository URLs retrieved', 'debug', {
        remotes: remoteMap,
      })
      return remoteMap
    } catch (error) {
      const errorMessage = `Failed to get remote repository URLs: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Fetches the contents of the .gitignore file from the repository
   * @returns The contents of the .gitignore file as a string, or null if the file doesn't exist
   */
  public async getGitignoreContent(): Promise<string | null> {
    this.log('Getting .gitignore contents', 'debug')

    try {
      let combinedContent = ''

      // Always attempt to read a .gitignore sitting in the working directory first (monorepo support)
      const localGitignorePath = path.join(this.repositoryPath, '.gitignore')
      if (fs.existsSync(localGitignorePath)) {
        const localContent = fs.readFileSync(localGitignorePath, 'utf8')
        combinedContent += `${localContent}\n`
      }

      // Attempt to read the repository root .gitignore (may be the same as repositoryPath)
      try {
        const gitRoot = await this.git.revparse(['--show-toplevel'])
        const rootGitignorePath = path.join(gitRoot, '.gitignore')
        if (fs.existsSync(rootGitignorePath)) {
          const rootContent = fs.readFileSync(rootGitignorePath, 'utf8')

          // Only append root content if it differs from the local content to avoid duplication
          if (rootContent.trim() !== combinedContent.trim()) {
            combinedContent += `\n${rootContent}`
          }
        }
      } catch (rootErr) {
        // If for some reason we cannot determine the git root, log the error and continue
        this.log(
          'Unable to resolve git root while reading .gitignore',
          'debug',
          { error: rootErr }
        )
      }

      if (combinedContent.trim() === '') {
        this.log('.gitignore file not found', 'debug')
        return null
      }

      this.log('.gitignore contents retrieved successfully', 'debug')
      return combinedContent.trimEnd()
    } catch (error) {
      const errorMessage = `Failed to get .gitignore contents: ${(error as Error).message}`
      this.log(errorMessage, 'error', { error })
      return null
    }
  }

  public async getGitignoreMatcher(): Promise<Ignore | null> {
    const content = await this.getGitignoreContent()
    if (!content) return null
    return ignore().add(content)
  }
}
