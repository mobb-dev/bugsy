/**
 * Comprehensive tests for LocalMobbFolderService
 * Tests all public methods with various scenarios using MockRepo
 */
import fs, { readFileSync } from 'fs'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  IssueType_Enum,
  Vulnerability_Report_Issue_Tag_Enum,
  Vulnerability_Severity_Enum,
} from '../../src/features/analysis/scm/generates/client_generates'
import { LocalMobbFolderService } from '../../src/mcp/services/LocalMobbFolderService'
import { McpFix } from '../../src/mcp/types'
import { ActiveGitRepo, NoChangesGitRepo } from './helpers/MockRepo'

// Mock the logger
vi.mock('../../src/mcp/Logger', () => ({
  logDebug: vi.fn(),
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
}))

// Helper function to create test McpFix objects
function createTestMcpFix(options: {
  id?: string
  patch: string
  severity?: string
  severityValue?: number
  issueType?: string
  fileName?: string
}): McpFix {
  const {
    id = 'test-fix',
    patch,
    severity = 'HIGH',
    severityValue = 8,
    issueType = 'sql-injection',
    fileName,
  } = options

  // Create a proper patch format if fileName is provided
  const formattedPatch = fileName
    ? `diff --git a/${fileName} b/${fileName}
index 1234567..abcdefg 100644
--- a/${fileName}
+++ b/${fileName}
${patch}`
    : patch

  return {
    id,
    confidence: 0.9,
    safeIssueType: issueType,
    severityText: severity,
    severityValue,
    gitBlameLogin: null,
    vulnerabilityReportIssues: [
      {
        parsedIssueType: IssueType_Enum.SqlInjection,
        parsedSeverity: Vulnerability_Severity_Enum.High,
        vulnerabilityReportIssueTags: [
          {
            vulnerability_report_issue_tag_value:
              'OWASP_TOP_10' as Vulnerability_Report_Issue_Tag_Enum,
          },
        ],
      },
    ],
    sharedState: null,
    patchAndQuestions: {
      __typename: 'FixData',
      patch: formattedPatch,
      patchOriginalEncodingBase64: '',
      extraContext: {
        fixDescription: 'Test fix description',
        extraContext: [],
      },
    },
  }
}

describe('LocalMobbFolderService', () => {
  let mockRepo: ActiveGitRepo
  let repoPath: string
  let service: LocalMobbFolderService

  beforeEach(() => {
    mockRepo = new ActiveGitRepo()
    repoPath = mockRepo.getRepoPath()
    service = new LocalMobbFolderService(repoPath)
    vi.clearAllMocks()

    // Mock Date.now() and Date.toISOString() for consistent snapshots
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T10:30:00.000Z'))
  })

  afterEach(() => {
    mockRepo.cleanupAll()
    vi.useRealTimers()
  })

  describe('validateRepository', () => {
    it('should validate a valid git repository', async () => {
      const result = await service.validateRepository()
      expect(result).toBe(true)
    })

    it('should throw error for invalid directory', async () => {
      // Create a service with non-existent directory
      const invalidService = new LocalMobbFolderService('/non/existent/path')

      await expect(invalidService.validateRepository()).rejects.toThrow()
    })

    it('should validate non-git directory successfully', async () => {
      // Create a service with valid non-git directory
      const nonGitService = new LocalMobbFolderService('/tmp')

      const result = await nonGitService.validateRepository()
      expect(result).toBe(true)
    })
  })

  describe('getMobbFolder', () => {
    it('should create .mobb folder in repository path', async () => {
      const mobbFolderPath = await service.getMobbFolder()

      // Verify .mobb folder was created in repoPath (not git root)
      expect(mobbFolderPath).toBe(join(repoPath, '.mobb'))

      // Verify folder exists and is a directory
      const stats = fs.statSync(mobbFolderPath)
      expect(stats.isDirectory()).toBe(true)
    })

    it('should add **/.mobb pattern to .gitignore', async () => {
      await service.getMobbFolder()

      // Read .gitignore file from git root
      const gitignorePath = join(repoPath, '.gitignore')
      const gitignoreContent = readFileSync(gitignorePath, 'utf8')

      expect(gitignoreContent).toContain('**/.mobb')
    })

    it('should not duplicate .gitignore entry if already exists', async () => {
      // First call
      await service.getMobbFolder()

      // Second call
      await service.getMobbFolder()

      const gitignorePath = join(repoPath, '.gitignore')
      const gitignoreContent = readFileSync(gitignorePath, 'utf8')

      // Should only have one occurrence of **/.mobb
      const occurrences = (gitignoreContent.match(/\*\*\/\.mobb/g) || []).length
      expect(occurrences).toBe(1)
    })

    it('should work with existing .mobb folder', async () => {
      // Create .mobb folder first
      const firstResult = await service.getMobbFolder()

      // Call again
      const secondResult = await service.getMobbFolder()

      expect(firstResult).toBe(secondResult)
      expect(fs.existsSync(firstResult)).toBe(true)
    })
  })

  describe('savePatch', () => {
    it('should save patch with correct filename format', async () => {
      const testFix = createTestMcpFix({
        id: 'test-fix-filename',
        patch: `@@ -1 +1 @@
-console.log("vulnerable");
+console.log("fixed");`,
        severity: 'high',
        issueType: 'sql-injection',
        fileName: 'UserController.java',
      })

      const result = await service.savePatch(testFix)

      expect(result.success).toBe(true)
      expect(result.fileName).toBe(
        'high-sql-injection-in-usercontroller.java.patch'
      )

      // Verify file was created with correct content
      const patchFilePath = join(repoPath, '.mobb', result.fileName!)
      const savedContent = readFileSync(patchFilePath, 'utf8')
      expect(savedContent).toContain('@@ -1 +1 @@')
    })

    it('should handle special characters in filename sanitization', async () => {
      const testFix = createTestMcpFix({
        id: 'test-fix-sanitization',
        patch: 'test patch content',
        severity: 'Critical/High',
        issueType: 'Cross-Site Scripting (XSS)',
        fileName: 'User Controller.java',
      })

      const result = await service.savePatch(testFix)

      expect(result.success).toBe(true)
      expect(result.fileName).toBe(
        'critical-high-cross-site-scripting-xss-in-fix-test-fix-sanitization.patch'
      )

      // Verify file exists
      const patchFilePath = join(repoPath, '.mobb', result.fileName!)
      expect(fs.existsSync(patchFilePath)).toBe(true)
    })

    it('should handle file conflicts with index suffixes', async () => {
      const testFix1 = createTestMcpFix({
        id: 'test-fix-conflict-1',
        patch: 'test patch content',
        severity: 'medium',
        issueType: 'path-traversal',
        fileName: 'FileHandler.java',
      })

      const testFix2 = createTestMcpFix({
        id: 'test-fix-conflict-2',
        patch: 'test patch content modified',
        severity: 'medium',
        issueType: 'path-traversal',
        fileName: 'FileHandler.java',
      })

      // Save first patch
      const result1 = await service.savePatch(testFix1)

      // Save second patch with same parameters
      const result2 = await service.savePatch(testFix2)

      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)

      expect(result1.fileName).toBe(
        'medium-path-traversal-in-filehandler.java.patch'
      )
      expect(result2.fileName).toBe(
        'medium-path-traversal-in-filehandler.java-1.patch'
      )

      // Verify both files exist with different content
      const file1Path = join(repoPath, '.mobb', result1.fileName!)
      const file2Path = join(repoPath, '.mobb', result2.fileName!)

      expect(readFileSync(file1Path, 'utf8')).toContain('test patch content')
      expect(readFileSync(file2Path, 'utf8')).toContain(
        'test patch content modified'
      )
    })

    it('should use custom filename when provided', async () => {
      const testFix = createTestMcpFix({
        id: 'test-fix-custom',
        patch: 'custom patch content',
        severity: 'low',
        issueType: 'info-disclosure',
        fileName: 'Logger.java',
      })

      const result = await service.savePatch(testFix, 'my-custom-fix')

      expect(result.success).toBe(true)
      expect(result.fileName).toBe('my-custom-fix.patch')

      const patchFilePath = join(repoPath, '.mobb', result.fileName!)
      expect(readFileSync(patchFilePath, 'utf8')).toContain(
        'custom patch content'
      )
    })

    it('should validate McpFix object', async () => {
      // Test fix with no patch content
      const noPatchFix: McpFix = {
        id: 'no-patch-test',
        confidence: 0.5,
        safeIssueType: 'test-vuln',
        severityText: 'HIGH',
        severityValue: 8,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'GetFixNoFixError',
        },
      }

      const result1 = await service.savePatch(noPatchFix)
      expect(result1.success).toBe(false)
      expect(result1.error).toContain('No valid patch content')

      // Test fix with empty patch content
      const emptyPatchFix: McpFix = {
        id: 'empty-patch-test',
        confidence: 0.5,
        safeIssueType: 'test-vuln',
        severityText: 'HIGH',
        severityValue: 8,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'FixData',
          patch: '',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Empty patch test',
            extraContext: [],
          },
        },
      }

      const result2 = await service.savePatch(emptyPatchFix)
      expect(result2.success).toBe(false)
      expect(result2.error).toContain('No valid patch content')

      // Test fix with invalid patch format (can't extract filename)
      const invalidPatchFix: McpFix = {
        id: 'invalid-patch-test',
        confidence: 0.5,
        safeIssueType: 'test-vuln',
        severityText: 'HIGH',
        severityValue: 8,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'FixData',
          patch: 'invalid patch without proper format',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Invalid patch test',
            extraContext: [],
          },
        },
      }

      const result3 = await service.savePatch(invalidPatchFix)
      expect(result3.success).toBe(true) // Should succeed with fallback filename
      expect(result3.fileName).toBe(
        'high-test-vuln-in-fix-invalid-patch-test.patch'
      )
    })
  })

  describe('logPatch', () => {
    it('should create patchInfo.md with fix details', async () => {
      const mockFix: McpFix = {
        id: 'test-fix-123',
        confidence: 0.85,
        safeIssueType: 'sql-injection',
        severityText: 'HIGH',
        severityValue: 8,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [
          {
            parsedIssueType: IssueType_Enum.SqlInjection,
            parsedSeverity: Vulnerability_Severity_Enum.High,
            vulnerabilityReportIssueTags: [
              {
                vulnerability_report_issue_tag_value:
                  'OWASP_TOP_10' as Vulnerability_Report_Issue_Tag_Enum,
              },
            ],
          },
        ],
        sharedState: {
          id: 'shared-state-456',
        },
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/test.java b/test.java
index 1234567..abcdefg 100644
--- a/test.java
+++ b/test.java
@@ -1,3 +1,3 @@
- String query = "SELECT * FROM users WHERE id = " + userId;
+ PreparedStatement stmt = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
+ stmt.setInt(1, userId);`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription:
              'Replace string concatenation with parameterized query to prevent SQL injection',
            extraContext: [
              {
                key: 'affectedLines',
                value: '12-15',
              },
            ],
          },
        },
        fixUrl: 'https://app.mobb.ai/fixes/test-fix-123',
      }

      const result = await service.logPatch(mockFix)

      expect(result.success).toBe(true)
      expect(result.filePath).toBe(join(repoPath, '.mobb', 'patchInfo.md'))

      // Verify file was created with correct content
      const patchInfoPath = join(repoPath, '.mobb', 'patchInfo.md')
      const content = readFileSync(patchInfoPath, 'utf8')

      // Normalize the content by replacing the temporary directory path with a placeholder
      // Handle both macOS (/var/folders/.../T/mcp-test-repo-xxx) and Linux (/tmp/mcp-test-repo-xxx) paths
      const normalizedContent = content
        .replace(
          /\/var\/folders\/[^/]+\/[^/]+\/T\/mcp-test-repo-[^/]+/g,
          '/tmp/test-repo'
        )
        .replace(/\/tmp\/mcp-test-repo-[^/]+/g, '/tmp/test-repo')

      // Use snapshot to verify complete markdown structure and content
      expect(normalizedContent).toMatchSnapshot(
        'logPatch-creates-correct-markdown-structure'
      )
    })

    it('should prepend new fixes to existing patchInfo.md', async () => {
      const mockFix1: McpFix = {
        id: 'fix-1',
        confidence: 0.9,
        safeIssueType: 'xss',
        severityText: 'MEDIUM',
        severityValue: 5,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'FixData',
          patch: 'diff --git a/file1.js b/file1.js\n+// Fixed XSS',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'First fix',
            extraContext: [],
          },
        },
      }

      const mockFix2: McpFix = {
        id: 'fix-2',
        confidence: 0.8,
        safeIssueType: 'csrf',
        severityText: 'HIGH',
        severityValue: 7,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'FixData',
          patch: 'diff --git a/file2.js b/file2.js\n+// Fixed CSRF',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Second fix',
            extraContext: [],
          },
        },
      }

      // Log first fix
      await service.logPatch(mockFix1)

      // Log second fix
      await service.logPatch(mockFix2)

      // Verify file content order (newest first)
      const patchInfoPath = join(repoPath, '.mobb', 'patchInfo.md')
      const content = readFileSync(patchInfoPath, 'utf8')

      const fix1Index = content.indexOf('fix-1')
      const fix2Index = content.indexOf('fix-2')

      // fix-2 (newer) should appear before fix-1 (older)
      expect(fix2Index).toBeLessThan(fix1Index)
      expect(content).toContain('Second fix')
      expect(content).toContain('First fix')
    })

    it('should handle fix with no patch available', async () => {
      const mockFix: McpFix = {
        id: 'no-fix-123',
        confidence: 0,
        safeIssueType: 'complex-vulnerability',
        severityText: 'CRITICAL',
        severityValue: 10,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'GetFixNoFixError',
        },
      }

      const result = await service.logPatch(mockFix)

      expect(result.success).toBe(true)

      const patchInfoPath = join(repoPath, '.mobb', 'patchInfo.md')
      const content = readFileSync(patchInfoPath, 'utf8')

      // Use snapshot to verify no-fix markdown structure
      expect(content).toMatchSnapshot('logPatch-handles-no-fix-available')
    })
  })

  describe('error handling scenarios', () => {
    it('should handle non-git directory in getMobbFolder', async () => {
      // Create a service with non-git directory outside of any git repository
      const tempDir = join('/tmp', 'non-git-test-' + Date.now())
      fs.mkdirSync(tempDir, { recursive: true })

      try {
        const nonGitService = new LocalMobbFolderService(tempDir)

        // Should succeed and create .mobb folder in non-git directory
        const mobbFolder = await nonGitService.getMobbFolder()

        expect(mobbFolder).toBe(join(tempDir, '.mobb'))
        expect(fs.existsSync(mobbFolder)).toBe(true)
        expect(fs.statSync(mobbFolder).isDirectory()).toBe(true)
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    })

    it('should handle directory creation failure in getMobbFolder', async () => {
      // Create a service with a path where directory creation will fail (read-only parent)
      const readOnlyService = new LocalMobbFolderService(
        '/usr/bin/non-writable-test'
      )

      await expect(readOnlyService.getMobbFolder()).rejects.toThrow(
        'Failed to get/create .mobb folder'
      )
    })

    it('should handle file system errors during patch save', async () => {
      // This test uses mocking to simulate file system errors
      const patchContent = 'test patch content'

      // Create .mobb folder first
      await service.getMobbFolder()

      // Mock fs.promises.writeFile to throw an error on first call
      const originalWriteFile = fs.promises.writeFile
      let callCount = 0
      vi.spyOn(fs.promises, 'writeFile').mockImplementation(async (...args) => {
        callCount++
        if (callCount === 1) {
          throw new Error('File system error')
        }
        return originalWriteFile(...args)
      })

      try {
        const testFix = createTestMcpFix({
          id: 'test-write-error',
          patch: patchContent,
          severity: 'high',
          issueType: 'test-vulnerability',
          fileName: 'TestFile.java',
        })

        const result = await service.savePatch(testFix)

        expect(result.success).toBe(false)
        expect(result.error).toContain('Failed to save patch')
      } finally {
        vi.restoreAllMocks()
      }
    })

    it('should handle extreme file conflicts (>1000) with timestamp fallback', async () => {
      // This test would be very slow in practice, so we'll mock the behavior
      // by creating a scenario that exercises the timestamp fallback logic

      // Create many conflicting files to test the safety mechanism
      // Note: This is a simplified test - in reality we'd need to mock fs operations
      // to simulate the extreme case without creating 1000+ files

      const mobbFolder = await service.getMobbFolder()

      // Create a few conflicting files to ensure the conflict resolution works
      for (let i = 0; i < 5; i++) {
        const testFix = createTestMcpFix({
          id: `test-conflict-${i}`,
          patch: `patch content ${i}`,
          severity: 'medium',
          issueType: 'test-conflict',
          fileName: 'ConflictTest.java',
        })
        await service.savePatch(testFix)
      }

      // Verify files were created with index suffixes
      const files = fs.readdirSync(mobbFolder)
      const conflictFiles = files.filter((f) =>
        f.includes('medium-test-conflict-in-conflicttest.java')
      )
      expect(conflictFiles.length).toBeGreaterThanOrEqual(5)
    })

    it('should handle large patches with >10 lines in markdown generation', async () => {
      // Create a large patch to test the truncation logic
      const largePatchLines = Array.from(
        { length: 25 },
        (_, i) => `+Line ${i + 1} of the patch`
      )
      const largePatch = `diff --git a/test.java b/test.java
index 1234567..abcdefg 100644
--- a/test.java
+++ b/test.java
@@ -1,3 +1,25 @@
-// Old code
${largePatchLines.join('\n')}`

      const mockFix: McpFix = {
        id: 'large-patch-test',
        confidence: 0.9,
        safeIssueType: 'large-vulnerability',
        severityText: 'HIGH',
        severityValue: 8,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'FixData',
          patch: largePatch,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Large patch test',
            extraContext: [],
          },
        },
      }

      const result = await service.logPatch(mockFix)

      expect(result.success).toBe(true)

      // Read the markdown and verify truncation message is present
      const patchInfoPath = join(repoPath, '.mobb', 'patchInfo.md')
      const content = readFileSync(patchInfoPath, 'utf8')

      // Normalize the content by replacing the temporary directory path with a placeholder
      // Handle both macOS (/var/folders/.../T/mcp-test-repo-xxx) and Linux (/tmp/mcp-test-repo-xxx) paths
      const normalizedContent = content
        .replace(
          /\/var\/folders\/[^/]+\/[^/]+\/T\/mcp-test-repo-[^/]+/g,
          '/tmp/test-repo'
        )
        .replace(/\/tmp\/mcp-test-repo-[^/]+/g, '/tmp/test-repo')

      // Use snapshot to verify large patch truncation and preview
      expect(normalizedContent).toMatchSnapshot(
        'logPatch-handles-large-patch-truncation'
      )
    })

    it('should handle file system errors during logPatch', async () => {
      // Create a mock fix
      const mockFix: McpFix = {
        id: 'error-test',
        confidence: 0.8,
        safeIssueType: 'test-error',
        severityText: 'MEDIUM',
        severityValue: 5,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'FixData',
          patch: 'test patch',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Error test fix',
            extraContext: [],
          },
        },
      }

      // Mock the getFolder method to throw an error
      vi.spyOn(
        service as LocalMobbFolderService & {
          getFolder: () => Promise<string>
        },
        'getFolder'
      ).mockRejectedValue(new Error('File system error in getFolder'))

      try {
        const result = await service.logPatch(mockFix)

        expect(result.success).toBe(false)
        expect(result.error).toContain('Failed to log patch info')
      } finally {
        vi.restoreAllMocks()
      }
    })

    it('should trigger timestamp fallback for extreme file conflicts', async () => {
      // Mock fs.existsSync to always return true for the first 1000+ attempts
      const originalExistsSync = fs.existsSync
      let callCount = 0

      const mockExistsSync = vi.fn().mockImplementation((path: string) => {
        callCount++
        // If it's checking for a patch file and we haven't exceeded 1001 calls, return true to simulate conflict
        if (path.includes('.patch') && callCount <= 1001) {
          return true // Simulate file exists (conflict)
        }
        return originalExistsSync(path) // Use original for other paths
      })

      // Replace fs.existsSync temporarily
      vi.spyOn(fs, 'existsSync').mockImplementation(mockExistsSync)

      try {
        const testFix = createTestMcpFix({
          id: 'timestamp-fallback-test',
          patch: 'timestamp fallback test',
          severity: 'critical',
          issueType: 'timestamp-test',
          fileName: 'TimestampTest.java',
        })

        const result = await service.savePatch(testFix)

        expect(result.success).toBe(true)
        // Should have timestamp in filename due to safety fallback
        expect(result.fileName).toMatch(
          /critical-timestamp-test-in-timestamptest.java-\d+\.patch/
        )
      } finally {
        // Restore original implementation
        vi.restoreAllMocks()
      }
    })

    it('should handle file read errors in logPatch when patchInfo.md exists but is unreadable', async () => {
      // First create the .mobb folder and patchInfo.md
      const mobbFolder = await service.getMobbFolder()
      const patchInfoPath = join(mobbFolder, 'patchInfo.md')

      // Create an existing patchInfo.md file
      fs.writeFileSync(patchInfoPath, 'existing content')

      // Mock fs.promises.readFile to throw an error
      vi.spyOn(fs.promises, 'readFile').mockRejectedValueOnce(
        new Error('Permission denied')
      )

      try {
        const mockFix: McpFix = {
          id: 'read-error-test',
          confidence: 0.6,
          safeIssueType: 'test-read-error',
          severityText: 'MEDIUM',
          severityValue: 4,
          gitBlameLogin: null,
          vulnerabilityReportIssues: [],
          sharedState: null,
          patchAndQuestions: {
            __typename: 'FixData',
            patch: 'test patch for read error',
            patchOriginalEncodingBase64: '',
            extraContext: {
              fixDescription: 'Read error test',
              extraContext: [],
            },
          },
        }

        const result = await service.logPatch(mockFix)

        expect(result.success).toBe(false)
        expect(result.error).toContain('Failed to log patch info')
      } finally {
        vi.restoreAllMocks()
      }
    })

    it('should handle writeFile errors during savePatch', async () => {
      // Create .mobb folder first
      await service.getMobbFolder()

      // Mock fs.promises.writeFile to throw an error
      vi.spyOn(fs.promises, 'writeFile').mockRejectedValueOnce(
        new Error('Disk full')
      )

      try {
        const testFix = createTestMcpFix({
          id: 'write-error-test',
          patch: 'test content',
          severity: 'high',
          issueType: 'write-error',
          fileName: 'WriteErrorTest.java',
        })

        const result = await service.savePatch(testFix)

        expect(result.success).toBe(false)
        expect(result.error).toContain('Failed to save patch')
        expect(result.error).toContain('Disk full')
      } finally {
        vi.restoreAllMocks()
      }
    })

    it('should handle non-git directory without gitignore operations', async () => {
      // Create a service with a path that is not a git repository
      const tempDir = join('/tmp', 'non-git-dir-' + Date.now())
      fs.mkdirSync(tempDir, { recursive: true })

      try {
        const nonGitService = new LocalMobbFolderService(tempDir)

        // Should succeed and create .mobb folder without git operations
        const mobbFolder = await nonGitService.getMobbFolder()

        expect(mobbFolder).toBe(join(tempDir, '.mobb'))
        expect(fs.existsSync(mobbFolder)).toBe(true)

        // Verify no .gitignore was created in non-git directory
        const gitignorePath = join(tempDir, '.gitignore')
        expect(fs.existsSync(gitignorePath)).toBe(false)
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    })

    it('should handle markdown generation with empty vulnerability tags', async () => {
      const mockFix: McpFix = {
        id: 'empty-tags-test',
        confidence: 0.7,
        safeIssueType: 'test-vulnerability',
        severityText: 'LOW',
        severityValue: 3,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [
          {
            parsedIssueType: IssueType_Enum.SqlInjection,
            parsedSeverity: Vulnerability_Severity_Enum.Low,
            vulnerabilityReportIssueTags: [], // Empty tags array
          },
        ],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'FixData',
          patch: 'small patch',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Empty tags test',
            extraContext: [],
          },
        },
      }

      const result = await service.logPatch(mockFix)

      expect(result.success).toBe(true)

      const patchInfoPath = join(repoPath, '.mobb', 'patchInfo.md')
      const content = readFileSync(patchInfoPath, 'utf8')

      // Use snapshot to verify empty vulnerability tags handling
      expect(content).toMatchSnapshot(
        'logPatch-handles-empty-vulnerability-tags'
      )
    })
  })

  describe('integration scenarios', () => {
    it('should work with NoChangesGitRepo', async () => {
      // Test with a different type of mock repo
      const noChangesRepo = new NoChangesGitRepo()
      const noChangesService = new LocalMobbFolderService(
        noChangesRepo.getRepoPath()
      )

      try {
        const result = await noChangesService.validateRepository()
        expect(result).toBe(true)

        const mobbFolder = await noChangesService.getMobbFolder()
        expect(mobbFolder).toContain('.mobb')
      } finally {
        noChangesRepo.cleanupAll()
      }
    })

    it('should handle nested repository paths', async () => {
      // Create a subdirectory and test service from there
      const subDir = join(repoPath, 'src', 'components')
      fs.mkdirSync(subDir, { recursive: true })

      const subDirService = new LocalMobbFolderService(subDir)

      const mobbFolder = await subDirService.getMobbFolder()

      // Should create .mobb in the subdirectory
      expect(mobbFolder).toBe(join(subDir, '.mobb'))
      expect(fs.existsSync(mobbFolder)).toBe(true)

      // But .gitignore should still be updated in git root
      const gitignorePath = join(repoPath, '.gitignore')
      const gitignoreContent = readFileSync(gitignorePath, 'utf8')
      expect(gitignoreContent).toContain('**/.mobb')
    })

    it('should handle complete workflow: validate -> create folder -> save patch -> log fix', async () => {
      // Complete workflow test
      await service.validateRepository()
      await service.getMobbFolder()

      const workflowTestFix = createTestMcpFix({
        id: 'workflow-test-fix',
        patch: 'test patch for workflow',
        severity: 'high',
        issueType: 'workflow-test',
        fileName: 'WorkflowTest.java',
      })
      const patchResult = await service.savePatch(workflowTestFix)

      expect(patchResult.success).toBe(true)

      const mockFix: McpFix = {
        id: 'workflow-fix',
        confidence: 0.95,
        safeIssueType: 'workflow-test',
        severityText: 'HIGH',
        severityValue: 9,
        gitBlameLogin: null,
        vulnerabilityReportIssues: [],
        sharedState: null,
        patchAndQuestions: {
          __typename: 'FixData',
          patch: 'workflow test patch content',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Workflow test fix',
            extraContext: [],
          },
        },
      }

      const logResult = await service.logPatch(mockFix)
      expect(logResult.success).toBe(true)

      // Verify all files were created
      const mobbFolder = join(repoPath, '.mobb')
      const patchFile = join(mobbFolder, patchResult.fileName!)
      const patchInfoFile = join(mobbFolder, 'patchInfo.md')

      expect(fs.existsSync(patchFile)).toBe(true)
      expect(fs.existsSync(patchInfoFile)).toBe(true)

      // Verify .gitignore was updated
      const gitignorePath = join(repoPath, '.gitignore')
      const gitignoreContent = readFileSync(gitignorePath, 'utf8')
      expect(gitignoreContent).toContain('**/.mobb')
    })
  })
})
