import * as stream from 'node:stream'

import Configstore from 'configstore'
import pino from 'pino'

import { createConfigstoreStream } from './configstore-stream'
import { createDdBatch, type DdBatch, type DdBatchConfig } from './dd-batch'
import { getHashedHostname, getPlainHostname } from './hostname'

type LogData = unknown

export type LoggerDdConfig = {
  apiKey: string
  ddsource: string
  service: string
  ddtags: string
  /** 'plain' = user@host, 'hashed' = sha256(user)@sha256(host). Default: 'plain'. */
  hostnameMode?: 'plain' | 'hashed'
  /** Call .unref() on the flush timer so it doesn't block Node.js exit. Default: false. */
  unrefTimer?: boolean
  /** Called on Datadog HTTP errors (e.g. to log to VS Code output channel). */
  onError?: (error: unknown) => void
}

export type LoggerConfig = {
  /** Configstore namespace (determines the backing JSON file path). */
  namespace: string
  /** Scope logs per project/workspace path. */
  scopePath?: string
  /** Buffer writes and flush on flushLogs(). Default: true. */
  buffered?: boolean
  /** Max log entries in ring buffer. Default: 1000. */
  maxLogs?: number
  /** Max heartbeat entries in ring buffer. Default: 100. */
  maxHeartbeat?: number
  /** Datadog config. Omit to disable Datadog logging. */
  dd?: LoggerDdConfig
  /** Extra pino streams (e.g. VS Code pretty-print output channel). */
  additionalStreams?: {
    stream: stream.Writable
    level: string | number
  }[]
}

export type Logger = {
  info: pino.LogFn
  warn: pino.LogFn
  error: pino.LogFn
  debug: pino.LogFn
  heartbeat(message: string, data?: LogData): void
  timed<T>(label: string, fn: () => Promise<T>): Promise<T>
  /** Flush buffered configstore entries to disk. No-op when buffered is false. */
  flushLogs(): void
  /** Flush Datadog batch and await the pending HTTP request. */
  flushDdAsync(): Promise<void>
  /** Flush Datadog batch and clear the timer. */
  disposeDd(): void
  /** Update the configstore scope path (e.g. when workspace becomes known). */
  setScopePath(path: string): void
  /** Update Datadog tags at runtime (e.g. after detecting Claude Code version). */
  updateDdTags(ddtags: string): void
}

export function createLogger(config: LoggerConfig): Logger {
  const {
    namespace,
    scopePath,
    buffered = true,
    maxLogs,
    maxHeartbeat,
    dd,
    additionalStreams = [],
  } = config

  // --- Configstore stream ---
  const store = new Configstore(namespace, {})
  const csStream = createConfigstoreStream(store, {
    buffered,
    scopePath,
    maxLogs,
    maxHeartbeat,
  })

  // --- Datadog batch ---
  let ddBatch: DdBatch | null = null
  if (dd) {
    const hostname =
      dd.hostnameMode === 'hashed' ? getHashedHostname() : getPlainHostname()

    const ddConfig: DdBatchConfig = {
      apiKey: dd.apiKey,
      ddsource: dd.ddsource,
      service: dd.service,
      ddtags: dd.ddtags,
      hostname,
      unrefTimer: dd.unrefTimer,
      onError: dd.onError,
    }
    ddBatch = createDdBatch(ddConfig)
  }

  // --- Assemble pino multistream ---
  const streams: pino.StreamEntry[] = [
    { stream: csStream.writable, level: 'info' as const },
  ]

  if (ddBatch) {
    streams.push({ stream: ddBatch.createPinoStream(), level: 'info' as const })
  }

  for (const extra of additionalStreams) {
    streams.push({
      stream: extra.stream,
      level: extra.level as pino.Level,
    })
  }

  const pinoLogger = pino(
    {
      formatters: {
        level: (label) => ({ level: label }),
      },
    },
    pino.multistream(streams)
  )

  // --- Public API ---
  const info: pino.LogFn = pinoLogger.info.bind(pinoLogger)
  const warn: pino.LogFn = pinoLogger.warn.bind(pinoLogger)
  const error: pino.LogFn = pinoLogger.error.bind(pinoLogger)
  const debug: pino.LogFn = pinoLogger.debug.bind(pinoLogger)

  function heartbeat(message: string, data?: LogData): void {
    pinoLogger.info({ data, heartbeat: true }, message)
  }

  async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      pinoLogger.info({ durationMs: Date.now() - start }, label)
      return result
    } catch (err) {
      pinoLogger.error(
        {
          durationMs: Date.now() - start,
          data: err instanceof Error ? err.message : String(err),
        },
        `${label} [FAILED]`
      )
      throw err
    }
  }

  function flushLogs(): void {
    csStream.flush()
  }

  async function flushDdAsync(): Promise<void> {
    if (ddBatch) {
      await ddBatch.flushAsync()
    }
  }

  function disposeDd(): void {
    if (ddBatch) {
      ddBatch.dispose()
    }
  }

  function updateDdTags(newDdTags: string): void {
    if (ddBatch) {
      ddBatch.updateDdTags(newDdTags)
    }
  }

  return {
    info,
    warn,
    error,
    debug,
    heartbeat,
    timed,
    flushLogs,
    flushDdAsync,
    disposeDd,
    setScopePath: csStream.setScopePath,
    updateDdTags,
  }
}
