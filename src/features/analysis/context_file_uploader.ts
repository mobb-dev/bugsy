import { setTimeout as sleep } from 'node:timers/promises'

import pLimit from 'p-limit'

import type { ProcessedFile, ProcessedSkill } from './context_file_processor'
import type { ContextFileEntry, SkillGroup } from './context_file_scanner'
import {
  markContextFilesUploaded,
  markContextUploadFailed,
  SKILL_CATEGORY,
} from './context_file_scanner'
import { NOOP_UPLOAD_LEDGER, type UploadLedger } from './context_upload_ledger'
import type { TracyRecordClientInput } from './graphql/tracy-batch-upload'
import { AiBlameInferenceType } from './scm/generates/client_generates'
import {
  isActionableS3Error,
  isTransientUploadError,
  uploadFile,
} from './upload-file'

/**
 * Concurrent S3 uploads, process-wide (see {@link uploadLimit}). Context/skill
 * uploads are background telemetry with no latency requirement, so we upload
 * sequentially (1) to keep the outbound-connection footprint minimal — one blob
 * on the wire at a time — rather than bursting the network. Tunable if a genuine
 * large first-run corpus ever needs more throughput.
 */
const UPLOAD_CONCURRENCY = 1

/**
 * Max upload attempts per file/skill within a single cycle (1 try + retries).
 * Kept low: 1 retry recovers the common single-blip transient, while the
 * cross-cycle failure backoff (in the scanner) handles persistent failures —
 * so we don't multiply per-file latency on a hostile network's first cycle.
 */
const UPLOAD_MAX_ATTEMPTS = 2
/** Base delay between in-cycle retries; grows exponentially with jitter. */
const UPLOAD_RETRY_BASE_MS = 250

/**
 * Upload a single file/skill to S3, retrying transient transport failures
 * (e.g. ECONNRESET from a proxy resetting the connection) a few times within
 * the cycle. Non-transient failures (HTTP errors from S3) throw immediately.
 */
async function uploadWithRetry(
  args: Parameters<typeof uploadFile>[0]
): Promise<void> {
  for (let attempt = 1; attempt <= UPLOAD_MAX_ATTEMPTS; attempt++) {
    try {
      await uploadFile(args)
      return
    } catch (err) {
      const isLastAttempt = attempt === UPLOAD_MAX_ATTEMPTS
      if (isLastAttempt || !isTransientUploadError(err)) {
        throw err
      }
      const backoff =
        UPLOAD_RETRY_BASE_MS * 2 ** (attempt - 1) * (1 + Math.random())
      await sleep(backoff)
    }
  }
}

/**
 * Process-wide upload concurrency cap. The daemon scans every active session
 * each cycle and fires an upload pass per session; a per-call limiter would let
 * that fan out to (sessions × concurrency) simultaneous requests. A single
 * shared limiter bounds total in-flight uploads across ALL sessions and cycles,
 * so outbound connections never storm regardless of how many sessions are live.
 */
const uploadLimit = pLimit(UPLOAD_CONCURRENCY)

/**
 * In-flight uploads keyed by S3 object key (content-addressed). Multiple
 * sessions routinely offer the same `~/.claude` blob in the same cycle; without
 * coalescing each would open its own connection for identical bytes. Followers
 * await the in-flight leader instead of issuing a duplicate POST.
 */
const inFlightUploads = new Map<string, Promise<void>>()

type CoalescedResult = { leader: boolean; ok: boolean; err?: unknown }

/**
 * Upload `s3Key` at most once concurrently. The first caller (leader) runs the
 * upload through the shared concurrency limiter; concurrent callers for the same
 * key (followers) await that same promise instead of opening a second
 * connection. Never throws — the outcome is returned so only the leader records
 * ledger/breaker state and logs, keeping one shared blob's failure counted once.
 */
async function coalescedUpload(
  s3Key: string,
  run: () => Promise<void>
): Promise<CoalescedResult> {
  const existing = inFlightUploads.get(s3Key)
  if (existing) {
    try {
      await existing
      return { leader: false, ok: true }
    } catch (err) {
      return { leader: false, ok: false, err }
    }
  }
  const p = uploadLimit(run)
  inFlightUploads.set(s3Key, p)
  try {
    await p
    return { leader: true, ok: true }
  } catch (err) {
    return { leader: true, ok: false, err }
  } finally {
    inFlightUploads.delete(s3Key)
  }
}

export type UploadContextRecordsOpts = {
  processedFiles: ProcessedFile[]
  processedSkills: ProcessedSkill[]
  keyPrefix: string
  url: string
  uploadFields: Record<string, string>
  sessionId: string
  now: string
  /** InferencePlatform enum value (serialized as string) */
  platform: string
  repositoryUrl?: string
  /** Git branch at sample time. `null` for detached HEAD; `undefined` to omit. */
  branch?: string | null
  /** HEAD commit SHA at sample time. `null` when unavailable; `undefined` to omit. */
  commitSha?: string | null
  clientVersion?: string
  /**
   * Persistent, content-addressed dedup/backoff/circuit-breaker state. When
   * provided, blobs already uploaded (by any session/run) are not re-uploaded —
   * the per-session Tracy record is still emitted so attribution is preserved.
   * Omit (or pass {@link NOOP_UPLOAD_LEDGER}) to always attempt the upload.
   */
  ledger?: UploadLedger
  onFileError?: (name: string, err: unknown) => void
  onSkillError?: (name: string, err: unknown) => void
}

export type UploadContextRecordsResult = {
  records: TracyRecordClientInput[]
  /** Only the files that were successfully uploaded (for markContextFilesUploaded) */
  uploadedFiles: ContextFileEntry[]
  /** Only the skill groups that were successfully uploaded */
  uploadedSkillGroups: SkillGroup[]
  /** Files whose S3 upload failed (for upload-failure backoff) */
  failedFiles: ContextFileEntry[]
  /** Skill groups whose S3 upload failed (for upload-failure backoff) */
  failedSkillGroups: SkillGroup[]
  /** Blobs skipped because their md5 was already uploaded (dedup hits). */
  dedupedCount: number
  /** Items skipped without attempting due to per-md5 backoff or open breaker. */
  suppressedCount: number
  /** Whether the global upload circuit breaker was open during this call. */
  breakerOpen: boolean
}

/**
 * Upload processed context files and skill zips to S3 with bounded concurrency.
 * Returns only the records/files/groups whose S3 upload succeeded.
 * Partial-failure safe: only successful uploads are returned, so the pipeline
 * layer only marks those files as uploaded (prevents silent data-loss when
 * individual S3 uploads fail).
 */
export async function uploadContextRecords(
  opts: UploadContextRecordsOpts
): Promise<UploadContextRecordsResult> {
  const {
    processedFiles,
    processedSkills,
    keyPrefix,
    url,
    uploadFields,
    sessionId,
    now,
    platform,
    repositoryUrl,
    branch,
    commitSha,
    clientVersion,
    ledger = NOOP_UPLOAD_LEDGER,
    onFileError,
    onSkillError,
  } = opts

  const records: TracyRecordClientInput[] = []
  const uploadedFiles: ContextFileEntry[] = []
  const uploadedSkillGroups: SkillGroup[] = []
  const failedFiles: ContextFileEntry[] = []
  const failedSkillGroups: SkillGroup[] = []
  let dedupedCount = 0
  let suppressedCount = 0
  const extraFields = {
    ...(repositoryUrl !== undefined && { repositoryUrl }),
    ...(branch !== undefined && { branch }),
    ...(commitSha !== undefined && { commitSha }),
    ...(clientVersion !== undefined && { clientVersion }),
  }

  // One item (a file or a skill zip): gate (dedup/backoff/breaker), upload if
  // needed, record ledger outcome, and emit the per-session record. Shared by
  // both processedFiles and processedSkills so the dedup/coalesce/backoff/breaker
  // invariant lives in exactly one place. Gating runs outside the concurrency
  // limiter (a skipped item never consumes an upload slot); only the S3 POST is
  // bounded (globally, via coalescedUpload → uploadLimit).
  type UploadItem = {
    md5: string
    s3Key: string
    getPayload: () => Buffer
    context: {
      category: string
      name: string
      sizeBytes: number
      filePath: string
    }
    errorName: string
    onError?: (name: string, err: unknown) => void
    markUploaded: () => void
    markFailed: () => void
  }

  const processItem = async (item: UploadItem): Promise<void> => {
    // One timestamp snapshot for all gating checks on this item (the ledger's
    // now param exists precisely so the checks share one instant).
    const nowMs = Date.now()
    if (ledger.isUploaded(item.md5, nowMs)) {
      dedupedCount++
    } else if (
      ledger.isBreakerOpen(nowMs) ||
      ledger.isBackedOff(item.md5, nowMs)
    ) {
      // Paused by the global breaker or in per-md5 backoff — skip silently.
      suppressedCount++
      return
    } else {
      const { leader, ok, err } = await coalescedUpload(item.s3Key, () =>
        uploadWithRetry({
          file: item.getPayload(),
          url,
          uploadKey: item.s3Key,
          uploadFields,
        })
      )
      if (!ok) {
        item.markFailed()
        // Only the leader records the outcome so one blob shared by N sessions
        // counts once toward backoff/breaker. Log if the per-md5 log-once window
        // allows it OR the error is an actionable S3 auth/permission failure
        // (those must never be hidden behind the log-once window).
        if (leader) {
          const logByWindow = ledger.onFailure(item.md5, Date.now())
          if (logByWindow || isActionableS3Error(err)) {
            item.onError?.(item.errorName, err)
          }
        }
        return
      }
      if (leader) {
        ledger.onSuccess(item.md5, Date.now())
      }
    }
    records.push({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      platform: platform as any,
      recordId: `ctx:${sessionId}:${item.md5}`,
      recordTimestamp: now,
      blameType: AiBlameInferenceType.Chat,
      rawDataS3Key: item.s3Key,
      ...extraFields,
      context: {
        md5: item.md5,
        category: item.context.category,
        name: item.context.name,
        sizeBytes: item.context.sizeBytes,
        filePath: item.context.filePath,
        sessionId,
      },
    })
    item.markUploaded()
  }

  const tasks: Promise<void>[] = [
    ...processedFiles.map((pf) =>
      processItem({
        md5: pf.md5,
        s3Key: `${keyPrefix}ctx-${pf.md5}.bin`,
        getPayload: () => Buffer.from(pf.sanitizedContent, 'utf-8'),
        context: {
          category: pf.entry.category,
          name: pf.entry.name,
          sizeBytes: pf.sizeBytes,
          filePath: pf.entry.path,
        },
        errorName: pf.entry.name,
        onError: onFileError,
        markUploaded: () => uploadedFiles.push(pf.entry),
        markFailed: () => failedFiles.push(pf.entry),
      })
    ),
    ...processedSkills.map((ps) =>
      processItem({
        md5: ps.md5,
        s3Key: `${keyPrefix}skill-${ps.md5}.zip`,
        getPayload: () => ps.zipBuffer,
        context: {
          category: SKILL_CATEGORY,
          name: ps.group.name,
          sizeBytes: ps.sizeBytes,
          filePath: ps.group.skillPath,
        },
        errorName: ps.group.name,
        onError: onSkillError,
        markUploaded: () => uploadedSkillGroups.push(ps.group),
        markFailed: () => failedSkillGroups.push(ps.group),
      })
    ),
  ]

  await Promise.allSettled(tasks)

  return {
    records,
    uploadedFiles,
    uploadedSkillGroups,
    failedFiles,
    failedSkillGroups,
    dedupedCount,
    suppressedCount,
    breakerOpen: ledger.isBreakerOpen(Date.now()),
  }
}

export type ContextUploadPipelineOpts = {
  processedFiles: ProcessedFile[]
  processedSkills: ProcessedSkill[]
  sessionId: string
  platform: string
  url: string
  uploadFieldsJSON: string
  keyPrefix: string
  repositoryUrl?: string
  branch?: string | null
  commitSha?: string | null
  clientVersion?: string
  /** See {@link UploadContextRecordsOpts.ledger}. */
  ledger?: UploadLedger
  /**
   * Submits Tracy records to the backend. Called only when at least one file
   * uploaded successfully. Should throw on failure so `markContextFilesUploaded`
   * is skipped for a failed submission.
   */
  submitRecords: (records: TracyRecordClientInput[]) => Promise<void>
  onFileError?: (name: string, err: unknown) => void
  onSkillError?: (name: string, err: unknown) => void
}

export type ContextUploadPipelineResult = {
  fileCount: number
  skillCount: number
  /** Blobs skipped because their md5 was already uploaded. */
  dedupedCount: number
  /** Items skipped due to per-md5 backoff or open circuit breaker. */
  suppressedCount: number
  /** Count of files+skills whose upload failed this cycle. */
  failedCount: number
  /** Whether the global upload circuit breaker was open during this cycle. */
  breakerOpen: boolean
}

/**
 * Core context file upload pipeline shared by CLI and extension.
 * Parses upload fields, uploads each file/skill to S3, submits Tracy records,
 * and marks files uploaded in session state.
 *
 * Returns `{ fileCount, skillCount }` on success (both may be 0 if no records
 * were produced). Returns `null` when `uploadFieldsJSON` is malformed — callers
 * should treat this as an error. Throws when `submitRecords` fails.
 */
export async function runContextFileUploadPipeline(
  opts: ContextUploadPipelineOpts
): Promise<ContextUploadPipelineResult | null> {
  const {
    processedFiles,
    processedSkills,
    sessionId,
    platform,
    url,
    uploadFieldsJSON,
    keyPrefix,
    repositoryUrl,
    branch,
    commitSha,
    clientVersion,
    ledger,
    submitRecords,
    onFileError,
    onSkillError,
  } = opts

  let uploadFields: Record<string, string>
  try {
    uploadFields = JSON.parse(uploadFieldsJSON)
  } catch {
    return null
  }

  const now = new Date().toISOString()

  const {
    records,
    uploadedFiles,
    uploadedSkillGroups,
    failedFiles,
    failedSkillGroups,
    dedupedCount,
    suppressedCount,
    breakerOpen,
  } = await uploadContextRecords({
    processedFiles,
    processedSkills,
    keyPrefix,
    url,
    uploadFields,
    sessionId,
    now,
    platform,
    repositoryUrl,
    branch,
    commitSha,
    clientVersion,
    ledger,
    onFileError,
    onSkillError,
  })

  // Back off re-attempting uploads that just failed so a persistently-failing
  // file/skill isn't re-emitted (and re-logged) on every poll cycle.
  if (failedFiles.length > 0 || failedSkillGroups.length > 0) {
    markContextUploadFailed(sessionId, failedFiles, failedSkillGroups)
  }

  const summary = {
    dedupedCount,
    suppressedCount,
    failedCount: failedFiles.length + failedSkillGroups.length,
    breakerOpen,
  }

  if (records.length === 0) {
    return { fileCount: 0, skillCount: 0, ...summary }
  }

  await submitRecords(records)
  markContextFilesUploaded(sessionId, uploadedFiles, uploadedSkillGroups)

  return {
    fileCount: uploadedFiles.length,
    skillCount: uploadedSkillGroups.length,
    ...summary,
  }
}
