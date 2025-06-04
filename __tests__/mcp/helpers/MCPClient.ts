import { McpServer } from '@mobb/bugsy/mcp/core/McpServer'
import {
  CallToolResult,
  ListToolsResult,
} from '@modelcontextprotocol/sdk/types'

export class MCPClient {
  private mcpServer: McpServer

  constructor(mcpServer: McpServer) {
    this.mcpServer = mcpServer
  }

  async listTools(): Promise<ListToolsResult> {
    return this.mcpServer.handleListToolsRequest({
      method: 'tools/list',
      params: {},
    })
  }

  async callTool<T extends CallToolResult>(
    name: string,
    args: Record<string, unknown>
  ): Promise<T> {
    return this.mcpServer.handleCallToolRequest({
      method: 'tools/call',
      params: {
        name,
        arguments: args,
      },
    })
  }
}
