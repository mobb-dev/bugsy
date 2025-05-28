import { spawn } from 'child_process'

// Define types for MCP tools and responses
export type MCPToolParameter = {
  type: string
  description?: string
  properties?: Record<string, MCPToolParameter>
  required?: string[]
}

// Update the tool type to match the actual server response
export type MCPTool = {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, MCPToolParameter>
    required?: string[]
  }
}

export type MCPListToolsResponse = {
  id: string
  jsonrpc: string
  result: {
    tools: MCPTool[]
  }
}

export type MCPFixVulnerabilitiesResponse = {
  id: string
  jsonrpc: string
  result: {
    content: {
      type: string
      text: string
    }[]
  }
}

// Add error response type
export type MCPErrorResponse = {
  id: string
  jsonrpc: string
  error: {
    code: number
    message: string
  }
}

export type MCPResponse =
  | MCPListToolsResponse
  | MCPFixVulnerabilitiesResponse
  | MCPErrorResponse

/**
 * MCP Client to communicate with the MCP server
 */
export class MCPClient {
  private nextId = 1

  constructor(private process: ReturnType<typeof spawn>) {}

  async listTools(): Promise<MCPResponse> {
    const requestId = `req-${this.nextId++}`
    // Using the correct method name based on the MCP SDK implementation
    const request = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'tools/list',
      params: {},
    }

    return this.sendRequest(request) as Promise<MCPResponse>
  }

  async callTool<T extends MCPResponse>(
    name: string,
    args: Record<string, unknown>
  ): Promise<T> {
    const requestId = `req-${this.nextId++}`
    const request = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'tools/call',
      params: {
        name,
        arguments: args,
      },
    }

    return this.sendRequest(request) as Promise<T>
  }

  private async sendRequest(
    request: Record<string, unknown>
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      let onData: ((data: Buffer) => void) | null = null

      const cleanup = () => {
        if (onData) {
          this.process.stdout?.removeListener('data', onData)
          onData = null
        }
      }

      // Set up a timeout
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('Request timed out'))
      }, 5000)

      // Send the request
      this.process.stdin?.write(JSON.stringify(request) + '\n')

      // Set up data handler for stdout
      onData = (data: Buffer) => {
        try {
          const responseLines = data.toString().trim().split('\n')
          for (const line of responseLines) {
            const response = JSON.parse(line)
            if (response['id'] === request['id']) {
              clearTimeout(timeout)
              cleanup()
              resolve(response)
              return
            }
          }
        } catch (err) {
          // Ignore parsing errors, continue waiting for complete response
        }
      }

      this.process.stdout?.on('data', onData)
    })
  }

  async close(): Promise<void> {
    this.process.stdin?.end()
    this.process.kill()
  }
}
