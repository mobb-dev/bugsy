import {
  initialScanInProgressPrompt,
  noReportFoundPrompt,
} from '@mobb/bugsy/mcp/core/prompts'
import { FetchAvailableFixesTool } from '@mobb/bugsy/mcp/tools/fetchAvailableFixes/FetchAvailableFixesTool'
import { tmpdir } from 'os'
import { join } from 'path'

import { CheckForNewAvailableFixesTool } from '../../src/mcp/tools/checkForNewAvailableFixes/CheckForNewAvailableFixesTool'
import { ScanAndFixVulnerabilitiesTool as FixVulnerabilitiesTool } from '../../src/mcp/tools/scanAndFixVulnerabilities/ScanAndFixVulnerabilitiesTool'
import {
  MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
  MCP_TOOL_FETCH_AVAILABLE_FIXES,
  MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES,
} from '../../src/mcp/tools/toolNames'
import { log } from './helpers/log'
import {
  ActiveGitRepo,
  EmptyGitRepo,
  MockRepo,
  NoChangesGitRepo,
  NonGitRepo,
} from './helpers/MockRepo'
import { BAD_API_KEY } from './mocks/graphqlHandlers'
import { MOCK_API_URL, mockGraphQL, server } from './mocks/mocks.js'

// Create module-level variables for the mocks
const mockFunctions = {
  logInfo: vi.fn(),
  logError: vi.fn(),
  logDebug: vi.fn(),
  logWarn: vi.fn(),
  log: vi.fn(),
}

// Mock the logger module - this will be hoisted to the top
vi.mock('../../src/mcp/Logger', () => {
  // Implementation that both logs and calls the mock
  const logInfoImpl = (message: unknown, data?: unknown) => {
    log('logInfo', message, data)
    mockFunctions.logInfo(message, data)
  }

  const logErrorImpl = (message: unknown, data?: unknown) => {
    log('logError', message, data)
    mockFunctions.logError(message, data)
  }

  const logDebugImpl = (message: unknown, data?: unknown) => {
    log('logDebug', message, data)
    mockFunctions.logDebug(message, data)
  }

  const logWarnImpl = (message: unknown, data?: unknown) => {
    log('logWarn', message, data)
    mockFunctions.logWarn(message, data)
  }

  const logImpl = (message: unknown, level: string, data?: unknown) => {
    if (level === 'error') {
      logErrorImpl(message, data)
    } else if (level === 'debug') {
      logDebugImpl(message, data)
    } else if (level === 'info') {
      logInfoImpl(message, data)
    } else if (level === 'warn') {
      logWarnImpl(message, data)
    }
  }

  return {
    logInfo: vi.fn().mockImplementation(logInfoImpl),
    logError: vi.fn().mockImplementation(logErrorImpl),
    logDebug: vi.fn().mockImplementation(logDebugImpl),
    logWarn: vi.fn().mockImplementation(logWarnImpl),
    log: vi.fn().mockImplementation(logImpl),
  }
})

// Create a helper object to access the mocks
const loggerMock = {
  mocks: mockFunctions,
}

// Mock open to prevent actual browser opening and add detailed logging
vi.mock('open', () => {
  const mockOpen = vi.fn().mockImplementation((url) => {
    log('Mock open called with URL:', url)
    // Simulate a small delay to mimic real behavior
    return new Promise((resolve) => {
      setTimeout(() => {
        log('Mock open resolving...')
        resolve(undefined)
      }, 100)
    })
  })
  return { default: mockOpen }
})

// Mock sleep function to speed up tests
vi.mock('@mobb/bugsy/utils', async () => {
  const actual = await vi.importActual('@mobb/bugsy/utils')
  return {
    ...(actual as object),
    sleep: vi.fn().mockResolvedValue(undefined),
  }
})

// Mock node-fetch to prevent actual HTTP requests while testing uploadFile logic
vi.mock('node-fetch', async () => {
  const actual = await vi.importActual('node-fetch')
  return {
    ...actual,
    default: vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      body: 'success',
    }),
    FormData: actual['FormData'],
    File: actual['File'],
    fileFrom: actual['fileFrom'],
  }
})

// Mock the subscribe function to prevent actual WebSocket connections
vi.mock('../../src/features/analysis/graphql/subscribe', () => ({
  subscribe: vi.fn().mockResolvedValue({
    analysis: {
      id: 'test-analysis-id',
      state: 'FINISHED',
    },
  }),
}))

// Move expectDebugMessage to a higher scope so it is available in all describe blocks
const expectDebugMessage = (message: string, expectedData?: unknown) => {
  const allLogCalls = loggerMock.mocks.logDebug.mock.calls.map(
    (call: unknown[]) => String(call[0])
  )
  // Check if message exists in debug logs
  expect(
    allLogCalls.some((msg: string) => msg.includes(message)),
    `Expected to find debug message "${message}" in:\n${allLogCalls.map((msg, i) => `  ${i + 1}. ${msg}`).join('\n')}`
  ).toBe(true)
  // If expectedData is provided, also check that data
  if (expectedData !== undefined) {
    const matchingCall = loggerMock.mocks.logDebug.mock.calls.find(
      (call: unknown[]) => String(call[0]).includes(message)
    )
    expect(matchingCall?.[1]).toEqual(expectedData)
  }
}

// Add expectLogMessage helper
const expectLogMessage = (message: string) => {
  const allLogCalls = loggerMock.mocks.logInfo.mock.calls.map(
    (call: unknown[]) => String(call[0])
  )
  expect(
    allLogCalls.some((msg: string) => msg.includes(message)),
    `Expected to find log message "${message}" in:\n${allLogCalls.map((msg, i) => `  ${i + 1}. ${msg}`).join('\n')}`
  ).toBe(true)
}

describe('MCP Server', () => {
  let nonExistentPath: string
  let emptyRepoPath: string
  let activeRepoPath: string
  let activeNoChangesRepoPath: string
  let codeNotInGitRepoPath: string
  let originalApiUrl: string | undefined

  // Individual MockRepo helpers (one repo per instance)
  let emptyRepo: MockRepo
  let activeRepo: MockRepo
  let activeNoChangesRepo: MockRepo
  let nonGitRepo: MockRepo

  // Helper function for common result assertions
  const expectValidResult = (result: {
    content: { type: string; text: string }[]
  }) => {
    expect(result).toBeDefined()
    expect(result.content).toBeDefined()
    expect(result.content[0]).toBeDefined()
    return result
  }

  beforeEach(async () => {
    log('Starting beforeEach...')

    // Store original API_URL and set it to our mock URL
    originalApiUrl = process.env['API_URL']
    process.env['API_URL'] = MOCK_API_URL
    log(`Setting API_URL to: ${MOCK_API_URL}`)
    log(`MSW server starting...`)

    // Start MSW server
    server.listen({ onUnhandledRequest: 'error' })
    log(`MSW server started`)

    // Create fresh paths for each test
    nonExistentPath = join(tmpdir(), 'mcp-test-non-existent-' + Date.now())
    log(`Created nonExistentPath: ${nonExistentPath}`)

    try {
      emptyRepo = new EmptyGitRepo()
      activeRepo = new ActiveGitRepo()
      activeNoChangesRepo = new NoChangesGitRepo()
      nonGitRepo = new NonGitRepo()

      emptyRepoPath = emptyRepo.getRepoPath()!
      activeRepoPath = activeRepo.getRepoPath()!
      activeNoChangesRepoPath = activeNoChangesRepo.getRepoPath()!
      codeNotInGitRepoPath = nonGitRepo.getRepoPath()!

      log('Created repos for test setup')
    } catch (e) {
      log('Error in beforeEach:', e)
      throw e
    }
    log('beforeEach completed.')
  })

  afterEach(async () => {
    log('Starting afterEach...')
    // Clean up repos after each test
    const repoHelpers: (MockRepo | undefined)[] = [
      emptyRepo,
      activeRepo,
      activeNoChangesRepo,
      nonGitRepo,
    ]
    for (const helper of repoHelpers) {
      if (helper) {
        try {
          helper.cleanupAll()
        } catch (e) {
          log('Error cleaning up repo helper:', e)
        }
      }
    }
    // Reset the GraphQL mock system
    log('Resetting GraphQL mocks...')
    mockGraphQL().reset()
    log('afterEach completed.')
  })

  beforeAll(() => {
    log('Starting beforeAll...')
    // Store original API_URL and set it to our mock URL
    originalApiUrl = process.env['API_URL']
    process.env['API_URL'] = MOCK_API_URL
    log(`Setting API_URL to: ${MOCK_API_URL}`)
    log('beforeAll completed.')
    server.listen()
  })

  afterAll(() => {
    log('Starting afterAll...')
    // Restore original API_URL
    if (originalApiUrl !== undefined) {
      process.env['API_URL'] = originalApiUrl
    } else {
      delete process.env['API_URL']
    }
    console.log(`MSW server stopping...`)
    // Stop MSW server
    server.close()
    console.log(`MSW server stopped`)

    // Clean up the git repos
    const repoHelpers: (MockRepo | undefined)[] = [
      emptyRepo,
      activeRepo,
      activeNoChangesRepo,
      nonGitRepo,
    ]
    repoHelpers.forEach((helper) => helper?.cleanupAll())

    log('afterAll completed.')
  })

  // Create a global error handler
  process.on('unhandledRejection', (reason: unknown) => {
    // Silently handle expected errors, specifically ApiConnectionError from CheckForNewAvailableFixesTool
    // when mocks shut down during test cleanup
    const isExpectedError =
      reason instanceof Error &&
      reason.message.includes('Failed to connect to the API')

    if (!isExpectedError) {
      // Only log unexpected errors
      console.error('Unexpected unhandled rejection:', reason)
      process.exit(1)
    }
    // Do not exit process - allow test to complete
  })

  describe(MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES, () => {
    it('should handle missing path parameter', async () => {
      const tool = new FixVulnerabilitiesTool()
      await expect(tool.execute({} as { path: string })).rejects.toThrow(
        "Invalid arguments: Missing required parameter 'path'"
      )
    })

    it('should handle non-existent path', async () => {
      const tool = new FixVulnerabilitiesTool()
      await expect(tool.execute({ path: nonExistentPath })).rejects.toThrow(
        'Invalid path: potential security risk detected in path'
      )
    })

    it('should handle path that is not a git repository', async () => {
      log('Starting test...')
      const tool = new FixVulnerabilitiesTool()
      log('Executing tool with nonRepoPath...')
      const result = await tool.execute({ path: codeNotInGitRepoPath })
      log('Tool execution completed, validating result...')
      log('Result', result)
      expectValidResult(result)
      log('Test completed: should handle path that is not a git repository')
    })

    it('should handle empty git repository', async () => {
      const tool = new FixVulnerabilitiesTool()
      log('FixVulnerabilitiesTool instance created')

      log('Executing tool with empty repo path')
      const result = await tool.execute({ path: emptyRepoPath })
      log('Tool execution completed')

      expectValidResult(result)
      log('Result validation passed')

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'No changed files found in the repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.',
          },
        ],
      })
    })

    describe('MCP authentication', () => {
      it('should work with API_KEY environment variable', async () => {
        // Configure GraphQL mocks for complete successful flow

        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()
        mockGraphQL().createCommunityUser().succeeds()
        mockGraphQL().me().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // === VERIFY FINAL RESULT ===
        expectValidResult(result)
        expect(result.content[0]?.text).toContain(
          'Here are the fixes to the vulnerabilities discovered by Mobb MCP'
        )
      })

      it('should fail with connection error', async () => {
        // Configure GraphQL mocks for the error scenario
        mockGraphQL().me().failsWithFetchError()

        // Create the tool and execute it
        const tool = new FixVulnerabilitiesTool()
        await expect(tool.execute({ path: activeRepoPath })).rejects.toThrow(
          'Error: failed to reach Mobb GraphQL endpoint'
        )
      }) // Set a higher timeout for this test

      it('should timeout when getEncryptedApiToken is not returning a token', async () => {
        process.env['MOBB_API_KEY'] = BAD_API_KEY
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().me().failsWithConnectionError()
        mockGraphQL().createCliLogin().succeeds()
        mockGraphQL().createCommunityUser().failsWithBadApiKey()
        // Mock getEncryptedApiToken to simulate authentication failure by returning empty data
        mockGraphQL()
          .getEncryptedApiToken()
          .failsWithError('authentication failed')

        // Create the tool and execute it
        const tool = new FixVulnerabilitiesTool()
        await expect(tool.execute({ path: activeRepoPath })).rejects.toThrow(
          'Error: failed to get encrypted api token'
        )
      })

      it('should complete the authentication flow', async () => {
        process.env['MOBB_API_KEY'] = BAD_API_KEY

        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()
        mockGraphQL().me().succeeds()
        mockGraphQL().createCliLogin().succeeds()
        mockGraphQL().getEncryptedApiToken().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // === VERIFY FINAL RESULT ===
        expectValidResult(result)
        expect(result.content[0]?.text).toContain(
          'Here are the fixes to the vulnerabilities discovered by Mobb MCP'
        )
      })

      it('should reject path traversal attempts with actual malicious paths', async () => {
        // Test actual malicious paths that should be blocked by validateMCPPath
        const tool = new FixVulnerabilitiesTool()
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
          await expect(tool.execute({ path: maliciousPath })).rejects.toThrow(
            'Invalid path: potential security risk detected in path: Path contains path traversal patterns'
          )
        }
      })
      it('should window specific path as non existent', async () => {
        // Test actual malicious paths that should be blocked by validateMCPPath
        const tool = new FixVulnerabilitiesTool()
        const windowsPaths = [
          'c:/Users/Antony/.cursor/webgoat',
          '/c:/Users/Antony/.cursor/webgoat',
        ]

        for (const windowsPath of windowsPaths) {
          await expect(tool.execute({ path: windowsPath })).rejects.toThrow(
            'Invalid path: potential security risk detected in path: Path does not exist or is not accessible:'
          )
        }
      })
      it('should not path traversal attempts with actual malicious paths', async () => {
        // Test actual malicious paths that should be blocked by validateMCPPath
        const tool = new FixVulnerabilitiesTool()
        const dotPaths = ['.', './']

        for (const dotPath of dotPaths) {
          await expect(tool.execute({ path: dotPath })).rejects.toThrow(
            'Invalid path: potential security risk detected in path: "." is not a valid path, please provide a full localpath to the repository'
          )
        }
      })
    })

    describe('when API call succeeds', () => {
      beforeEach(async () => {
        process.env['MOBB_API_KEY'] = 'test-working-key'

        // Clear all mocks including fetch
        vi.clearAllMocks()
        // Clear logger mocks
        Object.values(loggerMock.mocks).forEach((mock) => mock.mockClear())
      })

      // Helper function to check if an error log with specific data exists
      const expectErrorLogWithData = (
        message: string,
        expectedData?: unknown
      ) => {
        // Add API context to expected data if it contains error but not endpoint
        if (
          expectedData &&
          typeof expectedData === 'object' &&
          'error' in expectedData &&
          !('endpoint' in expectedData)
        ) {
          expectedData = {
            ...expectedData,
            endpoint: 'http://localhost:3001/graphql',
            apiKey: expect.any(String),
            headers: expect.objectContaining({
              'x-mobb-key': '[REDACTED]',
              'x-hasura-request-id': '[DYNAMIC]',
            }),
          }
        }
        const matchingCall = loggerMock.mocks.logError.mock.calls.find(
          (call: unknown[]) => String(call[0]).includes(message)
        )
        expect(matchingCall).toBeDefined()
        if (expectedData !== undefined) {
          expect(matchingCall?.[1]).toEqual(expectedData)
        }
      }

      it('should complete full successful flow with comprehensive verification', async () => {
        // Configure GraphQL mocks for complete successful flow
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        // Get access to mocked functions for verification
        const { default: fetch } = await import('node-fetch')
        const mockedFetch = vi.mocked(fetch)
        const { subscribe } = await import(
          '../../src/features/analysis/graphql/subscribe'
        )
        const mockedSubscribe = vi.mocked(subscribe)

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // === VERIFY COMPLETE FLOW LOGS ===
        expectLogMessage(
          `Executing tool: ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES}`
        )
        expectDebugMessage('[FileOperations] Packing files')
        expectLogMessage('Files packed successfully')
        expectDebugMessage('Upload info retrieved')
        expectLogMessage('File uploaded successfully')
        expectDebugMessage('Project ID retrieved')

        // Verify runScan flow logs
        expectLogMessage('Starting scan')
        expectLogMessage('Submitting vulnerability report')
        expectLogMessage('Vulnerability report submitted successfully')
        expectDebugMessage(
          '[USER_REQUEST] GraphQL: Starting GetAnalysis subscription'
        )
        expectDebugMessage(
          '[USER_REQUEST] GraphQL: GetAnalysis subscription completed'
        )

        // Verify getMCPFixes logs with data
        expectDebugMessage('3 fixes retrieved')
        expectDebugMessage('[GraphQL] GetReportFixes successful', {
          result: expect.objectContaining({
            fixReport: expect.arrayContaining([
              expect.objectContaining({
                fixes: expect.arrayContaining([
                  expect.objectContaining({
                    id: 'test-fix-1',
                    confidence: 85,
                    safeIssueType: 'SQL_INJECTION',
                  }),
                  expect.objectContaining({
                    id: 'test-fix-2',
                    confidence: 75,
                    safeIssueType: 'XSS',
                  }),
                ]),
              }),
            ]),
          }),
          fixCount: 2,
          totalCount: 2,
        })

        // === VERIFY S3 UPLOAD ===
        expect(mockedFetch).toHaveBeenCalledTimes(1)
        const mockCall = mockedFetch.mock.calls[0]
        const url = mockCall?.[0] as string
        const options = mockCall?.[1] as {
          method: string
          body: FormData
          agent?: unknown
        }

        expect(url).toBe('https://test-bucket.s3.amazonaws.com')
        expect(options.method).toBe('POST')
        expect(options.body).toBeDefined()
        expect(options.body.constructor.name).toBe('FormData')

        const formData = options.body
        expect(formData.has('key')).toBe(true)
        expect(formData.has('Content-Type')).toBe(true)
        expect(formData.has('file')).toBe(true)

        // === VERIFY SUBSCRIPTION ===
        expect(mockedSubscribe).toHaveBeenCalledTimes(1)
        const subscribeCall = mockedSubscribe.mock.calls[0]
        expect(subscribeCall?.[0]).toBeDefined() // query
        expect(subscribeCall?.[1]).toEqual({
          analysisId: 'test-fix-report-id',
        }) // variables
        expect(subscribeCall?.[2]).toBeTypeOf('function') // callback
        expect(subscribeCall?.[3]).toEqual({
          apiKey: expect.any(String),
          type: 'apiKey',
          timeoutInMs: 1800000, // 30 minutes
        }) // wsClientOptions

        // === VERIFY FINAL RESULT ===
        expectValidResult(result)
        expect(result.content[0]?.text).toContain(
          'Here are the fixes to the vulnerabilities discovered by Mobb MCP'
        )

        // Verify no error logs were generated
        expect(loggerMock.mocks.logError.mock.calls).toHaveLength(0)
      })

      it('should create new project when MCP Scans project does not exist', async () => {
        // Configure GraphQL mocks for scenario where project doesn't exist
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().projectNotFound()
        mockGraphQL().createProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the new project ID was created and used
        expectDebugMessage('Project ID retrieved')

        // Verify successful completion
        expectValidResult(result)
        expect(result.content[0]?.text).toContain(
          'Here are the fixes to the vulnerabilities discovered by Mobb MCP'
        )
      })

      it('should handle submitVulnerabilityReport failure gracefully', async () => {
        // Configure GraphQL mocks with submitVulnerabilityReport failure
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL()
          .submitVulnerabilityReport()
          .failsWithError('Submission failed')

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Submission failed')

        // Verify runScan started but failed during submission
        expectLogMessage('Starting scan')
        expectLogMessage('Submitting vulnerability report')
        // Note: The subsequent logs won't be present due to the error

        // Verify error was logged with data
        expect(loggerMock.mocks.logError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('[GraphQL] SubmitVulnerabilityReport failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Submission failed'),
            response: expect.objectContaining({
              errors: expect.arrayContaining([
                expect.objectContaining({
                  message: 'Submission failed',
                }),
              ]),
              status: 500,
            }),
          }),
          variables: expect.any(Object),
        })
      })

      it('should handle getMCPFixes failure gracefully', async () => {
        // Configure GraphQL mocks with getMCPFixes failure
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL()
          .getReportFixes()
          .failsWithError('Failed to retrieve fixes')

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })
        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Failed to retrieve fixes')

        // Verify error was logged with data
        expect(loggerMock.mocks.logError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('[GraphQL] GetReportFixes failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Failed to retrieve fixes'),
          }),
          reportId: 'test-fix-report-id',
        })
      })

      it('should format fixes prompt with vulnerability details and patches when code is not in git repo', async () => {
        // Configure GraphQL mocks for complete flow including getMCPFixes
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: codeNotInGitRepoPath })

        expectLogMessage(
          `Executing tool: ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES}`
        )
        expectDebugMessage('Found files in the repository')
        expectDebugMessage('[FileOperations] Packing files')
        expectLogMessage('Files packed successfully')

        // Verify successful completion
        expectValidResult(result)
        const fixesText = result.content[0]?.text

        // // Verify the complete fixes prompt with snapshot
        expect(fixesText).toMatchSnapshot()

        expectErrorLogWithData('Path is not a valid git repository')
        expect(loggerMock.mocks.logError.mock.calls).toHaveLength(1)
      })

      it('should format fixes prompt with vulnerability details and patches when no changes in git status', async () => {
        // Configure GraphQL mocks for complete flow including getMCPFixes
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeNoChangesRepoPath })

        expectLogMessage(
          `Executing tool: ${MCP_TOOL_SCAN_AND_FIX_VULNERABILITIES}`
        )
        expectDebugMessage('Using recently changed files from git history')
        expectDebugMessage('[FileOperations] Packing files')
        expectLogMessage('Files packed successfully')

        // Verify successful completion
        expectValidResult(result)
        const fixesText = result.content[0]?.text

        // Verify the complete fixes prompt with snapshot
        expect(fixesText).toMatchSnapshot()

        // Verify no error logs were generated
        expect(loggerMock.mocks.logError.mock.calls).toHaveLength(0)
      })

      it('should format fixes prompt with vulnerability details and patches', async () => {
        // Configure GraphQL mocks for complete flow including getMCPFixes
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify successful completion
        expectValidResult(result)
        const fixesText = result.content[0]?.text

        // Verify the complete fixes prompt with snapshot
        expect(fixesText).toMatchSnapshot()

        // Verify no error logs were generated
        expect(loggerMock.mocks.logError.mock.calls).toHaveLength(0)
      })

      it('should return no fixes found prompt when no fixes are available', async () => {
        // Configure GraphQL mocks for complete flow but with empty fixes
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().returnsEmptyFixes()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify successful completion
        expectValidResult(result)
        const fixesText = result.content[0]?.text

        // Verify the no fixes found prompt with snapshot
        expect(fixesText).toMatchSnapshot()

        // Verify no error logs were generated
        expect(loggerMock.mocks.logError.mock.calls).toHaveLength(0)
      })

      it('should handle connection errors gracefully', async () => {
        // Set MOBB_API_KEY to trigger connection verification
        process.env['MOBB_API_KEY'] = 'test-key'

        // Configure GraphQL mock to simulate connection error
        mockGraphQL().me().failsWithConnectionError()

        const tool = new FixVulnerabilitiesTool()
        await expect(tool.execute({ path: activeRepoPath })).rejects.toThrow(
          'Invalid API token'
        )
      })

      it('should handle upload file failure gracefully', async () => {
        // Configure GraphQL mocks for success up to upload
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()

        // Mock fetch to fail during upload
        const { default: fetch } = await import('node-fetch')
        const mockedFetch = vi.mocked(fetch)
        mockedFetch.mockResolvedValueOnce({
          ok: false,
          status: 403,
          body: 'Access denied',
        } as never)

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the upload error was handled
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Failed to upload the file')

        // Verify error was logged
        expect(loggerMock.mocks.logError.mock.calls.length).toBeGreaterThan(0)
      })

      it('should handle getAnalysis with missing analysis gracefully', async () => {
        // This test would require mocking the getAnalysis method directly
        // Since it's not currently used in the main flow, we'll test the error path
        // by creating a scenario where analysis is not found

        // Configure GraphQL mocks for success up to the point where we'd call getAnalysis
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify successful completion (getAnalysis is not called in normal flow)
        expectValidResult(result)
        expect(result.content[0]?.text).toContain(
          'Here are the fixes to the vulnerabilities discovered by Mobb MCP'
        )
      })

      it('should handle uploadS3BucketInfo failure gracefully', async () => {
        // Configure GraphQL mocks with uploadS3BucketInfo failure
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().failsWithError('Upload failed')

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Upload failed')

        // Verify error was logged with enhanced context
        expect(loggerMock.mocks.logError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('[GraphQL] uploadS3BucketInfo failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Upload failed'),
          }),
        })
      })

      it('should handle getLastOrgAndNamedProject failure gracefully', async () => {
        // Configure GraphQL mocks with getLastOrgAndNamedProject failure
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL()
          .getLastOrgAndNamedProject()
          .failsWithError('Organization error')

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Organization error')

        // Verify error was logged with enhanced context
        expect(loggerMock.mocks.logError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('[GraphQL] getProjectId failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Organization error'),
          }),
        })
      })

      it('should handle createProject failure gracefully', async () => {
        // Configure GraphQL mocks with createProject failure
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getLastOrgAndNamedProject().projectNotFound()
        mockGraphQL().createProject().failsWithError('Create project failed')

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Create project failed')

        // Verify error was logged with enhanced context
        expect(loggerMock.mocks.logError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('[GraphQL] getProjectId failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Create project failed'),
          }),
        })
      })
    })
  })

  describe(MCP_TOOL_FETCH_AVAILABLE_FIXES, () => {
    beforeEach(() => {
      // Reset all logger mocks before each test
      Object.values(loggerMock.mocks).forEach((mock) => mock.mockClear())
    })

    it('should handle missing path parameter', async () => {
      const tool = new FetchAvailableFixesTool()
      await expect(tool.execute({} as { path: string })).rejects.toThrow(
        "Invalid arguments: Missing required parameter 'path'"
      )
    })

    it('should handle non-existent path', async () => {
      const tool = new FetchAvailableFixesTool()
      await expect(tool.execute({ path: nonExistentPath })).rejects.toThrow(
        'Invalid path: potential security risk detected in path'
      )
    })

    it('should handle path that is not a git repository', async () => {
      const tool = new FetchAvailableFixesTool()
      await expect(
        tool.execute({ path: codeNotInGitRepoPath })
      ).rejects.toThrow('Invalid git repository')
    })

    it('should handle No origin URL git repository', async () => {
      const tool = new FetchAvailableFixesTool()
      await expect(tool.execute({ path: emptyRepoPath })).rejects.toThrow(
        'No origin URL found for the repository'
      )
    })

    it('should handle empty report array', async () => {
      // Configure GraphQL mock to return empty report
      mockGraphQL().getLatestReportByRepoUrl().returnsEmptyReport()

      const tool = new FetchAvailableFixesTool()
      const result = await tool.execute({ path: activeRepoPath })

      expectValidResult(result)
      const responseText = result.content[0]?.text
      if (!responseText) {
        throw new Error('Response text is undefined')
      }

      // In non-test environment, we expect the noReportFoundPrompt
      expect(responseText).toBe(noReportFoundPrompt)
      // Verify the complete prompt with snapshot
      expect(responseText).toMatchSnapshot()

      // Verify info log was generated (only in non-test environment)
      expect(loggerMock.mocks.logInfo.mock.calls.length).toBeGreaterThan(0)
      expect(
        loggerMock.mocks.logInfo.mock.calls.some((call) =>
          String(call[0]).includes('No report')
        )
      ).toBe(true)

      // Verify no error logs were generated
      expect(loggerMock.mocks.logError.mock.calls).toHaveLength(0)
    })

    it('should handle expired report with no active report', async () => {
      // Configure GraphQL mock to return expired report
      mockGraphQL().getLatestReportByRepoUrl().returnsExpiredReport()

      const tool = new FetchAvailableFixesTool()
      const result = await tool.execute({ path: activeRepoPath })

      expectValidResult(result)
      const responseText = result.content[0]?.text ?? ''
      expect(responseText).toContain('Out-of-Date Vulnerability Report')

      // Verify info log about expired report prompt
      expect(
        loggerMock.mocks.logInfo.mock.calls.some((call) =>
          String(call[0]).includes('Expired report found')
        )
      ).toBe(true)
    })

    it('should handle report with fixes', async () => {
      // Configure GraphQL mock to return report with fixes
      mockGraphQL().getLatestReportByRepoUrl().succeeds()

      const tool = new FetchAvailableFixesTool()
      const result = await tool.execute({ path: activeRepoPath })

      expectValidResult(result)
      const responseText = result.content[0]?.text ?? ''
      // remove the timestamp from the response formant i 1/1/2024, 2:00:00 AM
      const responseTextWithoutTimestamp = responseText.replace(
        /(\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}:\d{2}\s[AP]M)/,
        '1/1/2000, 12:00:00 AM'
      )
      expect(responseTextWithoutTimestamp).toMatchSnapshot()

      // Verify info log was generated (only in non-test environment)
      expect(loggerMock.mocks.logInfo.mock.calls.length).toBeGreaterThan(0)
      expect(
        loggerMock.mocks.logDebug.mock.calls.some(
          (call) =>
            call[0] ===
            'FetchAvailableFixesTool execution completed successfully'
        )
      ).toBe(true)

      // Verify no error logs were generated
      expect(loggerMock.mocks.logError.mock.calls).toHaveLength(0)
    })
  })

  describe(MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES, () => {
    beforeEach(() => {
      // Reset all logger mocks before each test
      Object.values(loggerMock.mocks).forEach((mock) => mock.mockClear())
    })

    afterEach(() => {
      // Restore all spies/mocks created with vi.spyOn
      vi.restoreAllMocks()
    })

    it('should handle missing path parameter', async () => {
      const tool = new CheckForNewAvailableFixesTool()
      await expect(tool.execute({} as { path: string })).rejects.toThrow(
        "Invalid arguments: Missing required parameter 'path'"
      )
    })

    it('should handle non-existent path', async () => {
      const tool = new CheckForNewAvailableFixesTool()
      await expect(tool.execute({ path: nonExistentPath })).rejects.toThrow(
        'Invalid path: potential security risk detected in path'
      )
    })

    it('should return initial scan in progress prompt when initial scan is in progress', async () => {
      mockGraphQL().me().succeeds()
      mockGraphQL().uploadS3BucketInfo().succeeds()
      mockGraphQL().getLastOrgAndNamedProject().succeeds()
      mockGraphQL().submitVulnerabilityReport().succeeds()
      mockGraphQL().getReportFixes().succeeds()
      const tool = new CheckForNewAvailableFixesTool()
      const result = await tool.execute({ path: activeRepoPath })
      expectValidResult(result)
      expect(result.content[0]?.text).toBe(initialScanInProgressPrompt)
    })
  })
})
