import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequest,
  ListToolsRequestSchema,
  ListToolsResult,
} from '@modelcontextprotocol/sdk/types.js'

import { logDebug, logError, logInfo, logWarn } from '../Logger'
import { getMcpGQLClient } from '../services/McpGQLClient'
import { BaseTool, ToolDefinition } from '../tools/base/BaseTool'
import { ToolRegistry } from './ToolRegistry'

export type McpServerConfig = {
  name: string
  version: string
}

export class McpServer {
  private server: Server
  private toolRegistry: ToolRegistry
  private isEventHandlersSetup = false

  constructor(config: McpServerConfig) {
    this.server = new Server(
      {
        name: config.name,
        version: config.version,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    this.toolRegistry = new ToolRegistry()
    this.setupHandlers()
    this.setupProcessEventHandlers()
    logInfo('MCP server instance created', config)
  }

  private setupProcessEventHandlers(): void {
    if (this.isEventHandlersSetup) {
      logDebug('Process event handlers already setup, skipping')
      return
    }

    // Define signals with their corresponding messages
    const signals: Record<string, string> = {
      SIGINT: 'MCP server interrupted',
      SIGTERM: 'MCP server terminated',
      exit: 'MCP server exiting',
      uncaughtException: 'Uncaught exception in MCP server',
      unhandledRejection: 'Unhandled promise rejection in MCP server',
      warning: 'Warning in MCP server',
    }

    // Set up handlers for each signal or event
    Object.entries(signals).forEach(([signal, message]) => {
      process.on(
        signal as
          | NodeJS.Signals
          | 'exit'
          | 'uncaughtException'
          | 'unhandledRejection'
          | 'warning',
        (error?: Error | number) => {
          if (error && signal !== 'exit') {
            logError(`${message}`, { error, signal })
          } else {
            logInfo(message, { signal })
          }

          // Exit on termination signals
          if (signal === 'SIGINT' || signal === 'SIGTERM') {
            process.exit(0)
          }

          // For uncaughtException, exit with error code
          if (signal === 'uncaughtException') {
            process.exit(1)
          }
        }
      )
    })

    this.isEventHandlersSetup = true
    logDebug('Process event handlers registered')
  }

  private createShutdownPromise(): Promise<void> {
    return new Promise<void>((resolve) => {
      const cleanup = () => {
        logInfo('Process shutdown initiated')
        resolve()
      }

      process.once('SIGINT', cleanup)
      process.once('SIGTERM', cleanup)
    })
  }

  public async handleListToolsRequest(
    request: ListToolsRequest
  ): Promise<ListToolsResult> {
    logInfo('Received list_tools request', { params: request.params })

    logInfo('Request', {
      request: JSON.parse(JSON.stringify(request)),
    })

    void getMcpGQLClient({ isToolsCall: true })

    const toolsDefinitions = this.toolRegistry.getAllTools()
    const response = {
      tools: toolsDefinitions.map((tool: ToolDefinition) => ({
        name: tool.name,
        display_name: tool.display_name || tool.name,
        description: tool.description || '',
        inputSchema: {
          type: 'object' as const,
          properties:
            (tool.inputSchema as { properties?: Record<string, unknown> })
              .properties || {},
          required:
            (tool.inputSchema as { required?: string[] }).required || [],
        },
      })),
    }
    logInfo('Returning list_tools response', { response })
    return response
  }

  public async handleCallToolRequest(request: CallToolRequest) {
    const { name, arguments: args } = request.params
    logInfo(`Received call tool request for ${name}`, { name, args })

    logInfo('Request', {
      request: JSON.parse(JSON.stringify(request)),
    })

    try {
      const tool = this.toolRegistry.getTool(name)
      if (!tool) {
        const errorMsg = `Unknown tool: ${name}`
        logWarn(errorMsg, {
          name,
          availableTools: this.toolRegistry.getToolNames(),
        })
        throw new Error(errorMsg)
      }

      logDebug(`Executing tool: ${name}`, { args })
      const response = await tool.execute(args)

      // Ensure response is properly serializable
      const serializedResponse = JSON.parse(JSON.stringify(response))
      logInfo(`Tool ${name} executed successfully`, {
        responseType: typeof response,
        hasContent: !!serializedResponse.content,
      })

      return serializedResponse
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logError(`Error executing tool ${name}: ${errorMessage}`, {
        error,
        toolName: name,
        args,
      })
      throw error
    }
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      (request: ListToolsRequest) => this.handleListToolsRequest(request)
    )

    // Call tool handler
    this.server.setRequestHandler(
      CallToolRequestSchema,
      (request: CallToolRequest) => this.handleCallToolRequest(request)
    )

    logDebug('MCP server handlers registered')
  }

  public registerTool(tool: BaseTool): void {
    this.toolRegistry.registerTool(tool)
    logDebug(`Tool registered: ${tool.name}`)
  }

  public async start(): Promise<void> {
    try {
      logDebug('Starting MCP server')
      const transport = new StdioServerTransport()
      await this.server.connect(transport)
      logInfo('MCP server is running on stdin/stdout')

      // Keep process running until interrupted
      process.stdin.resume()

      // Wait for shutdown signal
      await this.createShutdownPromise()

      // Clean shutdown
      await this.stop()
    } catch (error) {
      logError('Failed to start MCP server', { error })
      throw error
    }
  }

  public async stop(): Promise<void> {
    logInfo('MCP server shutting down')
    // Add any cleanup logic here if needed
  }
}
