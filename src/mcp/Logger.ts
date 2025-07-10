import { packageJson } from '../utils'

const loggerUrl = 'http://localhost:4444/log'
const isTestEnvironment =
  process.env['NODE_ENV'] === 'test' ||
  process.env['VITEST'] ||
  process.env['TEST']

type LogData = unknown

type LogMessage = {
  message: string
  level: string
  data?: LogData
}

const CIRCUIT_BREAKER_TIME = 5000 // 30 seconds
const URL_CHECK_TIMEOUT = 200 // 200ms for reachability check
const MAX_QUEUE_SIZE = 100 // Limit the queue to 100 log entries

class Logger {
  private queue: LogMessage[] = []
  private isProcessing = false
  private isCircuitBroken = false
  private circuitBreakerTimer: NodeJS.Timeout | null = null

  log(message: string, level: string = 'info', data?: LogData) {
    // Skip external logging in test environment
    if (isTestEnvironment) return

    // Add message to queue
    // Ensure queue does not exceed the maximum size
    if (this.queue.length >= MAX_QUEUE_SIZE) {
      // Remove the oldest log entry to make room for the new one
      this.queue.shift()
    }

    this.queue.push({ message, level, data })

    // Process queue if not already processing
    if (!this.isProcessing && !this.isCircuitBroken) {
      this.processQueue()
    }
  }

  private async isUrlReachable(url: string): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), URL_CHECK_TIMEOUT)

      await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      })
      // We treat ANY response (even 4xx/5xx) as reachable; only network errors will throw.

      clearTimeout(timeoutId)
      return true
    } catch (error) {
      return false
    }
  }

  private async processQueue() {
    // If queue is empty or circuit breaker is active, stop processing
    if (this.queue.length === 0 || this.isCircuitBroken) {
      this.isProcessing = false
      return
    }

    this.isProcessing = true
    const logEntry = this.queue[0]

    // Safety check
    if (!logEntry) {
      this.isProcessing = false
      return
    }

    // Check if loggerUrl is reachable
    const isReachable = await this.isUrlReachable(loggerUrl)
    if (!isReachable) {
      // URL is not reachable, trigger circuit breaker
      this.triggerCircuitBreaker()
      return
    }

    await this.sendLogEntry(logEntry)
  }

  private async sendLogEntry(logEntry: LogMessage) {
    const logMessage = {
      timestamp: new Date().toISOString(),
      level: logEntry.level,
      message: logEntry.message,
      data: logEntry.data,
      version: packageJson.version,
    }

    // Create an AbortController
    const controller = new AbortController()

    // Set a timeout to abort the request
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 500) // 500ms timeout

    // Send the log message
    try {
      await fetch(loggerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logMessage),
        redirect: 'error', // do not follow redirects
        signal: controller.signal,
      })
      // Remove the processed item from queue
      this.queue.shift()

      // Process next item
      setTimeout(() => this.processQueue(), 0)
    } catch (error) {
      // On failure, trigger circuit breaker
      this.triggerCircuitBreaker()
      logError('Failed to send log entry', error) // Added error logging
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private triggerCircuitBreaker() {
    // Set circuit breaker
    this.isCircuitBroken = true

    // Clear all pending requests
    this.queue = []

    // Stop processing
    this.isProcessing = false

    // Clear any existing timer
    if (this.circuitBreakerTimer) {
      clearTimeout(this.circuitBreakerTimer)
    }

    // Reset circuit breaker after timeout
    this.circuitBreakerTimer = setTimeout(() => {
      this.isCircuitBroken = false
      this.circuitBreakerTimer = null

      // Try processing queue again if there are new items
      if (this.queue.length > 0 && !this.isProcessing) {
        this.processQueue()
      }
    }, CIRCUIT_BREAKER_TIME)
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
