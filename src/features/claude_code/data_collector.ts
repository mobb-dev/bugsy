import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { access, open, readdir, readFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import Configstore from 'configstore'

import { getAuthenticatedGQLClient } from '../../commands/handleMobbLogin'
import { processContextFiles } from '../../features/analysis/context_file_processor'
import { scanContextFiles } from '../../features/analysis/context_file_scanner'
import { runContextFileUploadPipeline } from '../../features/analysis/context_file_uploader'
import { GQLClient } from '../../features/analysis/graphql/gql'
import { prepareAndSendTracyRecords } from '../../features/analysis/graphql/tracy-batch-upload'
import {
  AiBlameInferenceType,
  InferencePlatform,
} from '../../features/analysis/scm/generates/client_generates'
import { packageJson } from '../../utils/check_node_version'
import {
  configStore,
  getSessionFilePrefix,
} from '../../utils/ConfigStoreService'
import type { Logger } from '../../utils/shared-logger'
import { withTimeout } from '../../utils/with-timeout'
import {
  CC_VERSION_CACHE_KEY,
  CC_VERSION_CLI_KEY,
  CLEANUP_INTERVAL_MS,
  DAEMON_CHUNK_SIZE,
  GQL_AUTH_TIMEOUT_MS,
  STALE_KEY_MAX_AGE_MS,
} from './data_collector_constants'
import { getClaudeCodeVersion, hookLog } from './hook_logger'

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
export async function detectClaudeCodeVersion(): Promise<string | undefined> {
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
 * @param maxEntries - Maximum entries to read in a single call. Daemon passes DAEMON_CHUNK_SIZE (50).
 * Returns the entries and the total file size (used to save the cursor byte offset).
 */
export async function readNewTranscriptEntries(
  transcriptPath: string,
  sessionId: string,
  sessionStore: Configstore,
  maxEntries: number = DAEMON_CHUNK_SIZE
): Promise<{
  entries: (TranscriptEntry & { _recordId: string })[]
  endByteOffset: number
  resolvedTranscriptPath: string
  transcriptBytesRead: number
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
    // Cap the read to MAX_READ_BYTES to avoid OOM on very large transcripts.
    // We only consume maxEntries (50) per chunk anyway — excess is re-read next cycle.
    const MAX_TRANSCRIPT_READ_BYTES = 10 * 1024 * 1024 // 10MB — enough for 50 entries with large tool outputs
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
          transcriptBytesRead: 0,
        }
      }
      const bytesToRead = Math.min(
        stat.size - cursor.byteOffset,
        MAX_TRANSCRIPT_READ_BYTES
      )
      const buf = Buffer.alloc(bytesToRead)
      await fh.read(buf, 0, bytesToRead, cursor.byteOffset)
      content = buf.toString('utf-8')
      // If we capped the read, drop the last partial line (may be truncated mid-JSON)
      if (
        bytesToRead < stat.size - cursor.byteOffset &&
        !content.endsWith('\n')
      ) {
        const lastNewline = content.lastIndexOf('\n')
        if (lastNewline > 0) {
          content = content.substring(0, lastNewline + 1)
        }
      }
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
    // First run (no cursor) — cap the read to avoid OOM on large transcripts.
    const MAX_CWD_READ_BYTES = 2 * 1024 * 1024
    const fh = await open(transcriptPath, 'r')
    try {
      const stat = await fh.stat()
      fileSize = stat.size
      const bytesToRead = Math.min(stat.size, MAX_CWD_READ_BYTES)
      const buf = Buffer.alloc(bytesToRead)
      await fh.read(buf, 0, bytesToRead, 0)
      content = buf.toString('utf-8')
      if (bytesToRead < stat.size && !content.endsWith('\n')) {
        const lastNewline = content.lastIndexOf('\n')
        if (lastNewline > 0) {
          content = content.substring(0, lastNewline + 1)
        }
      }
    } finally {
      await fh.close()
    }
    lineIndexOffset = 0
    hookLog.debug(
      {
        data: {
          transcriptPath,
          totalBytes: fileSize,
          cappedBytes: content.length,
        },
      },
      'Read transcript file (first run)'
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

    if (parsed.length >= maxEntries) break

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
  const capped = parsed.length >= maxEntries

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
          maxEntries,
        },
      },
      'Capped at maxEntries, remaining entries deferred'
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
    transcriptBytesRead: content.length,
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

// NOTE: An older version of this file filtered specific assistant tool_use entries
// (TaskOutput, ToolSearch). That filtering was removed because those entries carry
// real `message.usage` token counts for Claude API calls — dropping them lost those
// tokens from session totals. No assistant tool_use entries are filtered today.

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

    return true
  })

  return { filtered, filteredOut: entries.length - filtered.length }
}

/**
 * Removes stale per-session configstore files that haven't been updated
 * in STALE_KEY_MAX_AGE_MS. Runs at most once per day.
 * Uses the global configStore only for the cleanup-throttle timestamp.
 */
export async function cleanupStaleSessions(configDir: string): Promise<void> {
  const lastCleanup = configStore.get('claudeCode.lastCleanupAt') as
    | number
    | undefined
  if (lastCleanup && Date.now() - lastCleanup < CLEANUP_INTERVAL_MS) {
    return
  }

  const cleanupStart = Date.now()
  const prefix = getSessionFilePrefix()

  try {
    const files = await readdir(configDir)
    const sessionFiles = files.filter(
      (f) => f.startsWith(prefix) && f.endsWith('.json')
    )
    let deletedCount = 0

    for (const file of sessionFiles) {
      const filePath = path.join(configDir, file)
      try {
        const content = JSON.parse(await readFile(filePath, 'utf-8')) as Record<
          string,
          unknown
        >

        // Find the most recent updatedAt across all cursor entries
        let newest = 0

        const cursors = content['cursor'] as Record<string, unknown> | undefined
        if (cursors && typeof cursors === 'object') {
          for (const val of Object.values(cursors)) {
            const c = val as CursorValue | undefined
            if (c?.updatedAt && c.updatedAt > newest) newest = c.updatedAt
          }
        }

        if (newest > 0 && cleanupStart - newest > STALE_KEY_MAX_AGE_MS) {
          await unlink(filePath)
          deletedCount++
        }
      } catch {
        // Skip files we can't read or parse
      }
    }

    hookLog.info(
      {
        heartbeat: true,
        data: {
          sessionFileCount: sessionFiles.length,
          deletedCount,
          cleanupDurationMs: Date.now() - cleanupStart,
        },
      },
      'Session cleanup'
    )
  } catch {
    // If we can't list the directory, skip cleanup silently
  }

  configStore.set('claudeCode.lastCleanupAt', cleanupStart)
}

/**
 * Input for processTranscript — the 3 fields that the daemon provides.
 */
export type TranscriptProcessInput = {
  session_id: string
  transcript_path: string
  cwd: string | undefined
}

export type HookResult = {
  entriesUploaded: number
  entriesSkipped: number
  errors: number
}

/**
 * Core transcript processing pipeline: reads new entries, filters noise,
 * authenticates, enriches with model info, and uploads the batch.
 */
export async function processTranscript(
  input: TranscriptProcessInput,
  sessionStore: Configstore,
  log: Logger,
  maxEntries: number = DAEMON_CHUNK_SIZE,
  gqlClientOverride?: GQLClient
): Promise<HookResult> {
  const {
    entries: rawEntries,
    endByteOffset,
    resolvedTranscriptPath,
    transcriptBytesRead,
  } = await log.timed('Read transcript', () =>
    readNewTranscriptEntries(
      input.transcript_path,
      input.session_id,
      sessionStore,
      maxEntries
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

  let gqlClient: GQLClient
  if (gqlClientOverride) {
    gqlClient = gqlClientOverride
  } else {
    try {
      gqlClient = await log.timed('GQL auth', () =>
        withTimeout(
          getAuthenticatedGQLClient({ isSkipPrompts: true }),
          GQL_AUTH_TIMEOUT_MS,
          'GQL auth'
        )
      )
    } catch (err) {
      log.error({ err }, 'GQL auth failed')
      return {
        entriesUploaded: 0,
        entriesSkipped: filteredOut,
        errors: entries.length,
      }
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
      rawEntry['sessionId'] = input.session_id
    }

    return {
      platform: InferencePlatform.ClaudeCode,
      recordId: _recordId,
      recordTimestamp: entry.timestamp ?? new Date().toISOString(),
      blameType: AiBlameInferenceType.Chat,
      rawData: rawEntry,
    }
  })

  let totalRawDataBytes = 0
  let maxRecordBytes = 0
  for (const r of records) {
    const size = r.rawData ? JSON.stringify(r.rawData).length : 0
    totalRawDataBytes += size
    if (size > maxRecordBytes) maxRecordBytes = size
  }

  log.info(
    {
      data: {
        count: records.length,
        skipped: filteredOut,
        transcriptBytesRead,
        rawDataBytes: totalRawDataBytes,
        maxRecordBytes,
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
    prepareAndSendTracyRecords(gqlClient, records, input.cwd, {
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

/**
 * Scans, sanitizes, and uploads context files and skills for this session.
 * Each file/skill is uploaded directly to S3 with its own Tracy event.
 * Change detection is handled inside the scanner via mtime tracking.
 */
export async function uploadContextFilesIfNeeded(
  sessionId: string,
  cwd: string,
  gqlClient: GQLClient,
  log: Logger
): Promise<void> {
  const { regularFiles, skillGroups } = await scanContextFiles(
    cwd,
    'claude-code',
    sessionId
  )
  if (regularFiles.length === 0 && skillGroups.length === 0) {
    return
  }

  const { files: processedFiles, skills: processedSkills } =
    await processContextFiles(regularFiles, skillGroups)

  if (processedFiles.length === 0 && processedSkills.length === 0) {
    return
  }

  const uploadUrlResult = await gqlClient.getTracyRawDataUploadUrl()
  const { url, uploadFieldsJSON, keyPrefix } =
    uploadUrlResult.getTracyRawDataUploadUrl
  if (!url || !uploadFieldsJSON || !keyPrefix) {
    log.error(
      { data: { sessionId } },
      'Failed to get S3 upload URL for context files'
    )
    return
  }

  const pipelineResult = await runContextFileUploadPipeline({
    processedFiles,
    processedSkills,
    sessionId,
    platform: InferencePlatform.ClaudeCode,
    url,
    uploadFieldsJSON,
    keyPrefix,
    submitRecords: async (records) => {
      const r = await prepareAndSendTracyRecords(gqlClient, records, cwd)
      if (!r.ok) {
        throw new Error(r.errors?.join(', ') ?? 'batch upload failed')
      }
    },
    onFileError: (name, err) =>
      log.error(
        { data: { sessionId, name, err } },
        'Failed to upload context file to S3'
      ),
    onSkillError: (name, err) =>
      log.error(
        { data: { sessionId, name, err } },
        'Failed to upload skill zip to S3'
      ),
  })

  if (pipelineResult === null) {
    log.error(
      { data: { sessionId } },
      'Malformed uploadFieldsJSON for context files'
    )
    return
  }

  if (pipelineResult.fileCount > 0 || pipelineResult.skillCount > 0) {
    log.info(
      {
        data: {
          sessionId,
          fileCount: pipelineResult.fileCount,
          skillCount: pipelineResult.skillCount,
        },
      },
      'Uploaded context files and skills for session'
    )
  }
}
