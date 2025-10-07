export type HostIDE =
  | 'CURSOR'
  | 'VSCODE'
  | 'WINDSURF'
  | 'CLAUDE'
  | 'WEBSTORM'
  | 'UNKNOWN'

/**
 * Service for managing workspace-related operations
 */
export class WorkspaceService {
  private static knownWorkspacePath: string | undefined

  /**
   * Sets a known workspace path that was discovered through successful validation
   * @param path The validated workspace path to store
   */
  public static setKnownWorkspacePath(path: string): void {
    this.knownWorkspacePath = path
  }

  /**
   * Gets the known workspace path that was previously validated
   * @returns The known workspace path or undefined if none stored
   */
  public static getKnownWorkspacePath(): string | undefined {
    return this.knownWorkspacePath
  }

  /**
   * Gets the workspace folder path from known path or environment variables
   * @returns The workspace folder path or undefined if none found
   */
  public static getWorkspaceFolderPath(): string | undefined {
    // Return known workspace path first if available (it's been validated)
    if (this.knownWorkspacePath) {
      return this.knownWorkspacePath
    }

    // Array of environment variables that might contain workspace/working directory paths
    // Ordered by preference: more specific to more general
    const workspaceEnvVars = [
      'WORKSPACE_FOLDER_PATHS', // Cursor IDE
      'PWD', // Claude Code and general shell
      'WORKSPACE_ROOT', // Generic workspace root
      'PROJECT_ROOT', // Generic project root
    ]

    // Return the first non-empty environment variable
    for (const envVar of workspaceEnvVars) {
      const value = process.env[envVar]
      if (value?.trim()) {
        return value.trim()
      }
    }

    return undefined
  }

  ///this should be deleted, use instead the host detection from the McpUsageService
  /**
   * Detects the IDE/editor host based on environment variables
   * @returns The detected IDE host
   */
  public static getHost(): HostIDE {
    // Check for Cursor IDE
    if (process.env['WORKSPACE_FOLDER_PATHS']) {
      return 'CURSOR'
    }

    // Check for VSCode
    if (
      process.env['VSCODE_IPC_HOOK'] ||
      process.env['VSCODE_PID'] ||
      process.env['TERM_PROGRAM'] === 'vscode'
    ) {
      return 'VSCODE'
    }

    // Check for Windsurf
    if (
      process.env['WINDSURF_IPC_HOOK'] ||
      process.env['WINDSURF_PID'] ||
      process.env['TERM_PROGRAM'] === 'windsurf'
    ) {
      return 'WINDSURF'
    }

    // Check for Claude Desktop
    if (process.env['CLAUDE_DESKTOP'] || process.env['ANTHROPIC_CLAUDE']) {
      return 'CLAUDE'
    }

    // Check for WebStorm/JetBrains IDEs
    if (
      process.env['WEBSTORM_VM_OPTIONS'] ||
      process.env['IDEA_VM_OPTIONS'] ||
      process.env['JETBRAINS_IDE']
    ) {
      return 'WEBSTORM'
    }

    return 'UNKNOWN'
  }
}
