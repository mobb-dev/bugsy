import fs from 'fs/promises'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FileUtils } from '../../src/features/analysis/scm/services/FileUtils'
import { GitService } from '../../src/features/analysis/scm/services/GitService'
import { getLocalFiles } from '../../src/mcp/services/GetLocalFiles'
import { ScanContext } from '../../src/types'
import {
  ActiveGitRepo,
  EmptyGitRepo,
  MockRepo,
  NoChangesGitRepo,
  NonGitRepo,
} from './helpers/MockRepo'

// Mock external dependencies
vi.mock('../../src/features/analysis/scm/services/FileUtils', () => ({
  FileUtils: {
    getLastChangedFiles: vi.fn(),
    shouldPackFile: vi.fn(),
    processRootDirectory: vi.fn(),
    processDirectory: vi.fn(),
  },
}))

vi.mock('../../src/features/analysis/scm/services/GitService')

describe('getLocalFiles', () => {
  let mockRepos: MockRepo[] = []
  let mockFileUtils: any
  let mockGitService: any

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Get references to mocked modules
    mockFileUtils = vi.mocked(FileUtils)
    mockGitService = vi.mocked(GitService)

    // Default mock implementations
    mockFileUtils.shouldPackFile.mockReturnValue(true)
    mockFileUtils.getLastChangedFiles.mockResolvedValue([])

    // Mock GitService constructor and methods
    mockGitService.mockImplementation(() => ({
      validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
      getChangedFiles: vi.fn().mockResolvedValue({ files: [] }),
      getRecentlyChangedFiles: vi
        .fn()
        .mockResolvedValue({ files: [], commitCount: 0 }),
    }))
  })

  afterEach(() => {
    // Clean up all mock repos
    mockRepos.forEach((repo) => repo.cleanupAll())
    mockRepos = []
    vi.clearAllMocks()
  })

  const createMockRepo = (
    type: 'empty' | 'active' | 'no-changes' | 'non-git',
    files?: string[]
  ) => {
    let repo: MockRepo
    switch (type) {
      case 'empty':
        repo = new EmptyGitRepo(files)
        break
      case 'active':
        repo = new ActiveGitRepo(files)
        break
      case 'no-changes':
        repo = new NoChangesGitRepo(files)
        break
      case 'non-git':
        repo = new NonGitRepo(files)
        break
    }
    mockRepos.push(repo)
    return repo
  }

  describe('basic functionality', () => {
    it('should return empty array when no files are found', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(result).toEqual([])
    })

    it('should resolve symlink paths using fs.realpath', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(realPathSpy).toHaveBeenCalledWith(repoPath)
    })

    it('should pass correct parameters to GitService constructor', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(mockGitService).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Function)
      )
    })
  })

  describe('different repository types', () => {
    describe('EmptyGitRepo', () => {
      it('should handle empty git repository', async () => {
        const mockRepo = createMockRepo('empty')
        const repoPath = mockRepo.getRepoPath()

        const result = await getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })

        expect(result).toEqual([])
        expect(mockGitService).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Function)
        )
      })
    })

    describe('ActiveGitRepo', () => {
      it('should process git repository with changes', async () => {
        const mockRepo = createMockRepo('active', ['file1.js', 'file2.py'])
        const repoPath = mockRepo.getRepoPath()

        // Mock git service to return changed files
        const mockInstance = {
          validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
          getChangedFiles: vi.fn().mockResolvedValue({
            files: ['file1.js', 'file2.py'],
          }),
          getRecentlyChangedFiles: vi.fn(),
        }
        mockGitService.mockReturnValue(mockInstance)

        // Mock file stats
        const mockStat = vi.spyOn(fs, 'stat').mockImplementation(
          async (_filePath) =>
            ({
              mtime: new Date(Date.now()),
            }) as any
        )

        const result = await getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })

        expect(mockInstance.validateRepository).toHaveBeenCalled()
        expect(mockInstance.getChangedFiles).toHaveBeenCalled()
        expect(result).toHaveLength(2)
        expect(result[0]).toMatchObject({
          filename: 'file1.js',
          relativePath: 'file1.js',
          fullPath: expect.stringContaining('file1.js'),
          lastEdited: expect.any(Number),
        })

        mockStat.mockRestore()
      })

      it('should fallback to recently changed files when no changes found', async () => {
        const mockRepo = createMockRepo('active', ['file1.js'])
        const repoPath = mockRepo.getRepoPath()

        const mockInstance = {
          validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
          getChangedFiles: vi.fn().mockResolvedValue({ files: [] }),
          getRecentlyChangedFiles: vi.fn().mockResolvedValue({
            files: ['file1.js'],
            commitCount: 1,
          }),
        }
        mockGitService.mockReturnValue(mockInstance)

        const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
          mtime: new Date(Date.now()),
        } as any)

        const result = await getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })

        expect(mockInstance.getRecentlyChangedFiles).toHaveBeenCalled()
        expect(result).toHaveLength(1)

        mockStat.mockRestore()
      })
    })

    describe('no-changesGitRepo', () => {
      it('should handle git repository with no changes', async () => {
        const mockRepo = createMockRepo('no-changes', ['file1.js'])
        const repoPath = mockRepo.getRepoPath()

        const mockInstance = {
          validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
          getChangedFiles: vi.fn().mockResolvedValue({ files: [] }),
          getRecentlyChangedFiles: vi.fn().mockResolvedValue({
            files: ['file1.js'],
            commitCount: 1,
          }),
        }
        mockGitService.mockReturnValue(mockInstance)

        const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
          mtime: new Date(Date.now()),
        } as any)

        const result = await getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })

        expect(mockInstance.getRecentlyChangedFiles).toHaveBeenCalled()
        expect(result).toHaveLength(1)

        mockStat.mockRestore()
      })
    })

    describe('non-gitRepo', () => {
      it('should handle non-git repository using FileUtils', async () => {
        const mockRepo = createMockRepo('non-git', ['file1.js', 'file2.py'])
        const repoPath = mockRepo.getRepoPath()

        const mockInstance = {
          validateRepository: vi.fn().mockResolvedValue({
            isValid: false,
            error: 'Not a git repository',
          }),
        }
        mockGitService.mockReturnValue(mockInstance)

        mockFileUtils.getLastChangedFiles.mockResolvedValue([
          'file1.js',
          'file2.py',
        ])

        const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
          mtime: new Date(Date.now()),
        } as any)

        const result = await getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })

        expect(mockFileUtils.getLastChangedFiles).toHaveBeenCalledWith({
          dir: repoPath,
          maxFileSize: expect.any(Number),
          maxFiles: undefined,
          isAllFilesScan: undefined,
        })
        expect(result).toHaveLength(2)

        mockStat.mockRestore()
      })
    })
  })

  describe('parameter handling', () => {
    it('should pass maxFileSize parameter correctly', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()
      const customMaxFileSize = 1024 * 1024 // 1MB

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: false }),
      }
      mockGitService.mockReturnValue(mockInstance)

      await getLocalFiles({
        path: repoPath,
        maxFileSize: customMaxFileSize,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(mockFileUtils.getLastChangedFiles).toHaveBeenCalledWith({
        dir: repoPath,
        maxFileSize: customMaxFileSize,
        maxFiles: undefined,
        isAllFilesScan: undefined,
      })
    })

    it('should pass maxFiles parameter correctly', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()
      const maxFiles = 10

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({ files: [] }),
        getRecentlyChangedFiles: vi.fn().mockResolvedValue({
          files: [],
          commitCount: 0,
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      await getLocalFiles({
        path: repoPath,
        maxFiles,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(mockInstance.getRecentlyChangedFiles).toHaveBeenCalledWith({
        maxFiles,
      })
    })

    it('should pass isAllFilesScan parameter correctly', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: false }),
      }
      mockGitService.mockReturnValue(mockInstance)

      await getLocalFiles({
        path: repoPath,
        isAllFilesScan: true,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(mockFileUtils.getLastChangedFiles).toHaveBeenCalledWith({
        dir: repoPath,
        maxFileSize: expect.any(Number),
        maxFiles: undefined,
        isAllFilesScan: true,
      })
    })

    it('should handle all scan contexts', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()
      const scanContexts = [
        ScanContext.USER_REQUEST,
        ScanContext.FULL_SCAN,
        ScanContext.BACKGROUND_PERIODIC,
        ScanContext.BACKGROUND_INITIAL,
        ScanContext.BUGSY,
      ]

      for (const scanContext of scanContexts) {
        const result = await getLocalFiles({
          path: repoPath,
          scanContext,
        })

        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
      }
    })
  })

  describe('file filtering and processing', () => {
    it('should filter files using FileUtils.shouldPackFile', async () => {
      const mockRepo = createMockRepo('active', [
        'file1.js',
        'file2.py',
        'large-file.bin',
      ])
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: ['file1.js', 'file2.py', 'large-file.bin'],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      // Mock shouldPackFile to reject large-file.bin
      mockFileUtils.shouldPackFile.mockImplementation(
        (filePath: string) => !filePath.includes('large-file.bin')
      )

      const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
        mtime: new Date(Date.now()),
      } as any)

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(result).toHaveLength(2)
      expect(result.some((f) => f.filename === 'large-file.bin')).toBe(false)
      expect(result.some((f) => f.filename === 'file1.js')).toBe(true)
      expect(result.some((f) => f.filename === 'file2.py')).toBe(true)

      mockStat.mockRestore()
    })

    it('should handle files with different modification times', async () => {
      const mockRepo = createMockRepo('active', ['old-file.js', 'new-file.js'])
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: ['old-file.js', 'new-file.js'],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi
        .spyOn(fs, 'stat')
        .mockImplementation(async (filePath) => {
          const isOldFile = filePath.toString().includes('old-file')
          return {
            mtime: new Date(isOldFile ? 1000 : 2000),
          } as any
        })

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(result).toHaveLength(2)
      expect(result.find((f) => f.filename === 'old-file.js')!.lastEdited).toBe(
        1000
      )
      expect(result.find((f) => f.filename === 'new-file.js')!.lastEdited).toBe(
        2000
      )

      mockStat.mockRestore()
    })

    it('should exclude files that fail stat operation', async () => {
      const mockRepo = createMockRepo('active', [
        'valid-file.js',
        'invalid-file.js',
      ])
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: ['valid-file.js', 'invalid-file.js'],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi
        .spyOn(fs, 'stat')
        .mockImplementation(async (filePath) => {
          if (filePath.toString().includes('invalid-file')) {
            throw new Error('File not found')
          }
          return {
            mtime: new Date(Date.now()),
          } as any
        })

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      // Should only contain valid-file.js, invalid-file.js should be excluded
      expect(result).toHaveLength(1)
      expect(result[0]!.filename).toBe('valid-file.js')

      mockStat.mockRestore()
    })

    it('should set lastEdited to 0 for files with stat errors and then filter them out', async () => {
      const mockRepo = createMockRepo('active', ['error-file.js'])
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: ['error-file.js'],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi
        .spyOn(fs, 'stat')
        .mockRejectedValue(new Error('Permission denied'))

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      // Files with lastEdited = 0 should be filtered out
      expect(result).toHaveLength(0)

      mockStat.mockRestore()
    })

    it('should handle non-Error objects in file stat operations', async () => {
      const mockRepo = createMockRepo('active', ['error-file.js'])
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: ['error-file.js'],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi
        .spyOn(fs, 'stat')
        .mockRejectedValue('Non-error stat failure')

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      // Should still return empty because lastEdited = 0
      expect(result).toHaveLength(0)

      mockStat.mockRestore()
    })

    it('should handle Error objects without stack in file stat operations', async () => {
      const mockRepo = createMockRepo('active', ['error-file.js'])
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: ['error-file.js'],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      // Create Error without stack
      const errorWithoutStack = new Error('Stat error without stack')
      delete (errorWithoutStack as any).stack

      const mockStat = vi.spyOn(fs, 'stat').mockRejectedValue(errorWithoutStack)

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      // Should still return empty because lastEdited = 0
      expect(result).toHaveLength(0)

      mockStat.mockRestore()
    })
  })

  describe('error handling', () => {
    it('should propagate FileUtils.getLastChangedFiles errors for non-git repos', async () => {
      const mockRepo = createMockRepo('non-git')
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: false }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const error = new Error('FileUtils error')
      mockFileUtils.getLastChangedFiles.mockRejectedValue(error)

      await expect(
        getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toThrow('FileUtils error')
    })

    it('should handle non-Error objects thrown by FileUtils', async () => {
      const mockRepo = createMockRepo('non-git')
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: false }),
      }
      mockGitService.mockReturnValue(mockInstance)

      // Throw a non-Error object (string)
      mockFileUtils.getLastChangedFiles.mockRejectedValue(
        'String error message'
      )

      await expect(
        getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toBe('String error message')
    })

    it('should handle Error objects without stack traces in FileUtils', async () => {
      const mockRepo = createMockRepo('non-git')
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: false }),
      }
      mockGitService.mockReturnValue(mockInstance)

      // Create Error without stack
      const errorWithoutStack = new Error('Error without stack')
      delete (errorWithoutStack as any).stack
      mockFileUtils.getLastChangedFiles.mockRejectedValue(errorWithoutStack)

      await expect(
        getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toThrow('Error without stack')
    })

    it('should propagate git service errors', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      const error = new Error('Git service error')
      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockRejectedValue(error),
      }
      mockGitService.mockReturnValue(mockInstance)

      await expect(
        getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toThrow('Git service error')
    })

    it('should handle non-Error objects thrown by git service', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockRejectedValue('Git string error'),
      }
      mockGitService.mockReturnValue(mockInstance)

      await expect(
        getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toBe('Git string error')
    })

    it('should handle Error objects without stack traces in git service', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Create Error without stack
      const errorWithoutStack = new Error('Git error without stack')
      delete (errorWithoutStack as any).stack

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockRejectedValue(errorWithoutStack),
      }
      mockGitService.mockReturnValue(mockInstance)

      await expect(
        getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toThrow('Git error without stack')
    })

    it('should handle fs.realpath errors', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      const realPathError = new Error('Path resolution failed')
      vi.spyOn(fs, 'realpath').mockRejectedValue(realPathError)

      await expect(
        getLocalFiles({
          path: repoPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toThrow('Path resolution failed')
    })

    it('should handle invalid paths gracefully', async () => {
      const invalidPath = '/path/that/does/not/exist'

      // fs.realpath will throw for non-existent paths
      const realPathSpy = vi.spyOn(fs, 'realpath')
      realPathSpy.mockRejectedValue(
        new Error('ENOENT: no such file or directory')
      )

      await expect(
        getLocalFiles({
          path: invalidPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toThrow('ENOENT: no such file or directory')

      realPathSpy.mockRestore()
    })

    it('should handle non-Error objects in main try-catch wrapper', async () => {
      const invalidPath = '/path/that/does/not/exist'

      // Mock fs.realpath to throw a non-Error object
      const realPathSpy = vi.spyOn(fs, 'realpath')
      realPathSpy.mockRejectedValue('Non-error string thrown')

      await expect(
        getLocalFiles({
          path: invalidPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toBe('Non-error string thrown')

      realPathSpy.mockRestore()
    })

    it('should handle Error objects without stack in main try-catch wrapper', async () => {
      const invalidPath = '/path/that/does/not/exist'

      // Create Error without stack
      const errorWithoutStack = new Error('Main wrapper error without stack')
      delete (errorWithoutStack as any).stack

      const realPathSpy = vi.spyOn(fs, 'realpath')
      realPathSpy.mockRejectedValue(errorWithoutStack)

      await expect(
        getLocalFiles({
          path: invalidPath,
          scanContext: ScanContext.USER_REQUEST,
        })
      ).rejects.toThrow('Main wrapper error without stack')

      realPathSpy.mockRestore()
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('should handle empty file lists from git operations', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({ files: [] }),
        getRecentlyChangedFiles: vi.fn().mockResolvedValue({
          files: [],
          commitCount: 0,
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(result).toEqual([])
      realPathSpy.mockRestore()
    })

    it('should handle paths with special characters', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      // Add file with special characters
      const specialFileName = 'file with spaces & symbols!.js'
      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: [specialFileName],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
        mtime: new Date(Date.now()),
      } as any)

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(result).toHaveLength(1)
      expect(result[0]!.filename).toBe(specialFileName)

      mockStat.mockRestore()
      realPathSpy.mockRestore()
    })

    it('should handle deeply nested file paths', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      const deepPath = 'very/deep/nested/folder/structure/file.js'
      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: [deepPath],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
        mtime: new Date(Date.now()),
      } as any)

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(result).toHaveLength(1)
      expect(result[0]!.filename).toBe('file.js')
      expect(result[0]!.relativePath).toBe(deepPath)
      expect(result[0]!.fullPath).toContain(deepPath)

      mockStat.mockRestore()
      realPathSpy.mockRestore()
    })

    it('should handle maxFiles parameter with git operations', async () => {
      const mockRepo = createMockRepo('active', [
        'file1.js',
        'file2.js',
        'file3.js',
      ])
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({ files: [] }),
        getRecentlyChangedFiles: vi.fn().mockResolvedValue({
          files: ['file1.js', 'file2.js'],
          commitCount: 1,
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
        mtime: new Date(Date.now()),
      } as any)

      await getLocalFiles({
        path: repoPath,
        maxFiles: 2,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(mockInstance.getRecentlyChangedFiles).toHaveBeenCalledWith({
        maxFiles: 2,
      })

      mockStat.mockRestore()
      realPathSpy.mockRestore()
    })

    it('should handle isAllFilesScan with non-git repository', async () => {
      const mockRepo = createMockRepo('non-git', ['file1.js', 'file2.js'])
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: false }),
      }
      mockGitService.mockReturnValue(mockInstance)

      mockFileUtils.getLastChangedFiles.mockResolvedValue([
        'file1.js',
        'file2.js',
      ])

      const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
        mtime: new Date(Date.now()),
      } as any)

      await getLocalFiles({
        path: repoPath,
        isAllFilesScan: true,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(mockFileUtils.getLastChangedFiles).toHaveBeenCalledWith({
        dir: repoPath,
        maxFileSize: expect.any(Number),
        maxFiles: undefined,
        isAllFilesScan: true,
      })

      mockStat.mockRestore()
      realPathSpy.mockRestore()
    })

    it('should handle git repository validation with isAllFilesScan=true', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
      }
      mockGitService.mockReturnValue(mockInstance)

      mockFileUtils.getLastChangedFiles.mockResolvedValue(['file1.js'])

      const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
        mtime: new Date(Date.now()),
      } as any)

      const result = await getLocalFiles({
        path: repoPath,
        isAllFilesScan: true,
        scanContext: ScanContext.USER_REQUEST,
      })

      // When isAllFilesScan=true, should use FileUtils even for valid git repos
      expect(mockFileUtils.getLastChangedFiles).toHaveBeenCalledWith({
        dir: repoPath,
        maxFileSize: expect.any(Number),
        maxFiles: undefined,
        isAllFilesScan: true,
      })
      expect(result).toHaveLength(1)

      mockStat.mockRestore()
      realPathSpy.mockRestore()
    })
  })

  describe('file path resolution', () => {
    it('should correctly resolve absolute paths for files', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      const relativePath = 'src/components/Button.tsx'
      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: [relativePath],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
        mtime: new Date(Date.now()),
      } as any)

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(result).toHaveLength(1)
      expect(result[0]!.filename).toBe('Button.tsx')
      expect(result[0]!.relativePath).toBe(relativePath)
      expect(result[0]!.fullPath).toBe(path.resolve(repoPath, relativePath))
      expect(path.isAbsolute(result[0]!.fullPath)).toBe(true)

      mockStat.mockRestore()
      realPathSpy.mockRestore()
    })

    it('should handle files that are already absolute paths', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      const absoluteFilePath = path.resolve(repoPath, 'absolute-file.js')
      const mockInstance = {
        validateRepository: vi.fn().mockResolvedValue({ isValid: true }),
        getChangedFiles: vi.fn().mockResolvedValue({
          files: [absoluteFilePath],
        }),
      }
      mockGitService.mockReturnValue(mockInstance)

      const mockStat = vi.spyOn(fs, 'stat').mockResolvedValue({
        mtime: new Date(Date.now()),
      } as any)

      const result = await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      expect(result).toHaveLength(1)
      expect(result[0]!.filename).toBe('absolute-file.js')
      expect(result[0]!.relativePath).toBe('absolute-file.js')
      expect(result[0]!.fullPath).toBe(absoluteFilePath)

      mockStat.mockRestore()
      realPathSpy.mockRestore()
    })
  })

  describe('logging behavior', () => {
    it('should pass logging function to GitService', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      await getLocalFiles({
        path: repoPath,
        scanContext: ScanContext.USER_REQUEST,
      })

      // Verify GitService was called with a log function
      expect(mockGitService).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Function)
      )

      realPathSpy.mockRestore()
    })

    it('should handle different scan contexts in logging', async () => {
      const mockRepo = createMockRepo('empty')
      const repoPath = mockRepo.getRepoPath()

      // Mock fs.realpath to return the repo path
      const realPathSpy = vi.spyOn(fs, 'realpath').mockResolvedValue(repoPath)

      const scanContexts = [
        ScanContext.FULL_SCAN,
        ScanContext.BACKGROUND_PERIODIC,
        ScanContext.BACKGROUND_INITIAL,
      ]

      for (const scanContext of scanContexts) {
        // This test just ensures no errors are thrown with different scan contexts
        const result = await getLocalFiles({
          path: repoPath,
          scanContext,
        })

        expect(result).toBeDefined()
      }

      realPathSpy.mockRestore()
    })
  })
})
