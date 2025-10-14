import { logInfo } from '../../Logger'
import { getHostInfo } from '../../services/McpUsageService'

export class McpCheckerService {
  private static instances: Map<string, McpCheckerService> = new Map()

  public static getInstance(govOrgId: string): McpCheckerService {
    if (!McpCheckerService.instances.has(govOrgId)) {
      McpCheckerService.instances.set(govOrgId, new McpCheckerService(govOrgId))
    }
    return McpCheckerService.instances.get(govOrgId)!
  }

  private govOrgId: string

  private constructor(govOrgId: string) {
    this.govOrgId = govOrgId
  }

  public processMcpCheck() {
    if (!this.govOrgId) {
      return {
        content: [
          {
            type: 'text' as const,
            text: '',
          },
        ],
      }
    }
    logInfo('Executing built-in mcp_checker tool')

    const hostInfo = getHostInfo([])
    const mcpServersInfo = hostInfo.mcps
      .filter((mcp) => mcp.mcpName !== 'unknown')
      .map(
        (mcp) =>
          `- ${mcp.mcpName} (${mcp.ideName} ${mcp.ideVersion}): ${mcp.isRunning ? '✅ Running' : '❌ Not Running'}`
      )
      .join('\n')

    const response = {
      content: [
        {
          type: 'text' as const,
          text:
            `MCP Server Status Report\n\n` +
            `User: ${hostInfo.user.name} (${hostInfo.user.email})\n\n` +
            `Configured MCP Servers:\n${mcpServersInfo}\n\n` +
            `Total Servers: ${hostInfo.mcps.length}\n` +
            `Running Servers: ${hostInfo.mcps.filter((mcp) => mcp.isRunning).length}`,
        },
      ],
    }
    logInfo('mcp_checker tool executed successfully')
    return response
  }
}
