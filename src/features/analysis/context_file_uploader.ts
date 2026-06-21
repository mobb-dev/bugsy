import { setTimeout as sleep } from 'node:timers/promises'

import pLimit from 'p-limit'

import type { ProcessedFile, ProcessedSkill } from './context_file_processor'
import type { ContextFileEntry, SkillGroup } from './context_file_scanner'
import {
  markContextFilesUploaded,
  markContextUploadFailed,
  SKILL_CATEGORY,
} from './context_file_scanner'
import type { TracyRecordClientInput } from './graphql/tracy-batch-upload'
import { AiBlameInferenceType } from './scm/generates/client_generates'
import { isTransientUploadError, uploadFile } from './upload-file'

/** Number of concurrent S3 uploads. */
const UPLOAD_CONCURRENCY = 5

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
    onFileError,
    onSkillError,
  } = opts

  const records: TracyRecordClientInput[] = []
  const uploadedFiles: ContextFileEntry[] = []
  const uploadedSkillGroups: SkillGroup[] = []
  const failedFiles: ContextFileEntry[] = []
  const failedSkillGroups: SkillGroup[] = []
  const limit = pLimit(UPLOAD_CONCURRENCY)
  const extraFields = {
    ...(repositoryUrl !== undefined && { repositoryUrl }),
    ...(branch !== undefined && { branch }),
    ...(commitSha !== undefined && { commitSha }),
    ...(clientVersion !== undefined && { clientVersion }),
  }

  const tasks: Promise<void>[] = [
    ...processedFiles.map((pf) =>
      limit(async () => {
        const s3Key = `${keyPrefix}ctx-${pf.md5}.bin`
        try {
          await uploadWithRetry({
            file: Buffer.from(pf.sanitizedContent, 'utf-8'),
            url,
            uploadKey: s3Key,
            uploadFields,
          })
        } catch (err) {
          failedFiles.push(pf.entry)
          onFileError?.(pf.entry.name, err)
          return
        }
        records.push({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          platform: platform as any,
          recordId: `ctx:${sessionId}:${pf.md5}`,
          recordTimestamp: now,
          blameType: AiBlameInferenceType.Chat,
          rawDataS3Key: s3Key,
          ...extraFields,
          context: {
            md5: pf.md5,
            category: pf.entry.category,
            name: pf.entry.name,
            sizeBytes: pf.sizeBytes,
            filePath: pf.entry.path,
            sessionId,
          },
        })
        uploadedFiles.push(pf.entry)
      })
    ),
    ...processedSkills.map((ps) =>
      limit(async () => {
        const s3Key = `${keyPrefix}skill-${ps.md5}.zip`
        try {
          await uploadWithRetry({
            file: ps.zipBuffer,
            url,
            uploadKey: s3Key,
            uploadFields,
          })
        } catch (err) {
          failedSkillGroups.push(ps.group)
          onSkillError?.(ps.group.name, err)
          return
        }
        records.push({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          platform: platform as any,
          recordId: `ctx:${sessionId}:${ps.md5}`,
          recordTimestamp: now,
          blameType: AiBlameInferenceType.Chat,
          rawDataS3Key: s3Key,
          ...extraFields,
          context: {
            md5: ps.md5,
            category: SKILL_CATEGORY,
            name: ps.group.name,
            sizeBytes: ps.sizeBytes,
            filePath: ps.group.skillPath,
            sessionId,
          },
        })
        uploadedSkillGroups.push(ps.group)
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
  /**
   * Submits Tracy records to the backend. Called only when at least one file
   * uploaded successfully. Should throw on failure so `markContextFilesUploaded`
   * is skipped for a failed submission.
   */
  submitRecords: (records: TracyRecordClientInput[]) => Promise<void>
  onFileError?: (name: string, err: unknown) => void
  onSkillError?: (name: string, err: unknown) => void
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
): Promise<{ fileCount: number; skillCount: number } | null> {
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
    onFileError,
    onSkillError,
  })

  // Back off re-attempting uploads that just failed so a persistently-failing
  // file/skill isn't re-emitted (and re-logged) on every poll cycle.
  if (failedFiles.length > 0 || failedSkillGroups.length > 0) {
    markContextUploadFailed(sessionId, failedFiles, failedSkillGroups)
  }

  if (records.length === 0) {
    return { fileCount: 0, skillCount: 0 }
  }

  await submitRecords(records)
  markContextFilesUploaded(sessionId, uploadedFiles, uploadedSkillGroups)

  return {
    fileCount: uploadedFiles.length,
    skillCount: uploadedSkillGroups.length,
  }
}
