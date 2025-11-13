import { GQLClient } from '@mobb/bugsy/features/analysis/graphql'
import { createMcpServer } from '@mobb/bugsy/mcp'
import {
  initialScanInProgressPrompt,
  noChangedFilesFoundPrompt,
  noFreshFixesPrompt,
} from '@mobb/bugsy/mcp/core/prompts'
import * as LoggerModule from '@mobb/bugsy/mcp/Logger'
import { McpGQLClient } from '@mobb/bugsy/mcp/services/McpGQLClient'
import { sleep } from '@mobb/bugsy/utils'
import {
  CallToolResult,
  ListToolsResult,
} from '@modelcontextprotocol/sdk/types'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs'
import fs from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { describe, expect, it, vi } from 'vitest'

import {
  MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
  MCP_TOOL_FETCH_AVAILABLE_FIXES,
  MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
} from '../src/mcp/tools/toolNames'
import { setupCommonBeforeEach, token } from './integration-test-utils'
import {
  benignFileContent,
  htmlVulnerableFileContent,
  jsVulnerableFileContent,
  multipleVulnerableFileContent,
  multiVulnerableFileContent,
  pyVulnerableFileContent,
  vulnerableFileContent,
} from './mcp/helpers/fileContents'
import { InlineMCPClient } from './mcp/helpers/InlineMCPClient'
import {
  ActiveGitRepo,
  EmptyGitRepo,
  MockRepo,
  NoChangesGitRepo,
  NonGitRepo,
} from './mcp/helpers/MockRepo'
import { expectLoggerMessage } from './mcp/helpers/testHelpers'

// Filter for debug logs to show on test failure
const FAIL_DEBUG_LOG_FILTER = [
  '[FULL_SCAN]',
  '[BACKGROUND_INITIAL]',
  'scan_and_fix_vulnerabilities',
  'Executing tool',
  'Tool execution',
  'Security scan',
  'File scan',
]

vi.useFakeTimers({
  shouldAdvanceTime: true,
})

vi.mock('open', async () => {
  const { createOpenMockImplementation } = await import(
    './integration-test-utils'
  )
  return {
    default: vi.fn().mockImplementation(createOpenMockImplementation()),
  }
})

vi.mock('../src/features/analysis/scanners/snyk', async () => {
  const { createSnykMockImplementation } = await import(
    './integration-test-utils'
  )
  return {
    getSnykReport: vi.fn().mockImplementation(createSnykMockImplementation()),
  }
})

setupCommonBeforeEach()

const randomRepoUrl = `https://github.com/test-org/test-repo-${Math.random()
  .toString(36)
  .substring(2, 15)}`

describe('mcp tests', () => {
  let mcpClient: InlineMCPClient

  let nonExistentPath: string
  let emptyRepoPath: string
  let activeRepoPath: string
  let activeNoChangesRepoPath: string
  let activeNonGitRepoPath: string
  let nonRepoEmptyPath: string

  let emptyRepo: MockRepo
  let activeRepo: MockRepo
  let activeSecondRepo: MockRepo
  let activeNoChangesRepo: MockRepo
  let nonGitRepo: MockRepo
  let logs: { message: string; data: unknown }[] = []

  // Helper function to safely replace mcpClient with cleanup
  const replaceMcpClient = async (newClient: InlineMCPClient) => {
    if (mcpClient) {
      try {
        // Add timeout to cleanup to prevent hanging
        const cleanupPromise = mcpClient.cleanup()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Cleanup timeout')), 5000)
        )
        await Promise.race([cleanupPromise, timeoutPromise])

        // Wait a bit to ensure event listeners are properly removed
        await sleep(100)
      } catch (error) {
        console.log('Error during MCP client cleanup:', error)
      }
    }
    mcpClient = newClient
  }

  beforeAll(async () => {
    const server = createMcpServer()

    nonExistentPath = join(tmpdir(), 'mcp-test-non-existent-' + Date.now())

    // Create temp directory that is not a git repo
    nonRepoEmptyPath = mkdtempSync(join(tmpdir(), 'mcp-test-non-repo-'))

    emptyRepo = new EmptyGitRepo()
    activeRepo = new ActiveGitRepo()
    activeSecondRepo = new ActiveGitRepo(undefined, { repoUrl: randomRepoUrl })
    activeNoChangesRepo = new NoChangesGitRepo()
    nonGitRepo = new NonGitRepo()

    emptyRepoPath = emptyRepo.getRepoPath()
    activeRepoPath = activeRepo.getRepoPath()
    activeNoChangesRepoPath = activeNoChangesRepo.getRepoPath()
    activeNonGitRepoPath = nonGitRepo.getRepoPath()

    // Create a client connected to this process
    mcpClient = new InlineMCPClient(server)
  })

  // Helper function to create fresh, isolated repository for each test
  const createFreshRepo = (
    type: 'git' | 'non-git' | 'no-changes' | 'empty' = 'git'
  ) => {
    const repoUrl = `https://github.com/test-org/test-repo-${Math.random()
      .toString(36)
      .substring(2, 15)}`

    switch (type) {
      case 'git':
        return new ActiveGitRepo(undefined, { repoUrl })
      case 'non-git':
        return new NonGitRepo()
      case 'no-changes':
        return new NoChangesGitRepo()
      case 'empty':
        return new EmptyGitRepo()
      default:
        return new ActiveGitRepo(undefined, { repoUrl })
    }
  }

  beforeEach(async () => {
    logs = []
    vi.spyOn(LoggerModule, 'logDebug').mockImplementation((message, data) => {
      logs.push({ message, data })
    })
    vi.spyOn(LoggerModule, 'logInfo').mockImplementation((message, data) => {
      logs.push({ message, data })
    })
    vi.spyOn(LoggerModule, 'logError').mockImplementation((message, data) => {
      logs.push({ message, data })
    })
    vi.spyOn(LoggerModule, 'logWarn').mockImplementation((message, data) => {
      logs.push({ message, data })
    })
    vi.spyOn(LoggerModule, 'log').mockImplementation((message, data) => {
      logs.push({ message, data })
    })

    // Clear any existing repository without creating a new one
    // Let each test create its own repository as needed
    try {
      if (activeSecondRepo) {
        activeSecondRepo.cleanupAll()
      }
    } catch (error) {
      console.log(
        'Warning: Could not cleanup activeSecondRepo in beforeEach:',
        error
      )
    }
  })

  afterEach(async (context) => {
    // Cleanup MCP client if it exists
    if (mcpClient) {
      try {
        // Add timeout to cleanup to prevent hanging
        const cleanupPromise = mcpClient.cleanup()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Cleanup timeout')), 5000)
        )
        await Promise.race([cleanupPromise, timeoutPromise])
      } catch (error) {
        console.log('Error during MCP client cleanup:', error)
      }
    }

    // Clear all mocks after each test
    vi.clearAllMocks()

    if (context.task.result?.state === 'fail') {
      console.log('---------------filtered mcp logs-----------------')
      const filteredLogs = logs.filter((log) =>
        FAIL_DEBUG_LOG_FILTER.some(
          (filter) =>
            typeof log.message === 'string' && log.message.includes(filter)
        )
      )
      for (const log of filteredLogs) {
        console.log(log.message)
        if (log.data) {
          console.log('  Data:', JSON.stringify(log.data, null, 2))
        }
      }
      console.log(
        `---------------end filtered mcp logs (${filteredLogs.length}/${logs.length})-----------------`
      )
    }
  })

  afterAll(async () => {
    // Clean up the final MCP client
    if (mcpClient) {
      try {
        const cleanupPromise = mcpClient.cleanup()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Cleanup timeout')), 5000)
        )
        await Promise.race([cleanupPromise, timeoutPromise])
      } catch (error) {
        console.log('Error during final MCP client cleanup:', error)
      }
    }

    // Clean up repositories created for the tests
    const repoHelpers: MockRepo[] = [
      emptyRepo,
      activeRepo,
      activeNoChangesRepo,
      nonGitRepo,
    ]
    repoHelpers.forEach((helper) => helper.cleanupAll())

    // Clean up temp directories
    if (existsSync(nonRepoEmptyPath)) {
      rmSync(nonRepoEmptyPath, { recursive: true, force: true })
    }
    if (existsSync(activeNonGitRepoPath)) {
      rmSync(activeNonGitRepoPath, { recursive: true, force: true })
    }
  })

  it('should respond to mcp list_tools call', async () => {
    const response = await mcpClient.listTools()

    const listToolsResponse = response as ListToolsResult
    expect(Array.isArray(listToolsResponse.tools)).toBe(true)

    // Snapshot the tools list for easier maintenance
    expect(listToolsResponse).toMatchSnapshot()
  })

  describe(`${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, () => {
    it(`should handle missing path parameter in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {}
        )
      ).rejects.toThrow("Invalid arguments: Missing required parameter 'path'")
    })

    it(`should handle non-existent path in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: nonExistentPath,
          }
        )
      ).rejects.toThrow(
        'Invalid path: potential security risk detected in path'
      )
    })

    it(`should handle empty git repository in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: emptyRepoPath,
          }
        )
      ).resolves.toStrictEqual({
        content: [
          {
            text: noChangedFilesFoundPrompt,
            type: 'text',
          },
        ],
      })
    })

    it(`should handle git repository with no changes and no scanRecentlyChangedFiles parameter in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: activeNoChangesRepoPath,
          }
        )
      ).resolves.toStrictEqual({
        content: [
          {
            text: noChangedFilesFoundPrompt,
            type: 'text',
          },
        ],
      })
    })

    it(`should handle git repository with no changes and scanRecentlyChangedFiles=false in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: activeNoChangesRepoPath,
            scanRecentlyChangedFiles: false,
          }
        )
      ).resolves.toStrictEqual({
        content: [
          {
            text: noChangedFilesFoundPrompt,
            type: 'text',
          },
        ],
      })
    })

    describe('Path Validation Security Tests', () => {
      it('should reject path traversal attempts with actual malicious paths', async () => {
        // Test actual malicious paths that should be blocked by validateMCPPath
        const maliciousPaths = [
          '../../../etc/passwd',
          '..\\..\\..\\windows\\system32\\config\\sam',
          '../.env',
          '../../package.json',
          '../../../home/user/.ssh/id_rsa',
          'subdir/../../../etc/hosts',
          './../../sensitive-file.txt',
          'normal-file/../../../etc/passwd',
        ]

        for (const maliciousPath of maliciousPaths) {
          await expect(
            mcpClient.callTool<CallToolResult>(
              MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
              {
                path: maliciousPath,
              }
            )
          ).rejects.toThrow(
            'Invalid path: potential security risk detected in path'
          )
        }
      })
    })

    it(`should handle path that is not a git repository in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: nonRepoEmptyPath,
          }
        )
      ).resolves.toStrictEqual({
        content: [
          {
            text: noChangedFilesFoundPrompt,
            type: 'text',
          },
        ],
      })
    })

    it(`should handle non-git repository with scanRecentlyChangedFiles=false in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      // For non-git repos, scanRecentlyChangedFiles parameter is ignored and files are always scanned
      // Empty non-git repo will return "no files" message
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: nonRepoEmptyPath,
            scanRecentlyChangedFiles: false,
          }
        )
      ).resolves.toStrictEqual({
        content: [
          {
            text: noChangedFilesFoundPrompt,
            type: 'text',
          },
        ],
      })
    })

    it(`should handle active non-git repository path in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      // Verify the directory still exists before running the test
      expect(existsSync(activeNonGitRepoPath)).toBe(true)
      expect(existsSync(join(activeNonGitRepoPath, 'sample1.py'))).toBe(true)

      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: activeNonGitRepoPath,
          }
        )
      ).resolves.toStrictEqual({
        content: [
          {
            text: expect.stringContaining('MOBB SECURITY SCAN COMPLETED'),
            type: 'text',
          },
        ],
      })
    }, 200000)

    it(`should handle active git repository path in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: activeRepoPath,
          }
        )
      ).resolves.toStrictEqual({
        content: [
          {
            text: expect.stringContaining('MOBB SECURITY SCAN COMPLETED'),
            type: 'text',
          },
        ],
      })
    })
    it(`should handle active (no changes) git repository path in ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES} tool`, async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
          {
            path: activeNoChangesRepoPath,
          }
        )
      ).resolves.toStrictEqual({
        content: [
          {
            text: noChangedFilesFoundPrompt,
            type: 'text',
          },
        ],
      })
    })
  })
  describe(`${MCP_TOOL_FETCH_AVAILABLE_FIXES} tool`, () => {
    it('should handle missing path parameter', async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(MCP_TOOL_FETCH_AVAILABLE_FIXES, {})
      ).rejects.toThrow("Invalid arguments: Missing required parameter 'path'")
    })

    it('should handle non-existent path', async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(MCP_TOOL_FETCH_AVAILABLE_FIXES, {
          path: nonExistentPath,
        })
      ).rejects.toThrow(
        'Invalid path: potential security risk detected in path'
      )
    })

    it('should handle path that is not a git repository', async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(MCP_TOOL_FETCH_AVAILABLE_FIXES, {
          path: nonRepoEmptyPath,
        })
      ).rejects.toThrow('Invalid git repository')
    })

    it('should handle empty git repository with no origin', async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(MCP_TOOL_FETCH_AVAILABLE_FIXES, {
          path: emptyRepoPath,
        })
      ).rejects.toThrow('No origin URL found for the repository')
    })

    describe('Path Validation Security Tests', () => {
      it('should reject path traversal attempts with malicious paths', async () => {
        // Test actual malicious paths that should be blocked by validateMCPPath
        const maliciousPaths = [
          '../../../etc/passwd',
          '..\\..\\..\\windows\\system32\\config\\sam',
          '../.env',
          '../../package.json',
          '../../../home/user/.ssh/id_rsa',
          'subdir/../../../etc/hosts',
          './../../sensitive-file.txt',
          'normal-file/../../../etc/passwd',
        ]

        for (const maliciousPath of maliciousPaths) {
          await expect(
            mcpClient.callTool<CallToolResult>(MCP_TOOL_FETCH_AVAILABLE_FIXES, {
              path: maliciousPath,
            })
          ).rejects.toThrow(
            'Invalid path: potential security risk detected in path'
          )
        }
      })
    })

    describe('file filtering parameters', () => {
      it('should throw error when both fileFilter and fetchFixesFromAnyFile are provided', async () => {
        await expect(
          mcpClient.callTool<CallToolResult>(MCP_TOOL_FETCH_AVAILABLE_FIXES, {
            path: activeRepoPath,
            fileFilter: ['sample1.py'],
            fetchFixesFromAnyFile: true,
          })
        ).rejects.toThrow(
          'Parameters "fileFilter" and "fetchFixesFromAnyFile" are mutually exclusive'
        )
      })

      it('should filter fixes by fileFilter parameter - verify file filtering works', async () => {
        // Create test repo with multiple vulnerable files (all uncommitted for simplicity)
        const testRepo = createFreshRepo('git')
        const testRepoPath = testRepo.getRepoPath()
        const testRepoUrl = testRepo.getRepoUrl()

        try {
          // Add three vulnerable files (all uncommitted so they all get scanned)
          testRepo.addFile('file1.py', pyVulnerableFileContent)
          testRepo.addFile('file2.js', jsVulnerableFileContent)
          testRepo.addFile('file3.html', htmlVulnerableFileContent)
          await sleep(100)

          // Run scan to generate fixes for all files
          const scanResult = await mcpClient.callTool<CallToolResult>(
            MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
            { path: testRepoPath }
          )
          expect(scanResult).toBeDefined()

          // Poll for report to be available in backend (up to 60 seconds)
          const gqlClient = new GQLClient({
            token,
            type: 'token',
          })

          let reports: Awaited<
            ReturnType<typeof gqlClient.getFixReportsByRepoUrl>
          > | null = null
          const pollStartTime = Date.now()
          const pollTimeout = 60000 // 60 seconds

          while (Date.now() - pollStartTime < pollTimeout) {
            reports = await gqlClient.getFixReportsByRepoUrl({
              repoUrl: testRepoUrl,
            })
            if (
              reports.fixReport.length > 0 &&
              reports.fixReport[0]?.state === 'Finished'
            ) {
              break
            }
            await sleep(2000) // Wait 2 seconds between polls
          }

          expect(reports).toBeDefined()
          expect(reports!.fixReport.length).toBeGreaterThan(0)
          expect(reports!.fixReport[0]?.state).toBe('Finished')

          const reportId = reports!.fixReport[0]!.id

          // Test file filtering using McpGQLClient directly (bypasses MCP scan source filter)
          const mcpGqlClient = new McpGQLClient({
            token,
            type: 'token',
          })

          // 1. Get ALL fixes (no filter) - establish baseline
          const allFixesResult = await mcpGqlClient.getReportFixesPaginated({
            reportId,
            limit: 10,
            offset: 0,
          })

          expect(allFixesResult).toBeDefined()
          expect(allFixesResult!.fixes).toBeDefined()
          expect(allFixesResult!.fixes.length).toBeGreaterThan(0)

          // 2. Get fixes filtered by specific file only (use relative paths)
          const file1FixesResult = await mcpGqlClient.getReportFixesPaginated({
            reportId,
            fileFilter: ['file1.py'],
            limit: 10,
            offset: 0,
          })

          expect(file1FixesResult).toBeDefined()
          expect(file1FixesResult!.fixes).toBeDefined()
          expect(file1FixesResult!.fixes.length).toBeGreaterThan(0)

          // 3. Get fixes filtered by two files
          const file12FixesResult = await mcpGqlClient.getReportFixesPaginated({
            reportId,
            fileFilter: ['file1.py', 'file2.js'],
            limit: 10,
            offset: 0,
          })

          expect(file12FixesResult).toBeDefined()
          expect(file12FixesResult!.fixes).toBeDefined()
          expect(file12FixesResult!.fixes.length).toBeGreaterThan(0)

          // Verify that:
          // - Filtering by 1 file returns fewer or equal fixes than no filter
          // - Filtering by 2 files returns more or equal fixes than filtering by 1 file
          expect(file1FixesResult!.fixes.length).toBeLessThanOrEqual(
            allFixesResult!.fixes.length
          )
          expect(file12FixesResult!.fixes.length).toBeGreaterThanOrEqual(
            file1FixesResult!.fixes.length
          )
        } finally {
          testRepo.cleanupAll()
        }
      }, 180000)
    })
  })

  describe(`${MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES} tool`, () => {
    // --------------------- Shared helper utilities --------------------- //
    /**
     * Assert that the first call returns the "initial scan in progress" prompt
     * and return that response.
     */
    const expectInitialScanPrompt = async (
      client: InlineMCPClient,
      repoPath: string
    ) => {
      const firstResponse = await client.callTool<CallToolResult>(
        MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
        { path: repoPath }
      )

      expect(firstResponse).toStrictEqual({
        content: [
          {
            text: initialScanInProgressPrompt,
            type: 'text',
          },
        ],
      })

      return firstResponse
    }

    /**
     * Polls until scan completes, returning the first response that is **not**
     * the "initial scan in progress" prompt.
     */
    const waitForScanCompletion = async (
      client: InlineMCPClient,
      repoPath: string,
      timeoutMs: number = 180000 // 3 minutes timeout
    ) => {
      let response = await expectInitialScanPrompt(client, repoPath)

      const start = Date.now()
      console.log('waiting for initial scan to complete')
      while (response!.content![0]!.text === initialScanInProgressPrompt) {
        // Check for timeout
        if (Date.now() - start > timeoutMs) {
          throw new Error(`Scan completion timeout after ${timeoutMs}ms`)
        }

        // Log polling status for debugging during tests
        await sleep(1000)
        response = await client.callTool<CallToolResult>(
          MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
          { path: repoPath }
        )
      }
      const end = Date.now()
      console.log(
        'initial scan completed after',
        Math.round((end - start) / 1000),
        'seconds'
      )
      console.log(
        'initial scan completed with',
        (response!.content![0]!.text as string).substring(0, 100)
      )
      return response
    }

    const expectNoFreshFixes = async () => {
      const res = await mcpClient.callTool<CallToolResult>(
        MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
        { path: activeRepoPath }
      )
      expect(res!.content![0]!.text).toBe(noFreshFixesPrompt)
    }

    const expectSingleFix = async (timeout = 60000, interval = 50) => {
      const start = Date.now()
      let lastError: unknown

      while (Date.now() - start < timeout) {
        try {
          const res = await mcpClient.callTool<CallToolResult>(
            MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
            { path: activeRepoPath }
          )
          expect(res!.content![0]!.text).toContain('## Fix 1:')
          expect(res!.content![0]!.text).not.toContain('## Fix 2:')
          return // success
        } catch (err) {
          lastError = err
        }

        // wait before next attempt
        // Sequential polling is intentional - we need to check status in order
        await sleep(interval)
      }

      // timeout exceeded
      throw lastError instanceof Error
        ? lastError
        : new Error(`expectSingleFix: condition not met within ${timeout}ms`)
    }

    it('should run the initial full scan', async () => {
      const testRepo = createFreshRepo('git')
      const testRepoPath = testRepo.getRepoPath()
      const testRepoUrl = testRepo.getRepoUrl()

      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      process.env['MVS_AUTO_FIX'] = 'false'
      process.env['WORKSPACE_FOLDER_PATHS'] = testRepoPath
      await replaceMcpClient(new InlineMCPClient(createMcpServer()))
      await mcpClient.listTools()

      await expectLoggerMessage(logs, 'Triggering initial full security scan')
      await expectLoggerMessage(logs, 'Security fixes retrieved')
      await expectLoggerMessage(logs, 'Full scan completed', {
        path: testRepoPath,
      })

      const reports = await gqlClient.getFixReportsByRepoUrl({
        repoUrl: testRepoUrl,
      })
      expect(reports.fixReport.length).toBe(2)
      expect(reports.fixReport[0]?.state).toBe('Finished')
      expect(reports.fixReport[1]?.state).toBe('Finished')
      await mcpClient.listTools()
      await sleep(5000)
      const reports2 = await gqlClient.getFixReportsByRepoUrl({
        repoUrl: testRepoUrl,
      })
      expect(reports2.fixReport.length).toBe(2)
      expect(reports2.fixReport[0]?.state).toBe('Finished')
      expect(reports2.fixReport[1]?.state).toBe('Finished')
      delete process.env['WORKSPACE_FOLDER_PATHS']

      // Cleanup test repository
      testRepo.cleanupAll()
    }, 120000)

    it('should handle missing path parameter', async () => {
      process.env['MVS_AUTO_FIX'] = 'false'
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
          {}
        )
      ).rejects.toThrow("Invalid arguments: Missing required parameter 'path'")
    })
    it('should handle non-existent path', async () => {
      await expect(
        mcpClient.callTool<CallToolResult>(
          MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
          {
            path: nonExistentPath,
          }
        )
      ).rejects.toThrow(
        'Invalid path: potential security risk detected in path'
      )
    })

    it('no initial fixes', async () => {
      process.env['MVS_AUTO_FIX'] = 'false'
      activeRepo.updateFileContent(0, benignFileContent)
      activeRepo.updateFileContent(1, benignFileContent)
      activeRepo.updateFileContent(2, benignFileContent)
      await replaceMcpClient(new InlineMCPClient(createMcpServer()))

      await waitForScanCompletion(mcpClient, activeRepoPath)

      // After initial scan, there should be no fresh fixes
      await expectNoFreshFixes()
    }, 200000)

    it('should return 3 initial fixes in 1 batch', async () => {
      process.env['MVS_AUTO_FIX'] = 'false'
      await replaceMcpClient(new InlineMCPClient(createMcpServer()))
      activeRepo.updateFileContent(0, vulnerableFileContent)
      activeRepo.updateFileContent(1, vulnerableFileContent)
      activeRepo.updateFileContent(2, vulnerableFileContent)

      const firstFixesRes = await waitForScanCompletion(
        mcpClient,
        activeRepoPath
      )

      console.log('initial scan complete, fetching fixes')
      expect(firstFixesRes!.content![0]!.text).toContain('## Fix 3:')

      await expectNoFreshFixes()
    }, 200000)

    it('should return 4 initial fixes in 2 batches', async () => {
      process.env['MVS_AUTO_FIX'] = 'false'
      await replaceMcpClient(new InlineMCPClient(createMcpServer()))
      activeRepo.updateFileContent(0, vulnerableFileContent)
      activeRepo.updateFileContent(1, vulnerableFileContent)
      activeRepo.updateFileContent(2, multipleVulnerableFileContent)

      const firstFixesRes = await waitForScanCompletion(
        mcpClient,
        activeRepoPath
      )

      expect(firstFixesRes!.content![0]!.text).toContain('## Fix 3:')

      await expectSingleFix()

      await expectNoFreshFixes()
    }, 200000)

    it('should detect new fixes introduced after initial scan', async () => {
      process.env['MVS_AUTO_FIX'] = 'false'
      activeRepo.updateFileContent(0, benignFileContent)
      activeRepo.updateFileContent(1, benignFileContent)
      activeRepo.updateFileContent(2, benignFileContent)

      // Mock setInterval before creating the MCP client
      const originalSetInterval = global.setInterval
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let intervalCallback: any = null

      global.setInterval = vi.fn().mockImplementation((callback, _interval) => {
        // Store the callback but don't automatically schedule it
        intervalCallback = callback
        return 123 as unknown as NodeJS.Timeout // Return a dummy timer ID
      })

      await replaceMcpClient(new InlineMCPClient(createMcpServer()))

      await waitForScanCompletion(mcpClient, activeRepoPath)

      // After initial scan, there should be no fresh fixes
      await expectNoFreshFixes()

      // Update content to vulnerable and manually trigger the periodic scan
      activeRepo.updateFileContent(0, vulnerableFileContent)

      // Instead of advancing timers, manually invoke the callback once
      if (intervalCallback) {
        intervalCallback()
      }

      await expectSingleFix()
      await expectNoFreshFixes()

      // Restore the original setInterval
      global.setInterval = originalSetInterval
    }, 200000)

    it('should not report new fixes that moved', async () => {
      process.env['MVS_AUTO_FIX'] = 'false'
      activeRepo.updateFileContent(0, benignFileContent)
      activeRepo.updateFileContent(1, benignFileContent)
      activeRepo.updateFileContent(2, benignFileContent)

      // Mock setInterval before creating the MCP client
      const originalSetInterval = global.setInterval
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let intervalCallback: any = null

      global.setInterval = vi.fn().mockImplementation((callback, _interval) => {
        // Store the callback but don't automatically schedule it
        intervalCallback = callback
        return 123 as unknown as NodeJS.Timeout // Return a dummy timer ID
      })
      await replaceMcpClient(new InlineMCPClient(createMcpServer()))

      await waitForScanCompletion(mcpClient, activeRepoPath)

      // After initial scan, there should be no fresh fixes
      await expectNoFreshFixes()

      activeRepo.updateFileContent(0, vulnerableFileContent)

      // Instead of advancing timers, manually invoke the callback once
      if (intervalCallback) {
        intervalCallback()
      }

      await expectSingleFix()
      await expectNoFreshFixes()

      activeRepo.updateFileContent(
        0,
        `

        ${vulnerableFileContent}`
      )

      // Trigger second scan manually
      if (intervalCallback) {
        intervalCallback()
      }

      await sleep(3000)
      await expectNoFreshFixes()

      // Restore the original setInterval
      global.setInterval = originalSetInterval
    }, 200000)

    describe('MVS_AUTO_FIX Integration Tests', () => {
      beforeEach(() => {
        // Reset environment and logs for each test
        process.env['MVS_AUTO_FIX'] = 'true'
        logs = []
      })

      afterEach(() => {
        delete process.env['MVS_AUTO_FIX']
      })

      it('should apply fixes to multiple files with different comment styles', async () => {
        process.env['MVS_AUTO_FIX'] = 'true'

        const testRepo = new ActiveGitRepo()
        const testRepoPath = testRepo.getRepoPath()

        testRepo.addFile('vulnerable.js', jsVulnerableFileContent)
        testRepo.addFile('vulnerable.py', pyVulnerableFileContent)
        testRepo.addFile('vulnerable.html', htmlVulnerableFileContent)

        /// uncomment after server fix of irrelevant detection
        testRepo.addFile('__tests__/vulnerable.js', jsVulnerableFileContent)

        try {
          process.env['WORKSPACE_FOLDER_PATHS'] = testRepoPath
          await replaceMcpClient(new InlineMCPClient(createMcpServer()))

          const scanResult = await waitForScanCompletion(
            mcpClient,
            testRepoPath
          )
          const firstContent = scanResult.content[0]

          expect(firstContent).toBeDefined()
          expect((firstContent?.text as string).length).toBeGreaterThan(0)

          await expectLoggerMessage(logs, 'Successfully auto-applied')

          await expectLoggerMessage(logs, 'MVS_AUTO_FIX override')

          await expectLoggerMessage(logs, 'mvs_auto_fix setting: true')
          /// uncomment after server fix of irrelevant detection
          // await expectLoggerMessage(logs, 'MVS_AUTO_FIX filtering completed')

          // await expectLoggerMessage(logs, 'Fix.*filtered out')

          const autoApplicationLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              (log.message.includes('Successfully auto-applied') ||
                log.message.includes('Auto-applying fix'))
          )
          expect(autoApplicationLogs.length).toBeGreaterThan(0)

          const commentLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes('Debug mode: Adding fix comment')
          )
          expect(commentLogs.length).toBeGreaterThan(0)

          const jsFilePath = join(testRepoPath, 'vulnerable.js')
          const pyFilePath = join(testRepoPath, 'vulnerable.py')
          const htmlFilePath = join(testRepoPath, 'vulnerable.html')

          const jsContent = readFileSync(jsFilePath, 'utf8')
          const pyContent = readFileSync(pyFilePath, 'utf8')
          const htmlContent = readFileSync(htmlFilePath, 'utf8')

          const hasJsComment = jsContent.includes(
            '// Mobb security fix applied'
          )
          const hasPyComment = pyContent.includes('# Mobb security fix applied')

          const jsAndPyPatched = hasJsComment && hasPyComment
          expect(jsAndPyPatched).toBe(true)

          expect(htmlContent).toContain('Mobb security fix applied')

          expect(hasJsComment).toBe(true)

          expect(hasPyComment).toBe(true)

          /// uncomment after server fix of irrelevant detection
          // const testFilePath = join(testRepoPath, '__tests__/vulnerable.js')
          // const testFileContent = readFileSync(testFilePath, 'utf8')
          // console.log(
          // )
          // const hasTestFileComment = testFileContent.includes(
          //   '# Mobb security fix applied'
          // )
          // expect(hasTestFileComment).toBe(false)

          // expect(testFileContent).toBe(pyVulnerableFileContent)

          // console.log(
          // )
          // const patchApplicationLogs = logs.filter(
          //   (log) =>
          //     typeof log.message === 'string' &&
          //     log.message.includes('Successfully applied fix')
          // )
          // expect(patchApplicationLogs.length).toBe(3)

          expect(firstContent?.text).toContain('fix')

          expect(firstContent?.text).toContain('vulnerability')
        } finally {
          delete process.env['WORKSPACE_FOLDER_PATHS']
          testRepo.cleanupAll()
        }
      }, 200000)

      it('should NOT auto-apply fixes when files are modified after scan starts', async () => {
        process.env['MVS_AUTO_FIX'] = 'true'

        const testRepo = new ActiveGitRepo()
        const testRepoPath = testRepo.getRepoPath()
        testRepo.addFile('vulnerable.js', jsVulnerableFileContent)
        const jsFilePath = join(testRepoPath, 'vulnerable.js')

        try {
          process.env['WORKSPACE_FOLDER_PATHS'] = testRepoPath
          await replaceMcpClient(new InlineMCPClient(createMcpServer()))

          // Modify file timestamp to simulate file modification during scan
          const currentTime = Date.now()
          const fifteenSecondsFromNow = currentTime + 15 * 1000
          await fs.utimes(
            jsFilePath,
            fifteenSecondsFromNow / 1000,
            fifteenSecondsFromNow / 1000
          )

          const scanResult = await waitForScanCompletion(
            mcpClient,
            testRepoPath
          )

          const secondTestContent = scanResult.content[0]
          expect(secondTestContent).toBeDefined()

          const discardedFixesLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes('Discarded') &&
              log.message.includes('fixes due to file modifications after scan')
          )
          expect(discardedFixesLogs.length).toBeGreaterThan(0)

          const appliedFixLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes('Successfully applied fix')
          )
          expect(appliedFixLogs.length).toBe(0)

          const finalContent = readFileSync(jsFilePath, 'utf8')
          expect(finalContent).not.toContain('Mobb security fix applied')

          expect(secondTestContent?.text).toContain(
            'MOBB AUTO-FIX MONITORING ACTIVE'
          )
        } finally {
          delete process.env['WORKSPACE_FOLDER_PATHS']
          testRepo.cleanupAll()
        }
      }, 200000)

      it('should NOT auto-apply fixes when files have already been patched', async () => {
        process.env['MVS_AUTO_FIX'] = 'true'

        const testRepo = new ActiveGitRepo()
        const testRepoPath = testRepo.getRepoPath()

        testRepo.addFile('vulnerable.js', jsVulnerableFileContent)
        const originalSetInterval = global.setInterval

        try {
          process.env['WORKSPACE_FOLDER_PATHS'] = testRepoPath
          await replaceMcpClient(new InlineMCPClient(createMcpServer()))

          const scanResult = await waitForScanCompletion(
            mcpClient,
            testRepoPath
          )
          const firstContent = scanResult.content[0]

          expect(firstContent).toBeDefined()
          expect((firstContent?.text as string).length).toBeGreaterThan(0)

          await expectLoggerMessage(logs, 'Successfully auto-applied')

          await expectLoggerMessage(logs, 'MVS_AUTO_FIX override')

          await expectLoggerMessage(logs, 'mvs_auto_fix setting: true')

          const autoApplicationLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              (log.message.includes('Successfully auto-applied') ||
                log.message.includes('Auto-applying fix'))
          )
          expect(autoApplicationLogs.length).toBeGreaterThan(0)

          const commentLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes('Debug mode: Adding fix comment')
          )
          expect(commentLogs.length).toBeGreaterThan(0)

          const jsFilePath = join(testRepoPath, 'vulnerable.js')

          const jsContent = readFileSync(jsFilePath, 'utf8')

          const hasJsComment = jsContent.includes(
            '// Mobb security fix applied'
          )

          expect(hasJsComment).toBe(true)

          testRepo.updateFile('vulnerable.js', jsVulnerableFileContent)

          await replaceMcpClient(new InlineMCPClient(createMcpServer()))

          await waitForScanCompletion(mcpClient, testRepoPath)

          // Assert file was NOT patched the second time
          const jsFilePathAfterSecondScan = join(testRepoPath, 'vulnerable.js')
          const jsContentAfterSecondScan = readFileSync(
            jsFilePathAfterSecondScan,
            'utf8'
          )

          expect(jsContentAfterSecondScan).toBe(jsVulnerableFileContent)
          expect(jsContentAfterSecondScan).not.toContain(
            '// Mobb security fix applied'
          )

          // Assert filter logs from filterFixesForMvsAutoFix - specific filtering reason
          const filterLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes(
                'filtered out - has AUTO_MVS download source'
              )
          )

          expect(filterLogs.length).toBeGreaterThan(0)

          // Also check for the completion log
          const completionLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes('MVS_AUTO_FIX filtering completed')
          )

          expect(completionLogs.length).toBeGreaterThan(0)
        } finally {
          // Restore the original setInterval
          global.setInterval = originalSetInterval
          delete process.env['WORKSPACE_FOLDER_PATHS']
          testRepo.cleanupAll()
        }
      }, 200000)

      it('should apply only one fix when multiple fixes target the same file', async () => {
        process.env['MVS_AUTO_FIX'] = 'true'

        const testRepo = new ActiveGitRepo()
        const testRepoPath = testRepo.getRepoPath()
        testRepo.addFile('multi-vuln.py', multiVulnerableFileContent)
        const multiVulnFilePath = join(testRepoPath, 'multi-vuln.py')

        await sleep(1000)

        try {
          process.env['WORKSPACE_FOLDER_PATHS'] = testRepoPath
          await replaceMcpClient(new InlineMCPClient(createMcpServer()))

          const scanResult = await waitForScanCompletion(
            mcpClient,
            testRepoPath
          )
          const thirdTestContent = scanResult.content[0]

          expect(thirdTestContent).toBeDefined()
          expect(typeof thirdTestContent?.text).toBe('string')
          expect((thirdTestContent?.text as string).length).toBeGreaterThan(0)

          await expectLoggerMessage(
            logs,
            'Executing tool: check_for_new_available_fixes'
          )

          await expectLoggerMessage(logs, 'Starting patch application')

          await expectLoggerMessage(logs, 'Grouped fixes')

          await expectLoggerMessage(logs, 'Attempting fix')

          await expectLoggerMessage(logs, 'Successfully applied fix')

          await expectLoggerMessage(logs, 'check_for_new_available_fixes')

          const appliedFixesLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes('Successfully applied fix')
          )
          const attemptingFixLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes('Attempting fix')
          )
          const groupedFixesLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              log.message.includes('Grouped fixes')
          )

          expect(groupedFixesLogs.length).toBeGreaterThan(0)

          expect(attemptingFixLogs.length).toBeGreaterThan(0)

          expect(appliedFixesLogs.length).toBeGreaterThan(0)

          await expectLoggerMessage(
            logs,
            'fixes skipped because other fixes were successfully applied'
          )

          const finalContent = readFileSync(multiVulnFilePath, 'utf8')
          const fixComments = (
            finalContent.match(/# Mobb security fix applied/g) || []
          ).length
          expect(fixComments).toBeLessThanOrEqual(1)

          const originalContent = multiVulnerableFileContent
          const contentChanged = finalContent !== originalContent
          const fixCommentPresent = finalContent.includes(
            '# Mobb security fix applied'
          )
          const sqlInjectionFixed =
            !finalContent.includes('" + user_id') ||
            finalContent.includes('parameterized') ||
            finalContent.includes('prepared')
          const cmdInjection1Fixed =
            !finalContent.includes('shell=True') ||
            finalContent.includes('shell=False')
          const cmdInjection2Fixed =
            !finalContent.includes('subprocess.run(delete_cmd, shell=True)') ||
            finalContent.includes('shell=False')

          const hasVulnFix =
            contentChanged ||
            fixCommentPresent ||
            sqlInjectionFixed ||
            cmdInjection1Fixed ||
            cmdInjection2Fixed
          expect(hasVulnFix).toBe(true)

          expect(thirdTestContent?.text).toContain('fix')

          expect(thirdTestContent?.text).toContain('vulnerability')

          const successPattern = /success|applied|fixed|complete/
          expect((thirdTestContent?.text as string).toLowerCase()).toMatch(
            successPattern
          )
        } finally {
          delete process.env['WORKSPACE_FOLDER_PATHS']
          testRepo.cleanupAll()
        }
      }, 200000)

      it('should ONLY auto-apply fixes to uncommitted files (git status filtering)', async () => {
        process.env['MVS_AUTO_FIX'] = 'true'

        const testRepo = new ActiveGitRepo()
        const testRepoPath = testRepo.getRepoPath()

        try {
          // Add and commit two vulnerable files
          testRepo.addFile('committed1.py', pyVulnerableFileContent)
          testRepo.addFile('committed2.js', jsVulnerableFileContent)
          await sleep(100)
          await testRepo.commitFiles(['committed1.py', 'committed2.js'])
          await sleep(100)

          // Add uncommitted vulnerable files
          testRepo.addFile('uncommitted1.html', htmlVulnerableFileContent)
          testRepo.addFile('uncommitted2.py', pyVulnerableFileContent)
          await sleep(100)

          process.env['WORKSPACE_FOLDER_PATHS'] = testRepoPath
          await replaceMcpClient(new InlineMCPClient(createMcpServer()))

          const scanResult = await waitForScanCompletion(
            mcpClient,
            testRepoPath
          )

          expect(scanResult.content[0]).toBeDefined()

          // Check file contents - committed files should NOT be patched
          const committed1Path = join(testRepoPath, 'committed1.py')
          const committed2Path = join(testRepoPath, 'committed2.js')
          const uncommitted1Path = join(testRepoPath, 'uncommitted1.html')
          const uncommitted2Path = join(testRepoPath, 'uncommitted2.py')

          const committed1Content = readFileSync(committed1Path, 'utf8')
          const committed2Content = readFileSync(committed2Path, 'utf8')
          const uncommitted1Content = readFileSync(uncommitted1Path, 'utf8')
          const uncommitted2Content = readFileSync(uncommitted2Path, 'utf8')

          // Committed files should NOT have security fix comments
          expect(committed1Content).not.toContain('Mobb security fix applied')
          expect(committed2Content).not.toContain('Mobb security fix applied')

          // Committed files should still have original vulnerable content
          expect(committed1Content).toBe(pyVulnerableFileContent)
          expect(committed2Content).toBe(jsVulnerableFileContent)

          // Uncommitted files SHOULD have security fix comments
          expect(uncommitted1Content).toContain('Mobb security fix applied')
          expect(uncommitted2Content).toContain('Mobb security fix applied')

          // Verify uncommitted files were actually modified (not just original content)
          expect(uncommitted1Content).not.toBe(htmlVulnerableFileContent)
          expect(uncommitted2Content).not.toBe(pyVulnerableFileContent)

          // Verify logs show auto-fix was applied
          await expectLoggerMessage(logs, 'Successfully auto-applied')

          // Verify the fix application was selective
          const appliedFixLogs = logs.filter(
            (log) =>
              typeof log.message === 'string' &&
              (log.message.includes('Successfully auto-applied') ||
                log.message.includes('Successfully applied fix'))
          )
          expect(appliedFixLogs.length).toBeGreaterThan(0)
        } finally {
          delete process.env['WORKSPACE_FOLDER_PATHS']
          testRepo.cleanupAll()
        }
      }, 200000)
    })
  })

  describe('MCP Prompts Integration', () => {
    describe('list_prompts handler', () => {
      it('should list all 6 registered prompts', async () => {
        const response = await mcpClient.listPrompts()

        expect(response).toBeDefined()
        expect(response.prompts).toBeDefined()
        expect(response.prompts.length).toBe(6)
      })

      it('should return correct metadata for each prompt', async () => {
        const response = await mcpClient.listPrompts()

        const promptNames = response.prompts.map((p) => p.name)
        expect(promptNames).toContain('security-tools-overview')
        expect(promptNames).toContain('scan-repository')
        expect(promptNames).toContain('scan-recent-changes')
        expect(promptNames).toContain('check-for-new-vulnerabilities')
        expect(promptNames).toContain('review-and-fix-critical')
        expect(promptNames).toContain('full-security-audit')

        // Check that each prompt has required fields
        response.prompts.forEach((prompt) => {
          expect(prompt).toHaveProperty('name')
          expect(prompt).toHaveProperty('description')
          expect(typeof prompt.name).toBe('string')
          expect(typeof prompt.description).toBe('string')
        })
      })

      it('should include argument schemas in response', async () => {
        const response = await mcpClient.listPrompts()

        const scanRepoPrompt = response.prompts.find(
          (p) => p.name === 'scan-repository'
        )
        expect(scanRepoPrompt).toBeDefined()
        expect(scanRepoPrompt?.arguments).toBeDefined()
        expect(Array.isArray(scanRepoPrompt?.arguments)).toBe(true)
        expect(scanRepoPrompt?.arguments?.length).toBeGreaterThan(0)
      })

      it('should match snapshot of list_prompts response', async () => {
        const response = await mcpClient.listPrompts()

        expect(response).toMatchSnapshot('list-prompts-response')
      })
    })

    describe('get_prompt handler', () => {
      it('should execute SecurityToolsOverviewPrompt via MCP', async () => {
        const response = await mcpClient.getPrompt('security-tools-overview')

        expect(response).toBeDefined()
        expect(response.description).toBeDefined()
        expect(response.messages).toBeDefined()
        expect(response.messages.length).toBeGreaterThan(0)
        expect(response.messages[0]?.content.text).toContain(
          'Mobb Security Tools'
        )
      })

      it('should execute ScanRepositoryPrompt without path', async () => {
        const response = await mcpClient.getPrompt('scan-repository')

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(
          'Security Repository Scan'
        )
        expect(response.messages[0]?.content.text).toContain(
          'What is the full path'
        )
      })

      it('should execute ScanRepositoryPrompt with path', async () => {
        const testPath = '/test/repo/path'
        const response = await mcpClient.getPrompt('scan-repository', {
          path: testPath,
        })

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(testPath)
        expect(response.messages[0]?.content.text).toContain(
          'Repository path provided'
        )
      })

      it('should execute ScanRecentChangesPrompt without path', async () => {
        const response = await mcpClient.getPrompt('scan-recent-changes')

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(
          'Scan Recent Changes'
        )
      })

      it('should execute ScanRecentChangesPrompt with path', async () => {
        const testPath = '/test/repo/path'
        const response = await mcpClient.getPrompt('scan-recent-changes', {
          path: testPath,
        })

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(testPath)
      })

      it('should execute CheckForNewVulnerabilitiesPrompt without path', async () => {
        const response = await mcpClient.getPrompt(
          'check-for-new-vulnerabilities'
        )

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(
          'Continuous Security Monitoring'
        )
      })

      it('should execute CheckForNewVulnerabilitiesPrompt with path', async () => {
        const testPath = '/test/repo/path'
        const response = await mcpClient.getPrompt(
          'check-for-new-vulnerabilities',
          { path: testPath }
        )

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(testPath)
      })

      it('should execute ReviewAndFixCriticalPrompt without path', async () => {
        const response = await mcpClient.getPrompt('review-and-fix-critical')

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(
          'Critical Security Vulnerabilities'
        )
      })

      it('should execute ReviewAndFixCriticalPrompt with path', async () => {
        const testPath = '/test/repo/path'
        const response = await mcpClient.getPrompt('review-and-fix-critical', {
          path: testPath,
        })

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(testPath)
      })

      it('should execute FullSecurityAuditPrompt without path', async () => {
        const response = await mcpClient.getPrompt('full-security-audit')

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(
          'Complete Security Audit'
        )
      })

      it('should execute FullSecurityAuditPrompt with path', async () => {
        const testPath = '/test/repo/path'
        const response = await mcpClient.getPrompt('full-security-audit', {
          path: testPath,
        })

        expect(response).toBeDefined()
        expect(response.messages[0]?.content.text).toContain(testPath)
      })

      it('should validate arguments through MCP protocol', async () => {
        // Test with invalid argument type
        await expect(
          mcpClient.getPrompt('scan-repository', { path: 123 })
        ).rejects.toThrow()
      })

      it('should throw error for unknown prompt name', async () => {
        await expect(
          mcpClient.getPrompt('non-existent-prompt')
        ).rejects.toThrow()
      })

      it('should return GetPromptResult with correct structure', async () => {
        const response = await mcpClient.getPrompt('security-tools-overview')

        expect(response).toHaveProperty('description')
        expect(response).toHaveProperty('messages')
        expect(Array.isArray(response.messages)).toBe(true)
        expect(response.messages[0]).toHaveProperty('role', 'user')
        expect(response.messages[0]).toHaveProperty('content')
        expect(response.messages[0]?.content).toHaveProperty('type', 'text')
        expect(response.messages[0]?.content).toHaveProperty('text')
      })

      it('should verify path parameter affects output', async () => {
        const path1 = '/test/repo1'
        const path2 = '/test/repo2'

        const response1 = await mcpClient.getPrompt('scan-repository', {
          path: path1,
        })
        const response2 = await mcpClient.getPrompt('scan-repository', {
          path: path2,
        })

        expect(response1.messages[0]?.content.text).toContain(path1)
        expect(response1.messages[0]?.content.text).not.toContain(path2)
        expect(response2.messages[0]?.content.text).toContain(path2)
        expect(response2.messages[0]?.content.text).not.toContain(path1)
      })

      it('should handle all prompts with snapshots', async () => {
        const promptNames = [
          'security-tools-overview',
          'scan-repository',
          'scan-recent-changes',
          'check-for-new-vulnerabilities',
          'review-and-fix-critical',
          'full-security-audit',
        ]

        for (const promptName of promptNames) {
          const response = await mcpClient.getPrompt(promptName)
          expect(response).toMatchSnapshot(`get-prompt-${promptName}`)
        }
      })
    })
  })
})
