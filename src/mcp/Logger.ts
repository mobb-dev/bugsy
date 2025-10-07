import Configstore from 'configstore'

import { packageJson } from '../utils'
import { WorkspaceService } from './services/WorkspaceService'

type LogData = unknown

const MAX_LOGS_SIZE = 1000

class Logger {
  private mobbConfigStore: Configstore
  private host: string
  private unknownPathSuffix: string
  private lastKnownPath: string | null = null

  constructor() {
    this.host = WorkspaceService.getHost()
    // Generate a 4-digit random number for unknown workspace paths
    this.unknownPathSuffix = Math.floor(1000 + Math.random() * 9000).toString()
    this.mobbConfigStore = new Configstore('mobb-logs', {})
    this.mobbConfigStore.set('version', packageJson.version)
  }
  /**
   * Gets the current log path, fetching workspace path dynamically
   */
  private getCurrentLogPath(): string {
    const workspacePath = WorkspaceService.getWorkspaceFolderPath()
    if (workspacePath) {
      return `${this.host}:${workspacePath}`
    }
    return `${this.host}:unknown-${this.unknownPathSuffix}`
  }

  /**
   * Migrates logs from unknown path to known workspace path
   */
  private migrateLogs(fromPath: string, toPath: string): void {
    const existingLogs = this.mobbConfigStore.get(fromPath) || []
    const targetLogs = this.mobbConfigStore.get(toPath) || []

    if (existingLogs.length > 0) {
      // Merge logs, keeping the total under MAX_LOGS_SIZE
      const combinedLogs = [...targetLogs, ...existingLogs]
      const finalLogs = combinedLogs.slice(-MAX_LOGS_SIZE)

      this.mobbConfigStore.set(toPath, finalLogs)
      this.mobbConfigStore.delete(fromPath)
    }
  }

  /**
   * Log a message to the console.
   * @param message - The message to log.
   * @param level - The level of the message.
   * @param data - The data to log.
   */
  log(message: string, level: string = 'info', data?: LogData) {
    const currentPath = this.getCurrentLogPath()

    // Check if workspace path became available and we need to migrate logs
    const workspacePath = WorkspaceService.getWorkspaceFolderPath()
    if (workspacePath && this.lastKnownPath !== workspacePath) {
      const unknownPath = `${this.host}:unknown-${this.unknownPathSuffix}`
      const knownPath = `${this.host}:${workspacePath}`

      // Migrate logs if we were using unknown path before
      if (
        this.lastKnownPath === null ||
        this.lastKnownPath.includes('unknown-')
      ) {
        this.migrateLogs(unknownPath, knownPath)
      }

      this.lastKnownPath = workspacePath
    }

    const logMessage = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }

    const logs = this.mobbConfigStore.get(currentPath) || []
    if (logs.length >= MAX_LOGS_SIZE) {
      logs.shift()
    }
    this.mobbConfigStore.set(currentPath, [...logs, logMessage])
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
