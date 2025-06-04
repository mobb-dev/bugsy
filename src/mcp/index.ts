// 0. Import dependencies
import { McpServer } from './core/McpServer'
import { logDebug, logError, logInfo } from './Logger'
import { FixVulnerabilitiesTool } from './tools/fixVulnerabilities/FixVulnerabilitiesTool'

/**
 * Creates and configures the MCP server with all tools and services
 */
export function createMcpServer(): McpServer {
  logDebug('Creating MCP server')

  // Create the server
  const server = new McpServer({
    name: 'mobb-mcp',
    version: '1.0.0',
  })

  // Create and register tools
  const fixVulnerabilitiesTool = new FixVulnerabilitiesTool()

  server.registerTool({
    name: fixVulnerabilitiesTool.name,
    definition: {
      name: fixVulnerabilitiesTool.name,
      display_name: fixVulnerabilitiesTool.display_name,
      description: fixVulnerabilitiesTool.description,
      inputSchema: fixVulnerabilitiesTool.inputSchema,
    },
    execute: (args: unknown) =>
      fixVulnerabilitiesTool.execute(args as { path: string }),
  })

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
