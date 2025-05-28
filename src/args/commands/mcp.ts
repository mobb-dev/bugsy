import { Argv } from 'yargs'

import { startMcpServer } from '../../mcp/index'

export const mcpBuilder = (yargs: Argv) => {
  return yargs
    .example('$0 mcp', 'Launch the MCP server')
    .option('debug', {
      alias: 'd',
      type: 'boolean',
      description: 'Run in debug mode with communication logging',
      default: false,
    })
    .strict()
}

/**
 * Handler for the MCP command - starts the MCP server directly
 */
export const mcpHandler = async (_args: { debug?: boolean }) => {
  try {
    await startMcpServer()
  } catch (error) {
    console.error('Failed to start MCP server:', error)
    process.exit(1)
  }
}
