import { GQLClient } from '@mobb/bugsy/features/analysis/graphql'
import { createMcpServer } from '@mobb/bugsy/mcp'
import {
  initialScanInProgressPrompt,
  noFreshFixesPrompt,
} from '@mobb/bugsy/mcp/core/prompts'
import * as LoggerModule from '@mobb/bugsy/mcp/Logger'
import { sleep } from '@mobb/bugsy/utils'
import {
  CallToolResult,
  ListToolsResult,
} from '@modelcontextprotocol/sdk/types'
import { existsSync, mkdtempSync, rmSync } from 'fs'
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
  multupleVulnerableFileContent,
  vulnerableFileContent,
} from './mcp/helpers/fileContents'
import { InlineMCPClient } from './mcp/helpers/InlineMCPClient'
import { MockRepo } from './mcp/helpers/MockRepo'
import {
  ActiveGitRepo,
  EmptyGitRepo,
  NoChangesGitRepo,
  NonGitRepo,
} from './mcp/helpers/MockRepo'
import { expectLoggerMessage } from './mcp/helpers/testHelpers'

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
  let activeSecondRepoPath: string
  let activeNoChangesRepoPath: string
  let activeNonGitRepoPath: string
  let nonRepoEmptyPath: string

  let emptyRepo: MockRepo
  let activeRepo: MockRepo
  let activeSecondRepo: MockRepo
  let activeNoChangesRepo: MockRepo
  let nonGitRepo: MockRepo
  let logs: { message: string; data: unknown }[] = []

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
    activeSecondRepoPath = activeSecondRepo.getRepoPath()
    activeNoChangesRepoPath = activeNoChangesRepo.getRepoPath()
    activeNonGitRepoPath = nonGitRepo.getRepoPath()

    // Create a client connected to this process
    mcpClient = new InlineMCPClient(server)
  })

  beforeEach(() => {
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
  })

  afterEach((context) => {
    // Clear all mocks after each test
    vi.clearAllMocks()

    if (context.task.result?.state === 'fail') {
      console.log('---------------mcp logs-----------------')
      for (const log of logs) {
        console.log(log.message)
      }
      console.log('---------------end mcp logs-----------------')
    }
  })

  afterAll(async () => {
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
            text: 'No changed files found in the repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.',
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
            text: 'No changed files found in the repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.',
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
    })
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
            text: expect.stringContaining('MOBB SECURITY SCAN COMPLETED'),
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
      repoPath: string
    ) => {
      let response = await expectInitialScanPrompt(client, repoPath)

      const start = Date.now()
      console.log('waiting for initial scan to complete')
      while (response!.content![0]!.text === initialScanInProgressPrompt) {
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
      const gqlClient = new GQLClient({
        token,
        type: 'token',
      })
      process.env['WORKSPACE_FOLDER_PATHS'] = activeSecondRepoPath
      mcpClient = new InlineMCPClient(createMcpServer())
      await mcpClient.listTools()

      await expectLoggerMessage(logs, 'Triggering initial full security scan')
      await expectLoggerMessage(logs, 'Security fixes retrieved')
      await expectLoggerMessage(logs, 'Full scan completed', {
        path: activeSecondRepoPath,
      })

      const reports = await gqlClient.getFixReportsByRepoUrl({
        repoUrl: randomRepoUrl,
      })
      expect(reports.fixReport.length).toBe(2)
      expect(reports.fixReport[0]?.state).toBe('Finished')
      expect(reports.fixReport[1]?.state).toBe('Finished')
      await mcpClient.listTools()
      await sleep(5000)
      const reports2 = await gqlClient.getFixReportsByRepoUrl({
        repoUrl: randomRepoUrl,
      })
      expect(reports2.fixReport.length).toBe(2)
      expect(reports2.fixReport[0]?.state).toBe('Finished')
      expect(reports2.fixReport[1]?.state).toBe('Finished')
      delete process.env['WORKSPACE_FOLDER_PATHS']
    }, 200000)

    it('should handle missing path parameter', async () => {
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

    it('no inital fixes', async () => {
      activeRepo.updateFileContent(0, benignFileContent)
      activeRepo.updateFileContent(1, benignFileContent)
      activeRepo.updateFileContent(2, benignFileContent)
      mcpClient = new InlineMCPClient(createMcpServer())

      await waitForScanCompletion(mcpClient, activeRepoPath)

      // After initial scan, there should be no fresh fixes
      await expectNoFreshFixes()
    }, 200000)

    it('should return 3 inital fixes in 1 batch', async () => {
      mcpClient = new InlineMCPClient(createMcpServer())
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

    it('should return 4 inital fixes in 2 batches', async () => {
      mcpClient = new InlineMCPClient(createMcpServer())
      activeRepo.updateFileContent(0, vulnerableFileContent)
      activeRepo.updateFileContent(1, vulnerableFileContent)
      activeRepo.updateFileContent(2, multupleVulnerableFileContent)

      const firstFixesRes = await waitForScanCompletion(
        mcpClient,
        activeRepoPath
      )

      expect(firstFixesRes!.content![0]!.text).toContain('## Fix 3:')

      await expectSingleFix()

      await expectNoFreshFixes()
    }, 200000)

    it('should detect new fixes introduced after initial scan', async () => {
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

      mcpClient = new InlineMCPClient(createMcpServer())

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
      mcpClient = new InlineMCPClient(createMcpServer())

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
  })
})
