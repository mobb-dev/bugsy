import { writeFileSync } from 'node:fs'
import * as stream from 'node:stream'

import Configstore from 'configstore'

type LogData = unknown

const DEFAULT_MAX_LOGS = 1000
const DEFAULT_MAX_HEARTBEAT = 100
const LOGS_KEY = 'logs'
const HEARTBEAT_KEY = 'heartbeat'

type LogEntry = {
  timestamp: string
  level: string
  message: string
  durationMs?: number
  data?: LogData
}

export type ConfigstoreStreamOptions = {
  buffered: boolean
  scopePath?: string
  maxLogs?: number
  maxHeartbeat?: number
}

export type ConfigstoreStream = {
  writable: stream.Writable
  flush: () => void
  setScopePath: (path: string) => void
}

export function createConfigstoreStream(
  store: Configstore,
  opts: ConfigstoreStreamOptions
): ConfigstoreStream {
  const maxLogs = opts.maxLogs ?? DEFAULT_MAX_LOGS
  const maxHeartbeat = opts.maxHeartbeat ?? DEFAULT_MAX_HEARTBEAT
  const buffer: LogEntry[] = []
  const heartbeatBuffer: LogEntry[] = []
  let scopePath = opts.scopePath

  function storeKey(base: string): string {
    return scopePath ? `${base}:${scopePath}` : base
  }

  function writeToDisk(entries: LogEntry[], key: string, max: number) {
    try {
      const existing = (store.get(key) as LogEntry[] | undefined) ?? []
      existing.push(...entries)
      const trimmed = existing.length > max ? existing.slice(-max) : existing
      store.set(key, trimmed)
    } catch {
      try {
        const lines = `${entries.map((e) => JSON.stringify(e)).join('\n')}\n`
        writeFileSync(`${store.path}.fallback`, lines, { flag: 'a' })
      } catch {
        // Nothing we can do — swallow silently
      }
    }
  }

  const writable = new stream.Writable({
    write(chunk, _encoding, callback) {
      callback()

      try {
        const parsed = JSON.parse(chunk.toString()) as {
          level?: string
          msg?: string
          durationMs?: number
          data?: LogData
          heartbeat?: boolean
          time?: number
        }

        const entry: LogEntry = {
          timestamp: parsed.time
            ? new Date(parsed.time).toISOString()
            : new Date().toISOString(),
          level: parsed.level ?? 'info',
          message: parsed.msg ?? '',
          ...(parsed.durationMs !== undefined && {
            durationMs: parsed.durationMs,
          }),
          ...(parsed.data !== undefined && { data: parsed.data }),
        }

        const isHeartbeat = parsed.heartbeat === true

        if (opts.buffered) {
          if (isHeartbeat) {
            heartbeatBuffer.push(entry)
          } else {
            buffer.push(entry)
          }
        } else {
          if (isHeartbeat) {
            writeToDisk([entry], storeKey(HEARTBEAT_KEY), maxHeartbeat)
          } else {
            writeToDisk([entry], storeKey(LOGS_KEY), maxLogs)
          }
        }
      } catch {
        // Malformed pino line — skip
      }
    },
  })

  function flush() {
    if (buffer.length > 0) {
      writeToDisk(buffer, storeKey(LOGS_KEY), maxLogs)
      buffer.length = 0
    }
    if (heartbeatBuffer.length > 0) {
      writeToDisk(heartbeatBuffer, storeKey(HEARTBEAT_KEY), maxHeartbeat)
      heartbeatBuffer.length = 0
    }
  }

  function setScopePath(path: string) {
    scopePath = path
  }

  return { writable, flush, setScopePath }
}
