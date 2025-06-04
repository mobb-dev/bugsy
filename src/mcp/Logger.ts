// Disable external logging during tests to prevent ECONNREFUSED errors
const logglerUrl = 'http://localhost:4444/log'
const isTestEnvironment =
  process.env['NODE_ENV'] === 'test' ||
  process.env['VITEST'] ||
  process.env['TEST']

type LogData = unknown

class Logger {
  log(message: string, level: string = 'info', data?: LogData) {
    const logMessage = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }

    // Skip external logging in test environment
    if (!isTestEnvironment) {
      try {
        fetch(logglerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(logMessage),
        })
      } catch (error) {
        // do nothing
      }
    }
  }
}

const logger = new Logger()

const logInfo = (message: string, data?: LogData) =>
  logger.log(message, 'info', data)
const logError = (message: string, data?: LogData) =>
  logger.log(message, 'error', data)
const logWarn = (message: string, data?: LogData) =>
  logger.log(message, 'warn', data)
const logDebug = (message: string, data?: LogData) =>
  logger.log(message, 'debug', data)

const log = logger.log
export { log, logDebug, logError, logInfo, logWarn }
