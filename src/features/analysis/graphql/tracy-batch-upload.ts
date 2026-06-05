import Debug from 'debug'

import {
  getSystemInfo,
  readRepoState,
} from '../../../args/commands/upload_ai_blame'
import { packageJson } from '../../../utils/check_node_version'
import { sanitizeData } from '../../../utils/sanitize-sensitive-data'
import { withTimeout } from '../../../utils/with-timeout'
import type { TracyRecordInput } from '../scm/generates/client_generates'
import type { GQLClient } from './gql'
import { uploadRawDataToS3 } from './s3-raw-data-upload'

// Re-exported so existing importers keep a single entry point for upload types.
export {
  classifyUploadError,
  type UploadFailureKind,
} from './s3-raw-data-upload'

const debug = Debug('mobbdev:tracy-batch-upload')

const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String(e)

function timedStep<T>(label: string, fn: () => T | Promise<T>): Promise<T> {
  const start = Date.now()
  const result = fn()
  const maybePromise =
    result instanceof Promise ? result : Promise.resolve(result)
  return maybePromise.then(
    (val) => {
      debug('[perf] %s: %dms', label, Date.now() - start)
      return val
    },
    (err) => {
      debug('[perf] %s FAILED: %dms', label, Date.now() - start)
      throw err
    }
  )
}

/** Per-operation timeout for the GraphQL submit step. The S3 phase has its own
 * per-operation and whole-phase budgets (see s3-raw-data-upload.ts). */
const BATCH_TIMEOUT_MS = 30_000 // 30 seconds

/**
 * Minimum serialized rawData size we bother uploading. S3's presigned POST
 * policy enforces `content-length-range [1, MAX]`, and anything this tiny is a
 * degenerate payload (`null`, `1`, `""`, `{}`, `[]`, …) with no useful content
 * — skip it client-side instead of wasting a guaranteed-failed round-trip.
 */
const MIN_RAWDATA_BYTES = 5

/** Cap on the degenerate-record content sample we surface for investigation. */
const MAX_DEGENERATE_SAMPLE_CHARS = 500

/** Placeholder used instead of raw content when sanitization is disabled, so
 * the degenerate-record log can never carry unsanitized user data. */
const REDACTED_SAMPLE = '<redacted: sanitization disabled>'

/** Max degenerate records included in a single warning log line. */
const MAX_DEGENERATE_LOG_RECORDS = 20

export type TracyRecordClientInput = Omit<
  TracyRecordInput,
  | 'rawDataS3Key'
  | 'repositoryUrl'
  | 'branch'
  | 'commitSha'
  | 'computerName'
  | 'userName'
  | 'clientVersion'
> & {
  rawData?: unknown // object from extension, will be sanitized & serialized
  /**
   * Pre-uploaded S3 key. When set, the rawData serialization + S3 upload step
   * is skipped for this record — the caller has already uploaded the content.
   */
  rawDataS3Key?: string
  /** Override auto-detected repo URL (e.g. from extension metadata) */
  repositoryUrl?: string
  /** Git branch at sample time (null when detached HEAD or non-git dir) */
  branch?: string | null
  /** HEAD commit SHA at sample time (null when non-git dir) */
  commitSha?: string | null
  /** Override auto-detected client version (e.g. extension version instead of CLI version) */
  clientVersion?: string
}

/**
 * A record whose serialized rawData was empty/structurally-empty and was
 * skipped before S3 upload (it would 400 against the content-length-range
 * floor). Surfaced so callers can log it for investigation — the metadata
 * record is still submitted, just without a rawDataS3Key.
 */
export type DegenerateRawDataRecord = {
  recordId: string
  platform: string
  filePath?: string | null
  editType?: string | null
  bytes: number
  /** Content sample, capped at MAX_DEGENERATE_SAMPLE_CHARS. Only the real
   * (sanitized) content when sanitization is enabled; otherwise REDACTED_SAMPLE
   * so unsanitized user data is never logged. */
  sample: string
}

export type TracyBatchUploadResult = {
  ok: boolean
  errors: string[] | null
  /** Records skipped pre-upload because their rawData serialized to empty. */
  degenerate?: DegenerateRawDataRecord[]
}

/** Stable warning message for the degenerate-skip log (shared by all callers). */
export const DEGENERATE_RECORDS_LOG_MESSAGE =
  'Skipped empty/degenerate rawData records before S3 upload'

/** Shared structured fields for the degenerate-skip warning so every upload
 * caller logs the same shape (count + a capped sample of records). */
export function degenerateRecordsLogFields(
  degenerate: DegenerateRawDataRecord[]
): { count: number; records: DegenerateRawDataRecord[] } {
  return {
    count: degenerate.length,
    records: degenerate.slice(0, MAX_DEGENERATE_LOG_RECORDS),
  }
}

/**
 * True when a serialized payload carries no data: empty/whitespace, `null`,
 * `""`, or an object/array that is empty even allowing internal whitespace
 * (`{}`, `{ }`, `[]`, `[  ]`).
 */
export function isStructurallyEmptyPayload(serialized: string): boolean {
  const trimmed = serialized.trim()
  if (trimmed === '' || trimmed === 'null' || trimmed === '""') return true
  const isObject = trimmed.startsWith('{') && trimmed.endsWith('}')
  const isArray = trimmed.startsWith('[') && trimmed.endsWith(']')
  if (isObject || isArray) return trimmed.slice(1, -1).trim() === ''
  return false
}

async function sanitizeRawData(rawData: unknown): Promise<string> {
  const start = Date.now()
  try {
    const sanitized = await sanitizeData(rawData)
    const serialized = JSON.stringify(sanitized)
    debug(
      '[perf] sanitizeRawData: %dms (%d bytes)',
      Date.now() - start,
      serialized.length
    )
    return serialized
  } catch (err) {
    // Sanitization should never break JSON when operating on parsed objects,
    // but if it does: note it and fall back to unsanitized data.
    debug(
      '[tracy] sanitizeRawData failed, falling back to unsanitized: %s',
      errorMessage(err)
    )
    return JSON.stringify(rawData)
  }
}

export async function prepareAndSendTracyRecords(
  client: GQLClient,
  rawRecords: TracyRecordClientInput[],
  workingDir?: string,
  options?: { sanitize?: boolean }
): Promise<TracyBatchUploadResult> {
  const { computerName, userName } = getSystemInfo()
  const defaultClientVersion = packageJson.version
  const shouldSanitize = options?.sanitize ?? true

  // Read git state fresh on every upload — no cross-batch cache. Per-record
  // values (sampled at event time by the daemon or extension) take precedence.
  // We only resolve defaults when a workingDir is supplied (the CLI daemon
  // path); the VS Code extension passes records pre-stamped per-file via
  // getNormalizedRepo, so falling back to a single shared workingDir would
  // misattribute events from secondary repos in multi-root workspaces.
  const defaults: {
    repositoryUrl: string | null
    branch: string | null
    commitSha: string | null
  } =
    workingDir != null
      ? await readRepoState(workingDir)
      : { repositoryUrl: null, branch: null, commitSha: null }

  // 1. Enrich records and optionally sanitize rawData
  debug(
    '[step:sanitize] %s %d records',
    shouldSanitize ? 'Sanitizing' : 'Serializing',
    rawRecords.length
  )
  const serializedRawDataByIndex = new Map<number, string>()
  // Records whose rawData serialized to empty — skipped before S3 (would 400),
  // surfaced to the caller for investigation.
  const degenerate: DegenerateRawDataRecord[] = []

  const records: TracyRecordInput[] = await timedStep(
    `${shouldSanitize ? 'sanitize' : 'serialize'} ${rawRecords.length} records`,
    async () => {
      // Process records sequentially to avoid memory spikes from concurrent
      // regex-heavy sanitization passes or large JSON.stringify buffers.
      // The daemon is a background process so latency is acceptable;
      // memory safety is not.
      const results: TracyRecordInput[] = []
      for (let index = 0; index < rawRecords.length; index++) {
        const record = rawRecords[index]!
        if (record.rawData != null && record.rawDataS3Key == null) {
          // Only serialize rawData when no pre-uploaded S3 key was provided
          const serialized = shouldSanitize
            ? await sanitizeRawData(record.rawData)
            : JSON.stringify(record.rawData)
          const bytes = Buffer.byteLength(serialized, 'utf-8')
          if (
            bytes < MIN_RAWDATA_BYTES ||
            isStructurallyEmptyPayload(serialized)
          ) {
            // Empty/tiny payload — would 400 (EntityTooSmall) at S3. Skip the
            // upload (the metadata record still ships, sans rawDataS3Key) and
            // record it for investigation. The sample is only included when
            // sanitization ran; on the sanitize-off path (CLI daemon default)
            // we redact it so raw user content can never reach warn-level logs.
            degenerate.push({
              recordId: record.recordId,
              platform: record.platform,
              filePath: record.filePath,
              editType: record.editType,
              bytes,
              sample: shouldSanitize
                ? serialized.slice(0, MAX_DEGENERATE_SAMPLE_CHARS)
                : REDACTED_SAMPLE,
            })
          } else {
            serializedRawDataByIndex.set(index, serialized)
          }
        }
        const { rawData: _rawData, ...rest } = record
        results.push({
          ...rest,
          repositoryUrl:
            record.repositoryUrl ?? defaults.repositoryUrl ?? undefined,
          branch: record.branch ?? defaults.branch ?? undefined,
          commitSha: record.commitSha ?? defaults.commitSha ?? undefined,
          computerName,
          userName,
          clientVersion: record.clientVersion ?? defaultClientVersion,
        })
      }
      return results
    }
  )

  // Empty payloads are skipped pre-upload; attach them to every return path.
  const degenerateOut = degenerate.length > 0 ? degenerate : undefined
  const finish = (
    result: Omit<TracyBatchUploadResult, 'degenerate'>
  ): TracyBatchUploadResult => ({ ...result, degenerate: degenerateOut })

  // 2. Upload rawData to S3 for records that have it
  const recordsWithRawData = rawRecords
    .map((record, index) => ({ recordId: record.recordId, index }))
    .filter((entry) => serializedRawDataByIndex.has(entry.index))

  if (recordsWithRawData.length > 0) {
    const { uploaded, errors } = await uploadRawDataToS3(
      client,
      recordsWithRawData,
      serializedRawDataByIndex
    )
    for (const [index, key] of uploaded) records[index]!.rawDataS3Key = key
    if (errors) return finish({ ok: false, errors })
  }

  // 3. Submit all records in a single call
  debug('[step:gql-submit] Submitting %d records via GraphQL', records.length)
  try {
    const result = await timedStep(`gql-submit ${records.length} records`, () =>
      withTimeout(
        client.uploadTracyRecords({ records }),
        BATCH_TIMEOUT_MS,
        '[step:gql-submit] uploadTracyRecords'
      )
    )
    if (result.uploadTracyRecords.status !== 'OK') {
      return finish({
        ok: false,
        errors: [
          `[step:gql-submit] Server rejected: ${result.uploadTracyRecords.error ?? 'Unknown server error'}`,
        ],
      })
    }
  } catch (err) {
    debug('[step:gql-submit] Upload failed: %s', errorMessage(err))
    return finish({
      ok: false,
      errors: [`[step:gql-submit] ${errorMessage(err)}`],
    })
  }

  return finish({ ok: true, errors: null })
}
