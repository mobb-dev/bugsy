import fs from 'node:fs'

import ignore, { Ignore } from 'ignore'
import * as path from 'path'
import { SimpleGit, simpleGit, StatusResult } from 'simple-git'

import { MCP_DEFAULT_MAX_FILES_TO_SCAN } from '../../../../mcp/core/configs'
import { FileUtils } from './FileUtils'

/** Maximum diff size in bytes for local commit data (3MB) */
const MAX_COMMIT_DIFF_SIZE_BYTES = 3 * 1024 * 1024

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

/**
 * Local commit data retrieved from git for Tracy extension.
 * Used to send commit diff directly without requiring SCM token.
 */
export type LocalCommitData = {
  /** Raw diff from git show */
  diff: string
  /** Commit timestamp */
  timestamp: Date
  /** Parent commits with timestamps (for time window calculation) */
  parentCommits?: { sha: string; timestamp: Date }[]
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
    this.log('[GitService] Git service initialized', 'debug', {
      repositoryPath,
    })
  }

  /**
   * Checks if the current path is within a git repository
   * @returns Promise<boolean> True if it's a git repository, false otherwise
   */
  public async isGitRepository(): Promise<boolean> {
    try {
      const isRepo = await this.git.checkIsRepo()
      if (!isRepo) {
        this.log('[GitService] Not a git repository', 'debug')
        return false
      }

      // Additional check to ensure we can access git root
      await this.git.revparse(['--show-toplevel'])
      return true
    } catch (error) {
      this.log('[GitService] Not a git repository', 'debug', {
        error: String(error),
      })
      return false
    }
  }

  /**
   * Validates that the path is a valid git repository
   */
  public async validateRepository(): Promise<GitValidationResult> {
    this.log('[GitService] Validating git repository', 'debug')

    try {
      const isRepo = await this.git.checkIsRepo()
      if (!isRepo) {
        const error = '[GitService] Path is not a valid git repository'
        this.log(error, 'error')
        return { isValid: false, error }
      }

      this.log('[GitService] Git repository validation successful', 'debug')
      return { isValid: true }
    } catch (error) {
      const errorMessage = `Failed to verify git repository: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      return { isValid: false, error: errorMessage }
    }
  }

  /**
   * Gets the current git status and returns changed files
   */
  public async getChangedFiles(): Promise<GitStatusResult> {
    this.log('[GitService] Getting git status', 'debug')

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
          const safeInput = path.basename(
            String(gitRelativePath || '')
              .replace('\0', '')
              .replace(/^(\.\.(\/|\\$))+/, '')
          )
          return path.relative(
            this.repositoryPath,
            path.join(gitRoot, safeInput)
          )
        })

      this.log('[GitService] Git status retrieved', 'info', {
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
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Gets git repository information including remote URL, current commit hash, and branch name
   */
  public async getGitInfo(): Promise<GitInfo> {
    this.log('[GitService] Getting git repository information', 'debug')

    try {
      const [repoUrl, hash, reference] = await Promise.all([
        this.git.getConfig('remote.origin.url'),
        this.git.revparse(['HEAD']),
        this.git.revparse(['--abbrev-ref', 'HEAD']),
      ])

      const normalizedRepoUrl = repoUrl.value
        ? this.normalizeGitUrl(repoUrl.value)
        : ''

      this.log('[GitService] Git repository information retrieved', 'debug', {
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
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Validates if a branch name is valid according to git's rules
   */
  public async isValidBranchName(branchName: string): Promise<boolean> {
    this.log('[GitService] Validating branch name', 'debug', { branchName })

    try {
      const result = await this.git.raw([
        'check-ref-format',
        '--branch',
        branchName,
      ])
      const isValid = Boolean(result)
      this.log('[GitService] Branch name validation result', 'debug', {
        branchName,
        isValid,
      })
      return isValid
    } catch (error) {
      this.log('[GitService] Branch name validation failed', 'debug', {
        branchName,
        error,
      })
      return false
    }
  }

  /**
   * Gets the current branch name
   */
  public async getCurrentBranch(): Promise<string> {
    this.log('[GitService] Getting current branch name', 'debug')

    try {
      const branch = await this.git.revparse(['--abbrev-ref', 'HEAD'])
      this.log('[GitService] Current branch retrieved', 'debug', { branch })
      return branch
    } catch (error) {
      const errorMessage = `Failed to get current branch: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Gets the current commit hash
   */
  public async getCurrentCommitHash(): Promise<string> {
    this.log('[GitService] Getting current commit hash', 'debug')

    try {
      const hash = await this.git.revparse(['HEAD'])
      this.log('[GitService] Current commit hash retrieved', 'debug', { hash })
      return hash
    } catch (error) {
      const errorMessage = `Failed to get current commit hash: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
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
    this.log('[GitService] Getting current commit hash and branch', 'debug')

    try {
      const [hash, branch] = await Promise.all([
        this.git.revparse(['HEAD']),
        this.git.revparse(['--abbrev-ref', 'HEAD']),
      ])

      this.log(
        '[GitService] Current commit hash and branch retrieved',
        'debug',
        {
          hash,
          branch,
        }
      )

      return { hash, branch }
    } catch (error) {
      const errorMessage = `Failed to get current commit hash and branch: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      return { hash: '', branch: '' }
    }
  }

  /**
   * Gets the remote repository URL
   */
  public async getRemoteUrl(): Promise<string> {
    this.log('[GitService] Getting remote repository URL', 'debug')

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

      this.log('[GitService] Remote repository URL retrieved', 'debug', {
        url: normalizedUrl,
      })
      return normalizedUrl
    } catch (error) {
      const errorMessage = `Failed to get remote repository URL: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
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
      `[GitService] Getting the ${maxFiles} most recently changed files, starting with current changes`,
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
      const consideredFiles: string[] = []

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

      this.log(
        `[GitService] Added ${fileSet.size} files from current changes`,
        'debug',
        {
          filesFromCurrentChanges: fileSet.size,
          currentChangesTotal: currentChanges.files.length,
        }
      )

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

            // Collect the file for logging
            consideredFiles.push(adjustedPath)

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
          this.log(
            `[GitService] Could not get files for commit ${commit.hash}`,
            'debug',
            {
              error: showError,
            }
          )
        }
      }

      const files = Array.from(fileSet)

      // Log all considered files in a single statement
      if (consideredFiles.length > 0) {
        this.log(
          `[GitService] Considered ${consideredFiles.length} files during recent file search`,
          'debug',
          { consideredFiles }
        )
      }

      this.log('[GitService] Recently changed files retrieved', 'info', {
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
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
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

    // Strip credentials from HTTPS URLs (e.g. https://token@github.com/org/repo).
    // This is common in CI environments where checkout injects an access token.
    if (
      normalizedUrl.startsWith('https://') ||
      normalizedUrl.startsWith('http://')
    ) {
      // Remove any "userinfo@" segment after the protocol.
      normalizedUrl = normalizedUrl.replace(/^(https?:\/\/)([^@/]+@)/, '$1')
    }

    return normalizedUrl
  }

  /**
   * Gets all remote repository URLs (equivalent to 'git remote -v')
   */
  public async getRepoUrls(): Promise<
    Record<string, { fetch: string; push: string }>
  > {
    this.log('[GitService] Getting all remote repository URLs', 'debug')

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

      this.log('[GitService] Remote repository URLs retrieved', 'debug', {
        remotes: remoteMap,
      })
      return remoteMap
    } catch (error) {
      const errorMessage = `Failed to get remote repository URLs: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Fetches the contents of the .gitignore file from the repository
   * @returns The contents of the .gitignore file as a string, or null if the file doesn't exist
   */
  public async getGitignoreContent(): Promise<string | null> {
    this.log('[GitService] Getting .gitignore contents', 'debug')

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
          '[GitService] Unable to resolve git root while reading .gitignore',
          'debug',
          { error: rootErr }
        )
      }

      if (combinedContent.trim() === '') {
        this.log('[GitService] .gitignore file not found', 'debug')
        return null
      }

      this.log(
        '[GitService] .gitignore contents retrieved successfully',
        'debug'
      )
      return combinedContent.trimEnd()
    } catch (error) {
      const errorMessage = `Failed to get .gitignore contents: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      return null
    }
  }

  public async getGitignoreMatcher(): Promise<Ignore | null> {
    const content = await this.getGitignoreContent()
    if (!content) return null
    return ignore().add(content)
  }

  /**
   * Gets the git repository root directory path
   * @returns Absolute path to the git repository root
   */
  public async getGitRoot(): Promise<string> {
    this.log('[GitService] Getting git repository root', 'debug')

    try {
      const gitRoot = await this.git.revparse(['--show-toplevel'])
      this.log('[GitService] Git root retrieved', 'debug', { gitRoot })
      return gitRoot
    } catch (error) {
      const errorMessage = `Failed to get git repository root: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Ensures that a specific entry exists in the .gitignore file
   * Creates .gitignore if it doesn't exist, adds the entry if not present
   * @param entry The entry to add to .gitignore (e.g., '.mobb', 'node_modules')
   * @returns True if entry was added, false if it already existed
   */
  public async ensureGitignoreEntry(entry: string): Promise<boolean> {
    this.log('[GitService] Ensuring .gitignore entry', 'debug', { entry })

    try {
      const gitRoot = await this.getGitRoot()
      const gitignorePath = path.join(gitRoot, '.gitignore')

      // Read existing content or create empty content
      let gitignoreContent = ''
      if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
        this.log('[GitService] .gitignore file exists', 'debug')
      } else {
        this.log('[GitService] Creating .gitignore file', 'info', {
          gitignorePath,
        })
      }

      // Check if entry already exists
      if (gitignoreContent.includes(entry)) {
        this.log('[GitService] Entry already exists in .gitignore', 'debug', {
          entry,
        })
        return false
      }

      // Add the entry
      this.log('[GitService] Adding entry to .gitignore', 'info', { entry })
      const newLine =
        gitignoreContent.endsWith('\n') || gitignoreContent === '' ? '' : '\n'
      const updatedContent = `${gitignoreContent}${newLine}${entry}\n`

      fs.writeFileSync(gitignorePath, updatedContent, 'utf8')
      this.log('[GitService] .gitignore updated successfully', 'debug', {
        entry,
      })

      return true
    } catch (error) {
      const errorMessage = `Failed to ensure .gitignore entry: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error, entry })
      throw new Error(errorMessage)
    }
  }

  /**
   * Checks if the .gitignore file exists in the repository root
   * @returns True if .gitignore exists, false otherwise
   */
  public async gitignoreExists(): Promise<boolean> {
    this.log('[GitService] Checking if .gitignore exists', 'debug')

    try {
      const gitRoot = await this.getGitRoot()
      const gitignorePath = path.join(gitRoot, '.gitignore')
      const exists = fs.existsSync(gitignorePath)

      this.log('[GitService] .gitignore existence check complete', 'debug', {
        exists,
      })
      return exists
    } catch (error) {
      const errorMessage = `Failed to check .gitignore existence: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'error', { error })
      throw new Error(errorMessage)
    }
  }

  /**
   * Gets timestamps for parent commits in a single git call.
   * @param parentShas Array of parent commit SHAs
   * @returns Array of parent commits with timestamps, or undefined if unavailable
   */
  private async getParentCommitTimestamps(
    parentShas: string[]
  ): Promise<{ sha: string; timestamp: Date }[] | undefined> {
    if (parentShas.length === 0) {
      return undefined
    }

    try {
      // Get all parent timestamps in one call using git log --no-walk
      // Format: %H = full commit hash, %cI = committer date in ISO 8601 format
      // Output: "sha timestamp" per line
      const output = await this.git.raw([
        'log',
        '--format=%H %cI',
        '--no-walk',
        ...parentShas,
      ])

      const parentCommits = output
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line: string) => {
          const [sha, ts] = line.split(' ')
          return { sha: sha ?? '', timestamp: new Date(ts ?? '') }
        })
        .filter((p) => p.sha !== '')

      return parentCommits.length > 0 ? parentCommits : undefined
    } catch {
      // Parents might not be available in shallow clone
      this.log('[GitService] Could not get parent commit timestamps', 'debug', {
        parentShas,
      })
      return undefined
    }
  }

  /**
   * Gets local commit data including diff, timestamp, and parent commits.
   * Used by Tracy extension to send commit data directly without requiring SCM token.
   * @param commitSha The commit SHA to get data for
   * @param maxDiffSizeBytes Maximum diff size in bytes (default 3MB). Returns null if exceeded.
   * @returns Commit data or null if unavailable/too large
   */
  public async getLocalCommitData(
    commitSha: string,
    maxDiffSizeBytes: number = MAX_COMMIT_DIFF_SIZE_BYTES
  ): Promise<LocalCommitData | null> {
    this.log('[GitService] Getting local commit data', 'debug', { commitSha })

    try {
      // Get commit metadata and diff in a single call
      // Format: %cI = committer date ISO 8601, %P = parent SHAs (space-separated)
      // Output: "timestamp\nparentShas\n<DIFF_DELIMITER>\ndiff..."
      const DIFF_DELIMITER = '---MOBB_DIFF_START---'
      const output = await this.git.show([
        commitSha,
        `--format=%cI%n%P%n${DIFF_DELIMITER}`,
        '--patch',
      ])

      // Split output into metadata and diff parts
      const delimiterIndex = output.indexOf(DIFF_DELIMITER)
      if (delimiterIndex === -1) {
        this.log('[GitService] Could not parse git show output', 'warning', {
          commitSha,
        })
        return null
      }
      const metadataOutput = output.substring(0, delimiterIndex)
      const diff = output.substring(delimiterIndex + DIFF_DELIMITER.length + 1) // +1 for newline

      // Check diff size limit
      const diffSizeBytes = Buffer.byteLength(diff, 'utf8')
      if (diffSizeBytes > maxDiffSizeBytes) {
        this.log('[GitService] Commit diff exceeds size limit', 'warning', {
          commitSha,
          diffSizeBytes,
          maxDiffSizeBytes,
        })
        return null
      }

      // Parse metadata: first line is timestamp, second line (if present) is space-separated parent SHAs
      // Note: Initial commits have no parents, so the second line may be empty or missing
      const metadataLines = metadataOutput.trim().split('\n')
      if (metadataLines.length < 1 || !metadataLines[0]) {
        this.log('[GitService] Unexpected metadata format', 'warning', {
          commitSha,
          metadataLines,
        })
        return null
      }
      const timestampStr = metadataLines[0]
      const timestamp = new Date(timestampStr)
      const parentShas = (metadataLines[1] ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)

      // Get parent commits with timestamps
      const parentCommits = await this.getParentCommitTimestamps(parentShas)

      this.log('[GitService] Local commit data retrieved', 'debug', {
        commitSha,
        diffSizeBytes,
        timestamp: timestamp.toISOString(),
        parentCommitCount: parentCommits?.length ?? 0,
      })

      return {
        diff,
        timestamp,
        parentCommits,
      }
    } catch (error) {
      const errorMessage = `Failed to get local commit data: ${(error as Error).message}`
      this.log(`[GitService] ${errorMessage}`, 'debug', { error, commitSha })
      return null
    }
  }
}
