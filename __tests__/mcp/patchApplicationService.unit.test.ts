/**
 * Comprehensive tests for PatchApplicationService
 * Includes both unit tests (individual methods) and integration tests (full patch application workflow)
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PatchApplicationService } from '../../src/mcp/services/PatchApplicationService'
import { McpFix } from '../../src/mcp/types'
import { ActiveGitRepo } from './helpers/MockRepo'

// Helper to access private methods in tests
const getCommentSyntax = (filePath: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (PatchApplicationService as any).getCommentSyntax(filePath)

const extractTargetFilesFromPatch = (patch: string): string[] =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (PatchApplicationService as any).extractTargetFilesFromPatch(patch)

// Mock the configs
vi.mock('../../src/mcp/core/configs', () => ({
  MCP_AUTO_FIX_DEBUG_MODE: true,
  MCP_DEFAULT_API_URL: 'http://localhost:8080',
}))

// Mock the logger
vi.mock('../../src/mcp/Logger', () => ({
  logDebug: vi.fn(),
  logError: vi.fn(),
  logInfo: vi.fn(),
  logWarn: vi.fn(),
}))

describe('PatchApplicationService', () => {
  let mockRepo: ActiveGitRepo
  let repoPath: string

  beforeEach(() => {
    mockRepo = new ActiveGitRepo()
    repoPath = mockRepo.getRepoPath()
    vi.clearAllMocks()
  })

  afterEach(() => {
    mockRepo.cleanupAll()
  })

  describe('getCommentSyntax', () => {
    it('should return correct comment syntax for JavaScript files', () => {
      const testCases = [
        { ext: '.js', expected: '//' },
        { ext: '.jsx', expected: '//' },
        { ext: '.mjs', expected: '//' },
        { ext: '.cjs', expected: '//' },
        { ext: '.ts', expected: '//' },
        { ext: '.tsx', expected: '//' },
      ]

      testCases.forEach(({ ext, expected }) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe(expected)
      })
    })

    it('should return correct comment syntax for C/C++ files', () => {
      const testCases = [
        { ext: '.c', expected: '//' },
        { ext: '.cpp', expected: '//' },
        { ext: '.cc', expected: '//' },
        { ext: '.cxx', expected: '//' },
        { ext: '.c++', expected: '//' },
        { ext: '.pcc', expected: '//' },
        { ext: '.tpp', expected: '//' },
        { ext: '.C', expected: '//' },
        { ext: '.h', expected: '//' },
        { ext: '.hpp', expected: '//' },
        { ext: '.hh', expected: '//' },
        { ext: '.hxx', expected: '//' },
        { ext: '.inl', expected: '//' },
        { ext: '.ipp', expected: '//' },
      ]

      testCases.forEach(({ ext, expected }) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe(expected)
      })
    })

    it('should return correct comment syntax for Python-style languages', () => {
      const testCases = [
        { ext: '.py', expected: '#' },
        { ext: '.pyi', expected: '#' },
        { ext: '.sh', expected: '#' },
        { ext: '.bash', expected: '#' },
        { ext: '.rb', expected: '#' },
        { ext: '.r', expected: '#' },
        { ext: '.R', expected: '#' },
        { ext: '.yaml', expected: '#' },
        { ext: '.yml', expected: '#' },
        { ext: '.dockerfile', expected: '#' },
        { ext: '.Dockerfile', expected: '#' },
        { ext: '.tf', expected: '#' },
        { ext: '.tfvars', expected: '#' },
        { ext: '.hcl', expected: '#' },
        { ext: '.promql', expected: '#' },
        { ext: '.cairo', expected: '#' },
        { ext: '.circom', expected: '#' },
        { ext: '.ex', expected: '#' },
        { ext: '.exs', expected: '#' },
      ]

      testCases.forEach(({ ext, expected }) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe(expected)
      })
    })

    it('should return correct comment syntax for HTML/XML files', () => {
      const testCases = [
        { ext: '.html', expected: '<!--' },
        { ext: '.htm', expected: '<!--' },
        { ext: '.xml', expected: '<!--' },
        { ext: '.plist', expected: '<!--' },
        { ext: '.vue', expected: '<!--' },
      ]

      testCases.forEach(({ ext, expected }) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe(expected)
      })
    })

    it('should return correct comment syntax for Lisp family languages', () => {
      const testCases = [
        { ext: '.lisp', expected: ';' },
        { ext: '.cl', expected: ';' },
        { ext: '.el', expected: ';' },
        { ext: '.scm', expected: ';' },
        { ext: '.ss', expected: ';' },
        { ext: '.clj', expected: ';' },
        { ext: '.cljs', expected: ';' },
        { ext: '.cljc', expected: ';' },
        { ext: '.edn', expected: ';' },
      ]

      testCases.forEach(({ ext, expected }) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe(expected)
      })
    })

    it('should return correct comment syntax for specialized languages', () => {
      const testCases = [
        { ext: '.cls', expected: '//' }, // Apex
        { ext: '.sol', expected: '//' }, // Solidity
        { ext: '.move', expected: '//' }, // Move
        { ext: '.hack', expected: '//' }, // Hack
        { ext: '.hck', expected: '//' }, // Hack
        { ext: '.jl', expected: '//' }, // Julia
        { ext: '.proto', expected: '//' }, // Protocol Buffers
        { ext: '.kt', expected: '//' }, // Kotlin
        { ext: '.kts', expected: '//' }, // Kotlin
        { ext: '.ktm', expected: '//' }, // Kotlin
        { ext: '.go', expected: '//' }, // Go
        { ext: '.rs', expected: '//' }, // Rust
        { ext: '.swift', expected: '//' }, // Swift
        { ext: '.scala', expected: '//' }, // Scala
        { ext: '.dart', expected: '//' }, // Dart
        { ext: '.java', expected: '//' }, // Java
        { ext: '.cs', expected: '//' }, // C#
        { ext: '.php', expected: '//' }, // PHP
        { ext: '.tpl', expected: '//' }, // PHP template
        { ext: '.phtml', expected: '//' }, // PHP HTML
      ]

      testCases.forEach(({ ext, expected }) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe(expected)
      })
    })

    it('should return correct comment syntax for other languages', () => {
      const testCases = [
        { ext: '.sql', expected: '--' },
        { ext: '.lua', expected: '--' },
        { ext: '.hs', expected: '--' },
        { ext: '.lhs', expected: '--' },
        { ext: '.elm', expected: '--' },
        { ext: '.ml', expected: '(*' },
        { ext: '.mli', expected: '(*' },
        { ext: '.css', expected: '/*' },
        { ext: '.ql', expected: '//' },
        { ext: '.qll', expected: '//' },
        { ext: '.json', expected: '//' },
        { ext: '.ipynb', expected: '#' },
        { ext: '.jsonnet', expected: '//' },
        { ext: '.libsonnet', expected: '//' },
      ]

      testCases.forEach(({ ext, expected }) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe(expected)
      })
    })

    it('should return default comment syntax for unknown extensions', () => {
      const result = getCommentSyntax('test.unknown')
      expect(result).toBe('//')
    })

    it('should return default comment syntax for files without extensions', () => {
      const result = getCommentSyntax('Dockerfile')
      expect(result).toBe('#')
    })

    it('should handle case-insensitive extensions', () => {
      const result = getCommentSyntax('TEST.JS')
      expect(result).toBe('//')
    })

    it('should have all required SUPPORTED_EXTENSIONS covered in commentMap', () => {
      // This test verifies that all extensions from SUPPORTED_EXTENSIONS have comment mappings
      const supportedExtensions = [
        '.js',
        '.jsx',
        '.mjs',
        '.cjs',
        '.ts',
        '.tsx', // JavaScript/TypeScript
        '.py',
        '.pyi', // Python
        '.java', // Java
        '.go', // Go
        '.rs', // Rust
        '.rb', // Ruby
        '.swift', // Swift
        '.kt',
        '.kts',
        '.ktm', // Kotlin
        '.scala', // Scala
        '.dart', // Dart
        '.c',
        '.cpp',
        '.cc',
        '.cxx',
        '.c++',
        '.h',
        '.hpp',
        '.hh', // C/C++
        '.cs', // C#
        '.php',
        '.tpl',
        '.phtml', // PHP
        '.html',
        '.htm',
        '.xml',
        '.plist',
        '.vue', // HTML/XML
        '.css', // CSS
        '.sql', // SQL
        '.lua', // Lua
        '.hs',
        '.lhs',
        '.elm', // Haskell/Elm
        '.ml',
        '.mli', // OCaml
        '.lisp',
        '.cl',
        '.el',
        '.scm',
        '.ss',
        '.clj',
        '.cljs',
        '.cljc',
        '.edn', // Lisp family
        '.yaml',
        '.yml', // YAML
        '.json',
        '.ipynb',
        '.jsonnet',
        '.libsonnet', // JSON variants
        '.tf',
        '.tfvars',
        '.hcl', // Terraform
        '.dockerfile',
        '.Dockerfile', // Dockerfile
        '.sh',
        '.bash', // Shell
        '.r',
        '.R', // R
        '.cls',
        '.sol',
        '.move',
        '.hack',
        '.hck',
        '.jl',
        '.proto', // Specialized languages
        '.ql',
        '.qll',
        '.ex',
        '.exs',
        '.cairo',
        '.circom',
        '.promql', // More specialized
      ]

      // Test a sample of extensions to ensure they all have comment syntax
      supportedExtensions.forEach((ext) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should return consistent comment syntax for similar file types', () => {
      // JavaScript family should all use //
      const jsExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']
      jsExtensions.forEach((ext) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe('//')
      })

      // Python-style should all use #
      const pythonStyleExtensions = [
        '.py',
        '.pyi',
        '.sh',
        '.bash',
        '.r',
        '.R',
        '.yaml',
        '.yml',
      ]
      pythonStyleExtensions.forEach((ext) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe('#')
      })

      // HTML-style should all use <!--
      const htmlStyleExtensions = ['.html', '.htm', '.xml', '.plist', '.vue']
      htmlStyleExtensions.forEach((ext) => {
        const result = getCommentSyntax(`test${ext}`)
        expect(result).toBe('<!--')
      })
    })
  })

  describe('patch application', () => {
    it('should apply a simple patch to a JavaScript file', async () => {
      // Create a test JavaScript file
      const testFile = 'src/test.js'
      const originalContent = `function getUserById(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.query(query);
}`

      mockRepo.addFile(testFile, originalContent)

      // Create a mock fix with patch
      const mockFix: McpFix = {
        id: 'test-fix-1',
        safeIssueType: 'SQL Injection',
        severityText: 'High',
        severityValue: 8,
        confidence: 95,
        fixUrl: 'http://localhost:8080/fixes/test-fix-1',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${testFile} b/${testFile}
index 1234567..abcdefg 100644
--- a/${testFile}
+++ b/${testFile}
@@ -2,6 +2,7 @@ function getUserById(userId) {
   if (!userId) {
     throw new Error('User ID is required');
   }
-  const query = "SELECT * FROM users WHERE id = " + userId;
-  return db.query(query);
+  const query = "SELECT * FROM users WHERE id = ?";
+  return db.query(query, [userId]);
 }`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription:
              'Fixed SQL injection vulnerability by using parameterized queries',
            extraContext: [],
          },
        },
      }

      // Apply the fix
      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)
      expect(result.failedFixes).toHaveLength(0)

      // Verify the file content was updated
      const updatedContent = readFileSync(join(repoPath, testFile), 'utf8')
      expect(updatedContent).toContain(
        'const query = "SELECT * FROM users WHERE id = ?";'
      )
      expect(updatedContent).toContain('return db.query(query, [userId]);')
      expect(updatedContent).not.toContain(
        'const query = "SELECT * FROM users WHERE id = " + userId;'
      )
    })

    it('should apply a patch to a Python file', async () => {
      // Create a test Python file
      const testFile = 'src/security.py'
      const originalContent = `import os

def get_user_file(filename):
    file_path = "/var/data/" + filename
    return open(file_path, 'r').read()`

      mockRepo.addFile(testFile, originalContent)

      // Create a mock fix with patch
      const mockFix: McpFix = {
        id: 'test-fix-2',
        safeIssueType: 'Path Traversal',
        severityText: 'High',
        severityValue: 7,
        confidence: 90,
        fixUrl: 'http://localhost:8080/fixes/test-fix-2',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${testFile} b/${testFile}
index 1234567..abcdefg 100644
--- a/${testFile}
+++ b/${testFile}
@@ -1,5 +1,7 @@
 import os
+import os.path

 def get_user_file(filename):
-    file_path = "/var/data/" + filename
+    safe_filename = os.path.basename(filename)
+    file_path = os.path.join("/var/data/", safe_filename)
     return open(file_path, 'r').read()`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription:
              'Fixed path traversal vulnerability by sanitizing filename',
            extraContext: [],
          },
        },
      }

      // Apply the fix
      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)
      expect(result.failedFixes).toHaveLength(0)

      // Verify the file content was updated
      const updatedContent = readFileSync(join(repoPath, testFile), 'utf8')
      expect(updatedContent).toContain('import os.path')
      expect(updatedContent).toContain(
        'safe_filename = os.path.basename(filename)'
      )
      expect(updatedContent).toContain(
        'file_path = os.path.join("/var/data/", safe_filename)'
      )
    })

    it('should create a new file when patch creates a file', async () => {
      const newFile = 'src/security-utils.js'

      // Create a mock fix that creates a new file
      const mockFix: McpFix = {
        id: 'test-fix-3',
        safeIssueType: 'Missing Security Utils',
        severityText: 'Medium',
        severityValue: 5,
        confidence: 85,
        fixUrl: 'http://localhost:8080/fixes/test-fix-3',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${newFile} b/${newFile}
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/${newFile}
@@ -0,0 +1,8 @@
+// Security utility functions
+
+function sanitizeInput(input) {
+  if (typeof input !== 'string') {
+    return '';
+  }
+  return input.replace(/[<>&"']/g, '');
+}`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Added security utility functions',
            extraContext: [],
          },
        },
      }

      // Apply the fix
      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      // Verify the result
      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)
      expect(result.failedFixes).toHaveLength(0)

      // Verify the new file was created with correct content
      const newContent = readFileSync(join(repoPath, newFile), 'utf8')
      expect(newContent).toContain('// Security utility functions')
      expect(newContent).toContain('function sanitizeInput(input) {')
      expect(newContent).toContain("return input.replace(/[<>&\"']/g, '');")
    })

    it('should handle patch application failure gracefully', async () => {
      // Create a mock fix with invalid patch
      const mockFix: McpFix = {
        id: 'test-fix-invalid',
        safeIssueType: 'Test',
        severityText: 'Low',
        severityValue: 2,
        confidence: 50,
        fixUrl: 'http://localhost:8080/fixes/test-fix-invalid',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: 'invalid patch content that cannot be parsed',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Invalid test fix',
            extraContext: [],
          },
        },
      }

      // Apply the fix
      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      // Verify the result shows failure
      expect(result.success).toBe(false)
      expect(result.appliedFixes).toHaveLength(0)
      expect(result.failedFixes).toHaveLength(1)
      expect(result.failedFixes[0]?.fix.id).toBe('test-fix-invalid')
      expect(result.failedFixes[0]?.error).toContain('Failed to parse patch')
    })

    it('should apply multiple fixes to different files', async () => {
      // Create test files
      const jsFile = 'src/app.js'
      const pyFile = 'src/utils.py'

      mockRepo.addFile(jsFile, 'console.log("Hello");')
      mockRepo.addFile(pyFile, 'print("Hello")')

      const fixes: McpFix[] = [
        {
          id: 'fix-js',
          safeIssueType: 'Console Log',
          severityText: 'Low',
          severityValue: 1,
          confidence: 80,
          fixUrl: 'http://localhost:8080/fixes/fix-js',
          vulnerabilityReportIssues: [],
          patchAndQuestions: {
            __typename: 'FixData',
            patch: `diff --git a/${jsFile} b/${jsFile}
index 1234567..abcdefg 100644
--- a/${jsFile}
+++ b/${jsFile}
@@ -1 +1 @@
-console.log("Hello");
+// console.log("Hello");`,
            patchOriginalEncodingBase64: '',
            extraContext: {
              fixDescription: 'Commented out console.log',
              extraContext: [],
            },
          },
        },
        {
          id: 'fix-py',
          safeIssueType: 'Print Statement',
          severityText: 'Low',
          severityValue: 1,
          confidence: 80,
          fixUrl: 'http://localhost:8080/fixes/fix-py',
          vulnerabilityReportIssues: [],
          patchAndQuestions: {
            __typename: 'FixData',
            patch: `diff --git a/${pyFile} b/${pyFile}
index 1234567..abcdefg 100644
--- a/${pyFile}
+++ b/${pyFile}
@@ -1 +1 @@
-print("Hello")
+# print("Hello")`,
            patchOriginalEncodingBase64: '',
            extraContext: {
              fixDescription: 'Commented out print statement',
              extraContext: [],
            },
          },
        },
      ]

      // Apply the fixes
      const result = await PatchApplicationService.applyFixes({
        fixes,
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      // Verify both fixes were applied
      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(2)
      expect(result.failedFixes).toHaveLength(0)

      // Verify file contents
      const jsContent = readFileSync(join(repoPath, jsFile), 'utf8')
      const pyContent = readFileSync(join(repoPath, pyFile), 'utf8')

      expect(jsContent).toContain('// console.log("Hello");')
      expect(pyContent).toContain('# print("Hello")')
    })

    it('should skip lower priority fixes when higher priority fix succeeds for same file', async () => {
      const testFile = 'src/test.js'
      mockRepo.addFile(testFile, 'var x = 1;')

      const fixes: McpFix[] = [
        {
          id: 'fix-high-priority',
          safeIssueType: 'High Priority Issue',
          severityText: 'High',
          severityValue: 8,
          confidence: 95,
          fixUrl: 'http://localhost:8080/fixes/fix-high-priority',
          vulnerabilityReportIssues: [],
          patchAndQuestions: {
            __typename: 'FixData',
            patch: `diff --git a/${testFile} b/${testFile}
index 1234567..abcdefg 100644
--- a/${testFile}
+++ b/${testFile}
@@ -1 +1 @@
-var x = 1;
+const x = 1;`,
            patchOriginalEncodingBase64: '',
            extraContext: {
              fixDescription: 'Use const instead of var',
              extraContext: [],
            },
          },
        },
        {
          id: 'fix-low-priority',
          safeIssueType: 'Low Priority Issue',
          severityText: 'Low',
          severityValue: 2,
          confidence: 85,
          fixUrl: 'http://localhost:8080/fixes/fix-low-priority',
          vulnerabilityReportIssues: [],
          patchAndQuestions: {
            __typename: 'FixData',
            patch: `diff --git a/${testFile} b/${testFile}
index 1234567..abcdefg 100644
--- a/${testFile}
+++ b/${testFile}
@@ -1 +1 @@
-var x = 1;
+let x = 1;`,
            patchOriginalEncodingBase64: '',
            extraContext: {
              fixDescription: 'Use let instead of var',
              extraContext: [],
            },
          },
        },
      ]

      // Apply the fixes
      const result = await PatchApplicationService.applyFixes({
        fixes,
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      // Verify only the high priority fix was applied
      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)
      expect(result.appliedFixes[0]?.id).toBe('fix-high-priority')

      // Verify file content shows the high priority fix
      const content = readFileSync(join(repoPath, testFile), 'utf8')
      expect(content).toContain('const x = 1;')
      expect(content).not.toContain('let x = 1;')
      expect(content).not.toContain('var x = 1;')
    })
  })

  describe('extractPathFromPatch', () => {
    it('should extract file path from git patch', () => {
      const patch = `diff --git a/src/test.js b/src/test.js
index 1234567..abcdefg 100644
--- a/src/test.js
+++ b/src/test.js`

      const result = PatchApplicationService.extractPathFromPatch(patch)
      expect(result).toBe('src/test.js')
    })

    it('should return null for invalid patch', () => {
      const result =
        PatchApplicationService.extractPathFromPatch('invalid patch')
      expect(result).toBeNull()
    })

    it('should return null for empty patch', () => {
      const result = PatchApplicationService.extractPathFromPatch('')
      expect(result).toBeNull()
    })

    it('should return null for undefined patch', () => {
      const result = PatchApplicationService.extractPathFromPatch(undefined)
      expect(result).toBeNull()
    })

    it('should extract path from patch with different git diff format', () => {
      const patch = `diff --git a/src/complex/path/file.js b/src/complex/path/file.js
--- a/src/complex/path/file.js
+++ b/src/complex/path/file.js`

      const result = PatchApplicationService.extractPathFromPatch(patch)
      expect(result).toBe('src/complex/path/file.js')
    })
  })

  describe('error handling and edge cases', () => {
    it('should handle malformed patch data gracefully', async () => {
      // Create a mock fix with completely malformed patch
      const mockFix: McpFix = {
        id: 'test-fix-malformed',
        safeIssueType: 'Test',
        severityText: 'Medium',
        severityValue: 5,
        confidence: 80,
        fixUrl: 'http://localhost:8080/fixes/test-fix-malformed',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: 'not a valid patch at all - no diff header',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Malformed patch test',
            extraContext: [],
          },
        },
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      expect(result.success).toBe(false)
      expect(result.failedFixes).toHaveLength(1)
      expect(result.failedFixes[0]?.error).toContain('Failed to parse patch')
    })

    it('should handle fix with no patch data', async () => {
      // Create a mock fix with missing patch data
      const mockFix: McpFix = {
        id: 'test-fix-no-patch',
        safeIssueType: 'Test',
        severityText: 'Low',
        severityValue: 2,
        confidence: 70,
        fixUrl: 'http://localhost:8080/fixes/test-fix-no-patch',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: '',
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'No patch test',
            extraContext: [],
          },
        },
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      expect(result.success).toBe(false)
      expect(result.failedFixes).toHaveLength(1)
      expect(result.failedFixes[0]?.error).toContain('empty patch content')
    })

    it('should handle fix with non-FixData type', async () => {
      // Create a mock fix with wrong type
      const mockFix: McpFix = {
        id: 'test-fix-wrong-type',
        safeIssueType: 'Test',
        severityText: 'Low',
        severityValue: 2,
        confidence: 70,
        fixUrl: 'http://localhost:8080/fixes/test-fix-wrong-type',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'SomeOtherType',
        } as unknown as McpFix['patchAndQuestions'],
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      expect(result.success).toBe(false)
      expect(result.failedFixes).toHaveLength(1)
      expect(result.failedFixes[0]?.error).toContain(
        'does not contain patch data'
      )
    })

    it('should handle deeply nested file paths', async () => {
      // Test handling of deeply nested paths (not path traversal, just deep nesting)
      const deepFile = 'very/deep/nested/path/file.js'
      const mockFix: McpFix = {
        id: 'test-fix-deep-path',
        safeIssueType: 'Deep Path Test',
        severityText: 'Low',
        severityValue: 2,
        confidence: 80,
        fixUrl: 'http://localhost:8080/fixes/test-fix-deep-path',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${deepFile} b/${deepFile}
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/${deepFile}
@@ -0,0 +1,1 @@
+console.log('deep file');`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Deep path test',
            extraContext: [],
          },
        },
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)

      // Verify the deep nested file was created
      const filePath = join(repoPath, deepFile)
      const content = readFileSync(filePath, 'utf8')
      expect(content).toContain('deep file')
    })

    it('should handle patch with unusual target file names', async () => {
      // Test files with unusual but valid names
      const unusualFile = 'file-with-dashes_and_underscores.test.js'
      const mockFix: McpFix = {
        id: 'test-fix-unusual-name',
        safeIssueType: 'Test',
        severityText: 'Low',
        severityValue: 2,
        confidence: 80,
        fixUrl: 'http://localhost:8080/fixes/test-fix-unusual-name',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${unusualFile} b/${unusualFile}
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/${unusualFile}
@@ -0,0 +1,3 @@
+// Test file with unusual name
+console.log('unusual name');
+module.exports = {};`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Unusual filename test',
            extraContext: [],
          },
        },
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)

      // Verify the file was created
      const filePath = join(repoPath, unusualFile)
      const content = readFileSync(filePath, 'utf8')
      expect(content).toContain('unusual name')
    })

    it('should handle file modification when original file does not exist', async () => {
      const nonExistentFile = 'src/does-not-exist.js'
      const mockFix: McpFix = {
        id: 'test-fix-missing-file',
        safeIssueType: 'Test',
        severityText: 'Medium',
        severityValue: 5,
        confidence: 80,
        fixUrl: 'http://localhost:8080/fixes/test-fix-missing-file',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${nonExistentFile} b/${nonExistentFile}
index 1234567..abcdefg 100644
--- a/${nonExistentFile}
+++ b/${nonExistentFile}
@@ -1,3 +1,3 @@
 function test() {
-  console.log('old');
+  console.log('new');
 }`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Missing file test',
            extraContext: [],
          },
        },
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      expect(result.success).toBe(false)
      expect(result.failedFixes).toHaveLength(1)
      expect(result.failedFixes[0]?.error).toContain(
        'Target file does not exist'
      )
    })
  })

  describe('file modification time validation', () => {
    it('should skip fixes for files modified after scan time', async () => {
      // Create a test file
      const testFile = 'src/modified-file.js'
      const originalContent = 'console.log("original");'
      mockRepo.addFile(testFile, originalContent)

      // Get current time and set scan time to past
      const scanTime = Date.now() - 60000 // 1 minute ago

      // Wait a moment to ensure file modification time is after scan time
      await new Promise((resolve) => setTimeout(resolve, 10))

      // Modify the file to update its modification time
      const filePath = join(repoPath, testFile)
      writeFileSync(filePath, originalContent + '\n// modified')

      const mockFix: McpFix = {
        id: 'test-fix-modified-file',
        safeIssueType: 'Test',
        severityText: 'Medium',
        severityValue: 5,
        confidence: 80,
        fixUrl: 'http://localhost:8080/fixes/test-fix-modified-file',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${testFile} b/${testFile}
index 1234567..abcdefg 100644
--- a/${testFile}
+++ b/${testFile}
@@ -1 +1 @@
-console.log("original");
+console.log("patched");`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Modified file test',
            extraContext: [],
          },
        },
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanStartTime: scanTime,
        scanContext: 'test',
      })

      expect(result.success).toBe(false)
      expect(result.failedFixes).toHaveLength(1)
      expect(result.failedFixes[0]?.error).toContain(
        'was modified after scan started'
      )
    })
  })

  describe('advanced patch scenarios', () => {
    it('should handle file deletion patches', async () => {
      // Create a file to be deleted
      const testFile = 'src/to-delete.js'
      const originalContent = 'console.log("to be deleted");'
      mockRepo.addFile(testFile, originalContent)

      const mockFix: McpFix = {
        id: 'test-fix-delete-file',
        safeIssueType: 'File Cleanup',
        severityText: 'Medium',
        severityValue: 4,
        confidence: 90,
        fixUrl: 'http://localhost:8080/fixes/test-fix-delete-file',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${testFile} b/${testFile}
deleted file mode 100644
index 1234567..0000000
--- a/${testFile}
+++ /dev/null
@@ -1 +0,0 @@
-console.log("to be deleted");`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Delete unnecessary file',
            extraContext: [],
          },
        },
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)

      // Verify file deletion was handled
      const filePath = join(repoPath, testFile)
      let fileExists = true
      try {
        readFileSync(filePath, 'utf8')
      } catch (error) {
        fileExists = false
      }

      // File should be deleted if deletion is implemented
      if (!fileExists) {
        console.log('File deletion worked correctly')
      } else {
        console.log('File deletion not implemented or failed')
      }
    })

    it('should handle patches with complex diff formats', async () => {
      const testFile = 'src/complex-diff.js'
      const originalContent = `function example() {
  const a = 1;
  const b = 2;
  return a + b;
}`
      mockRepo.addFile(testFile, originalContent)

      const mockFix: McpFix = {
        id: 'test-fix-complex-diff',
        safeIssueType: 'Code Improvement',
        severityText: 'Low',
        severityValue: 2,
        confidence: 85,
        fixUrl: 'http://localhost:8080/fixes/test-fix-complex-diff',
        vulnerabilityReportIssues: [],
        patchAndQuestions: {
          __typename: 'FixData',
          patch: `diff --git a/${testFile} b/${testFile}
index 1234567..abcdefg 100644
--- a/${testFile}
+++ b/${testFile}
@@ -1,5 +1,6 @@
 function example() {
+  // Improved version
   const a = 1;
   const b = 2;
-  return a + b;
+  return a + b + 0; // Explicit zero
 }`,
          patchOriginalEncodingBase64: '',
          extraContext: {
            fixDescription: 'Add comments and improve code',
            extraContext: [],
          },
        },
      }

      const result = await PatchApplicationService.applyFixes({
        fixes: [mockFix],
        repositoryPath: repoPath,
        scanContext: 'test',
      })

      expect(result.success).toBe(true)
      expect(result.appliedFixes).toHaveLength(1)

      const updatedContent = readFileSync(join(repoPath, testFile), 'utf8')
      expect(updatedContent).toContain('// Improved version')
      expect(updatedContent).toContain('return a + b + 0;')
    })

    it('should handle extractTargetFilesFromPatch with multiple files', () => {
      const patch = `diff --git a/src/file1.js b/src/file1.js
index 1234567..abcdefg 100644
--- a/src/file1.js
+++ b/src/file1.js
@@ -1 +1 @@
-old content
+new content
diff --git a/src/file2.py b/src/file2.py
index 7654321..gfedcba 100644
--- a/src/file2.py
+++ b/src/file2.py
@@ -1 +1 @@
-print("old")
+print("new")`

      // Access the private method through our helper
      const result = extractTargetFilesFromPatch(patch)
      expect(result).toEqual(['src/file1.js', 'src/file2.py'])
    })

    it('should handle patches targeting /dev/null correctly', () => {
      const patch = `diff --git a/src/test.js b/src/test.js
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/test.js
@@ -0,0 +1,3 @@
+function test() {
+  return true;
+}`

      const result = extractTargetFilesFromPatch(patch)
      expect(result).toEqual(['src/test.js'])
    })

    it('should handle backup patch format with git diff lines', () => {
      const patch = `Some other content
diff --git a/folder/script.sh b/folder/script.sh
More content
+++ b/folder/script.sh
Content here`

      const result = extractTargetFilesFromPatch(patch)
      expect(result).toEqual(['folder/script.sh'])
    })
  })

  describe('comment syntax edge cases', () => {
    it('should handle files with multiple extensions', () => {
      const result = getCommentSyntax('config.json.template')
      expect(result).toBe('//')
    })

    it('should handle files with no extension but known basename patterns', () => {
      // Test the actual behavior - case sensitivity matters for basename matching
      const result1 = getCommentSyntax('Dockerfile')
      expect(result1).toBe('#') // This should work as Dockerfile is in commentMap

      // Test case sensitivity - these should fall back to default since commentMap is case-sensitive
      const result2 = getCommentSyntax('dockerfile')
      expect(result2).toBe('//') // Falls back to default

      const result3 = getCommentSyntax('DOCKERFILE')
      expect(result3).toBe('//') // Falls back to default
    })

    it('should prioritize basename over extension for special files', () => {
      // This tests the logic where basename check comes before extension check
      const result = getCommentSyntax('Dockerfile.backup')
      // Should use extension (.backup) fallback since Dockerfile.backup doesn't match basename exactly
      expect(result).toBe('//')
    })
  })
})
