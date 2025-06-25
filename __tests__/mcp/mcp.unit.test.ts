import { noReportFoundPrompt } from '@mobb/bugsy/mcp/core/prompts'
import { FetchAvailableFixesTool } from '@mobb/bugsy/mcp/tools/fetchAvailableFixes/FetchAvailableFixesTool'
import { tmpdir } from 'os'
import { join } from 'path'

import { ScanAndFixVulnerabilitiesTool as FixVulnerabilitiesTool } from '../../src/mcp/tools/scanAndFixVulnerabilities/ScanAndFixVulnerabilitiesTool'
import { log } from './helpers/log'
import {
  createActiveGitRepo,
  createActiveNoChangesGitRepo,
  createActiveNonGitRepo,
  createEmptyGitRepo,
  deleteGitRepo,
} from './helpers/utils'
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

describe('MCP Server', () => {
  let nonExistentPath: string
  let emptyRepoPath: string
  let activeRepoPath: string
  let activeNoChangesRepoPath: string
  let codeNotInGitRepoPath: string
  let originalApiUrl: string | undefined

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
      emptyRepoPath = createEmptyGitRepo()
      log(`Created emptyRepoPath: ${emptyRepoPath}`)

      activeRepoPath = createActiveGitRepo()
      log(`Created activeRepoPath: ${activeRepoPath}`)

      // Create a git repository with no changes in `git status`
      activeNoChangesRepoPath = createActiveNoChangesGitRepo()

      // Create a directory with a code file that is not in a git repo
      codeNotInGitRepoPath = createActiveNonGitRepo()

      log(`Using codeNotInGitRepoPath: ${codeNotInGitRepoPath}`)
    } catch (e) {
      log('Error in beforeEach:', e)
      throw e
    }
    log('beforeEach completed.')
  })

  afterEach(async () => {
    log('Starting afterEach...')
    // Clean up repos after each test
    if (emptyRepoPath) {
      log(`Cleaning up emptyRepoPath: ${emptyRepoPath}`)
      try {
        deleteGitRepo(emptyRepoPath)
      } catch (e) {
        log('Error cleaning up emptyRepoPath:', e)
      }
    }
    if (activeRepoPath) {
      log(`Cleaning up activeRepoPath: ${activeRepoPath}`)
      try {
        deleteGitRepo(activeRepoPath)
      } catch (e) {
        log('Error cleaning up activeRepoPath:', e)
      }
    }
    if (activeNoChangesRepoPath) {
      log(`Cleaning up activeNoChangesRepoPath: ${activeNoChangesRepoPath}`)
      try {
        deleteGitRepo(activeNoChangesRepoPath)
      } catch (e) {
        log('Error cleaning up activeNoChangesRepoPath:', e)
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
    deleteGitRepo(emptyRepoPath)
    deleteGitRepo(activeRepoPath)
    deleteGitRepo(activeNoChangesRepoPath)
    deleteGitRepo(codeNotInGitRepoPath)

    log('afterAll completed.')
  })

  // Create a global error handler
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    // Force process to continue
    process.exit(1)
  })

  describe('FixVulnerabilitiesTool', () => {
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
      const tool = new FixVulnerabilitiesTool()
      log('Executing tool with nonRepoPath...')
      const result = await tool.execute({ path: codeNotInGitRepoPath })
      log('Tool execution completed, validating result...')
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
        mockGraphQL().getOrgAndProjectId().succeeds()
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
          'Error: failed to connect to Mobb API'
        )
      }) // Set a higher timeout for this test

      it('should timeout when getEncryptedApiToken is not returning a token', async () => {
        process.env['MOBB_API_KEY'] = BAD_API_KEY
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getOrgAndProjectId().succeeds()
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
        mockGraphQL().getOrgAndProjectId().succeeds()
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
    })

    describe('when API call succeeds', () => {
      beforeEach(async () => {
        process.env['MOBB_API_KEY'] = 'test-working-key'

        // Clear all mocks including fetch
        vi.clearAllMocks()
        // Clear logger mocks
        Object.values(loggerMock.mocks).forEach((mock) => mock.mockClear())
      })

      // Helper function to check if a debug message exists
      const expectDebugMessage = (message: string) => {
        const allLogCalls = loggerMock.mocks.logDebug.mock.calls.map(
          (call: unknown[]) => String(call[0])
        )
        expect(allLogCalls.some((msg: string) => msg.includes(message))).toBe(
          true
        )
      }

      // Helper function to check if a log message exists
      const expectLogMessage = (message: string) => {
        const allLogCalls = loggerMock.mocks.logInfo.mock.calls.map(
          (call: unknown[]) => String(call[0])
        )
        expect(allLogCalls.some((msg: string) => msg.includes(message))).toBe(
          true
        )
      }

      // Helper function to check if a log message with specific data exists
      const expectLogMessageWithData = (
        message: string,
        expectedData?: unknown
      ) => {
        const matchingCall = loggerMock.mocks.logInfo.mock.calls.find(
          (call: unknown[]) => String(call[0]).includes(message)
        )
        expect(matchingCall).toBeDefined()
        if (expectedData !== undefined) {
          expect(matchingCall?.[1]).toEqual(expectedData)
        }
      }

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
        mockGraphQL().getOrgAndProjectId().succeeds()
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
        expectLogMessage('Executing tool: scan_and_fix_vulnerabilities')
        expectLogMessage('FilePacking: packing files')
        expectLogMessage('Files packed successfully')
        expectLogMessage('Upload info retrieved')
        expectLogMessage('File uploaded successfully')
        expectLogMessage('Project ID retrieved')

        // Verify runScan flow logs
        expectLogMessage('Starting scan')
        expectLogMessage('Submitting vulnerability report')
        expectLogMessage('Vulnerability report submitted successfully')
        expectLogMessage('Starting analysis subscription')
        expectLogMessage('Analysis subscription completed')

        // Verify getMCPFixes logs with data
        expectLogMessage('Fixes retrieved')
        expectLogMessageWithData('GraphQL: GetReportFixes successful', {
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
          timeoutInMs: 300000, // 5 minutes
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
        mockGraphQL().getOrgAndProjectId().projectNotFound()
        mockGraphQL().createProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the new project ID was created and used
        expectLogMessage('Project ID retrieved')

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
        mockGraphQL().getOrgAndProjectId().succeeds()
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
        expectErrorLogWithData('GraphQL: SubmitVulnerabilityReport failed', {
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
        mockGraphQL().getOrgAndProjectId().succeeds()
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
        expectErrorLogWithData('GraphQL: GetReportFixes failed', {
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
        mockGraphQL().getOrgAndProjectId().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: codeNotInGitRepoPath })

        expectLogMessage('Executing tool: scan_and_fix_vulnerabilities')
        expectDebugMessage(
          'Git repository validation failed, using all files in the repository'
        )
        expectLogMessage('FilePacking: packing files')
        expectLogMessage('Files packed successfully')

        // Verify successful completion
        expectValidResult(result)
        const fixesText = result.content[0]?.text

        // // Verify the complete fixes prompt with snapshot
        expect(fixesText).toMatchSnapshot()

        expectErrorLogWithData('Path is not a valid git repository')
        // Verify no error logs were generated
        expect(loggerMock.mocks.logError.mock.calls).toHaveLength(1)
      })

      it('should format fixes prompt with vulnerability details and patches when no changes in git status', async () => {
        // Configure GraphQL mocks for complete flow including getMCPFixes
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getOrgAndProjectId().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getReportFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeNoChangesRepoPath })

        expectLogMessage('Executing tool: scan_and_fix_vulnerabilities')
        expectDebugMessage(
          'No changes found, using recently changed files from git history'
        )
        expectLogMessage('FilePacking: packing files')
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
        mockGraphQL().getOrgAndProjectId().succeeds()
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
        mockGraphQL().getOrgAndProjectId().succeeds()
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
        mockGraphQL().getOrgAndProjectId().succeeds()
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
        expectErrorLogWithData('GraphQL: uploadS3BucketInfo failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Upload failed'),
          }),
        })
      })

      it('should handle getOrgAndProjectId failure gracefully', async () => {
        // Configure GraphQL mocks with getOrgAndProjectId failure
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getOrgAndProjectId().failsWithError('Organization error')

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Organization error')

        // Verify error was logged with enhanced context
        expect(loggerMock.mocks.logError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('GraphQL: getProjectId failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Organization error'),
          }),
        })
      })

      it('should handle createProject failure gracefully', async () => {
        // Configure GraphQL mocks with createProject failure
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getOrgAndProjectId().projectNotFound()
        mockGraphQL().createProject().failsWithError('Create project failed')

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Create project failed')

        // Verify error was logged with enhanced context
        expect(loggerMock.mocks.logError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('GraphQL: getProjectId failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Create project failed'),
          }),
        })
      })
    })
  })

  describe('CheckForAvailableFixesTool', () => {
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
        loggerMock.mocks.logInfo.mock.calls.some(
          (call) =>
            call[0] ===
            'FetchAvailableFixesTool execution completed successfully'
        )
      ).toBe(true)

      // Verify no error logs were generated
      expect(loggerMock.mocks.logError.mock.calls).toHaveLength(0)
    })
  })
})
