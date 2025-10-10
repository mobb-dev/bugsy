import * as path2 from 'node:path'

import { execFileSync, execSync } from 'child_process'
import fs, {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'
import simpleGit from 'simple-git'

import { benignFileContent } from './fileContents'
import { log } from './log'

/**
 * Base MockRepo class that encapsulates helper methods for creating and cleaning up
 * temporary repositories that are used throughout the test suites.
 */
export class MockRepo {
  /** Holds the path of the temporary repository managed by this instance */
  protected readonly repoPath: string

  /** Holds the remote URL of the repository (if it's a git repo) */
  protected repoUrl: string = ''

  /** Default set of sample files used by multiple helpers */
  protected readonly sampleFiles: string[] = [
    'sample1.py',
    'dir/sample2.py',
    'dir/dir2/sample3.py',
  ]

  /** The list of files to create in the repository */
  protected readonly files: string[]

  /** Path to the sample .gitignore file */
  protected readonly sampleGitignorePath = join(
    __dirname,
    '..',
    'mocks',
    'sample.gitignore'
  )

  /**
   * Creates a new MockRepo instance
   * @param files Optional list of files to create in the repository (defaults to sampleFiles)
   * @param customPath Optional custom path for the repository. If not provided, a temporary directory will be created.
   */
  constructor(files?: string[], customPath?: string) {
    // Use provided files or default to sampleFiles
    this.files = files || this.sampleFiles

    // Use custom path or create a temporary directory
    this.repoPath = customPath || mkdtempSync(join(tmpdir(), 'mcp-test-repo-'))
    log('Created repository directory at:', this.repoPath)
  }

  /**
   * Returns the path to the created repository
   * @returns Path to the repository
   */
  getRepoPath(): string {
    return this.repoPath
  }

  /**
   * Returns the remote URL of the repository
   * @returns Remote URL of the repository
   */
  getRepoUrl(): string {
    return this.repoUrl
  }

  /**
   * Adds a file to the current repository
   * @param fileName Path to the file relative to the repo root, supports nested directories
   * @param fileContent Optional content to write to the file, defaults to benignFileContent if not provided
   * @returns Full path to the created file
   */
  addFile(fileName: string, fileContent?: string): string {
    const filePath = join(this.repoPath, fileName)
    const dirPath = dirname(filePath)

    // Create any necessary directories
    mkdirSync(dirPath, { recursive: true })

    // Write the file with content or default content
    const content = fileContent !== undefined ? fileContent : benignFileContent
    writeFileSync(filePath, content)
    log(`Created file ${fileName} in repo`)
    const now = Date.now()
    utimesSync(filePath, now / 1000, now / 1000)

    return filePath
  }

  /**
   * Updates an existing file in the repository
   * @param fileName Path to the file relative to the repo root, supports nested directories
   * @param fileContent Content to write to the file
   * @returns Full path to the updated file
   * @throws Error if the file does not exist
   */
  updateFile(fileName: string, fileContent: string): string {
    const filePath = join(this.repoPath, fileName)

    // Verify the file exists
    if (!existsSync(filePath)) {
      throw new Error(`File ${fileName} does not exist in repository`)
    }

    // Overwrite the file content
    writeFileSync(filePath, fileContent)
    log(`Updated file ${fileName} in repo`)
    const now = Date.now()
    utimesSync(filePath, now / 1000, now / 1000)

    return filePath
  }

  /**
   * Adds multiple files to the repository
   * @param files Array of file objects with fileName, fileContent and isCommitted properties
   * @returns Array of paths to the created files
   */
  addFiles(
    files: {
      fileName: string
      fileContent?: string
      isCommitted: boolean
    }[]
  ): string[] {
    const filesToCommit: string[] = []
    const filePaths: string[] = []

    // Add each file
    files.forEach((file) => {
      const path = this.addFile(file.fileName, file.fileContent)
      filePaths.push(path)

      if (file.isCommitted) {
        filesToCommit.push(file.fileName)
      }
    })

    // Commit files marked for committing
    if (filesToCommit.length > 0) {
      this.commitFiles(
        filesToCommit,
        `Add ${filesToCommit.length} files`
      ).catch((error) => {
        console.error('Error committing files:', error)
      })
    }

    return filePaths
  }

  /**
   * Adds and commits the specified files to Git
   * @param fileNames Array of file paths relative to the repo root to commit, or a single file path
   * @param commitMessage Optional commit message, defaults to "Add files"
   * @returns true if commit successful, false otherwise
   */
  async commitFiles(
    fileNames: string | string[],
    commitMessage?: string
  ): Promise<boolean> {
    try {
      const git = simpleGit(this.repoPath)

      // Check if this is a git repository
      try {
        await git.revparse(['--is-inside-work-tree'])
      } catch (error) {
        log('Not a git repository, skipping commit')
        return false
      }

      // Convert single file name to array
      const files = Array.isArray(fileNames) ? fileNames : [fileNames]

      // Stage the files
      await git.add(files)
      log(`Added ${files.length} files to git staging`)

      // Create commit
      const message = commitMessage || 'Add files'
      await git.commit(message)
      log(`Committed files with message: ${message}`)

      return true
    } catch (error) {
      log('Error committing files:', error)
      return false
    }
  }

  /**
   * Adds a file to the repository and optionally commits it
   * @param fileName Path to the file relative to the repo root
   * @param fileContent Optional content to write to the file
   * @param isCommitEnabled Whether to commit the file after adding it
   * @param commitMessage Optional commit message
   * @returns Full path to the created file
   */
  async addAndCommitFile(
    fileName: string,
    fileContent?: string,
    isCommitEnabled: boolean = true,
    commitMessage?: string
  ): Promise<string> {
    // Add the file
    const filePath = this.addFile(fileName, fileContent)

    // Commit if requested
    if (isCommitEnabled) {
      await this.commitFiles(fileName, commitMessage || `Add ${fileName}`)
    }

    return filePath
  }

  /**
   * Initializes a git repository in the current path
   * @returns true if successful, false otherwise
   */
  protected initGitRepo(): boolean {
    try {
      log('Initializing git repository at:', this.repoPath)
      execSync('git init --initial-branch=main -q', {
        cwd: this.repoPath,
        stdio: 'ignore',
      })
      return true
    } catch (error) {
      log('Git init failed:', error)
      return false
    }
  }

  /**
   * Configures git user name and email
   * @returns true if successful, false otherwise
   */
  protected configureGitUser(): boolean {
    try {
      execSync('git config user.name "Test User"', {
        cwd: this.repoPath,
        stdio: 'ignore',
      })
      execSync('git config user.email "test@example.com"', {
        cwd: this.repoPath,
        stdio: 'ignore',
      })
      return true
    } catch (error) {
      log('Git user configuration failed:', error)
      return false
    }
  }

  /**
   * Creates an empty commit
   * @param message The commit message
   * @returns true if successful, false otherwise
   */
  protected createEmptyCommit(message: string = 'Initial commit'): boolean {
    try {
      execFileSync('git', ['commit', '--allow-empty', '-m', message], {
        cwd: this.repoPath,
        stdio: 'ignore',
      })
      log('Created empty commit with message:', message)
      return true
    } catch (error) {
      log('Failed to create empty commit:', error)
      return false
    }
  }

  /**
   * Adds all files to git staging
   * @returns true if successful, false otherwise
   */
  protected stageAllFiles(): boolean {
    try {
      execSync('git add .', {
        cwd: this.repoPath,
        stdio: 'ignore',
      })
      log('Added all files to git staging')
      return true
    } catch (error) {
      log('Failed to stage files:', error)
      return false
    }
  }

  /**
   * Creates a commit with all staged files
   * @param message The commit message
   * @returns true if successful, false otherwise
   */
  protected commitStagedFiles(message: string = 'Add sample files'): boolean {
    try {
      execFileSync('git', ['commit', '-m', message], {
        cwd: this.repoPath,
        stdio: 'ignore',
      })
      log(`Committed staged files with message: ${message}`)
      return true
    } catch (error) {
      log('Failed to commit staged files:', error)
      return false
    }
  }

  /**
   * Adds a remote origin to the git repository
   * @param url The remote URL
   * @returns true if successful, false otherwise
   */
  protected addRemoteOrigin(
    url: string = 'https://github.com/test-org/test-repo.git'
  ): boolean {
    try {
      execFileSync('git', ['remote', 'add', 'origin', url], {
        cwd: this.repoPath,
        stdio: 'ignore',
      })
      log('Added remote origin URL:', url)
      return true
    } catch (error) {
      log('Failed to add remote origin:', error)
      return false
    }
  }

  /**
   * Reads the sample.gitignore content
   * @returns Content of the sample .gitignore file
   */
  protected getSampleGitignoreContent(): string {
    try {
      return readFileSync(this.sampleGitignorePath, 'utf-8')
    } catch (error) {
      console.error('Error reading sample.gitignore file:', error)
      return '# Default gitignore\nnode_modules/\ndist/\n*.log'
    }
  }

  /**
   * Creates .gitignore file in repository
   */
  protected createGitignoreFile(): void {
    try {
      const gitignoreContent = this.getSampleGitignoreContent()
      this.addFiles([
        {
          fileName: '.gitignore',
          fileContent: gitignoreContent,
          isCommitted: false,
        },
      ])
      log('Created .gitignore file in repository')
    } catch (error) {
      console.error('Error creating .gitignore file:', error)
    }
  }

  /**
   * Creates all sample files defined in this.files inside the provided repository path.
   * Ensures that every file's parent directories exist before writing.
   *
   * @param content The content to write to each file. Defaults to benignFileContent.
   */
  protected generateFiles(content: string = benignFileContent): void {
    this.files.forEach((file, idx) => {
      const filePath = join(this.repoPath, file)
      const dirPath = dirname(filePath)
      mkdirSync(dirPath, { recursive: true })
      writeFileSync(filePath, content)
      // Stagger modification times so later files appear newer
      const time = Date.now() + idx * 1000
      fs.utimesSync(filePath, time / 1000, time / 1000)
      log(`Created file ${file} in repo`)
    })
  }

  /**
   * Deletes a repository from disk.
   */
  deleteGitRepo(): void {
    try {
      if (existsSync(this.repoPath)) {
        // Try to clean up git hooks if they exist
        try {
          const hooksDir = join(this.repoPath, '.git', 'hooks')
          if (existsSync(hooksDir)) {
            execSync(`chmod -R 755 ${hooksDir}`, { stdio: 'ignore' })
          }
        } catch (e) {
          log(`Warning: Could not clean up git hooks: ${e}`)
        }

        rmSync(this.repoPath, { recursive: true, force: true })
        log(`Cleaned up repo at: ${this.repoPath}`)
      }
    } catch (e) {
      console.error(
        `Error cleaning up repo at ${String(this.repoPath).replace(/\n|\r/g, '')}:`,
        e
      )
    }
  }

  /** Remove any leftover repositories this helper knows about */
  cleanupAll(): void {
    log('Cleaning up repository')
    try {
      if (existsSync(this.repoPath)) {
        rmSync(this.repoPath, { recursive: true, force: true })
        log(`Cleaned up repo at: ${this.repoPath}`)
      }
    } catch (e) {
      console.error(
        `Error cleaning up repo at ${String(this.repoPath).replace(/\n|\r/g, '')}:`,
        e
      )
    }
  }

  /**
   * Overwrite an existing sample file (by its index in files) with new content.
   * @param fileIndex Index into this.files (0-based)
   * @param content   New file contents
   */
  updateFileContent(fileIndex: number, content: string): void {
    if (fileIndex < 0 || fileIndex >= this.files.length) {
      throw new RangeError('fileIndex out of bounds')
    }

    const relativeFilePath = this.files[fileIndex] as string
    try {
      const safeInput = path2.basename(
        String(relativeFilePath || '')
          .replace('\0', '')
          .replace(/^(\.\.(\/|\\$))+/, '')
      )
      const filePath = join(this.repoPath, safeInput)
      const dirPath = dirname(filePath)
      mkdirSync(dirPath, { recursive: true })
      writeFileSync(filePath, content)
      log(`Updated file ${relativeFilePath} in repo ${this.repoPath}`)
    } catch (error) {
      console.error('Error updating file content:', error)
    }
  }
}

/**
 * EmptyGitRepo creates an empty git repository with just an initial commit.
 */
export class EmptyGitRepo extends MockRepo {
  /**
   * Creates a new EmptyGitRepo instance
   * @param files Optional list of files to create in the repository (defaults to sampleFiles)
   * @param _options Additional options for repository creation (not used, kept for API consistency)
   */
  constructor(files?: string[], _options: { repoUrl?: string } = {}) {
    super(files ?? [])
    this.initializeEmptyGitRepo()
  }

  /**
   * Initializes an empty git repository with an initial commit
   */
  private initializeEmptyGitRepo(): void {
    try {
      // Initialize git repository and configure user
      this.initGitRepo()
      this.configureGitUser()

      // Create .gitignore file with sample content
      this.createGitignoreFile()

      // Create initial commit
      this.createEmptyCommit()
    } catch (e) {
      log('Git init failed (non-fatal for tests):', e)
    }
  }
}

/**
 * ActiveGitRepo creates a git repository with committed files that are modified,
 * resulting in uncommitted changes in the working directory.
 */
/**
 * Helper function to generate unique repository URLs for test isolation
 * @param prefix - The prefix to use in the repo name (e.g., 'multi-comment-styles')
 * @returns A unique repository URL
 */
function generateUniqueRepoUrl(prefix: string = 'test-repo'): string {
  return `https://github.com/test-org/${prefix}-${Math.random()
    .toString(36)
    .substring(2, 15)}.git`
}

export class ActiveGitRepo extends MockRepo {
  /**
   * Creates a new ActiveGitRepo instance with committed files that are modified
   * @param files Optional list of files to create in the repository (defaults to sampleFiles)
   * @param options Additional options for repository creation
   */
  constructor(
    files?: string[],
    options: {
      repoUrl?: string
    } = {}
  ) {
    super(files)
    this.initializeActiveGitRepo(options)
  }

  /**
   * Initializes a git repository with files that are committed and then modified
   * @param options Additional options for repository creation
   */
  private initializeActiveGitRepo(options: { repoUrl?: string }): void {
    try {
      // Initialize git repo and configure user
      this.initGitRepo()
      this.configureGitUser()

      // .gitignore and sample files
      this.createGitignoreFile()
      this.generateFiles()

      // stage and commit
      this.stageAllFiles()
      this.commitStagedFiles()

      // add remote origin - use provided repoUrl or generate unique one by default
      const remoteUrl = options.repoUrl || generateUniqueRepoUrl('test-repo')
      this.repoUrl = remoteUrl
      this.addRemoteOrigin(remoteUrl)

      // modify files to create changes
      this.files.forEach((file) => {
        const filePath = join(this.repoPath, file)
        writeFileSync(filePath, benignFileContent + ' ')
      })
    } catch (e) {
      log('Synchronous ACTIVE repo setup failed:', e)
    }
  }
}

/**
 * NoChangesGitRepo creates a git repository with committed files without any modifications.
 */
export class NoChangesGitRepo extends MockRepo {
  /**
   * Creates a new NoChangesGitRepo instance with committed files but no modifications
   * @param files Optional list of files to create in the repository (defaults to sampleFiles)
   * @param options Additional options for repository creation
   */
  constructor(files?: string[], options: { repoUrl?: string } = {}) {
    super(files)
    this.initializeNoChangesGitRepo(options)
  }

  /**
   * Initializes a git repository with files that are committed but not modified
   * @param options Additional options for repository creation
   */
  private initializeNoChangesGitRepo(options: { repoUrl?: string }): void {
    try {
      // Initialize git repo and configure user
      this.initGitRepo()
      this.configureGitUser()

      // .gitignore and sample files
      this.createGitignoreFile()
      this.generateFiles()

      // stage and commit
      this.stageAllFiles()
      this.commitStagedFiles()

      // add remote origin
      const remoteUrl =
        options.repoUrl || 'https://github.com/test-org/test-repo.git'
      this.repoUrl = remoteUrl
      this.addRemoteOrigin(remoteUrl)
    } catch (e) {
      log('Synchronous NO_CHANGES repo setup failed:', e)
    }
  }
}

/**
 * NonGitRepo creates a filesystem directory structure with files but without initializing a git repository.
 */
export class NonGitRepo extends MockRepo {
  /**
   * Creates a new NonGitRepo instance with files but no git repository
   * @param files Optional list of files to create in the repository (defaults to sampleFiles)
   */
  constructor(files?: string[]) {
    super(files)
    this.initializeNonGitRepo()
  }

  /**
   * Creates a filesystem directory structure with files but without a Git repository
   */
  private initializeNonGitRepo(): void {
    // Create .gitignore file even in non-Git repos for testing purposes
    this.createGitignoreFile()

    // Generate sample files inside the repository
    this.generateFiles()
  }
}
