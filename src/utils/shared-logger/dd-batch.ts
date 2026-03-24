import * as stream from 'node:stream'
import * as util from 'node:util'

import fetch from 'cross-fetch'

const DD_BATCH_INTERVAL_MS = 5_000
const DD_BATCH_MAX_SIZE = 50

export type DdBatchConfig = {
  apiKey: string
  ddsource: string
  service: string
  ddtags: string
  hostname: string
  /** Call .unref() on the flush timer so it doesn't block Node.js exit (CLI). */
  unrefTimer?: boolean
  /** Called when Datadog HTTP fails (e.g. to log to VS Code output channel). */
  onError?: (error: unknown) => void
}

export type DdBatch = {
  enqueue: (message: string) => void
  flush: () => void
  flushAsync: () => Promise<void>
  dispose: () => void
  createPinoStream: () => stream.Writable
}

export function createDdBatch(config: DdBatchConfig): DdBatch {
  let batch: Record<string, unknown>[] = []
  let flushTimer: ReturnType<typeof setInterval> | null = null
  let pendingFlush: Promise<void> | null = null
  let errorLogged = false

  function flush(): void {
    if (batch.length === 0) return
    const toSend = batch
    batch = []

    pendingFlush = fetch('https://http-intake.logs.datadoghq.com/api/v2/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': config.apiKey,
      },
      body: JSON.stringify(toSend),
    })
      .then(() => undefined)
      .catch((error) => {
        if (!errorLogged) {
          errorLogged = true
          config.onError?.(
            `Error sending log to Datadog (further errors suppressed): ${util.inspect(error)}`
          )
        }
      })
  }

  function enqueue(message: string): void {
    if (!config.apiKey) return

    batch.push({
      hostname: config.hostname,
      ddsource: config.ddsource,
      service: config.service,
      ddtags: config.ddtags,
      message,
    })

    if (!flushTimer) {
      flushTimer = setInterval(flush, DD_BATCH_INTERVAL_MS)
      if (config.unrefTimer) {
        flushTimer.unref()
      }
    }

    if (batch.length >= DD_BATCH_MAX_SIZE) {
      flush()
    }
  }

  async function flushAsync(): Promise<void> {
    flush()
    await pendingFlush
  }

  function dispose(): void {
    flush()
    if (flushTimer) {
      clearInterval(flushTimer)
      flushTimer = null
    }
  }

  function createPinoStream(): stream.Writable {
    return new stream.Writable({
      write(chunk, _encoding, callback) {
        callback()
        enqueue(chunk.toString())
      },
    })
  }

  return { enqueue, flush, flushAsync, dispose, createPinoStream }
}
