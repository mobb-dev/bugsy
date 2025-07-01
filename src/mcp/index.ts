// 0. Import dependencies
import { packageJson } from '../utils'
import { McpServer } from './core/McpServer'
import { logDebug, logError, logInfo } from './Logger'
import { BaseTool } from './tools/base/BaseTool'
import { CheckForNewAvailableFixesTool } from './tools/checkForNewAvailableFixes/CheckForNewAvailableFixesTool'
import { FetchAvailableFixesTool } from './tools/fetchAvailableFixes/FetchAvailableFixesTool'
import { ScanAndFixVulnerabilitiesTool } from './tools/scanAndFixVulnerabilities/ScanAndFixVulnerabilitiesTool'

/**
 * Creates and configures the MCP server with all tools and services
 */
export function createMcpServer(): McpServer {
  logDebug('Creating MCP server')

  // Create the server
  const server = new McpServer({
    name: 'mobb-mcp',
    version: packageJson.version,
  })

  // Determine which tools should be enabled based on the TOOLS_ENABLED env variable.
  // If TOOLS_ENABLED is not provided, all tools will be registered (existing behaviour).
  const enabledToolsEnv = process.env['TOOLS_ENABLED']
  const enabledToolsSet = enabledToolsEnv
    ? new Set(
        enabledToolsEnv
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      )
    : null

  // Helper that registers a tool only if it's included in the enabledToolsSet (or if no filter is set)
  const registerIfEnabled = (tool: BaseTool) => {
    if (!enabledToolsSet || enabledToolsSet.has(tool.name)) {
      server.registerTool(tool)
      logDebug(`Registered tool: ${tool.name}`)
    } else {
      logDebug(`Skipping tool (disabled): ${tool.name}`)
    }
  }

  // Create tools (instantiation is cheap and required to inspect the tool.name)
  const scanAndFixVulnerabilitiesTool = new ScanAndFixVulnerabilitiesTool()
  const fetchAvailableFixesTool = new FetchAvailableFixesTool()
  const checkForNewAvailableFixesTool = new CheckForNewAvailableFixesTool()

  // Conditionally register tools
  registerIfEnabled(scanAndFixVulnerabilitiesTool)
  registerIfEnabled(fetchAvailableFixesTool)
  registerIfEnabled(checkForNewAvailableFixesTool)

  logInfo('MCP server created and configured')
  return server
}

/**
 * Main MCP server function that can be called directly
 */
export async function startMcpServer(): Promise<void> {
  try {
    logDebug('Initializing MCP server')

    // Create and configure the server
    const server = createMcpServer()

    // Start the server (now handles its own lifecycle)
    await server.start()
  } catch (error) {
    logError('Failed to start MCP server', { error })
    throw error
  }
}

// Note: This file is now imported by the CLI and not executed directly
