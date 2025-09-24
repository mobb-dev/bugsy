export async function waitFor(
  expectation: () => void | Promise<void>,
  {
    timeout = 1000,
    interval = 50,
  }: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const start = Date.now()
  let lastError: unknown

  while (Date.now() - start < timeout) {
    try {
      await expectation()
      return // success
    } catch (err) {
      lastError = err
    }

    // wait before next attempt
    // Sequential polling is intentional - we need to check each attempt in order
    await new Promise((r) => setTimeout(r, interval))
  }

  // timeout exceeded
  throw lastError instanceof Error
    ? lastError
    : new Error(`waitFor: expectation did not pass within ${timeout}ms$`)
}

// Alias that reads nicely in assertions
export const eventually = waitFor

/**
 * Waits for a specific log message to appear in a logs array
 * @param logs Array of log objects to search through
 * @param message The message to wait for
 * @param options Configuration options for timeout and interval
 * @returns Promise that resolves when the log message appears
 */
export async function waitForLog(
  logs: { message: string; data: unknown }[],
  message: string,
  {
    timeout = 60000,
    interval = 100,
  }: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const start = Date.now()

  while (Date.now() - start < timeout) {
    // Check if any log message matches our expectation
    const found = logs.some((log) => log.message.includes(message))

    if (found) {
      return // success
    }

    // Wait before next check
    await new Promise((r) => setTimeout(r, interval))
  }

  // Timeout exceeded
  const recentMessages = logs.slice(-5).map((log) => log.message)
  throw new Error(
    `waitForLog: Expected log message "${message}" not found within ${timeout}ms. ` +
      `Recent log messages: ${recentMessages.join(', ')}`
  )
}
