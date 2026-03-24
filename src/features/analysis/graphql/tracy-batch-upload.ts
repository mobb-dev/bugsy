import Debug from 'debug'

import {
  getRepositoryUrl,
  getSystemInfo,
} from '../../../args/commands/upload_ai_blame'
import { packageJson } from '../../../utils/check_node_version'
import { sanitizeData } from '../../../utils/sanitize-sensitive-data'
import type { TracyRecordInput } from '../scm/generates/client_generates'
import { uploadFile } from '../upload-file'
import type { GQLClient } from './gql'

const debug = Debug('mobbdev:tracy-batch-upload')

export type TracyRecordClientInput = Omit<
  TracyRecordInput,
  | 'rawDataS3Key'
  | 'repositoryUrl'
  | 'computerName'
  | 'userName'
  | 'clientVersion'
> & {
  rawData?: unknown // object from extension, will be sanitized & serialized
}

export type TracyBatchUploadResult = {
  ok: boolean
  errors: string[] | null
}

async function sanitizeRawData(rawData: unknown): Promise<string> {
  try {
    const sanitized = await sanitizeData(rawData)
    return JSON.stringify(sanitized)
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
  workingDir?: string
): Promise<TracyBatchUploadResult> {
  const repositoryUrl = await getRepositoryUrl(workingDir)
  const { computerName, userName } = getSystemInfo()
  const clientVersion = packageJson.version

  // 1. Enrich records and sanitize rawData
  const serializedRawDataByIndex = new Map<number, string>()

  const records: TracyRecordInput[] = await Promise.all(
    rawRecords.map(async (record, index) => {
      if (record.rawData != null) {
        const serialized = await sanitizeRawData(record.rawData)
        serializedRawDataByIndex.set(index, serialized)
      }
      const { rawData: _rawData, ...rest } = record
      return {
        ...rest,
        repositoryUrl: repositoryUrl ?? undefined,
        computerName,
        userName,
        clientVersion,
      }
    })
  )

  // 2. Upload rawData to S3 for records that have it
  const recordsWithRawData = rawRecords
    .map((r, i) => ({ recordId: r.recordId, index: i }))
    .filter((entry) => serializedRawDataByIndex.has(entry.index))

  if (recordsWithRawData.length > 0) {
    debug('Uploading %d rawData files to S3...', recordsWithRawData.length)

    const uploadUrlResult = await client.getTracyRawDataUploadUrl()
    const { url, uploadFieldsJSON, keyPrefix } =
      uploadUrlResult.getTracyRawDataUploadUrl

    if (!url || !uploadFieldsJSON || !keyPrefix) {
      return {
        ok: false,
        errors: ['Failed to get S3 upload URL for rawData'],
      }
    }

    let uploadFields: Record<string, string>
    try {
      uploadFields = JSON.parse(uploadFieldsJSON)
    } catch {
      return { ok: false, errors: ['Malformed uploadFieldsJSON from server'] }
    }

    // Upload all rawData files to S3 concurrently using a single presigned URL
    const uploadResults = await Promise.allSettled(
      recordsWithRawData.map(async (entry) => {
        const rawDataJson = serializedRawDataByIndex.get(entry.index)
        if (!rawDataJson) {
          debug('No serialized rawData for recordId=%s', entry.recordId)
          return
        }

        const uploadKey = `${keyPrefix}${entry.recordId}.json`

        await uploadFile({
          file: Buffer.from(rawDataJson, 'utf-8'),
          url,
          uploadKey,
          uploadFields,
        })

        records[entry.index]!.rawDataS3Key = uploadKey
      })
    )

    const uploadErrors = uploadResults
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => (r.reason as Error).message)

    if (uploadErrors.length > 0) {
      debug('S3 upload errors: %O', uploadErrors)
    }

    // Verify all records that need S3 keys actually got them
    const missingS3Keys = recordsWithRawData.filter(
      (entry) => !records[entry.index]!.rawDataS3Key
    )
    if (missingS3Keys.length > 0) {
      const missingIds = missingS3Keys.map((e) => e.recordId)
      debug('Records missing S3 keys after upload: %O', missingIds)
      return {
        ok: false,
        errors: [
          `Failed to upload rawData to S3 for ${missingS3Keys.length} record(s): ${missingIds.join(', ')}`,
          ...uploadErrors,
        ],
      }
    }

    debug('S3 uploads complete')
  }

  // 3. Submit all records in a single call
  try {
    const result = await client.uploadTracyRecords({ records })
    if (result.uploadTracyRecords.status !== 'OK') {
      return {
        ok: false,
        errors: [result.uploadTracyRecords.error ?? 'Unknown server error'],
      }
    }
  } catch (err) {
    debug('Upload failed: %s', (err as Error).message)
    return {
      ok: false,
      errors: [(err as Error).message],
    }
  }

  return { ok: true, errors: null }
}
