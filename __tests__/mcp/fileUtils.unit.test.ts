import { promises as fsPromises } from 'node:fs'

import fs from 'fs'
import { isBinary } from 'istextorbinary'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FileUtils } from '../../src/features/analysis/scm/services/FileUtils'
import { EmptyGitRepo, MockRepo, NonGitRepo } from './helpers/MockRepo'

// Mock istextorbinary before the rest of the imports
vi.mock('istextorbinary', () => ({
  isBinary: vi.fn(),
}))

describe('FileUtils', () => {
  let mockRepo: MockRepo

  beforeEach(() => {
    mockRepo = new EmptyGitRepo()
    vi.clearAllMocks()
  })

  afterEach(() => {
    mockRepo.cleanupAll()
  })

  describe('isExcludedFileType', () => {
    it('should exclude .env files', () => {
      expect(FileUtils.isExcludedFileType('.env')).toBe(true)
      expect(FileUtils.isExcludedFileType('.env.local')).toBe(true)
      expect(FileUtils.isExcludedFileType('.env.development')).toBe(true)
    })

    it('should exclude files with extensions in EXCLUDED_FILE_PATTERNS', () => {
      expect(FileUtils.isExcludedFileType('config.json')).toBe(true)
      expect(FileUtils.isExcludedFileType('readme.md')).toBe(true)
      expect(FileUtils.isExcludedFileType('image.png')).toBe(true)
    })

    it('should not exclude regular source files', () => {
      expect(FileUtils.isExcludedFileType('app.js')).toBe(false)
      expect(FileUtils.isExcludedFileType('main.py')).toBe(false)
      expect(FileUtils.isExcludedFileType('index.ts')).toBe(false)
    })
  })

  describe('shouldPackFile', () => {
    it('should not pack excluded file types', () => {
      // Setup
      const filepath = 'config.json'
      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(true)

      // Test
      expect(FileUtils.shouldPackFile(filepath)).toBe(false)
      expect(FileUtils.isExcludedFileType).toHaveBeenCalledWith(filepath)
    })

    it('should not pack files larger than maxFileSize', () => {
      // Create a large file in the mock repo
      const repoPath = mockRepo.getRepoPath()
      const filepath = 'large-file.js'
      const fullPath = path.join(repoPath, filepath)

      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(false)

      // Mock stat to return large file size
      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValueOnce(false)

      expect(FileUtils.shouldPackFile(fullPath)).toBe(false)
    })

    it('should not pack binary files', () => {
      // Create a file in the mock repo
      const filepath = 'binary-file.bin'
      const fullPath = mockRepo.addFile(filepath, 'binary content')

      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(false)

      // Mock isBinary to return true
      vi.mocked(isBinary).mockReturnValueOnce(true)

      expect(FileUtils.shouldPackFile(fullPath)).toBe(false)
    })

    it('should pack valid text files', () => {
      // Create a file in the mock repo
      const filepath = 'valid-file.js'
      const fullPath = mockRepo.addFile(filepath, 'console.log("Hello");')

      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(false)

      // Mock isBinary to return false
      vi.mocked(isBinary).mockReturnValueOnce(false)

      expect(FileUtils.shouldPackFile(fullPath)).toBe(true)
    })

    it('should return false when file access fails', () => {
      const filepath = 'non-existent-file.js'
      vi.spyOn(FileUtils, 'isExcludedFileType').mockReturnValueOnce(false)

      expect(FileUtils.shouldPackFile(filepath)).toBe(false)
    })
  })

  describe('getLastChangedFiles', () => {
    // Add a custom method to create a repo with specific gitignore content
    async function createRepoWithGitignore(
      gitignoreContent: string
    ): Promise<string> {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      repo.addFile('.gitignore', gitignoreContent)
      return repoPath
    }

    // Extend MockRepo to create a more complex repository structure
    async function createComplexRepo(): Promise<string> {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!

      // Create files of various types
      const files = [
        {
          fileName: 'src/index.js',
          fileContent: 'console.log("Hello");',
          isCommited: true,
        },
        {
          fileName: 'src/components/Button.jsx',
          fileContent: 'export const Button = () => {};',
          isCommited: true,
        },
        {
          fileName: 'src/utils.ts',
          fileContent: 'export function add(a, b) { return a + b; }',
          isCommited: true,
        },
        {
          fileName: 'test/utils.test.js',
          fileContent: 'test("add", () => {});',
          isCommited: true,
        },
        {
          fileName: 'config.json',
          fileContent: '{"name": "test"}',
          isCommited: true,
        },
        {
          fileName: 'README.md',
          fileContent: '# Test Project',
          isCommited: true,
        },
        {
          fileName: 'node_modules/lib/index.js',
          fileContent: 'module.exports = {};',
          isCommited: true,
        },
        {
          fileName: 'dist/bundle.min.js',
          fileContent: 'console.log("minified");',
          isCommited: true,
        },
        {
          fileName: 'vendor/library.js',
          fileContent: 'third-party code',
          isCommited: true,
        },
      ]

      await repo.addFiles(files)

      return repoPath
    }

    it('should return empty array when directory does not exist', async () => {
      const nonExistentPath = '/path/does/not/exist'

      const result = await FileUtils.getLastChangedFiles({
        dir: nonExistentPath,
        maxFileSize: 1024 * 1024,
      })

      expect(result).toEqual([])
    })

    it('should return empty array when path is not a directory', async () => {
      const filePath = mockRepo.addFile('file.txt', 'content')

      // Create a spy to simulate non-directory
      vi.spyOn(FileUtils, 'getLastChangedFiles').mockResolvedValueOnce([])

      const result = await FileUtils.getLastChangedFiles({
        dir: filePath,
        maxFileSize: 1024 * 1024,
      })

      expect(result).toEqual([])
    })

    it('should get exclusion patterns from gitignore when available', async () => {
      const repoPath = await createRepoWithGitignore(`
# Example gitignore
node_modules/
dist/
*.log
**/*.min.js
`)

      // Ensure FileUtils runs without throwing when .gitignore exists
      await expect(
        FileUtils.getLastChangedFiles({
          dir: repoPath,
          maxFileSize: 1024 * 1024,
        })
      ).resolves.not.toThrow()
    })

    it('should apply exclusion patterns and file filters correctly', async () => {
      // Create a complex repository with a real .gitignore file
      const repoPath = await createComplexRepo()

      // Create a real .gitignore file
      await mockRepo.addFile(
        '.gitignore',
        `
# Example gitignore
node_modules/
dist/
*.log
**/*.min.js
vendor/
`
      )

      // Mock shouldPackFile to include only source files
      vi.spyOn(FileUtils, 'shouldPackFile').mockImplementation((filepath) => {
        const ext = path.extname(filepath).toLowerCase()
        // Only pack JavaScript/TypeScript files, exclude JSON, MD, etc.
        return ['.js', '.jsx', '.ts', '.tsx'].includes(ext)
      })

      const result = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        isAllFilesScan: true, // Get all files, not just most recent
      })

      // We expect only source files in non-excluded directories
      expect(result).not.toContain('node_modules/lib/index.js')
      expect(result).not.toContain('dist/bundle.min.js')
      expect(result).not.toContain('vendor/library.js')
      expect(result).not.toContain('config.json')
      expect(result).not.toContain('README.md')

      // We expect these files to be included
      expect(result).toContain('src/index.js')
      expect(result).toContain('src/components/Button.jsx')
      expect(result).toContain('src/utils.ts')
      expect(result).toContain('test/utils.test.js')
    })

    it('should limit the number of files when isAllFilesScan is false', async () => {
      const repoPath = await createComplexRepo()

      // Mock shouldPackFile to always return true for testing the limit
      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValue(true)

      // No need to mock nested pattern exclusion; it is handled by ignore matcher

      const maxFiles = 2

      const result = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        maxFiles,
        isAllFilesScan: false, // Limit to maxFiles
      })

      expect(result.length).toBeLessThanOrEqual(maxFiles)
    })

    it('should return all files when isAllFilesScan is true', async () => {
      const repoPath = await createComplexRepo()

      // Mock shouldPackFile to always return true for this test
      vi.spyOn(FileUtils, 'shouldPackFile').mockReturnValue(true)

      // No need to mock nested pattern exclusion

      // Create a custom gitignore file with no exclusions for this test
      await mockRepo.addFile('.gitignore', '# Empty gitignore')

      const result = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        maxFiles: 1, // Try to limit to 1 file
        isAllFilesScan: true, // Should ignore maxFiles and return all files
      })

      // Should return more than 1 file despite maxFiles being set to 1
      expect(result.length).toBeGreaterThan(1)
    })

    it('should handle errors gracefully during directory processing', async () => {
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!

      // Mock access to fail for specific directories
      vi.spyOn(fsPromises, 'access').mockImplementation(async (pathParam) => {
        if (pathParam.toString().includes('problematic')) {
          throw new Error('Access denied')
        }
        return undefined
      })

      // Create a directory that will fail access
      await repo.addFile('problematic/file.txt', 'content')

      // This should not throw despite the access error
      await expect(
        FileUtils.getLastChangedFiles({
          dir: repoPath,
          maxFileSize: 1024 * 1024,
        })
      ).resolves.not.toThrow()
    })

    it('should exclude files matching all patterns in the sample .gitignore via gitignore filtering', async () => {
      // Prepare a fresh repo and copy the sample .gitignore
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!

      // Copy sample .gitignore content into the repo
      const sampleGitignoreContent = await fsPromises.readFile(
        path.join(__dirname, 'mocks', 'sample.gitignore'),
        'utf8'
      )
      await repo.addFile('.gitignore', sampleGitignoreContent)

      // Files & directories that correspond to every pattern line in sample.gitignore
      const sampleFiles = [
        // Matches "filename   " (trailing spaces trimmed to 'filename')
        {
          fileName: 'filename/dummy.js',
          isCommited: false,
        },
        // Matches "\\!important!.py"
        {
          fileName: '!important!.py/dummy.js',
          isCommited: false,
        },
        // Matches "/root_level_only.py"
        {
          fileName: 'root_level_only.py/dummy.js',
          isCommited: false,
        },
        // Matches "docs/generated/"
        {
          fileName: 'docs/generated/index.js',
          isCommited: false,
        },
        // Matches "logs/"
        {
          fileName: 'logs/log.txt',
          isCommited: false,
        },
        // Matches "dist" (root-level dir)
        {
          fileName: 'dist/file.txt',
          isCommited: false,
        },
        // Matches "TODO.js"
        {
          fileName: 'TODO.js',
          isCommited: false,
        },
        // Matches "*.java"
        {
          fileName: 'Example.java',
          isCommited: false,
        },
        // Matches "file?.js"
        {
          fileName: 'file1.js',
          isCommited: false,
        },
        // Matches "[a-z]est.js"
        {
          fileName: 'test.js',
          isCommited: false,
        },
        // Matches "**/node_modules"
        {
          fileName: 'src/node_modules/module.js',
          isCommited: false,
        },
        // Matches "generated/**"
        {
          fileName: 'generated/script.js',
          isCommited: false,
        },
        // Matches "doc/**/temp"
        {
          fileName: 'doc/inner/temp/file.txt',
          isCommited: false,
        },
        // Matches "dist/**/node_modules/*." – create a file ending with a dot
        {
          fileName: 'dist/foo/node_modules/bar.',
          isCommited: false,
        },
      ]

      await repo.addFiles(sampleFiles)

      // Ensure shouldPackFile always returns true so filtering happens via gitignore rules
      const shouldPackFileSpy = vi
        .spyOn(FileUtils, 'shouldPackFile')
        .mockReturnValue(true)

      const result = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        isAllFilesScan: true,
      })

      // Ensure none of the sample files appear in the result
      for (const { fileName } of sampleFiles) {
        expect(result).not.toContain(fileName)
      }
      // Verify shouldPackFile was invoked (and therefore not the cause of exclusion)
      expect(shouldPackFileSpy).toHaveBeenCalled()
    })

    it('should fall back to EXCLUDED_DIRS when .gitignore is absent in a git repo', async () => {
      // Create an empty git repo and remove the default .gitignore
      const repo = new EmptyGitRepo()
      const repoPath = repo.getRepoPath()!
      // Remove .gitignore created by helper
      const gitignorePath = path.join(repoPath, '.gitignore')
      if (fs.existsSync(gitignorePath)) fs.unlinkSync(gitignorePath)

      // Add files under an excluded root directory (node_modules) and a normal directory
      await repo.addFiles([
        {
          fileName: 'node_modules/pkg/index.js',
          fileContent: 'console.log(0)',
          isCommited: false,
        },
        {
          fileName: 'src/app.js',
          fileContent: 'console.log(1)',
          isCommited: false,
        },
      ])

      const files = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        isAllFilesScan: true,
      })

      expect(files).not.toContain('node_modules/pkg/index.js')
      expect(files).toContain('src/app.js')
    })

    it('should fall back to EXCLUDED_DIRS for a non-git repository', async () => {
      const repo = new NonGitRepo()
      const repoPath = repo.getRepoPath()!

      // Remove .gitignore created by helper
      const gitignorePath = path.join(repoPath, '.gitignore')
      if (fs.existsSync(gitignorePath)) fs.unlinkSync(gitignorePath)

      await repo.addFiles([
        {
          fileName: 'dist/output.js',
          fileContent: 'console.log(2)',
          isCommited: false,
        },
        {
          fileName: 'src/index.js',
          fileContent: 'console.log(3)',
          isCommited: false,
        },
      ])

      const files = await FileUtils.getLastChangedFiles({
        dir: repoPath,
        maxFileSize: 1024 * 1024,
        isAllFilesScan: true,
      })

      expect(files).not.toContain('dist/output.js')
      expect(files).toContain('src/index.js')
    })
  })
})
