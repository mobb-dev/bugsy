const logglerUrl = 'http://localhost:4444/log'

type LogLevel = 'info' | 'error' | 'warn' | 'debug' | 'trace'

type LogData = unknown

class Logger {
  log(message: string, level: LogLevel = 'info', data?: LogData) {
    const logMessage = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }

    //post log message to loggler
    try {
      fetch(logglerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logMessage),
      })
    } catch (error) {
      //do nothing
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

export default logger.log
export { logDebug, logError, logInfo, logWarn }
