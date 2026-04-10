import { setTimeout } from 'node:timers'

import type { Logger } from './shared-logger'

const DEFAULT_TIMEOUT_MS = 10_000

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}
const noopLogger: Pick<Logger, 'debug' | 'error'> = {
  debug: noop,
  error: noop,
}

export async function readStdinData(config?: {
  logger?: Pick<Logger, 'debug' | 'error'>
  timeoutMs?: number
}): Promise<unknown> {
  const logger = config?.logger ?? noopLogger
  const timeoutMs = config?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  logger.debug('Reading stdin data')
  return new Promise((resolve, reject) => {
    let inputData = ''
    let settled = false

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true
        process.stdin.destroy()
        reject(new Error('Timed out reading from stdin'))
      }
    }, timeoutMs)

    process.stdin.setEncoding('utf-8')

    process.stdin.on('data', (chunk: string) => {
      inputData += chunk
    })

    process.stdin.on('end', () => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      try {
        const parsedData = JSON.parse(inputData)
        logger.debug(
          {
            data: { keys: Object.keys(parsedData as Record<string, unknown>) },
          },
          'Parsed stdin data'
        )
        resolve(parsedData)
      } catch (error) {
        const msg = `Failed to parse JSON from stdin: ${(error as Error).message}`
        logger.error(msg)
        reject(new Error(msg))
      }
    })

    process.stdin.on('error', (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      logger.error(
        { data: { error: error.message } },
        'Error reading from stdin'
      )
      reject(new Error(`Error reading from stdin: ${error.message}`))
    })
  })
}
