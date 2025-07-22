import { sleep } from '@mobb/bugsy/utils'

/**
 * Helper function to check if a specific log message exists in the logs array.
 * Handles object property order in the data comparison.
 */
export const expectLoggerMessage = async (
  logs: { message: string; data: unknown }[],
  message: string,
  expectedData?: unknown,
  {
    timeout = 60000,
    interval = 50,
  }: { timeout?: number; interval?: number } = {}
) => {
  // Helper function to sort object keys for consistent JSON.stringify output
  const sortObjectKeys = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    // Handle arrays by recursively sorting their elements
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys) as unknown as T
    }
    // Sort object keys and build a new object with sorted keys
    return Object.keys(obj as object)
      .sort()
      .reduce((result: Record<string, unknown>, key) => {
        result[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
        return result
      }, {}) as T
  }

  const start = Date.now()
  let lastError: unknown
  let formattedLogs: string = ''

  while (Date.now() - start < timeout) {
    try {
      // Check if message exists in any log type
      const hasMessage = logs.some((logEntry) => {
        if (logEntry.message.includes(message)) {
          if (expectedData) {
            // Sort keys before comparing to ensure property order doesn't matter
            return (
              JSON.stringify(sortObjectKeys(logEntry.data)) ===
              JSON.stringify(sortObjectKeys(expectedData))
            )
          }
          return true
        }
        return false
      })

      // Format logs for error message display
      formattedLogs = logs
        .map((log, i) => {
          const dataStr = log.data ? `, data: ${JSON.stringify(log.data)}` : ''
          return `  ${i + 1}. message: ${log.message}${dataStr}`
        })
        .join('\n')

      // Use an explicit error message rather than relying on the expect behavior
      if (!hasMessage) {
        if (expectedData) {
          throw new Error(
            `Message "${message}" with expected data not found in logs:\n${formattedLogs}`
          )
        } else {
          throw new Error(
            `Message "${message}" not found in logs:\n${formattedLogs}`
          )
        }
      }

      return // success
    } catch (err) {
      lastError = err
    }

    // Sequential polling is intentional - we need to check in sequence with delay between attempts
    await sleep(interval)
  }

  // timeout exceeded
  throw lastError instanceof Error
    ? lastError
    : new Error(
        `expectLoggerMessage: message "${message}" did not appear within ${timeout}ms\n${formattedLogs}`
      )
}
