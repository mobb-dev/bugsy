import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

import Configstore from 'configstore'

import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import { packageJson } from '../../utils/check_node_version'
import {
  configStore,
  createSessionConfigStore,
} from '../../utils/ConfigStoreService'
import { withTimeout } from '../../utils/with-timeout'
import { DaemonPidFile } from './daemon_pid_file'
import {
  cleanupStaleSessions,
  detectClaudeCodeVersion,
  processTranscript,
} from './data_collector'
import {
  DAEMON_CHUNK_SIZE,
  DAEMON_POLL_INTERVAL_MS,
  DAEMON_TTL_MS,
  GQL_AUTH_TIMEOUT_MS,
} from './data_collector_constants'
import {
  createScopedHookLog,
  flushDdLogs,
  hookLog,
  setClaudeCodeVersion,
} from './hook_logger'
import {
  autoUpgradeMatcherIfStale,
  writeDaemonCheckScript,
} from './install_hook'
import {
  extractCwdFromTranscript,
  scanForTranscripts,
  type TranscriptFileInfo,
} from './transcript_scanner'

/**
 * Starts the background daemon. This is the entry point called by the
 * `claude-code-daemon` CLI command.
 *
 * Lifecycle:
 * 1. Self-dedup: exit if another daemon's heartbeat is fresh
 * 2. Write PID file
 * 3. Authenticate GQL client once
 * 4. Poll loop: scan transcripts, process chunks, update heartbeat
 * 5. Self-terminate after DAEMON_TTL_MS or on any upload/auth error
 */
export async function startDaemon(): Promise<void> {
  hookLog.info('Daemon starting')

  const pidFile = await acquirePidFile()

  async function gracefulExit(code: number, reason: string): Promise<never> {
    hookLog.info({ data: { code } }, `Daemon exiting: ${reason}`)
    pidFile.remove()
    await flushDdLogs()
    process.exit(code)
  }

  let shuttingDown = false
  process.once('SIGTERM', () => {
    shuttingDown = true
  })
  process.once('SIGINT', () => {
    shuttingDown = true
  })
  process.on('uncaughtException', (err) => {
    hookLog.error({ err }, 'Daemon uncaughtException')
    void gracefulExit(1, 'uncaughtException')
  })
  process.on('unhandledRejection', (reason) => {
    hookLog.error({ err: reason }, 'Daemon unhandledRejection')
    void gracefulExit(1, 'unhandledRejection')
  })

  await tryAutoUpgradeHooks()
  writeDaemonCheckScript()

  // Detect Claude Code version once at startup
  try {
    const ccVersion = await detectClaudeCodeVersion()
    setClaudeCodeVersion(ccVersion)
  } catch {
    // Never fail daemon for version detection
  }

  const gqlClient = await authenticateOrExit(gracefulExit)

  const startedAt = Date.now()
  // Track mtime+size per file from last cycle for change detection
  const lastSeen = new Map<string, { mtimeMs: number; size: number }>()
  // Track configDir for cleanupStaleSessions (run once per day)
  let cleanupConfigDir: string | undefined

  // Main poll loop — awaits sleep between cycles to keep the process alive
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Clean shutdown on signal — checked between cycles so flush completes
    if (shuttingDown) {
      await gracefulExit(0, 'signal')
    }

    if (Date.now() - startedAt >= DAEMON_TTL_MS) {
      await gracefulExit(0, 'TTL reached')
    }

    // Update heartbeat to prove liveness to shim + peers
    pidFile.updateHeartbeat()

    try {
      const changed = await detectChangedTranscripts(lastSeen)

      // Process each changed transcript file sequentially
      for (const transcript of changed) {
        const sessionStore = createSessionConfigStore(transcript.sessionId)

        // Remember configDir for cleanup
        if (!cleanupConfigDir) {
          cleanupConfigDir = path.dirname(sessionStore.path)
        }

        await drainTranscript(transcript, sessionStore, gqlClient)
      }

      // Cleanup stale session files (runs at most once per day)
      if (cleanupConfigDir) {
        await cleanupStaleSessions(cleanupConfigDir)
      }
    } catch (err) {
      // Unexpected error in cycle — log but don't exit for scan/stat errors
      hookLog.warn({ err }, 'Unexpected error in daemon cycle')
    }

    // Wait before next cycle
    await sleep(DAEMON_POLL_INTERVAL_MS)
  }
}

/**
 * Create PID file and self-dedup against an existing live daemon.
 */
async function acquirePidFile(): Promise<DaemonPidFile> {
  const pidFile = new DaemonPidFile()
  pidFile.ensureDir()

  pidFile.read()
  if (pidFile.isAlive()) {
    hookLog.info(
      { data: { existingPid: pidFile.data?.pid } },
      'Another daemon is alive, exiting'
    )
    await flushDdLogs()
    process.exit(0)
  }

  pidFile.write(process.pid, packageJson.version)
  hookLog.info({ data: { pid: process.pid } }, 'Daemon PID file written')

  return pidFile
}

/**
 * Authenticate GQL client once — reuse for the daemon's lifetime.
 * On failure, remove PID file and exit immediately (fail-fast).
 * The shim will restart the daemon on the next hook invocation.
 */
async function authenticateOrExit(
  exit: (code: number, reason: string) => Promise<never>
) {
  try {
    const client = await withTimeout(
      getAuthenticatedGQLClient({ isSkipPrompts: true }),
      GQL_AUTH_TIMEOUT_MS,
      'GQL auth'
    )
    hookLog.info('Daemon authenticated')
    return client
  } catch (err) {
    hookLog.error({ err }, 'Daemon auth failed')
    return exit(1, 'auth failed')
  }
}

/**
 * Process a single transcript in DAEMON_CHUNK_SIZE chunks until caught up.
 * Fail-fast on upload errors; log and skip on file I/O errors.
 */
async function drainTranscript(
  transcript: TranscriptFileInfo,
  sessionStore: Configstore,
  gqlClient: Awaited<ReturnType<typeof getAuthenticatedGQLClient>>
): Promise<void> {
  const cwd = await extractCwdFromTranscript(transcript.filePath)
  const log = createScopedHookLog(cwd ?? transcript.projectDir, {
    daemonMode: true,
  })

  try {
    let hasMore = true
    while (hasMore) {
      const result = await processTranscript(
        {
          session_id: transcript.sessionId,
          transcript_path: transcript.filePath,
          cwd,
        },
        sessionStore,
        log,
        DAEMON_CHUNK_SIZE,
        gqlClient
      )

      hasMore =
        result.entriesUploaded + result.entriesSkipped >= DAEMON_CHUNK_SIZE

      if (result.errors > 0) {
        hookLog.warn(
          {
            data: {
              sessionId: transcript.sessionId,
              errors: result.errors,
            },
          },
          'Upload error — will retry next cycle'
        )
        break
      }
    }
  } catch (err) {
    hookLog.warn(
      { err, data: { sessionId: transcript.sessionId } },
      'Error processing transcript — skipping'
    )
  }
}

/** Scan transcripts and return only those changed since last cycle. */
async function detectChangedTranscripts(
  lastSeen: Map<string, { mtimeMs: number; size: number }>
): Promise<TranscriptFileInfo[]> {
  const transcripts = await scanForTranscripts()
  const changed: TranscriptFileInfo[] = []
  const currentPaths = new Set<string>()

  for (const t of transcripts) {
    currentPaths.add(t.filePath)
    const prev = lastSeen.get(t.filePath)
    if (!prev || t.mtimeMs > prev.mtimeMs || t.size > prev.size) {
      changed.push(t)
    }
    lastSeen.set(t.filePath, { mtimeMs: t.mtimeMs, size: t.size })
  }

  for (const p of lastSeen.keys()) {
    if (!currentPaths.has(p)) lastSeen.delete(p)
  }

  return changed
}

/** Auto-upgrade hook config once per CLI version (best-effort). */
async function tryAutoUpgradeHooks(): Promise<void> {
  const lastUpgradeVersion = configStore.get(
    'claudeCode.matcherUpgradeVersion'
  ) as string | undefined
  if (lastUpgradeVersion === packageJson.version) return

  try {
    const upgraded = await autoUpgradeMatcherIfStale()
    configStore.set('claudeCode.matcherUpgradeVersion', packageJson.version)
    if (upgraded) {
      hookLog.info('Auto-upgraded hook matcher')
    }
  } catch (err) {
    hookLog.warn({ err }, 'Failed to auto-upgrade hook matcher')
  }
}
