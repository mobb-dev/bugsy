import { Argv } from 'yargs'

import { organizationIdOptions } from '../../args/options'
import { validateOrganizationId } from '../../args/validation'
import { startMcpServer } from '../../mcp/index'

export const mcpBuilder = (yargs: Argv) => {
  return yargs
    .example('$0 mcp', 'Launch the MCP server')
    .option('gov-org-id', organizationIdOptions)
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
export const mcpHandler = async (_args: {
  debug?: boolean
  govOrgId?: string
}) => {
  try {
    validateOrganizationId(_args.govOrgId)
    await startMcpServer({ govOrgId: _args.govOrgId })
  } catch (error) {
    console.error('Failed to start MCP server:', error)
    process.exit(1)
  }
}
