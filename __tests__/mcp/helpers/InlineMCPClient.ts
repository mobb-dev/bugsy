import { McpServer } from '@mobb/bugsy/mcp/core/McpServer'
import {
  CallToolResult,
  GetPromptResult,
  ListPromptsResult,
  ListToolsResult,
} from '@modelcontextprotocol/sdk/types'

export class InlineMCPClient {
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

  async listPrompts(): Promise<ListPromptsResult> {
    return this.mcpServer.handleListPromptsRequest({
      method: 'prompts/list',
      params: {},
    })
  }

  async getPrompt(
    name: string,
    args?: Record<string, unknown>
  ): Promise<GetPromptResult> {
    return this.mcpServer.handleGetPromptRequest({
      method: 'prompts/get',
      params: {
        name,
        arguments: args as { [x: string]: string } | undefined,
      },
    })
  }

  async cleanup(): Promise<void> {
    await this.mcpServer.stop()
  }
}
