import os from 'node:os'

import { packageJson } from '../../utils/check_node_version'

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
 * Machine details forwarded to the web login so the MVS page can show the
 * developer's device (computer name + OS username) and client version.
 */
export type LoginMachineInfo = {
  hostname: string
  computerUser?: string
  clientVersion?: string
}

/**
 * Builds a URL with machine details and optional login-context query params.
 * @param baseUrl - The base URL for the login endpoint
 * @param loginId - The unique login session ID
 * @param machine - The client machine details (hostname + OS user + version)
 * @param context - The login context with trigger, source, and optional IDE
 *   info. When omitted, only the machine params are appended.
 * @returns The complete URL with query parameters
 * @throws {TypeError} If baseUrl is not a valid URL
 */
export function buildLoginUrl(
  baseUrl: string,
  loginId: string,
  machine: LoginMachineInfo,
  context?: LoginContext
): string {
  const url = new URL(`${baseUrl}/${loginId}`)
  url.searchParams.set('hostname', machine.hostname)
  if (machine.computerUser) {
    url.searchParams.set('computerUser', machine.computerUser)
  }
  if (machine.clientVersion) {
    url.searchParams.set('clientVersion', machine.clientVersion)
  }
  if (context) {
    url.searchParams.set('trigger', context.trigger)
    url.searchParams.set('source', context.source)
    if (context.ide) {
      url.searchParams.set('ide', context.ide)
    }
  }
  return url.toString()
}

/**
 * Best-effort OS username for MVS device attribution. os.userInfo() can throw
 * when there's no passwd entry (some containers), so it's guarded.
 */
export function getComputerUser(): string | undefined {
  try {
    return os.userInfo().username || undefined
  } catch {
    return undefined
  }
}

export function getLoginMachineInfo(): LoginMachineInfo {
  return {
    hostname: os.hostname(),
    computerUser: getComputerUser(),
    clientVersion: packageJson.version,
  }
}

/**
 * Shared entry point for the browser login URL (CLI + MCP flows): gathers the
 * local machine details and appends the optional login context.
 */
export function buildLoginBrowserUrl(
  baseUrl: string,
  loginId: string,
  context?: LoginContext
): string {
  return buildLoginUrl(baseUrl, loginId, getLoginMachineInfo(), context)
}
