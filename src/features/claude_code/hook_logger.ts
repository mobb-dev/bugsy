import { createLogger, type Logger } from '../../utils/shared-logger'

// Replaced at build time by tsup `define`. Falls back to empty string in dev.
declare const __DD_RUM_TOKEN__: string
declare const __CLI_VERSION__: string
const DD_RUM_TOKEN: string =
  typeof __DD_RUM_TOKEN__ !== 'undefined' ? __DD_RUM_TOKEN__ : ''
const CLI_VERSION: string =
  typeof __CLI_VERSION__ !== 'undefined' ? __CLI_VERSION__ : 'unknown'

const NAMESPACE = 'mobbdev-claude-code-hook-logs'

/** Claude Code version detected at runtime. Set via setClaudeCodeVersion(). */
let claudeCodeVersion: string | undefined

function buildDdTags(): string {
  const tags = [`version:${CLI_VERSION}`]
  if (claudeCodeVersion) {
    tags.push(`cc_version:${claudeCodeVersion}`)
  }
  return tags.join(',')
}

function createHookLogger(scopePath?: string): Logger {
  return createLogger({
    namespace: NAMESPACE,
    scopePath,
    dd: {
      apiKey: DD_RUM_TOKEN,
      ddsource: 'mobbdev-cli',
      service: 'mobbdev-cli-hook',
      ddtags: buildDdTags(),
      hostnameMode: 'hashed',
      unrefTimer: true,
    },
  })
}

const logger = createHookLogger()
const activeScopedLoggers: Logger[] = []

export const hookLog = logger

/**
 * Set the detected Claude Code version. Call once early in the hook lifecycle.
 * Updates the global logger's ddtags immediately and ensures new scoped
 * loggers also include cc_version.
 */
export function setClaudeCodeVersion(version: string | undefined): void {
  claudeCodeVersion = version
  // Update the already-created global logger so all subsequent logs include cc_version
  logger.updateDdTags(buildDdTags())
}

/** Get the currently detected Claude Code version. */
export function getClaudeCodeVersion(): string | undefined {
  return claudeCodeVersion
}

/** Flush the global logger and all active scoped loggers (configstore only). */
export function flushLogs() {
  logger.flushLogs()
  for (const scoped of activeScopedLoggers) {
    scoped.flushLogs()
  }
}

/** Flush buffered Datadog logs for all loggers, then clear scoped loggers. Call before process exit. */
export async function flushDdLogs(): Promise<void> {
  await logger.flushDdAsync()
  for (const scoped of activeScopedLoggers) {
    await scoped.flushDdAsync()
  }
  activeScopedLoggers.length = 0
}

/** Create a scoped logger for a specific project path.
 *  Registered for flushing via flushLogs(). */
export function createScopedHookLog(scopePath: string): Logger {
  const scoped = createHookLogger(scopePath)
  activeScopedLoggers.push(scoped)
  return scoped
}
