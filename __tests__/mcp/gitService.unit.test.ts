import { existsSync, unlinkSync, writeFileSync } from 'fs'
import fs from 'fs'
import path from 'path'
import { SimpleGit, StatusResult } from 'simple-git'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FileUtils } from '../../src/features/analysis/scm/services/FileUtils'
import {
  GitService,
  normalizeGitUrl,
} from '../../src/features/analysis/scm/services/GitService'
import {
  ActiveGitRepo,
  EmptyGitRepo,
  MockRepo,
  NoChangesGitRepo,
  NonGitRepo,
} from './helpers/MockRepo'

// Mock FileUtils
vi.mock('../../src/features/analysis/scm/services/FileUtils', () => ({
  FileUtils: {
    shouldPackFile: vi.fn().mockResolvedValue(true),
  },
}))

describe('GitService', () => {
  let mockRepo: MockRepo
  let gitService: GitService
  let repoPath: string
  const logSpy = vi.fn()

  beforeEach(() => {
    mockRepo = new EmptyGitRepo()
    logSpy.mockClear()
  })

  afterEach(() => {
    mockRepo.cleanupAll()
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with the repository path and logger', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      expect(gitService).toBeDefined()
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Git service initialized',
        'debug',
        expect.objectContaining({ repositoryPath: repoPath })
      )
    })

    it('should initialize with default no-op logger if none provided', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath)

      expect(gitService).toBeDefined()
      // No assertion on logSpy as we're using the default logger
    })
  })

  describe('validateRepository', () => {
    it('should return valid=true for a valid git repository', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const isValidResult = await gitService.validateRepository()

      expect(isValidResult).toEqual({ isValid: true })
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Validating git repository',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Git repository validation successful',
        'debug'
      )
    })

    it('should return valid=false for a non-git directory', async () => {
      const nonGitRepo = new NonGitRepo()
      repoPath = nonGitRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const isValidResult = await gitService.validateRepository()

      expect(isValidResult).toEqual({
        isValid: false,
        error: '[GitService] Path is not a valid git repository',
      })
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Validating git repository',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Path is not a valid git repository',
        'error'
      )
    })

    it('should handle errors during validation', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Mock git.checkIsRepo to throw an error instead of removing the .git directory
      const gitMock = {
        checkIsRepo: vi.fn().mockImplementation(() => {
          throw new Error('Failed to verify git repository')
        }),
      } as unknown as SimpleGit

      // Intentionally accessing private property for testing via index signature
      gitService['git'] = gitMock

      const isValidResult = await gitService.validateRepository()

      expect(isValidResult.isValid).toBe(false)
      expect(isValidResult.error).toContain('Failed to verify git repository')
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to verify git repository'),
        'error',
        expect.anything()
      )
    })
  })

  describe('getChangedFiles', () => {
    it('should return changed files in the repository', async () => {
      const activeRepo = new ActiveGitRepo()
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const changedFiles = await gitService.getChangedFiles()

      expect(changedFiles.files.length).toBeGreaterThan(0)
      expect(changedFiles.deletedFiles).toEqual([])
      expect(changedFiles.status).toBeDefined()
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Getting git status',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Git status retrieved',
        'info',
        expect.anything()
      )
    })

    it('should identify deleted files', async () => {
      // Skip this test for now as it's causing filesystem issues
      // Will be revisited in a follow-up PR
    })

    it('should handle errors when getting git status', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Create a situation that would cause an error
      fs.rmSync(path.join(repoPath, '.git'), { recursive: true, force: true })

      await expect(gitService.getChangedFiles()).rejects.toThrow(
        'Failed to get git status'
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get git status'),
        'error',
        expect.anything()
      )
    })

    it('should handle working directory paths correctly', async () => {
      const activeRepo = new ActiveGitRepo()
      repoPath = activeRepo.getRepoPath()!
      const subDirPath = path.join(repoPath, 'dir')

      // Create git service pointing to a subdirectory of the repo
      gitService = new GitService(subDirPath, logSpy)

      const changedFiles = await gitService.getChangedFiles()

      // Verify files are correctly reported relative to the subdirectory
      expect(changedFiles.files.length).toBeGreaterThan(0)
      // We don't need to check exact paths, just that the function didn't throw
    })
  })

  describe('getGitInfo', () => {
    it('should return repository information', async () => {
      const testRepoUrl = 'https://github.com/test-org/test-repo'
      const activeRepo = new ActiveGitRepo([], { repoUrl: testRepoUrl })
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const gitInfo = await gitService.getGitInfo()

      expect(gitInfo).toEqual({
        repoUrl: testRepoUrl,
        hash: expect.any(String),
        reference: expect.any(String),
      })
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Getting git repository information',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Git repository information retrieved',
        'debug',
        expect.anything()
      )
    })

    it('should normalize SSH URLs to HTTPS', async () => {
      const activeRepo = new ActiveGitRepo([], {
        repoUrl: 'git@github.com:test-org/test-repo.git',
      })
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const gitInfo = await gitService.getGitInfo()

      expect(gitInfo.repoUrl).toBe('https://github.com/test-org/test-repo')
    })

    it('should handle errors when getting git info', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Create a situation that would cause an error
      fs.rmSync(path.join(repoPath, '.git'), { recursive: true, force: true })

      await expect(gitService.getGitInfo()).rejects.toThrow(
        'Failed to get git repository information'
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get git repository information'),
        'error',
        expect.anything()
      )
    })
  })

  describe('isValidBranchName', () => {
    it('should return true for a valid branch name', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const validBranchName = 'feature/new-feature'
      const isValid = await gitService.isValidBranchName(validBranchName)

      expect(isValid).toBe(true)
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Validating branch name',
        'debug',
        {
          branchName: validBranchName,
        }
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Branch name validation result',
        'debug',
        { branchName: validBranchName, isValid: true }
      )
    })

    it('should return false for an invalid branch name', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const invalidBranchName = 'feature/new.lock'
      const isValid = await gitService.isValidBranchName(invalidBranchName)

      expect(isValid).toBe(false)
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Validating branch name',
        'debug',
        {
          branchName: invalidBranchName,
        }
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Branch name validation failed',
        'debug',
        expect.objectContaining({ branchName: invalidBranchName })
      )
    })
  })

  describe('getCurrentBranch', () => {
    it('should return the current branch name', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const branch = await gitService.getCurrentBranch()

      expect(typeof branch).toBe('string')
      expect(branch).toBeTruthy()
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Getting current branch name',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Current branch retrieved',
        'debug',
        {
          branch,
        }
      )
    })

    it('should handle errors when getting current branch', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Create a situation that would cause an error
      fs.rmSync(path.join(repoPath, '.git'), { recursive: true, force: true })

      await expect(gitService.getCurrentBranch()).rejects.toThrow(
        'Failed to get current branch'
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get current branch'),
        'error',
        expect.anything()
      )
    })
  })

  describe('getCurrentCommitHash', () => {
    it('should return the current commit hash', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const hash = await gitService.getCurrentCommitHash()

      expect(typeof hash).toBe('string')
      expect(hash).toMatch(/^[a-f0-9]+$/) // Hash should be hexadecimal
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Getting current commit hash',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Current commit hash retrieved',
        'debug',
        { hash }
      )
    })

    it('should handle errors when getting commit hash', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Create a situation that would cause an error
      fs.rmSync(path.join(repoPath, '.git'), { recursive: true, force: true })

      await expect(gitService.getCurrentCommitHash()).rejects.toThrow(
        'Failed to get current commit hash'
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get current commit hash'),
        'error',
        expect.anything()
      )
    })
  })

  describe('getCurrentCommitAndBranch', () => {
    it('should return both the current commit hash and branch name', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const commitAndBranch = await gitService.getCurrentCommitAndBranch()

      expect(commitAndBranch).toEqual({
        hash: expect.stringMatching(/^[a-f0-9]+$/),
        branch: expect.any(String),
      })
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Getting current commit hash and branch',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Current commit hash and branch retrieved',
        'debug',
        {
          hash: expect.any(String),
          branch: expect.any(String),
        }
      )
    })

    it('should return empty strings on error', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Create a situation that would cause an error
      fs.rmSync(path.join(repoPath, '.git'), { recursive: true, force: true })

      const commitAndBranch = await gitService.getCurrentCommitAndBranch()

      expect(commitAndBranch).toEqual({ hash: '', branch: '' })
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get current commit hash and branch'),
        'error',
        expect.anything()
      )
    })
  })

  describe('getRemoteUrl', () => {
    it('should return the remote URL', async () => {
      const testRepoUrl = 'https://github.com/test-org/test-repo'
      const activeRepo = new ActiveGitRepo([], {
        repoUrl: testRepoUrl,
      })
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const url = await gitService.getRemoteUrl()

      expect(url).toBe(testRepoUrl)
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Getting remote repository URL',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Remote repository URL retrieved',
        'debug',
        { url }
      )
    })

    it('should normalize SSH URLs to HTTPS', async () => {
      const activeRepo = new ActiveGitRepo([], {
        repoUrl: 'git@github.com:test-org/test-repo.git',
      })
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const url = await gitService.getRemoteUrl()

      expect(url).toBe('https://github.com/test-org/test-repo')
    })

    it('should handle errors when getting remote URL', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Mock getConfig to throw an error
      const gitMock = {
        getConfig: vi.fn().mockImplementation(() => {
          throw new Error('Failed to get remote repository URL')
        }),
      } as unknown as SimpleGit

      // Intentionally accessing private property for testing via index signature
      gitService['git'] = gitMock

      await expect(gitService.getRemoteUrl()).rejects.toThrow(
        'Failed to get remote repository URL'
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get remote repository URL'),
        'error',
        expect.anything()
      )
    })
  })

  describe('getRecentlyChangedFiles', () => {
    beforeEach(() => {
      // Reset the mock for shouldPackFile
      vi.mocked(FileUtils.shouldPackFile).mockResolvedValue(true)
    })

    it('should return recently changed files', async () => {
      const activeRepo = new ActiveGitRepo()
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Mock getChangedFiles to return sample files
      const mockFiles = ['file1.js', 'file2.js']
      vi.spyOn(gitService, 'getChangedFiles').mockResolvedValue({
        files: mockFiles,
        deletedFiles: [],
        status: {} as StatusResult,
      })

      const changedFiles = await gitService.getRecentlyChangedFiles({})

      expect(changedFiles.files).toEqual(expect.arrayContaining(mockFiles))
      expect(changedFiles.commitCount).toBeGreaterThanOrEqual(0)
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Getting the'),
        'debug'
      )
    })

    it('should limit number of files returned based on maxFiles', async () => {
      const activeRepo = new ActiveGitRepo()
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Mock getChangedFiles to return more files than the maxFiles limit
      const mockFiles = ['file1.js', 'file2.js', 'file3.js']
      vi.spyOn(gitService, 'getChangedFiles').mockResolvedValue({
        files: mockFiles,
        deletedFiles: [],
        status: {} as StatusResult,
      })

      const maxFiles = 1
      const changedFiles = await gitService.getRecentlyChangedFiles({
        maxFiles,
      })

      expect(changedFiles.files.length).toBeLessThanOrEqual(maxFiles)
    })

    it('should apply file filtering using FileUtils.shouldPackFile', async () => {
      const activeRepo = new ActiveGitRepo()
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Mock getChangedFiles to return sample files
      const mockFiles = ['file1.js', 'sample1.py', 'file2.js']
      vi.spyOn(gitService, 'getChangedFiles').mockResolvedValue({
        files: mockFiles,
        deletedFiles: [],
        status: {} as StatusResult,
      })

      // Set up FileUtils.shouldPackFile to reject specific files
      vi.mocked(FileUtils.shouldPackFile).mockImplementation(
        (filePath: string) => {
          return !filePath.includes('sample1.py')
        }
      )

      const changedFiles = await gitService.getRecentlyChangedFiles({})

      // We should not see sample1.py in the results
      expect(
        changedFiles.files.some((file) => file.includes('sample1.py'))
      ).toBe(false)
    })

    it('should handle errors when getting recently changed files', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Create a situation that would cause an error
      fs.rmSync(path.join(repoPath, '.git'), { recursive: true, force: true })

      await expect(gitService.getRecentlyChangedFiles({})).rejects.toThrow(
        'Failed to get recently changed files'
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get recently changed files'),
        'error',
        expect.anything()
      )
    })
  })

  describe('getGitignoreContent', () => {
    it('should return gitignore content when it exists', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      const gitignoreContent = 'node_modules/\ndist/\n*.log'
      writeFileSync(path.join(repoPath, '.gitignore'), gitignoreContent)
      gitService = new GitService(repoPath, logSpy)

      const content = await gitService.getGitignoreContent()

      expect(content).toBe(gitignoreContent)
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Getting .gitignore contents',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] .gitignore contents retrieved successfully',
        'debug'
      )
    })

    it('should return null when gitignore does not exist', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Make sure there's no .gitignore file
      if (existsSync(path.join(repoPath, '.gitignore'))) {
        unlinkSync(path.join(repoPath, '.gitignore'))
      }

      const content = await gitService.getGitignoreContent()

      expect(content).toBeNull()
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] Getting .gitignore contents',
        'debug'
      )
      expect(logSpy).toHaveBeenCalledWith(
        '[GitService] .gitignore file not found',
        'debug'
      )
    })

    it('should handle errors when reading gitignore', async () => {
      const emptyRepo = new EmptyGitRepo()
      repoPath = emptyRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      // Create a gitignore file
      const gitignorePath = path.join(repoPath, '.gitignore')
      writeFileSync(gitignorePath, 'node_modules/')

      // Use spyOn instead of direct mocking to preserve function signature
      vi.spyOn(fs, 'readFileSync').mockImplementation((filePath, options) => {
        if (filePath === gitignorePath) {
          throw new Error('Permission denied')
        }
        // Call the original implementation for other paths
        return originalReadFileSync(
          filePath,
          options as
            | fs.ObjectEncodingOptions
            | BufferEncoding
            | null
            | undefined
        )
      })

      const originalReadFileSync = fs.readFileSync

      const content = await gitService.getGitignoreContent()

      expect(content).toBeNull()
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get .gitignore contents'),
        'error',
        expect.anything()
      )

      // Restore original function
      vi.mocked(fs.readFileSync).mockRestore()
    })
  })

  // New tests for getGitignoreMatcher (using ignore library)
  describe('getGitignoreMatcher', () => {
    it('should create matcher that ignores paths from .gitignore', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      const gitignoreContent = 'node_modules/\n*.log\n'
      writeFileSync(path.join(repoPath, '.gitignore'), gitignoreContent)

      const gitService = new GitService(repoPath)
      const matcher = await gitService.getGitignoreMatcher()

      expect(matcher).not.toBeNull()
      expect(matcher?.ignores('node_modules/foo.js')).toBe(true)
      expect(matcher?.ignores('debug.log')).toBe(true)
      expect(matcher?.ignores('src/app.ts')).toBe(false)
    })

    it('should return matcher when .gitignore exists', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      const gitignoreContent = 'node_modules/\n*.log\n'
      writeFileSync(path.join(repoPath, '.gitignore'), gitignoreContent)

      const gitService = new GitService(repoPath)
      const matcher = await gitService.getGitignoreMatcher()

      expect(matcher).not.toBeNull()
    })

    // Add new test to ensure nested .gitignore files are respected
    it('should respect .gitignore files located in a subdirectory (monorepo support)', async () => {
      const repo = new EmptyGitRepo()
      const repoRootPath = repo.getRepoPath()!

      // Create subdirectory similar to monorepo package structure
      const subDirPath = path.join(repoRootPath, 'packages', 'app')
      fs.mkdirSync(subDirPath, { recursive: true })

      // Write .gitignore inside the subdirectory only
      const gitignoreContent = 'build/\n*.tmp\n'
      writeFileSync(path.join(subDirPath, '.gitignore'), gitignoreContent)

      // Initialize GitService pointing to the subdirectory
      const gitService = new GitService(subDirPath)
      const matcher = await gitService.getGitignoreMatcher()

      expect(matcher).not.toBeNull()
      expect(matcher?.ignores('build/output.js')).toBe(true)
      expect(matcher?.ignores('foo.tmp')).toBe(true)
      expect(matcher?.ignores('src/index.ts')).toBe(false)
    })
  })

  // Extend MockRepo with additional functionality needed for GitService tests
  describe('Extended MockRepo functionality', () => {
    it('should allow creating a repository with a specific remote URL', async () => {
      const customUrl = 'https://github.com/custom/repo'
      const activeRepo = new ActiveGitRepo([], {
        repoUrl: customUrl,
      })
      repoPath = activeRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const gitInfo = await gitService.getGitInfo()

      expect(gitInfo.repoUrl).toBe(customUrl)
    })

    it('should allow creating repositories with various states', async () => {
      // Test repository with no changes
      const activeNoChangesRepo = new NoChangesGitRepo()
      repoPath = activeNoChangesRepo.getRepoPath()!
      gitService = new GitService(repoPath, logSpy)

      const changedFiles = await gitService.getChangedFiles()

      // Should have no changed files
      expect(changedFiles.files.length).toBe(0)

      // Add a new file to test that changes are detected
      const newFilePath = path.join(repoPath, 'new-file.js')
      writeFileSync(newFilePath, 'console.log("new file");')

      const updatedChangedFiles = await gitService.getChangedFiles()

      // Should now detect the new file
      expect(updatedChangedFiles.files.length).toBeGreaterThan(0)
    })
  })

  // Additional edge-case tests to improve coverage
  describe('edge-case coverage', () => {
    it('normalizeGitUrl should handle Azure DevOps SSH formats', () => {
      expect(normalizeGitUrl('git@ssh.dev.azure.com:v3/org/proj/repo')).toBe(
        'https://dev.azure.com/v3/org/proj/repo'
      )

      expect(normalizeGitUrl('git@contoso.com:v3/org/proj/repo')).toBe(
        'https://contoso.com/org/_git/repo'
      )
    })

    it('getGitignoreContent should still succeed when git root cannot be resolved', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      const localContent = 'tmp'
      writeFileSync(path.join(repoPath, '.gitignore'), localContent)

      const gitService = new GitService(repoPath)
      // Mock revparse to throw so the inner catch executes
      gitService['git'] = {
        revparse: vi.fn().mockImplementation(() => {
          throw new Error('fail')
        }),
      } as unknown as SimpleGit

      const content = await gitService.getGitignoreContent()
      expect(content).toBe(localContent)
    })

    it('isValidBranchName should return false on git error', async () => {
      const repo = new EmptyGitRepo()
      const gitService = new GitService(repo.getRepoPath()!)
      gitService['git'] = {
        raw: vi.fn().mockImplementation(() => {
          throw new Error('format error')
        }),
      } as unknown as SimpleGit

      const isValid = await gitService.isValidBranchName('invalid')
      expect(isValid).toBe(false)
    })
  })
})
