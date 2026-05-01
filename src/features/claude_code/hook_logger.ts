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
  const tags = [
    `version:${CLI_VERSION}`,
    `platform:claude_code`,
    `os:${process.platform}`,
    `arch:${process.arch}`,
  ]
  if (claudeCodeVersion) {
    tags.push(`cc_version:${claudeCodeVersion}`)
  }
  return tags.join(',')
}

/**
 * Guards against recursion when logging a DD-ship failure through the same
 * logger (which will itself try to ship to DD). Nested onError invocations
 * fall back to stderr and don't re-enter the logger.
 */
let handlingDdError = false

function createHookLogger(opts?: {
  scopePath?: string
  enableConfigstore?: boolean
}): Logger {
  const created: Logger = createLogger({
    namespace: NAMESPACE,
    scopePath: opts?.scopePath,
    enableConfigstore: opts?.enableConfigstore,
    dd: {
      apiKey: DD_RUM_TOKEN,
      ddsource: 'mobbdev-cli',
      service: 'mobbdev-cli-hook',
      ddtags: buildDdTags(),
      hostnameMode: 'hashed',
      unrefTimer: true,
      onError: (error) => {
        if (handlingDdError) {
          // Last-resort trail when the logger itself can't reach DD.
          // Stderr is swallowed by the daemon but appears in test/dev runs.
          process.stderr.write(`dd-ship-error: ${String(error)}\n`)
          return
        }
        // Route through the standard logger so the failure lands in
        // configstore logs and ships to DD itself once connectivity
        // recovers — uniform with every other warn in the CLI.
        handlingDdError = true
        try {
          created.warn(
            { err: String(error), source: 'dd-log-shipping' },
            'Datadog log shipping failed'
          )
        } finally {
          handlingDdError = false
        }
      },
    },
  })
  return created
}

const logger = createHookLogger()
const activeScopedLoggers: Logger[] = []
const scopedLoggerCache = new Map<string, Logger>()

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

/** Flush buffered Datadog logs for all loggers. */
export async function flushDdLogs(): Promise<void> {
  await logger.flushDdAsync()
  for (const scoped of activeScopedLoggers) {
    await scoped.flushDdAsync()
  }
}

/** Create or retrieve a scoped logger for a specific project path.
 *  Cached by path to avoid accumulating loggers in long-running daemons.
 *  Set daemonMode to disable configstore (DD-only). */
export function createScopedHookLog(
  scopePath: string,
  opts?: { daemonMode?: boolean }
): Logger {
  const cached = scopedLoggerCache.get(scopePath)
  if (cached) return cached

  const scoped = createHookLogger({
    scopePath,
    enableConfigstore: opts?.daemonMode ? false : undefined,
  })
  scopedLoggerCache.set(scopePath, scoped)
  activeScopedLoggers.push(scoped)
  return scoped
}

/** Number of cached scoped loggers (for monitoring unbounded growth). */
export function getScopedLoggerCount(): number {
  return scopedLoggerCache.size
}
