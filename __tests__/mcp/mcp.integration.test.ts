import { spawn } from 'child_process'
import { existsSync, mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

import {
  MCPClient,
  MCPFixVulnerabilitiesResponse,
  MCPListToolsResponse,
} from './helpers/MCPClient'
import {
  createActiveGitRepo,
  createEmptyGitRepo,
  createMCPProcess,
  deleteGitRepo,
  log,
} from './helpers/utils'

/**
 * Helper function to verify a successful MCP response with text content
 * @param response The MCP response to verify
 * @param expectedText The expected text content in the response
 */
function verifySuccessfulTextResponse(
  response: MCPFixVulnerabilitiesResponse,
  expectedText: string
): void {
  // Verify response structure
  expect(response).toHaveProperty('jsonrpc')
  expect(response).toHaveProperty('id')

  // The response should not contain an error
  expect('error' in response).toBe(false)

  // The response should have a result
  expect('result' in response).toBe(true)

  // Type guard to ensure TypeScript knows the response has a result property
  const result = response.result

  // Check the content property in the result
  expect(result).toHaveProperty('content')
  expect(Array.isArray(result.content)).toBe(true)

  // Check the text content
  const textContent = result.content.find((item) => item.type === 'text')
  expect(textContent).toBeDefined()

  if (textContent) {
    expect(textContent.text).toBe(expectedText)
  }
}

/**
 * Helper function to verify an MCP error response
 * @param response The MCP response to verify
 * @param expectedMessage The expected error message (partial match)
 */
function verifyErrorResponse(
  response: MCPFixVulnerabilitiesResponse,
  expectedMessage: string
): void {
  // Verify response structure
  expect(response).toHaveProperty('jsonrpc')
  expect(response).toHaveProperty('id')

  // The response should contain an error
  expect('error' in response).toBe(true)

  // After assertion, we know the response has an error property
  const errorResponse = response as unknown as {
    error: { code: number; message: string }
  }
  expect(errorResponse.error).toHaveProperty('code')
  expect(errorResponse.error).toHaveProperty('message')
  expect(errorResponse.error.message).toContain(expectedMessage)
}

describe('MCP Server', () => {
  let mcpProcess: ReturnType<typeof spawn>
  let mcpClient: MCPClient
  let nonExistentPath: string
  let nonRepoPath: string
  let emptyRepoPath: string
  let activeRepoPath: string

  beforeAll(async () => {
    // Create temp paths for testing
    nonExistentPath = join(tmpdir(), 'mcp-test-non-existent-' + Date.now())

    // Create temp directory that is not a git repo
    nonRepoPath = mkdtempSync(join(tmpdir(), 'mcp-test-non-repo-'))

    // Create an empty git repository
    emptyRepoPath = createEmptyGitRepo()

    // Create a git repository with a staged file
    activeRepoPath = createActiveGitRepo()

    // Start the MCP server
    mcpProcess = await createMCPProcess()
    mcpClient = new MCPClient(mcpProcess)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    if (mcpClient) {
      await mcpClient.close()
    }

    // Clean up temp directories
    if (existsSync(nonRepoPath)) {
      rmSync(nonRepoPath, { recursive: true, force: true })
    }

    // Clean up the git repos
    deleteGitRepo(emptyRepoPath)
    deleteGitRepo(activeRepoPath)
  })

  it('should respond to list_tools request', async () => {
    const response = await mcpClient.listTools()

    // Verify response structure
    expect(response).toHaveProperty('jsonrpc')
    expect(response).toHaveProperty('id')

    // In case the server responds with an error, log it for debugging
    if ('error' in response) {
      log('Server returned error:', response.error)
      // Fail the test if there's an error
      expect('error' in response).toBe(false)
    }

    // Use assertions instead of conditionals for critical response properties
    expect('result' in response).toBe(true)

    const listToolsResponse = response as MCPListToolsResponse
    expect(Array.isArray(listToolsResponse.result.tools)).toBe(true)

    // Assert the exact response structure
    expect(listToolsResponse.result).toEqual({
      tools: [
        {
          name: 'fix_vulnerabilities',
          display_name: 'fix_vulnerabilities',
          description:
            'Scans the current code changes and returns fixes for potential vulnerabilities',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'The path to the local git repository',
              },
            },
            required: ['path'],
          },
        },
      ],
    })
  })

  it('should handle missing path parameter in fix_vulnerabilities tool', async () => {
    // Call the fix_vulnerabilities tool without providing a path
    const response = await mcpClient.callTool<MCPFixVulnerabilitiesResponse>(
      'fix_vulnerabilities',
      {}
    )

    verifyErrorResponse(response, "Missing required parameter 'path'")
  })

  it('should handle non-existent path in fix_vulnerabilities tool', async () => {
    // Call the fix_vulnerabilities tool with a non-existent path
    const response = await mcpClient.callTool<MCPFixVulnerabilitiesResponse>(
      'fix_vulnerabilities',
      {
        path: nonExistentPath,
      }
    )

    verifyErrorResponse(
      response,
      'Invalid path: potential security risk detected in path'
    )
  })

  it('should handle path that is not a git repository in fix_vulnerabilities tool', async () => {
    // Call the fix_vulnerabilities tool with a path that is not a git repo
    const response = await mcpClient.callTool<MCPFixVulnerabilitiesResponse>(
      'fix_vulnerabilities',
      {
        path: nonRepoPath,
      }
    )

    verifyErrorResponse(response, 'Path is not a valid git repository')
  })

  it('should handle empty git repository in fix_vulnerabilities tool', async () => {
    // Call the fix_vulnerabilities tool with an empty git repo
    const response = await mcpClient.callTool<MCPFixVulnerabilitiesResponse>(
      'fix_vulnerabilities',
      {
        path: emptyRepoPath,
      }
    )

    verifySuccessfulTextResponse(
      response,
      'No changed files found in the git repository. The vulnerability scanner analyzes modified, added, or staged files. Make some changes to your code and try again.'
    )
  })

  it('should handle missing API_KEY environment variable', async () => {
    // Store the original API_KEY
    const originalApiKey = process.env['API_KEY']

    try {
      // Unset the API_KEY
      process.env['API_KEY'] = undefined

      // Call the fix_vulnerabilities tool with the active git repo path
      const response = await mcpClient.callTool<MCPFixVulnerabilitiesResponse>(
        'fix_vulnerabilities',
        {
          path: activeRepoPath,
        }
      )

      verifySuccessfulTextResponse(
        response,
        'API_KEY environment variable is not set'
      )
    } finally {
      // Restore the original API_KEY
      process.env['API_KEY'] = originalApiKey
    }
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
        const response =
          await mcpClient.callTool<MCPFixVulnerabilitiesResponse>(
            'fix_vulnerabilities',
            {
              path: maliciousPath,
            }
          )

        // These should be rejected by validateMCPPath with security error
        verifyErrorResponse(
          response,
          'Invalid path: potential security risk detected in path'
        )
      }
    })
  })
})
