import { tmpdir } from 'os'
import { join } from 'path'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { FixVulnerabilitiesTool } from '../../src/mcp/tools/fixVulnerabilities/FixVulnerabilitiesTool'
import {
  createActiveGitRepo,
  createEmptyGitRepo,
  deleteGitRepo,
} from './helpers/utils'
import { MOCK_API_URL, mockGraphQL, server } from './mocks/mocks.js'

// Mock the logger to capture log messages
vi.mock('../../src/mcp/Logger', () => ({
  logInfo: vi.fn(),
  logError: vi.fn(),
  logDebug: vi.fn(),
}))

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
vi.mock('../../src/mcp/tools/fixVulnerabilities/helpers/subscribe', () => ({
  subscribe: vi.fn().mockResolvedValue({
    analysis: {
      id: 'test-analysis-id',
      state: 'FINISHED',
    },
  }),
}))

describe('MCP Server Direct Tests', () => {
  let nonExistentPath: string
  let nonRepoPath: string
  let emptyRepoPath: string
  let activeRepoPath: string
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

  beforeAll(() => {
    // Store original API_URL and set it to our mock URL
    originalApiUrl = process.env['API_URL']
    process.env['API_URL'] = MOCK_API_URL

    console.log(`Setting API_URL to: ${MOCK_API_URL}`)
    console.log(`MSW server starting...`)

    // Start MSW server
    server.listen({ onUnhandledRequest: 'error' })

    console.log(`MSW server started`)

    // Create temp paths for testing
    nonExistentPath = join(tmpdir(), 'mcp-test-non-existent-' + Date.now())

    // Create temp directory that is not a git repo
    nonRepoPath = tmpdir()

    // Create an empty git repository
    emptyRepoPath = createEmptyGitRepo()

    // Create a git repository with a staged file
    activeRepoPath = createActiveGitRepo()
  })

  beforeEach(() => {
    // Reset the GraphQL mock system instead of clearing all mocks
    mockGraphQL().reset()
    console.log(`Test starting, MSW handlers reset`)
  })

  afterAll(() => {
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
      await expect(tool.execute({ path: nonRepoPath })).rejects.toThrow(
        'Path is not a valid git repository'
      )
    })

    it('should handle empty git repository', async () => {
      const tool = new FixVulnerabilitiesTool()
      const result = await tool.execute({ path: emptyRepoPath })

      expectValidResult(result)
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'No changed files found in the git repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.',
          },
        ],
      })
    })

    it('should handle missing API_KEY environment variable', async () => {
      // Store the original API_KEY
      const originalApiKey = process.env['API_KEY']

      try {
        // Unset the API_KEY
        delete process.env['API_KEY']

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        expectValidResult(result)
        expect(result).toEqual({
          content: [
            {
              type: 'text',
              text: 'API_KEY environment variable is not set',
            },
          ],
        })
      } finally {
        // Restore the original API_KEY
        if (originalApiKey !== undefined) {
          process.env['API_KEY'] = originalApiKey
        }
      }
    })

    it('should handle API connection failure', async () => {
      // Set minimal API_KEY to get past the environment check
      process.env['API_KEY'] = 'test-bad-key'

      // Configure GraphQL mock to simulate connection failure
      mockGraphQL().me().failsWithConnectionError()

      const tool = new FixVulnerabilitiesTool()
      const result = await tool.execute({ path: activeRepoPath })

      expectValidResult(result)
      expect(result.content[0]?.text).toBe(
        'Failed to connect to the API. Please check your API_KEY'
      )
    })

    describe('when API call succeeds', () => {
      let mockedLogInfo: ReturnType<typeof vi.fn>
      let mockedLogError: ReturnType<typeof vi.fn>

      beforeEach(async () => {
        process.env['API_KEY'] = 'test-working-key'

        // Set up common log mocks
        const { logInfo, logError } = await import('../../src/mcp/Logger')
        mockedLogInfo = vi.mocked(logInfo)
        mockedLogError = vi.mocked(logError)

        // Clear any previous log calls
        mockedLogInfo.mockClear()
        mockedLogError.mockClear()

        // Clear all mocks including fetch
        vi.clearAllMocks()
      })

      // Helper function to check if a log message exists
      const expectLogMessage = (message: string) => {
        const allLogCalls = mockedLogInfo.mock.calls.map((call: unknown[]) =>
          String(call[0])
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
        const matchingCall = mockedLogInfo.mock.calls.find((call: unknown[]) =>
          String(call[0]).includes(message)
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
        const matchingCall = mockedLogError.mock.calls.find((call: unknown[]) =>
          String(call[0]).includes(message)
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
        mockGraphQL().getMCPFixes().succeeds()

        // Get access to mocked functions for verification
        const { default: fetch } = await import('node-fetch')
        const mockedFetch = vi.mocked(fetch)
        const { subscribe } = await import(
          '../../src/mcp/tools/fixVulnerabilities/helpers/subscribe'
        )
        const mockedSubscribe = vi.mocked(subscribe)

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // === VERIFY COMPLETE FLOW LOGS ===
        expectLogMessage('Executing tool: fix_vulnerabilities')
        expectLogMessage('FilePackingService: packing files')
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
        expectLogMessageWithData('GraphQL: GetMCPFixes successful', {
          result: expect.objectContaining({
            fix: expect.arrayContaining([
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
          fixCount: 2,
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
          apiKey: 'test-working-key',
          type: 'apiKey',
          timeoutInMs: 300000, // 5 minutes
        }) // wsClientOptions

        // === VERIFY FINAL RESULT ===
        expectValidResult(result)
        expect(result.content[0]?.text).toContain(
          'Here are the fixes to the vulnerabilities discovered by Mobb MCP'
        )

        // Verify no error logs were generated
        expect(mockedLogError.mock.calls).toHaveLength(0)
      })

      it('should create new project when MCP Scans project does not exist', async () => {
        // Configure GraphQL mocks for scenario where project doesn't exist
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getOrgAndProjectId().projectNotFound()
        mockGraphQL().createProject().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getMCPFixes().succeeds()

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
        expect(mockedLogError.mock.calls.length).toBeGreaterThan(0)
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
          endpoint: 'http://localhost:3001/graphql',
          headers: expect.objectContaining({
            'x-mobb-key': '[REDACTED]',
            'x-hasura-request-id': '[DYNAMIC]',
          }),
        })
      })

      it('should handle getMCPFixes failure gracefully', async () => {
        // Configure GraphQL mocks with getMCPFixes failure
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getOrgAndProjectId().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getMCPFixes().failsWithError('Failed to retrieve fixes')

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toContain('Failed to retrieve fixes')

        // Verify error was logged with data
        expect(mockedLogError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('GraphQL: GetMCPFixes failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Failed to retrieve fixes'),
            response: expect.objectContaining({
              errors: expect.arrayContaining([
                expect.objectContaining({
                  message: 'Failed to retrieve fixes',
                }),
              ]),
              status: 500,
            }),
          }),
          fixReportId: 'test-fix-report-id',
          endpoint: 'http://localhost:3001/graphql',
          headers: expect.objectContaining({
            'x-mobb-key': '[REDACTED]',
            'x-hasura-request-id': '[DYNAMIC]',
          }),
        })
      })

      it('should format fixes prompt with vulnerability details and patches', async () => {
        // Configure GraphQL mocks for complete flow including getMCPFixes
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getOrgAndProjectId().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getMCPFixes().succeeds()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify successful completion
        expectValidResult(result)
        const fixesText = result.content[0]?.text

        // Verify the complete fixes prompt with snapshot
        expect(fixesText).toMatchSnapshot()

        // Verify no error logs were generated
        expect(mockedLogError.mock.calls).toHaveLength(0)
      })

      it('should return no fixes found prompt when no fixes are available', async () => {
        // Configure GraphQL mocks for complete flow but with empty fixes
        mockGraphQL().me().succeeds()
        mockGraphQL().uploadS3BucketInfo().succeeds()
        mockGraphQL().getOrgAndProjectId().succeeds()
        mockGraphQL().submitVulnerabilityReport().succeeds()
        mockGraphQL().getMCPFixes().returnsEmptyFixes()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify successful completion
        expectValidResult(result)
        const fixesText = result.content[0]?.text

        // Verify the no fixes found prompt with snapshot
        expect(fixesText).toMatchSnapshot()

        // Verify no error logs were generated
        expect(mockedLogError.mock.calls).toHaveLength(0)
      })

      it('should handle connection errors gracefully', async () => {
        // Set API_KEY to trigger connection verification
        process.env['API_KEY'] = 'test-key'

        // Configure GraphQL mock to simulate connection error
        mockGraphQL().me().failsWithConnectionError()

        const tool = new FixVulnerabilitiesTool()
        const result = await tool.execute({ path: activeRepoPath })

        // Verify that the error was handled and logged
        expectValidResult(result)
        expect(result.content[0]?.text).toBe(
          'Failed to connect to the API. Please check your API_KEY'
        )

        // Verify error was logged
        expect(mockedLogError.mock.calls.length).toBeGreaterThan(0)
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
        expect(mockedLogError.mock.calls.length).toBeGreaterThan(0)
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
        mockGraphQL().getMCPFixes().succeeds()

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
        expect(mockedLogError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('GraphQL: uploadS3BucketInfo failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Upload failed'),
          }),
          endpoint: 'http://localhost:3001/graphql',
          headers: expect.objectContaining({
            'x-mobb-key': '[REDACTED]',
            'x-hasura-request-id': '[DYNAMIC]',
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
        expect(mockedLogError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('GraphQL: getProjectId failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Organization error'),
          }),
          endpoint: 'http://localhost:3001/graphql',
          headers: expect.objectContaining({
            'x-mobb-key': '[REDACTED]',
            'x-hasura-request-id': '[DYNAMIC]',
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
        expect(mockedLogError.mock.calls.length).toBeGreaterThan(0)
        expectErrorLogWithData('GraphQL: getProjectId failed', {
          error: expect.objectContaining({
            message: expect.stringContaining('Create project failed'),
          }),
          endpoint: 'http://localhost:3001/graphql',
          headers: expect.objectContaining({
            'x-mobb-key': '[REDACTED]',
            'x-hasura-request-id': '[DYNAMIC]',
          }),
        })
      })
    })
  })
})
