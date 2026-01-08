/**
 * Supported IDE/editor types for tracking and analytics.
 * Keep in sync with clients/tracer_ext/src/shared/repositoryInfo.ts
 */
export type IDE = 'cursor' | 'vscode' | 'windsurf' | 'claude' | 'webstorm'

/**
 * Detects the IDE/editor host based on environment variables.
 * Detection order: Cursor, Windsurf, Claude, WebStorm, VS Code (last since others are forks)
 * @returns The detected IDE or undefined if no IDE could be detected
 */
export function detectIDE(): IDE | undefined {
  const env = process.env

  // Check specific IDEs first (more specific env vars)
  if (env['CURSOR_TRACE_ID'] || env['CURSOR_SESSION_ID']) return 'cursor'
  if (env['WINDSURF_IPC_HOOK'] || env['WINDSURF_PID']) return 'windsurf'
  if (env['CLAUDE_DESKTOP'] || env['ANTHROPIC_CLAUDE']) return 'claude'
  if (
    env['WEBSTORM_VM_OPTIONS'] ||
    env['IDEA_VM_OPTIONS'] ||
    env['JETBRAINS_IDE']
  )
    return 'webstorm'
  if (env['VSCODE_IPC_HOOK'] || env['VSCODE_PID']) return 'vscode'

  // Fallback to TERM_PROGRAM
  const termProgram = env['TERM_PROGRAM']?.toLowerCase()
  if (termProgram === 'windsurf') return 'windsurf'
  if (termProgram === 'vscode') return 'vscode'

  return undefined
}

/**
 * Valid sources for login requests
 */
export type LoginSource = 'mcp' | 'cli' | 'tracer-ext'

/**
 * Context information about who triggered a login sequence
 */
export type LoginContext = {
  /** The action that triggered the login (e.g., 'scan', 'fetch_fixes', 'review') */
  trigger: string
  /** The source of the login request */
  source: LoginSource
  /** The IDE being used, if applicable */
  ide?: IDE
}

/**
 * Creates a login context for MCP-based authentication
 */
export function createMcpLoginContext(trigger: string): LoginContext {
  return {
    trigger,
    source: 'mcp',
    ide: detectIDE(),
  }
}

/**
 * Creates a login context for CLI-based authentication
 */
export function createCliLoginContext(trigger: string): LoginContext {
  return {
    trigger,
    source: 'cli',
  }
}

/**
 * Builds a URL with login context query parameters
 * @param baseUrl - The base URL for the login endpoint
 * @param loginId - The unique login session ID
 * @param hostname - The hostname of the client machine
 * @param context - The login context with trigger, source, and optional IDE info
 * @returns The complete URL with query parameters
 * @throws {TypeError} If baseUrl is not a valid URL
 */
export function buildLoginUrl(
  baseUrl: string,
  loginId: string,
  hostname: string,
  context: LoginContext
): string {
  const url = new URL(`${baseUrl}/${loginId}`)
  url.searchParams.set('hostname', hostname)
  url.searchParams.set('trigger', context.trigger)
  url.searchParams.set('source', context.source)
  if (context.ide) {
    url.searchParams.set('ide', context.ide)
  }
  return url.toString()
}
