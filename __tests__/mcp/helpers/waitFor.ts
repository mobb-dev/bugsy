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
