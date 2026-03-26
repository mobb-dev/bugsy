import Debug from 'debug'

import {
  getRepositoryUrl,
  getSystemInfo,
} from '../../../args/commands/upload_ai_blame'
import { packageJson } from '../../../utils/check_node_version'
import { sanitizeData } from '../../../utils/sanitize-sensitive-data'
import { withTimeout } from '../../../utils/with-timeout'
import type { TracyRecordInput } from '../scm/generates/client_generates'
import { uploadFile } from '../upload-file'
import type { GQLClient } from './gql'

const debug = Debug('mobbdev:tracy-batch-upload')

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

/** Max time for the entire batch upload flow (GQL + S3 + submit). */
const BATCH_TIMEOUT_MS = 30_000 // 30 seconds

export type TracyRecordClientInput = Omit<
  TracyRecordInput,
  | 'rawDataS3Key'
  | 'repositoryUrl'
  | 'computerName'
  | 'userName'
  | 'clientVersion'
> & {
  rawData?: unknown // object from extension, will be sanitized & serialized
  /** Override auto-detected repo URL (e.g. from extension metadata) */
  repositoryUrl?: string
  /** Override auto-detected client version (e.g. extension version instead of CLI version) */
  clientVersion?: string
}

export type TracyBatchUploadResult = {
  ok: boolean
  errors: string[] | null
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
    // but if it does: log warning and fall back to unsanitized data.
    console.warn(
      '[tracy] sanitizeRawData failed, falling back to unsanitized:',
      (err as Error).message
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

  // Only resolve default repo URL if the caller didn't provide one per-record.
  const defaultRepoUrl = rawRecords[0]?.repositoryUrl
    ? undefined
    : ((await getRepositoryUrl(workingDir)) ?? undefined)

  // 1. Enrich records and optionally sanitize rawData
  debug(
    '[step:sanitize] %s %d records',
    shouldSanitize ? 'Sanitizing' : 'Serializing',
    rawRecords.length
  )
  const serializedRawDataByIndex = new Map<number, string>()

  const records: TracyRecordInput[] = await timedStep(
    `${shouldSanitize ? 'sanitize' : 'serialize'} ${rawRecords.length} records`,
    () =>
      Promise.all(
        rawRecords.map(async (record, index) => {
          if (record.rawData != null) {
            const serialized = shouldSanitize
              ? await sanitizeRawData(record.rawData)
              : JSON.stringify(record.rawData)
            serializedRawDataByIndex.set(index, serialized)
          }
          const { rawData: _rawData, ...rest } = record
          return {
            ...rest,
            repositoryUrl: record.repositoryUrl ?? defaultRepoUrl,
            computerName,
            userName,
            clientVersion: record.clientVersion ?? defaultClientVersion,
          }
        })
      )
  )

  // 2. Upload rawData to S3 for records that have it
  const recordsWithRawData = rawRecords
    .map((r, i) => ({ recordId: r.recordId, index: i }))
    .filter((entry) => serializedRawDataByIndex.has(entry.index))

  if (recordsWithRawData.length > 0) {
    debug(
      '[step:s3-url] Requesting presigned URL for %d rawData files',
      recordsWithRawData.length
    )

    let uploadUrlResult
    try {
      uploadUrlResult = await withTimeout(
        client.getTracyRawDataUploadUrl(),
        BATCH_TIMEOUT_MS,
        '[step:s3-url] getTracyRawDataUploadUrl'
      )
    } catch (err) {
      return {
        ok: false,
        errors: [
          `[step:s3-url] Failed to fetch S3 upload URL: ${(err as Error).message}`,
        ],
      }
    }
    const { url, uploadFieldsJSON, keyPrefix } =
      uploadUrlResult.getTracyRawDataUploadUrl

    if (!url || !uploadFieldsJSON || !keyPrefix) {
      return {
        ok: false,
        errors: [
          `[step:s3-url] Missing S3 upload fields (url=${!!url}, fields=${!!uploadFieldsJSON}, prefix=${!!keyPrefix})`,
        ],
      }
    }

    let uploadFields: Record<string, string>
    try {
      uploadFields = JSON.parse(uploadFieldsJSON)
    } catch {
      return {
        ok: false,
        errors: ['[step:s3-url] Malformed uploadFieldsJSON from server'],
      }
    }

    // Upload all rawData files to S3 concurrently using a single presigned URL
    debug(
      '[step:s3-upload] Uploading %d files to S3',
      recordsWithRawData.length
    )
    const s3Start = Date.now()
    const uploadResults = await Promise.allSettled(
      recordsWithRawData.map(async (entry) => {
        const rawDataJson = serializedRawDataByIndex.get(entry.index)
        if (!rawDataJson) {
          debug('No serialized rawData for recordId=%s', entry.recordId)
          return
        }

        const uploadKey = `${keyPrefix}${entry.recordId}.json`

        await withTimeout(
          uploadFile({
            file: Buffer.from(rawDataJson, 'utf-8'),
            url,
            uploadKey,
            uploadFields,
          }),
          BATCH_TIMEOUT_MS,
          `[step:s3-upload] uploadFile ${entry.recordId}`
        )

        records[entry.index]!.rawDataS3Key = uploadKey
      })
    )

    debug(
      '[perf] s3-upload %d files: %dms',
      recordsWithRawData.length,
      Date.now() - s3Start
    )

    const uploadErrors = uploadResults
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => (r.reason as Error).message)

    if (uploadErrors.length > 0) {
      debug('[step:s3-upload] S3 upload errors: %O', uploadErrors)
    }

    // Verify all records that need S3 keys actually got them
    const missingS3Keys = recordsWithRawData.filter(
      (entry) => !records[entry.index]!.rawDataS3Key
    )
    if (missingS3Keys.length > 0) {
      const missingIds = missingS3Keys.map((e) => e.recordId)
      debug('[step:s3-upload] Records missing S3 keys: %O', missingIds)
      return {
        ok: false,
        errors: [
          `[step:s3-upload] Failed to upload rawData for ${missingS3Keys.length} record(s): ${missingIds.join(', ')}`,
          ...uploadErrors,
        ],
      }
    }

    debug('[step:s3-upload] S3 uploads complete')
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
      return {
        ok: false,
        errors: [
          `[step:gql-submit] Server rejected: ${result.uploadTracyRecords.error ?? 'Unknown server error'}`,
        ],
      }
    }
  } catch (err) {
    debug('[step:gql-submit] Upload failed: %s', (err as Error).message)
    return {
      ok: false,
      errors: [`[step:gql-submit] ${(err as Error).message}`],
    }
  }

  return { ok: true, errors: null }
}
