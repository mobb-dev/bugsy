import { createLogger, type Logger } from '../../utils/shared-logger'

// Replaced at build time by tsup `define`. Falls back to empty string in dev.
declare const __DD_RUM_TOKEN__: string
declare const __CLI_VERSION__: string
const DD_RUM_TOKEN: string =
  typeof __DD_RUM_TOKEN__ !== 'undefined' ? __DD_RUM_TOKEN__ : ''
const CLI_VERSION: string =
  typeof __CLI_VERSION__ !== 'undefined' ? __CLI_VERSION__ : 'unknown'

const NAMESPACE = 'mobbdev-claude-code-hook-logs'

function createHookLogger(scopePath?: string): Logger {
  return createLogger({
    namespace: NAMESPACE,
    scopePath,
    dd: {
      apiKey: DD_RUM_TOKEN,
      ddsource: 'mobbdev-cli',
      service: 'mobbdev-cli-hook',
      ddtags: `version:${CLI_VERSION}`,
      hostnameMode: 'hashed',
      unrefTimer: true,
    },
  })
}

const logger = createHookLogger()
const activeScopedLoggers: Logger[] = []

export const hookLog = logger

/** Flush the global logger and all active scoped loggers. */
export function flushLogs() {
  logger.flushLogs()
  for (const scoped of activeScopedLoggers) {
    scoped.flushLogs()
  }
  activeScopedLoggers.length = 0
}

/** Flush buffered Datadog logs and stop the timer. Call before process exit. */
export async function flushDdLogs(): Promise<void> {
  await logger.flushDdAsync()
  for (const scoped of activeScopedLoggers) {
    await scoped.flushDdAsync()
  }
}

/** Create a scoped logger for a specific project path.
 *  Registered for flushing via flushLogs(). */
export function createScopedHookLog(scopePath: string): Logger {
  const scoped = createHookLogger(scopePath)
  activeScopedLoggers.push(scoped)
  return scoped
}
