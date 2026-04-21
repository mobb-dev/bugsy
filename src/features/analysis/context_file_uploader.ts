import pLimit from 'p-limit'

import type { ProcessedFile, ProcessedSkill } from './context_file_processor'
import type { ContextFileEntry, SkillGroup } from './context_file_scanner'
import {
  markContextFilesUploaded,
  SKILL_CATEGORY,
} from './context_file_scanner'
import type { TracyRecordClientInput } from './graphql/tracy-batch-upload'
import { AiBlameInferenceType } from './scm/generates/client_generates'
import { uploadFile } from './upload-file'

/** Number of concurrent S3 uploads. */
const UPLOAD_CONCURRENCY = 5

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
    clientVersion,
    onFileError,
    onSkillError,
  } = opts

  const records: TracyRecordClientInput[] = []
  const uploadedFiles: ContextFileEntry[] = []
  const uploadedSkillGroups: SkillGroup[] = []
  const limit = pLimit(UPLOAD_CONCURRENCY)
  const extraFields = {
    ...(repositoryUrl !== undefined && { repositoryUrl }),
    ...(clientVersion !== undefined && { clientVersion }),
  }

  const tasks: Promise<void>[] = [
    ...processedFiles.map((pf) =>
      limit(async () => {
        const s3Key = `${keyPrefix}ctx-${pf.md5}.bin`
        try {
          await uploadFile({
            file: Buffer.from(pf.sanitizedContent, 'utf-8'),
            url,
            uploadKey: s3Key,
            uploadFields,
          })
        } catch (err) {
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
          await uploadFile({
            file: ps.zipBuffer,
            url,
            uploadKey: s3Key,
            uploadFields,
          })
        } catch (err) {
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

  return { records, uploadedFiles, uploadedSkillGroups }
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

  const { records, uploadedFiles, uploadedSkillGroups } =
    await uploadContextRecords({
      processedFiles,
      processedSkills,
      keyPrefix,
      url,
      uploadFields,
      sessionId,
      now,
      platform,
      repositoryUrl,
      clientVersion,
      onFileError,
      onSkillError,
    })

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
