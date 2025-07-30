import Configstore from 'configstore'

import { packageJson } from '../utils'

type LogData = unknown

const MAX_LOGS_SIZE = 1000

class Logger {
  private mobbConfigStore: Configstore
  private path: string
  constructor() {
    this.path = process.env['WORKSPACE_FOLDER_PATHS'] || 'unknown'
    this.mobbConfigStore = new Configstore('mobb-logs', {})
    this.mobbConfigStore.set('version', packageJson.version)
  }
  /**
   * Log a message to the console.
   * @param message - The message to log.
   * @param level - The level of the message.
   * @param data - The data to log.
   */
  log(message: string, level: string = 'info', data?: LogData) {
    const logMessage = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }

    const logs = this.mobbConfigStore.get(this.path) || []
    if (logs.length >= MAX_LOGS_SIZE) {
      logs.shift()
    }
    this.mobbConfigStore.set(this.path, [...logs, logMessage])
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

const log = logger.log.bind(logger)
export { log, logDebug, logError, logInfo, logWarn }
