import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequest,
  CallToolRequestSchema,
  GetPromptRequest,
  GetPromptRequestSchema,
  GetPromptResult,
  ListPromptsRequest,
  ListPromptsRequestSchema,
  ListPromptsResult,
  ListToolsRequest,
  ListToolsRequestSchema,
  ListToolsResult,
  Prompt,
} from '@modelcontextprotocol/sdk/types.js'

import { logDebug, logError, logInfo, logWarn } from '../Logger'
import { BasePrompt } from '../prompts/base/BasePrompt'
import { createAuthenticatedMcpGQLClient } from '../services/McpGQLClient'
import { McpUsageService } from '../services/McpUsageService'
import { WorkspaceService } from '../services/WorkspaceService'
import { BaseTool, ToolDefinition } from '../tools/base/BaseTool'
import { CheckForNewAvailableFixesTool } from '../tools/checkForNewAvailableFixes/CheckForNewAvailableFixesTool'
import {
  MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES,
  MCP_TOOL_CHECKER,
} from '../tools/toolNames'
import { isAutoScan } from './configs'
import { PromptRegistry } from './PromptRegistry'
import { ToolRegistry } from './ToolRegistry'

export type McpServerConfig = {
  name: string
  version: string
}

export class McpServer {
  private server: Server
  private toolRegistry: ToolRegistry
  private promptRegistry: PromptRegistry
  private isEventHandlersSetup = false
  private eventHandlers: Map<string, (error?: Error | number) => void> =
    new Map()
  private parentProcessCheckInterval?: NodeJS.Timeout
  private readonly parentPid: number

  private socketEventHandlers: Map<
    string,
    (...args: unknown[]) => Promise<void> | void
  > = new Map()

  private mcpUsageService: McpUsageService | null

  constructor(config: McpServerConfig, govOrgId: string = '') {
    this.parentPid = process.ppid
    this.mcpUsageService = govOrgId ? new McpUsageService(govOrgId) : null

    this.server = new Server(
      {
        name: config.name,
        version: config.version,
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
        },
      }
    )

    this.toolRegistry = new ToolRegistry()
    this.promptRegistry = new PromptRegistry()
    this.setupHandlers()
    this.setupProcessEventHandlers()
    this.setupParentProcessMonitoring()
    logInfo('MCP server instance created')
    logDebug('MCP server instance config', {
      config,
      parentPid: this.parentPid,
    })
  }

  private async trackServerUsage(
    action: 'start' | 'stop',
    signalOrError?: string | Error | number
  ): Promise<void> {
    try {
      if (!this.mcpUsageService?.hasOrganizationId()) {
        logDebug(
          `[McpServer] Skipping ${action} usage tracking - organization ID not available`
        )
        return
      }

      if (action === 'start') {
        await this.mcpUsageService?.trackServerStart()
      }
      if (action === 'stop') {
        await this.mcpUsageService?.trackServerStop()
        this.mcpUsageService?.reset()
      }
    } catch (usageError) {
      logWarn(`Failed to track MCP server ${action}`, {
        error: usageError,
        signalOrError,
      })
    }
  }

  private async handleProcessSignal({
    signal,
    error,
  }: {
    signal:
      | NodeJS.Signals
      | 'exit'
      | 'uncaughtException'
      | 'unhandledRejection'
      | 'warning'
    error?: Error | number
  }): Promise<void> {
    const messages: Record<string, string> = {
      SIGINT: 'MCP server interrupted',
      SIGTERM: 'MCP server terminated',
      SIGHUP: 'MCP server hangup signal received',
      SIGQUIT: 'MCP server quit signal received',
      SIGABRT: 'MCP server abort signal received',
      SIGPIPE: 'MCP server broken pipe signal received',
      SIGTSTP: 'MCP server terminal stop signal received',
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
    } else if (signal === 'unhandledRejection') {
      // Enhanced logging for unhandled promise rejections
      const errorDetails = {
        signal,
        errorType: error?.constructor?.name || 'Unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorString: error?.toString(),
        errorJson: JSON.stringify(error, null, 2),
        timestamp: new Date().toISOString(),
      }
      logError(`${message} - Enhanced error details`, errorDetails)

      // Also log the raw error object for debugging
      logError(`${message} - Raw error object`, { error, signal })
    } else if (error) {
      logError(`${message}`, { error, signal })
    } else {
      logDebug(message, { signal })
    }

    if (
      signal === 'SIGINT' ||
      signal === 'SIGTERM' ||
      signal === 'SIGHUP' ||
      signal === 'SIGQUIT' ||
      signal === 'SIGABRT' ||
      signal === 'SIGPIPE' ||
      signal === 'SIGTSTP'
    ) {
      await this.trackServerUsage('stop', signal)
      process.exit(0)
    }

    if (signal === 'uncaughtException') {
      await this.trackServerUsage('stop', signal)
      process.exit(1)
    }
  }

  private isParentProcessAlive(): boolean {
    try {
      // Signal 0 doesn't kill the process, just checks if it exists
      process.kill(this.parentPid, 0)
      return true
    } catch (error) {
      // ESRCH error means process doesn't exist
      return false
    }
  }

  private async handleParentProcessDeath(source: string): Promise<void> {
    logInfo(`Parent process death detected via ${source}`, {
      parentPid: this.parentPid,
    })
    await this.trackServerUsage('stop', `parent-death-${source}`)
    process.exit(0)
  }

  private setupParentProcessMonitoring(): void {
    logInfo('Setting up parent process monitoring', {
      parentPid: this.parentPid,
    })

    // Monitor stdin/stdout streams
    const stdinCloseHandler = async () => {
      logDebug('stdin closed - parent likely terminated')
      await this.handleParentProcessDeath('stdin-close')
    }
    const stdinEndHandler = async () => {
      logDebug('stdin ended - parent likely terminated')
      await this.handleParentProcessDeath('stdin-end')
    }
    const stdoutErrorHandler = async (...args: unknown[]) => {
      const error = args[0] as Error
      logWarn('stdout error - parent may have terminated', { error })
      // Only exit if it's a pipe error (parent closed)
      if (
        error.message.includes('EPIPE') ||
        error.message.includes('ECONNRESET')
      ) {
        await this.handleParentProcessDeath('stdout-error')
      }
    }
    const stderrErrorHandler = async (...args: unknown[]) => {
      const error = args[0] as Error
      logWarn('stderr error - parent may have terminated', { error })
      // Only exit if it's a pipe error (parent closed)
      if (
        error.message.includes('EPIPE') ||
        error.message.includes('ECONNRESET')
      ) {
        await this.handleParentProcessDeath('stderr-error')
      }
    }
    const disconnectHandler = async () => {
      logDebug('IPC disconnected - parent terminated')
      await this.handleParentProcessDeath('ipc-disconnect')
    }

    // Store handlers for cleanup
    this.socketEventHandlers.set('stdin-close', stdinCloseHandler)
    this.socketEventHandlers.set('stdin-end', stdinEndHandler)
    this.socketEventHandlers.set('stdout-error', stdoutErrorHandler)
    this.socketEventHandlers.set('stderr-error', stderrErrorHandler)
    this.socketEventHandlers.set('disconnect', disconnectHandler)

    // Add listeners
    process.stdin.on('close', stdinCloseHandler)
    process.stdin.on('end', stdinEndHandler)
    process.stdout.on('error', stdoutErrorHandler)
    process.stderr.on('error', stderrErrorHandler)

    if (process.send) {
      process.on('disconnect', disconnectHandler)
      logDebug('IPC monitoring enabled')
    } else {
      logDebug('IPC not available - skipping IPC monitoring')
    }

    //  Periodic parent process checking (every 10 seconds)
    this.parentProcessCheckInterval = setInterval(async () => {
      if (!this.isParentProcessAlive()) {
        logDebug('Parent process not alive during periodic check')
        await this.handleParentProcessDeath('periodic-check')
      }
    }, 10000)

    logInfo('Parent process monitoring setup complete')
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
      'SIGHUP',
      'SIGQUIT',
      'SIGABRT',
      'SIGPIPE',
      'SIGTSTP',
      'exit',
      'uncaughtException',
      'unhandledRejection',
      'warning',
    ]

    signals.forEach((signal) => {
      const handler = async (error?: Error | number) => {
        await this.handleProcessSignal({ signal, error })
      }
      this.eventHandlers.set(signal, handler)
      process.on(signal, handler)
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
      process.once('SIGHUP', cleanup)
      process.once('SIGQUIT', cleanup)
      process.once('SIGABRT', cleanup)
      process.once('SIGPIPE', cleanup)
      process.once('SIGTSTP', cleanup)
    })
  }

  private async triggerScanForNewAvailableFixes(): Promise<void> {
    try {
      // Try to create authenticated client for background use
      const gqlClient = await createAuthenticatedMcpGQLClient({
        isBackgroundCall: true,
      })

      const isConnected = await gqlClient.verifyApiConnection()
      if (!isConnected) {
        logError('Failed to connect to the API, skipping background scan')
        return
      }
      WorkspaceService.clearKnownWorkspacePath()
      const workspacePath = WorkspaceService.getWorkspaceFolderPath()
      if (workspacePath) {
        try {
          const checkForNewAvailableFixesTool = this.toolRegistry.getTool(
            MCP_TOOL_CHECK_FOR_NEW_AVAILABLE_FIXES
          ) as CheckForNewAvailableFixesTool
          logInfo('Triggering periodic scan for new available fixes')
          checkForNewAvailableFixesTool.triggerScan({
            path: workspacePath,
            gqlClient,
          })
        } catch (error) {
          logError('Error getting workspace folder path tool', { error })
        }
      }
    } catch (error) {
      // Handle authentication failures gracefully in background scans
      if (
        error instanceof Error &&
        (error.message.includes('Authentication') ||
          error.message.includes('failed to connect to Mobb API'))
      ) {
        logError(
          'Background scan skipped due to authentication failure. Please re-authenticate by running a manual scan.',
          {
            error: error.message,
          }
        )
        return
      }

      logError('Unexpected error during background scan', { error })
    }
  }

  public async handleListToolsRequest(
    request: ListToolsRequest
  ): Promise<ListToolsResult> {
    const mcpCheckerTool = this.toolRegistry.getToolDefinition(MCP_TOOL_CHECKER)
    if (mcpCheckerTool) {
      return {
        tools: [
          {
            name: mcpCheckerTool.name,
            display_name: mcpCheckerTool.display_name || mcpCheckerTool.name,
            description: mcpCheckerTool.description,
            inputSchema: {
              type: 'object' as const,
              properties:
                (
                  mcpCheckerTool.inputSchema as {
                    properties?: Record<string, unknown>
                  }
                ).properties || {},
              required:
                (mcpCheckerTool.inputSchema as { required?: string[] })
                  .required || [],
            },
          },
        ],
      }
    }

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

    if (isAutoScan) {
      void this.triggerScanForNewAvailableFixes()
    } else {
      logDebug('Auto scan disabled, skipping triggerScanForNewAvailableFixes')
    }

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

  public async handleListPromptsRequest(
    request: ListPromptsRequest
  ): Promise<ListPromptsResult> {
    logInfo('Received list_prompts request')
    logDebug('list_prompts request', {
      request: JSON.parse(JSON.stringify(request)),
    })

    const promptDefinitions = this.promptRegistry.getAllPrompts()
    const response: ListPromptsResult = {
      prompts: promptDefinitions.map((prompt) => ({
        name: prompt.name,
        description: prompt.description,
        arguments: prompt.arguments,
      })) as Prompt[],
    }

    logDebug('Returning list_prompts response', { response })
    return response
  }

  public async handleGetPromptRequest(
    request: GetPromptRequest
  ): Promise<GetPromptResult> {
    const { name, arguments: args } = request.params
    logInfo(`Received get_prompt request for ${name}`)

    logDebug('get_prompt request', {
      request: JSON.parse(JSON.stringify(request)),
    })

    try {
      const prompt = this.promptRegistry.getPrompt(name)
      if (!prompt) {
        const errorMsg = `Unknown prompt: ${name}`
        logWarn(errorMsg, {
          name,
          availablePrompts: this.promptRegistry.getPromptNames(),
        })
        throw new Error(errorMsg)
      }

      logInfo(`Generating prompt: ${name}`)
      const response = await prompt.getPrompt(args)

      logInfo(`Prompt ${name} generated successfully`)
      logDebug(`Prompt ${name} generated successfully`, {
        hasMessages: !!response.messages,
        messageCount: response.messages?.length,
      })

      return response
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logError(`Error generating prompt ${name}: ${errorMessage}`, {
        error,
        promptName: name,
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

    // List prompts handler
    this.server.setRequestHandler(
      ListPromptsRequestSchema,
      (request: ListPromptsRequest) => this.handleListPromptsRequest(request)
    )

    // Get prompt handler
    this.server.setRequestHandler(
      GetPromptRequestSchema,
      (request: GetPromptRequest) => this.handleGetPromptRequest(request)
    )

    logInfo('MCP server handlers registered')
  }

  public registerTool(tool: BaseTool): void {
    this.toolRegistry.registerTool(tool)
    logInfo(`Tool registered: ${tool.name}`)
  }

  public registerPrompt(prompt: BasePrompt): void {
    this.promptRegistry.registerPrompt(prompt)
    logInfo(`Prompt registered: ${prompt.name}`)
  }

  public getParentProcessId(): number {
    return this.parentPid
  }

  public checkParentProcessAlive(): boolean {
    return this.isParentProcessAlive()
  }

  public async start(): Promise<void> {
    try {
      logInfo('Starting MCP server')
      const transport = new StdioServerTransport()
      await this.server.connect(transport)
      logDebug('MCP server is running on stdin/stdout')

      await this.trackServerUsage('start')

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

    await this.trackServerUsage('stop')

    // Clean up parent process monitoring
    if (this.parentProcessCheckInterval) {
      clearInterval(this.parentProcessCheckInterval)
      this.parentProcessCheckInterval = undefined
      logDebug('Parent process check interval cleared')
    }

    // Remove all socket event handlers that were registered
    this.socketEventHandlers.forEach((handler, eventType) => {
      try {
        switch (eventType) {
          case 'stdin-close':
            process.stdin.removeListener('close', handler)
            break
          case 'stdin-end':
            process.stdin.removeListener('end', handler)
            break
          case 'stdout-error':
            process.stdout.removeListener('error', handler)
            break
          case 'stderr-error':
            process.stderr.removeListener('error', handler)
            break
          case 'disconnect':
            process.removeListener('disconnect', handler)
            break
        }
      } catch (error) {
        logWarn(`Failed to remove ${eventType} listener`, { error })
      }
    })
    this.socketEventHandlers.clear()
    logDebug('Socket event handlers cleaned up')

    // Remove all event handlers that were registered
    this.eventHandlers.forEach((handler, signal) => {
      process.removeListener(signal, handler)
    })
    this.eventHandlers.clear()
    this.isEventHandlersSetup = false

    logDebug('Process event handlers cleaned up')
  }
}
