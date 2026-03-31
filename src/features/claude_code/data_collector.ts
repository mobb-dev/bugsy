import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { access, open, readdir, readFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import Configstore from 'configstore'
import { z } from 'zod'

import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import { prepareAndSendTracyRecords } from '../../features/analysis/graphql/tracy-batch-upload'
import {
  AiBlameInferenceType,
  InferencePlatform,
} from '../../features/analysis/scm/generates/client_generates'
import { packageJson } from '../../utils/check_node_version'
import {
  configStore,
  createSessionConfigStore,
  getSessionFilePrefix,
} from '../../utils/ConfigStoreService'
import type { Logger } from '../../utils/shared-logger'
import { withTimeout } from '../../utils/with-timeout'
import {
  createScopedHookLog,
  getClaudeCodeVersion,
  hookLog,
  setClaudeCodeVersion,
} from './hook_logger'
import { autoUpgradeMatcherIfStale } from './install_hook'

const CC_VERSION_CACHE_KEY = 'claudeCode.detectedCCVersion'
const CC_VERSION_CLI_KEY = 'claudeCode.detectedCCVersionCli'

const GLOBAL_COOLDOWN_MS = 5_000 // 5 seconds — throttle across all sessions on this machine
const HOOK_COOLDOWN_MS = 15_000 // 15 seconds — skip invocations within cooldown (per session)
const ACTIVE_LOCK_TTL_MS = 60_000 // 60 seconds — stale lock fallback if hook crashes without clearing
const GQL_AUTH_TIMEOUT_MS = 15_000 // 15 seconds — max wait for GQL authentication
const STALE_KEY_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000 // 14 days
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000 // Run cleanup at most once per day
const MAX_ENTRIES_PER_INVOCATION = 50 // Cap entries per hook run to avoid CPU spikes on large transcripts

const COOLDOWN_KEY = 'lastHookRunAt'
const ACTIVE_KEY = 'hookActiveAt'

const HookDataSchema = z.object({
  session_id: z.string().nullish(),
  transcript_path: z.string().nullish(),
  cwd: z.string().nullish(),
  hook_event_name: z.string(),
  tool_name: z.string(),
  tool_input: z.unknown(),
  tool_response: z.unknown(),
})

export type HookData = z.infer<typeof HookDataSchema>

type TranscriptEntry = {
  type?: string
  uuid?: string
  sessionId?: string
  timestamp?: string
  [key: string]: unknown
}

const execFileAsync = promisify(execFile)

/**
 * Detect the Claude Code version by running `claude --version`.
 * Cached in configstore — re-detected when our CLI version changes.
 */
async function detectClaudeCodeVersion(): Promise<string | undefined> {
  const cachedCliVersion = configStore.get(CC_VERSION_CLI_KEY) as
    | string
    | undefined
  if (cachedCliVersion === packageJson.version) {
    return configStore.get(CC_VERSION_CACHE_KEY) as string | undefined
  }

  try {
    const { stdout } = await execFileAsync('claude', ['--version'], {
      timeout: 3_000,
      encoding: 'utf-8',
    })
    // Output format: "2.1.87 (Claude Code)" — extract the version number
    const version = stdout.trim().split(/\s/)[0] || stdout.trim()
    configStore.set(CC_VERSION_CACHE_KEY, version)
    configStore.set(CC_VERSION_CLI_KEY, packageJson.version)
    return version
  } catch {
    // claude not in PATH or not installed — cache empty to avoid retrying
    configStore.set(CC_VERSION_CACHE_KEY, undefined)
    configStore.set(CC_VERSION_CLI_KEY, packageJson.version)
    return undefined
  }
}

/**
 * Reads and parses JSON data from stdin
 */
const STDIN_TIMEOUT_MS = 10_000 // 10 seconds

export async function readStdinData(): Promise<unknown> {
  hookLog.debug('Reading stdin data')
  return new Promise((resolve, reject) => {
    let inputData = ''
    let settled = false

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true
        process.stdin.destroy()
        reject(new Error('Timed out reading from stdin'))
      }
    }, STDIN_TIMEOUT_MS)

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
        hookLog.debug(
          {
            data: { keys: Object.keys(parsedData as Record<string, unknown>) },
          },
          'Parsed stdin data'
        )
        resolve(parsedData)
      } catch (error) {
        const msg = `Failed to parse JSON from stdin: ${(error as Error).message}`
        hookLog.error(msg)
        reject(new Error(msg))
      }
    })

    process.stdin.on('error', (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      hookLog.error(
        { data: { error: error.message } },
        'Error reading from stdin'
      )
      reject(new Error(`Error reading from stdin: ${error.message}`))
    })
  })
}

/**
 * Validates hook data structure against the expected schema
 */
export function validateHookData(data: unknown): HookData {
  return HookDataSchema.parse(data)
}

/**
 * Extracts sessionId from the first entry of a transcript JSONL file.
 * Used as a fallback when session_id is missing from hook stdin data
 * (e.g. older Claude Code versions that don't provide it).
 */
export async function extractSessionIdFromTranscript(
  transcriptPath: string
): Promise<string | null> {
  try {
    // Read only the first 4KB to extract sessionId from the first line,
    // avoiding loading the entire transcript file into memory.
    const fh = await open(transcriptPath, 'r')
    try {
      const buf = Buffer.alloc(4096)
      const { bytesRead } = await fh.read(buf, 0, 4096, 0)
      const chunk = buf.toString('utf-8', 0, bytesRead)
      const firstLine = chunk.split('\n').find((l) => l.trim().length > 0)
      if (!firstLine) return null
      const entry = JSON.parse(firstLine) as { sessionId?: string }
      return entry.sessionId ?? null
    } finally {
      await fh.close()
    }
  } catch {
    return null
  }
}

/**
 * Generates a deterministic synthetic ID for entries without a uuid.
 * Uses a hash of sessionId + timestamp + type + line index to produce
 * a stable ID that's consistent across invocations.
 */
function generateSyntheticId(
  sessionId: string | undefined,
  timestamp: string | undefined,
  type: string | undefined,
  lineIndex: number
): string {
  const input = `${sessionId ?? ''}:${timestamp ?? ''}:${type ?? ''}:${lineIndex}`
  const hash = createHash('sha256').update(input).digest('hex').slice(0, 16)
  return `synth:${hash}`
}

/**
 * Returns the key for storing the upload cursor for a transcript file
 * within the per-session configstore.
 */
function getCursorKey(transcriptPath: string): string {
  const hash = createHash('sha256')
    .update(transcriptPath)
    .digest('hex')
    .slice(0, 12)
  return `cursor.${hash}`
}

type CursorValue = {
  id: string
  byteOffset: number
  updatedAt: number
  lastModel?: string
}

/**
 * Resolves the transcript path, falling back to the base project directory
 * when the path doesn't exist (e.g. worktree-derived paths where Claude Code
 * stores the transcript under the original project, not the worktree).
 *
 * Strategy:
 * 1. Try the original path as-is.
 * 2. Strip the worktree suffix from the project dir name and try that.
 * 3. Fall back to scanning sibling project dirs for the same filename.
 */
export async function resolveTranscriptPath(
  transcriptPath: string,
  sessionId: string
): Promise<string> {
  // 1. Fast path — file exists at the given location
  try {
    await access(transcriptPath)
    return transcriptPath
  } catch {
    // continue to fallbacks
  }

  const filename = path.basename(transcriptPath)
  const dirName = path.basename(path.dirname(transcriptPath))
  const projectsDir = path.dirname(path.dirname(transcriptPath))

  // 2. Strip worktree suffix: "-Users-...-repo--claude-worktrees-name" → "-Users-...-repo"
  //    The encoded dir contains "claude-worktrees-" when cwd is inside .claude/worktrees/
  const baseDirName = dirName.replace(/[-.]claude-worktrees-.+$/, '')
  if (baseDirName !== dirName) {
    const candidate = path.join(projectsDir, baseDirName, filename)
    try {
      await access(candidate)
      hookLog.info(
        {
          data: {
            original: transcriptPath,
            resolved: candidate,
            sessionId,
            method: 'worktree-strip',
          },
        },
        'Transcript path resolved via fallback'
      )
      return candidate
    } catch {
      // Stripped path didn't work either, fall through to scan
    }
  }

  // 3. Scan sibling project dirs for the same transcript filename
  try {
    const dirs = await readdir(projectsDir)
    for (const dir of dirs) {
      if (dir === dirName) continue // already tried
      const candidate = path.join(projectsDir, dir, filename)
      try {
        await access(candidate)
        hookLog.info(
          {
            data: {
              original: transcriptPath,
              resolved: candidate,
              sessionId,
              method: 'sibling-scan',
            },
          },
          'Transcript path resolved via fallback'
        )
        return candidate
      } catch {
        // Not in this dir, try next
      }
    }
  } catch {
    // Can't list projects dir
  }

  // No fallback found — return original path and let the caller handle the error
  return transcriptPath
}

/**
 * Reads the transcript JSONL file and returns entries that haven't been
 * uploaded yet (everything after the stored cursor position).
 * Uses a byte offset to avoid re-reading/parsing the entire file on each invocation.
 * Each entry gets an `_recordId` (from uuid or synthetic) assigned.
 *
 * Returns the entries and the total file size (used to save the cursor byte offset).
 */
export async function readNewTranscriptEntries(
  transcriptPath: string,
  sessionId: string,
  sessionStore: Configstore
): Promise<{
  entries: (TranscriptEntry & { _recordId: string })[]
  endByteOffset: number
  resolvedTranscriptPath: string
}> {
  transcriptPath = await resolveTranscriptPath(transcriptPath, sessionId)

  const cursor = sessionStore.get(getCursorKey(transcriptPath)) as
    | CursorValue
    | undefined

  let content: string
  let fileSize: number
  let lineIndexOffset: number

  if (cursor?.byteOffset) {
    // Read only the new portion of the file from the cursor byte offset.
    // The offset always points to a line boundary (after a '\n'),
    // so the first line in the read portion is always a complete JSONL entry.
    const fh = await open(transcriptPath, 'r')
    try {
      const stat = await fh.stat()
      fileSize = stat.size
      if (cursor.byteOffset >= stat.size) {
        hookLog.info({ data: { sessionId } }, 'No new data in transcript file')
        return {
          entries: [],
          endByteOffset: fileSize,
          resolvedTranscriptPath: transcriptPath,
        }
      }
      const buf = Buffer.alloc(stat.size - cursor.byteOffset)
      await fh.read(buf, 0, buf.length, cursor.byteOffset)
      content = buf.toString('utf-8')
    } finally {
      await fh.close()
    }
    // Line index offset is not known precisely without reading the head,
    // but synthetic IDs only need to be unique within the file, so we use
    // the byte offset as a proxy (different from any real line index).
    lineIndexOffset = cursor.byteOffset
    hookLog.debug(
      {
        data: {
          transcriptPath,
          byteOffset: cursor.byteOffset,
          bytesRead: content.length,
        },
      },
      'Read transcript file from offset'
    )
  } else {
    content = await readFile(transcriptPath, 'utf-8')
    fileSize = Buffer.byteLength(content, 'utf-8')
    lineIndexOffset = 0
    hookLog.debug(
      { data: { transcriptPath, totalBytes: fileSize } },
      'Read full transcript file'
    )
  }

  const startOffset = cursor?.byteOffset ?? 0
  const allLines = content.split('\n')

  const parsed: (TranscriptEntry & { _recordId: string })[] = []
  let malformedLines = 0
  let bytesConsumed = 0
  let parsedLineIndex = 0

  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i]!
    const lineBytes =
      Buffer.byteLength(line, 'utf-8') + (i < allLines.length - 1 ? 1 : 0) // +1 for \n delimiter

    if (parsed.length >= MAX_ENTRIES_PER_INVOCATION) break

    bytesConsumed += lineBytes

    if (line.trim().length === 0) continue

    try {
      const entry = JSON.parse(line) as TranscriptEntry
      const recordId =
        entry.uuid ??
        generateSyntheticId(
          entry.sessionId,
          entry.timestamp,
          entry.type,
          lineIndexOffset + parsedLineIndex
        )
      parsed.push({ ...entry, _recordId: recordId })
    } catch {
      malformedLines++
    }
    parsedLineIndex++
  }

  const endByteOffset = startOffset + bytesConsumed
  const capped = parsed.length >= MAX_ENTRIES_PER_INVOCATION

  if (malformedLines > 0) {
    hookLog.warn(
      { data: { malformedLines, transcriptPath } },
      'Skipped malformed lines'
    )
  }

  if (capped) {
    hookLog.info(
      {
        data: {
          sessionId,
          entriesParsed: parsed.length,
          totalLines: allLines.length,
        },
      },
      'Capped at MAX_ENTRIES_PER_INVOCATION, remaining entries deferred'
    )
  } else if (!cursor) {
    hookLog.info(
      { data: { sessionId, totalEntries: parsed.length } },
      'First invocation for session — uploading all entries'
    )
  } else {
    hookLog.info(
      {
        data: { sessionId, byteOffset: startOffset, newEntries: parsed.length },
      },
      'Resuming from byte offset'
    )
  }

  return {
    entries: parsed,
    endByteOffset,
    resolvedTranscriptPath: transcriptPath,
  }
}

/**
 * Progress subtypes that carry no unique session data and should be
 * filtered out before upload. Each entry here has a comment explaining
 * why it is safe to drop.
 */
const FILTERED_PROGRESS_SUBTYPES = new Set([
  // Incremental streaming output from running bash commands, emitted every
  // ~1 second. The final complete output is already captured in the "user"
  // tool_result entry when the command finishes.
  'bash_progress',

  // Records that the hook itself fired. Pure meta-noise — the hook
  // recording the fact that the hook ran.
  'hook_progress',

  // UI-only "waiting" indicator for background tasks (TaskOutput polling).
  // Contains only a task description and type — no session-relevant data.
  'waiting_for_task',

  // MCP tool start/completed timing events. Only unique data is elapsedTimeMs
  // which can be derived from tool_use/tool_result timestamps.
  'mcp_progress',
])

/**
 * Top-level transcript entry types that carry no useful session data.
 */
const FILTERED_ENTRY_TYPES = new Set([
  // Claude Code's internal undo/restore bookkeeping — tracks which files
  // have backups. No sessionId, no message, no model or tool data.
  'file-history-snapshot',

  // Internal task queue management (enqueue/remove/popAll). Duplicates data
  // already captured in user messages, agent_progress, and Task tool_use entries.
  'queue-operation',

  // Records the last user prompt text before a compaction or session restart.
  // Redundant — the actual user prompt is already captured in the 'user' entry.
  'last-prompt',
])

/**
 * Assistant tool_use entries that are pure plumbing — their meaningful data
 * is already captured in the corresponding user:tool_result entry.
 */
const FILTERED_ASSISTANT_TOOLS = new Set([
  // Polls for a sub-agent result. The input is just task_id + boilerplate
  // (block, timeout). The actual result is captured in the user:tool_result.
  'TaskOutput',

  // Discovers available deferred/MCP tools. The input is just a search query.
  // The discovered tools are captured in the user:tool_result.
  'ToolSearch',
])

/**
 * Filters out transcript entries that carry no unique session data.
 * Returns the filtered list and the count of entries removed.
 */
export function filterEntries(
  entries: (TranscriptEntry & { _recordId: string })[]
): {
  filtered: (TranscriptEntry & { _recordId: string })[]
  filteredOut: number
} {
  const filtered = entries.filter((entry) => {
    const entryType = entry.type ?? ''

    // Filter out entire entry types that carry no useful session data
    if (FILTERED_ENTRY_TYPES.has(entryType)) {
      return false
    }

    // Filter out specific progress subtypes
    if (entryType === 'progress') {
      const data = entry['data'] as Record<string, unknown> | undefined
      const subtype = typeof data?.['type'] === 'string' ? data['type'] : ''
      return !FILTERED_PROGRESS_SUBTYPES.has(subtype)
    }

    // Filter out assistant tool_use entries that are pure plumbing
    if (entryType === 'assistant') {
      const message = entry['message'] as Record<string, unknown> | undefined
      const content = message?.['content']
      if (Array.isArray(content) && content.length > 0) {
        const block = content[0] as Record<string, unknown>
        if (
          block['type'] === 'tool_use' &&
          typeof block['name'] === 'string' &&
          FILTERED_ASSISTANT_TOOLS.has(block['name'])
        ) {
          return false
        }
      }
    }

    return true
  })

  return { filtered, filteredOut: entries.length - filtered.length }
}

/**
 * Removes stale per-session configstore files that haven't been updated
 * in STALE_KEY_MAX_AGE_MS. Runs at most once per day.
 * Uses the global configStore only for the cleanup-throttle timestamp.
 */
async function cleanupStaleSessions(sessionStore: Configstore): Promise<void> {
  const lastCleanup = configStore.get('claudeCode.lastCleanupAt') as
    | number
    | undefined
  if (lastCleanup && Date.now() - lastCleanup < CLEANUP_INTERVAL_MS) {
    return
  }

  const now = Date.now()
  const prefix = getSessionFilePrefix()
  const configDir = path.dirname(sessionStore.path)

  try {
    const files = await readdir(configDir)
    let deletedCount = 0

    for (const file of files) {
      if (!file.startsWith(prefix) || !file.endsWith('.json')) continue

      const filePath = path.join(configDir, file)
      try {
        const content = JSON.parse(await readFile(filePath, 'utf-8')) as Record<
          string,
          unknown
        >

        // Find the most recent updatedAt across all cursor entries + cooldown
        let newest = 0
        const cooldown = content[COOLDOWN_KEY] as number | undefined
        if (cooldown && cooldown > newest) newest = cooldown

        const cursors = content['cursor'] as Record<string, unknown> | undefined
        if (cursors && typeof cursors === 'object') {
          for (const val of Object.values(cursors)) {
            const c = val as CursorValue | undefined
            if (c?.updatedAt && c.updatedAt > newest) newest = c.updatedAt
          }
        }

        if (newest > 0 && now - newest > STALE_KEY_MAX_AGE_MS) {
          await unlink(filePath)
          deletedCount++
        }
      } catch {
        // Skip files we can't read or parse
      }
    }

    if (deletedCount > 0) {
      hookLog.info({ data: { deletedCount } }, 'Cleaned up stale session files')
    }
  } catch {
    // If we can't list the directory, skip cleanup silently
  }

  configStore.set('claudeCode.lastCleanupAt', now)
}

/**
 * Main entry point: reads new transcript entries and uploads them
 * as raw records via the batch UploadTracyRecords API.
 */
export type HookResult = {
  entriesUploaded: number
  entriesSkipped: number
  errors: number
}

export async function processAndUploadTranscriptEntries(): Promise<HookResult> {
  hookLog.info('Hook invoked')

  // Global cooldown: throttle hook processes across all sessions on this machine.
  // Shorter than per-session cooldown — just prevents burst spawning.
  const globalLastRun = configStore.get('claudeCode.globalLastHookRunAt') as
    | number
    | undefined
  const globalNow = Date.now()
  if (globalLastRun && globalNow - globalLastRun < GLOBAL_COOLDOWN_MS) {
    return { entriesUploaded: 0, entriesSkipped: 0, errors: 0 }
  }
  configStore.set('claudeCode.globalLastHookRunAt', globalNow)

  // Auto-upgrade stale hook matcher (re-checks on each CLI version bump)
  const lastUpgradeVersion = configStore.get(
    'claudeCode.matcherUpgradeVersion'
  ) as string | undefined
  if (lastUpgradeVersion !== packageJson.version) {
    const upgraded = await autoUpgradeMatcherIfStale()
    configStore.set('claudeCode.matcherUpgradeVersion', packageJson.version)
    if (upgraded) {
      hookLog.info('Auto-upgraded hook matcher to reduce CPU usage')
    }
  }

  // Detect Claude Code version (cached — re-detected on CLI version bump).
  // Must run before scoped loggers are created so ddtags include cc_version.
  try {
    const ccVersion = await detectClaudeCodeVersion()
    setClaudeCodeVersion(ccVersion)
  } catch {
    // Never fail the hook for version detection
  }

  const rawData = await readStdinData()
  const rawObj = rawData as Record<string, unknown> | null
  const hookData = (() => {
    try {
      return validateHookData(rawData)
    } catch (err) {
      hookLog.error(
        {
          data: {
            hook_event_name: rawObj?.['hook_event_name'],
            tool_name: rawObj?.['tool_name'],
            session_id: rawObj?.['session_id'],
            cwd: rawObj?.['cwd'],
            keys: rawObj ? Object.keys(rawObj) : [],
          },
        },
        `Hook validation failed: ${(err as Error).message?.slice(0, 200)}`
      )
      throw err
    }
  })()

  // transcript_path is required — without it there's no file to read.
  if (!hookData.transcript_path) {
    hookLog.warn(
      {
        data: {
          hook_event_name: hookData.hook_event_name,
          tool_name: hookData.tool_name,
          session_id: hookData.session_id,
          cwd: hookData.cwd,
        },
      },
      'Missing transcript_path — cannot process hook'
    )
    return { entriesUploaded: 0, entriesSkipped: 0, errors: 0 }
  }

  // session_id fallback: peek at the transcript file and extract from the first entry.
  let sessionId = hookData.session_id
  if (!sessionId) {
    sessionId = await extractSessionIdFromTranscript(hookData.transcript_path)
    if (sessionId) {
      hookLog.warn(
        {
          data: {
            hook_event_name: hookData.hook_event_name,
            tool_name: hookData.tool_name,
            cwd: hookData.cwd,
            extractedSessionId: sessionId,
          },
        },
        'Missing session_id in hook data — extracted from transcript'
      )
    } else {
      hookLog.warn(
        {
          data: {
            hook_event_name: hookData.hook_event_name,
            tool_name: hookData.tool_name,
            transcript_path: hookData.transcript_path,
          },
        },
        'Missing session_id and could not extract from transcript — cannot process hook'
      )
      return { entriesUploaded: 0, entriesSkipped: 0, errors: 0 }
    }
  }

  if (!hookData.cwd) {
    hookLog.warn(
      {
        data: {
          hook_event_name: hookData.hook_event_name,
          tool_name: hookData.tool_name,
          session_id: sessionId,
        },
      },
      'Missing cwd in hook data — scoped logging and repo URL detection disabled'
    )
  }

  // Build a resolved hookData with guaranteed non-null session_id and transcript_path
  const resolvedHookData = {
    ...hookData,
    session_id: sessionId,
    transcript_path: hookData.transcript_path,
    cwd: hookData.cwd ?? undefined,
  }

  // Per-session configstore: each session gets its own file so concurrent
  // hooks from different sessions never compete for the same JSON file.
  const sessionStore = createSessionConfigStore(resolvedHookData.session_id)

  // Cleanup stale session files (runs at most once per day)
  await cleanupStaleSessions(sessionStore)

  // Cooldown: skip if this session was processed recently.
  // The hook fires on every tool use, but we only need to upload every ~10s.
  // Within a single session the cooldown serializes writes, so no race.
  const now = Date.now()
  const lastRunAt = sessionStore.get(COOLDOWN_KEY) as number | undefined
  if (lastRunAt && now - lastRunAt < HOOK_COOLDOWN_MS) {
    return { entriesUploaded: 0, entriesSkipped: 0, errors: 0 }
  }

  // Active lock: skip if another hook process is currently running for this session.
  // Prevents parallel hooks from piling up during slow network calls.
  // TTL fallback ensures a crashed hook doesn't block future invocations.
  const activeAt = sessionStore.get(ACTIVE_KEY) as number | undefined
  if (activeAt && now - activeAt < ACTIVE_LOCK_TTL_MS) {
    const activeDuration = now - activeAt
    if (activeDuration > HOOK_COOLDOWN_MS) {
      hookLog.warn(
        {
          data: {
            activeDurationMs: activeDuration,
            sessionId: resolvedHookData.session_id,
          },
        },
        'Hook still active — possible slow upload or hung process'
      )
    }
    return { entriesUploaded: 0, entriesSkipped: 0, errors: 0 }
  }
  sessionStore.set(ACTIVE_KEY, now)
  sessionStore.set(COOLDOWN_KEY, now)

  // Create a project-scoped logger so logs are separated per repo.
  // Fall back to process.cwd() when cwd is missing from hook data —
  // Claude Code spawns the hook process with cwd set to the project dir.
  const log = createScopedHookLog(resolvedHookData.cwd ?? process.cwd())

  log.info(
    {
      data: {
        sessionId: resolvedHookData.session_id,
        toolName: resolvedHookData.tool_name,
        hookEvent: resolvedHookData.hook_event_name,
        cwd: resolvedHookData.cwd,
        claudeCodeVersion: getClaudeCodeVersion(),
      },
    },
    'Hook data validated'
  )

  try {
    return await processTranscript(resolvedHookData, sessionStore, log)
  } finally {
    sessionStore.delete(ACTIVE_KEY)
    log.flushLogs()
  }
}

type ResolvedHookData = Omit<HookData, 'session_id' | 'transcript_path'> & {
  session_id: string
  transcript_path: string
  cwd: string | undefined
}

async function processTranscript(
  hookData: ResolvedHookData,
  sessionStore: Configstore,
  log: Logger
): Promise<HookResult> {
  const {
    entries: rawEntries,
    endByteOffset,
    resolvedTranscriptPath,
  } = await log.timed('Read transcript', () =>
    readNewTranscriptEntries(
      hookData.transcript_path,
      hookData.session_id,
      sessionStore
    )
  )
  const cursorKey = getCursorKey(resolvedTranscriptPath)

  if (rawEntries.length === 0) {
    log.info('No new entries to upload')
    return { entriesUploaded: 0, entriesSkipped: 0, errors: 0 }
  }

  const { filtered: entries, filteredOut } = filterEntries(rawEntries)
  if (filteredOut > 0) {
    log.info(
      { data: { filteredOut, remaining: entries.length } },
      'Filtered out noise entries'
    )
  }

  if (entries.length === 0) {
    log.info('All entries filtered out, nothing to upload')
    // Advance cursor past filtered entries so we don't re-process them
    const lastEntry = rawEntries[rawEntries.length - 1]!
    const prevCursor = sessionStore.get(cursorKey) as CursorValue | undefined
    const cursor: CursorValue = {
      id: lastEntry._recordId,
      byteOffset: endByteOffset,
      updatedAt: Date.now(),
      lastModel: prevCursor?.lastModel,
    }
    sessionStore.set(cursorKey, cursor)
    return {
      entriesUploaded: 0,
      entriesSkipped: filteredOut,
      errors: 0,
    }
  }

  let gqlClient
  try {
    gqlClient = await log.timed('GQL auth', () =>
      withTimeout(
        getAuthenticatedGQLClient({ isSkipPrompts: true }),
        GQL_AUTH_TIMEOUT_MS,
        'GQL auth'
      )
    )
  } catch (err) {
    log.error(
      {
        data: {
          error: String(err),
          stack: err instanceof Error ? err.stack : undefined,
        },
      },
      'GQL auth failed'
    )
    return {
      entriesUploaded: 0,
      entriesSkipped: filteredOut,
      errors: entries.length,
    }
  }

  // Propagate model to entries that don't carry one natively.
  // Restore last-seen model from the transcript cursor (persisted across hook
  // invocations, cleaned up with other cursor keys after 14 days of inactivity).
  const cursorForModel = sessionStore.get(cursorKey) as CursorValue | undefined
  let lastSeenModel: string | null = cursorForModel?.lastModel ?? null
  const records = entries.map((entry) => {
    const { _recordId, ...rawEntry } = entry
    const message = rawEntry['message'] as Record<string, unknown> | undefined
    const currentModel = (message?.['model'] as string | undefined) ?? null

    if (currentModel && currentModel !== '<synthetic>') {
      lastSeenModel = currentModel
    } else if (lastSeenModel && !currentModel) {
      // Inject last-seen model into the entry's message (or create one)
      if (message) {
        message['model'] = lastSeenModel
      } else {
        rawEntry['message'] = { model: lastSeenModel }
      }
    }

    // Ensure sessionId is on every record so the processor can extract it.
    // Sub-agent events (role-based format) don't carry sessionId natively.
    if (!rawEntry['sessionId']) {
      rawEntry['sessionId'] = hookData.session_id
    }

    return {
      platform: InferencePlatform.ClaudeCode,
      recordId: _recordId,
      recordTimestamp: entry.timestamp ?? new Date().toISOString(),
      blameType: AiBlameInferenceType.Chat,
      rawData: rawEntry,
    }
  })

  const totalRawDataBytes = records.reduce((sum, r) => {
    return sum + (r.rawData ? JSON.stringify(r.rawData).length : 0)
  }, 0)

  log.info(
    {
      data: {
        count: records.length,
        skipped: filteredOut,
        rawDataBytes: totalRawDataBytes,
        firstRecordId: records[0]?.recordId,
        lastRecordId: records[records.length - 1]?.recordId,
      },
    },
    'Uploading batch'
  )

  // PII/secrets sanitization is off by default for performance (70+ regex patterns per string).
  // Set MOBBDEV_HOOK_SANITIZE=1 in the hook command to enable PII/secrets redaction.
  const sanitize = process.env['MOBBDEV_HOOK_SANITIZE'] === '1'

  const result = await log.timed('Batch upload', () =>
    prepareAndSendTracyRecords(gqlClient, records, hookData.cwd, {
      sanitize,
    })
  )

  if (result.ok) {
    // Advance cursor to end of file (including filtered entries)
    const lastRawEntry = rawEntries[rawEntries.length - 1]!
    const cursor: CursorValue = {
      id: lastRawEntry._recordId,
      byteOffset: endByteOffset,
      updatedAt: Date.now(),
      lastModel: lastSeenModel ?? undefined,
    }
    sessionStore.set(cursorKey, cursor)
    log.heartbeat('Upload ok', {
      entriesUploaded: entries.length,
      entriesSkipped: filteredOut,
      claudeCodeVersion: getClaudeCodeVersion(),
    })
    return {
      entriesUploaded: entries.length,
      entriesSkipped: filteredOut,
      errors: 0,
    }
  }

  log.error(
    { data: { errors: result.errors, recordCount: entries.length } },
    'Batch upload had errors'
  )
  return {
    entriesUploaded: 0,
    entriesSkipped: filteredOut,
    errors: entries.length,
  }
}
