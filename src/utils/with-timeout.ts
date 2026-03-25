import { setTimeout as delay } from 'node:timers/promises'

/** Wraps a promise with a timeout. Rejects with a descriptive error on expiry. */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  const ac = new AbortController()
  return Promise.race([
    promise.finally(() => ac.abort()),
    delay(ms, undefined, { signal: ac.signal }).then(() => {
      throw new Error(`${label} timed out after ${ms}ms`)
    }),
  ])
}
