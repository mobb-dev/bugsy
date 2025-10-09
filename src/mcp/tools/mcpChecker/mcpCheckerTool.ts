import { logDebug, logError } from '@mobb/bugsy/mcp/Logger'
import z from 'zod'

import { BaseTool } from '../base/BaseTool'
import { MCP_TOOL_CHECKER } from '../toolNames'
import { McpCheckerService } from './mcpCheckerService'

export class McpCheckerTool extends BaseTool {
  name = MCP_TOOL_CHECKER
  displayName = 'MCP Checker'
  // A detailed description to guide the LLM on when and how to invoke this tool.
  description =
    'Check the MCP servers running on this IDE against organization policies.'

  inputValidationSchema = z.object({})

  inputSchema = {
    type: 'object' as const,
    properties: {},
    required: [],
  }

  hasAuthentication = false

  private mcpCheckerService: McpCheckerService

  constructor(govOrgId: string) {
    super()
    this.mcpCheckerService = McpCheckerService.getInstance(govOrgId)
  }

  async executeInternal(args: z.infer<typeof this.inputValidationSchema>) {
    logDebug(`Executing tool: ${this.name}`, { args })

    try {
      return this.mcpCheckerService.processMcpCheck()
    } catch (error) {
      // Return error as text content for processing errors (not validation errors)
      const errorResponse = this.createSuccessResponse((error as Error).message)

      logError('Tool execution failed', {
        error: (error as Error).message,
        result: errorResponse,
      })

      return errorResponse
    }
  }
}
