import { writeFileSync } from 'node:fs'
import * as stream from 'node:stream'

import Configstore from 'configstore'

type LogData = unknown

const DEFAULT_MAX_LOGS = 1000
const DEFAULT_MAX_HEARTBEAT = 100
const LOGS_KEY = 'logs'
const HEARTBEAT_KEY = 'heartbeat'

/** Max JSON-serialized size of the `data` field per log entry. Prevents multi-MB payloads. */
const MAX_DATA_CHARS = 2048
/** Max number of scoped keys per prefix (logs:*, heartbeat:*). Oldest scopes pruned first. */
const MAX_SCOPE_KEYS = 20

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

      // Prune stale scope keys to prevent unbounded growth.
      // e.g. logs:/Users/.../autofixer2 stays forever even if you never use that repo again.
      const prefix = key.includes(':') ? key.split(':')[0] : null
      if (prefix) {
        pruneStaleScopes(prefix)
      }
    } catch {
      try {
        const lines = `${entries.map((e) => JSON.stringify(e)).join('\n')}\n`
        writeFileSync(`${store.path}.fallback`, lines, { flag: 'a' })
      } catch {
        // Nothing we can do — swallow silently
      }
    }
  }

  /**
   * Remove oldest scoped keys when there are too many.
   * Keeps the most recently written scopes (by last entry timestamp).
   */
  function pruneStaleScopes(prefix: string) {
    const allKeys = Object.keys(store.all)
    const scopedKeys = allKeys.filter(
      (k) => k.startsWith(`${prefix}:`) && Array.isArray(store.get(k))
    )

    if (scopedKeys.length <= MAX_SCOPE_KEYS) {
      return
    }

    // Sort by last entry timestamp (oldest first)
    const withTimestamp = scopedKeys.map((k) => {
      const entries = store.get(k) as LogEntry[]
      const last = entries.length > 0 ? entries[entries.length - 1] : undefined
      return { key: k, lastTs: last?.timestamp ?? '' }
    })
    withTimestamp.sort((a, b) => a.lastTs.localeCompare(b.lastTs))

    // Delete oldest until we're at the limit
    const toDelete = withTimestamp.slice(
      0,
      withTimestamp.length - MAX_SCOPE_KEYS
    )
    for (const { key: k } of toDelete) {
      store.delete(k)
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

        // Truncate large data payloads to prevent multi-MB log entries
        let data = parsed.data
        if (data !== undefined) {
          const serialized = JSON.stringify(data)
          if (serialized.length > MAX_DATA_CHARS) {
            data = `${serialized.slice(0, MAX_DATA_CHARS)}... [truncated, ${serialized.length} chars]`
          }
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
          ...(data !== undefined && { data }),
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
