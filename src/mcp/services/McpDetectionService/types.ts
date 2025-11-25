/**
 * MCP Server configuration
 */
export type MCPServerConfig = {
  readonly command?: string
  readonly args?: readonly string[]
  readonly url?: string
  readonly env?: Readonly<Record<string, string>>
  readonly type?: string
}

/**
 * MCP configuration containing server definitions
 */
export type MCPConfig = {
  readonly mcpServers?: Readonly<Record<string, MCPServerConfig>>
  readonly servers?: Readonly<Record<string, MCPServerConfig>> // Alternative key name
}

/**
 * Workspace information from IDE storage
 */
export type WorkspaceInfo = {
  readonly folder?: string
  readonly workspace?: {
    readonly uri?: string
  }
}

/**
 * Result of workspace detection with MCP configuration
 */
export type WorkspaceResult = {
  readonly workspacePath: string
  readonly storageId: string
  readonly mcpConfig: MCPConfig | null
}

/**
 * Supported IDE types
 */
export type IDE = 'cursor' | 'vscode'
