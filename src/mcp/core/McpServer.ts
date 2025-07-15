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
import { createAuthenticatedMcpGQLClient } from '../services/McpGQLClient'
import { BaseTool, ToolDefinition } from '../tools/base/BaseTool'
import { CheckForNewAvailableFixesTool } from '../tools/checkForNewAvailableFixes/CheckForNewAvailableFixesTool'
import { MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES } from '../tools/toolNames'
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
    logInfo('MCP server instance created')
    logDebug('MCP server instance config', { config })
  }

  private handleProcessSignal(
    signal:
      | NodeJS.Signals
      | 'exit'
      | 'uncaughtException'
      | 'unhandledRejection'
      | 'warning',
    error?: Error | number
  ): void {
    const messages: Record<string, string> = {
      SIGINT: 'MCP server interrupted',
      SIGTERM: 'MCP server terminated',
      exit: 'MCP server exiting',
      uncaughtException: 'Uncaught exception in MCP server',
      unhandledRejection: 'Unhandled promise rejection in MCP server',
      warning: 'Warning in MCP server',
    }
    const message = messages[signal] || `Unhandled signal: ${signal}`

    // Handle exit signal separately - error parameter is the exit code
    if (signal === 'exit') {
      const exitCode = error as number | undefined
      if (exitCode === 0 || exitCode === undefined) {
        logDebug(`${message} (clean exit)`, { signal, exitCode })
      } else {
        logWarn(`${message} (exit code: ${exitCode})`, { signal, exitCode })
      }
    } else if (error) {
      logError(`${message}`, { error, signal })
    } else {
      logDebug(message, { signal })
    }

    if (signal === 'SIGINT' || signal === 'SIGTERM') {
      process.exit(0)
    }

    if (signal === 'uncaughtException') {
      process.exit(1)
    }
  }

  private setupProcessEventHandlers(): void {
    if (this.isEventHandlersSetup) {
      logDebug('Process event handlers already setup, skipping')
      return
    }

    const signals: (
      | NodeJS.Signals
      | 'exit'
      | 'uncaughtException'
      | 'unhandledRejection'
      | 'warning'
    )[] = [
      'SIGINT',
      'SIGTERM',
      'exit',
      'uncaughtException',
      'unhandledRejection',
      'warning',
    ]

    signals.forEach((signal) => {
      process.on(signal, (error?: Error | number) => {
        this.handleProcessSignal(signal, error)
      })
    })

    this.isEventHandlersSetup = true
    logInfo('Process event handlers registered')
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

  private async triggerScanForNewAvailableFixes(): Promise<void> {
    //this triggers browser login flow
    const gqlClient = await createAuthenticatedMcpGQLClient({
      isBackgoundCall: true,
    })
    const isConnected = await gqlClient.verifyApiConnection()
    if (!isConnected) {
      logError('Failed to connect to the API, skipping scan')
      return
    }

    if (process.env['WORKSPACE_FOLDER_PATHS']) {
      logDebug('WORKSPACE_FOLDER_PATHS is set', {
        WORKSPACE_FOLDER_PATHS: process.env['WORKSPACE_FOLDER_PATHS'],
      })
      try {
        const checkForNewAvailableFixesTool = this.toolRegistry.getTool(
          MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES
        ) as CheckForNewAvailableFixesTool
        logInfo('Triggering periodic scan for new available fixes')
        checkForNewAvailableFixesTool.triggerScan({
          path: process.env['WORKSPACE_FOLDER_PATHS'],
          gqlClient,
        })
      } catch (error) {
        logError('Error getting workspace folder path tool', { error })
      }
    }
  }

  public async handleListToolsRequest(
    request: ListToolsRequest
  ): Promise<ListToolsResult> {
    logInfo('Received list_tools request')
    logDebug('list_tools request', {
      request: JSON.parse(JSON.stringify(request)),
    })

    logDebug('Request', {
      request: JSON.parse(JSON.stringify(request)),
    })

    logDebug('env', {
      env: process.env,
    })

    void this.triggerScanForNewAvailableFixes()

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
    logDebug('Returning list_tools response', { response })
    return response
  }

  public async handleCallToolRequest(request: CallToolRequest) {
    const { name, arguments: args } = request.params
    logInfo(`Received call tool request for ${name}`)

    logDebug('Request', {
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

      logInfo(`Executing tool: ${name}`)
      const response = await tool.execute(args)

      // Ensure response is properly serializable
      const serializedResponse = JSON.parse(JSON.stringify(response))
      logInfo(`Tool ${name} executed successfully`)
      logDebug(`Tool ${name} executed successfully`, {
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

    logInfo('MCP server handlers registered')
  }

  public registerTool(tool: BaseTool): void {
    this.toolRegistry.registerTool(tool)
    logInfo(`Tool registered: ${tool.name}`)
  }

  public async start(): Promise<void> {
    try {
      logInfo('Starting MCP server')
      const transport = new StdioServerTransport()
      await this.server.connect(transport)
      logDebug('MCP server is running on stdin/stdout')

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
    logDebug('MCP server shutting down')
    // Add any cleanup logic here if needed
  }
}
