import { promisify } from 'node:util'
import { gzip } from 'node:zlib'

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

const gzipAsync = promisify(gzip)
const debug = Debug('mobbdev:tracy-batch-upload')

const MAX_BATCH_PAYLOAD_BYTES = 3 * 1024 * 1024 // 3MB safety margin (Express limit is 4MB)

export type TracyRecordClientInput = Omit<
  TracyRecordInput,
  | 'rawData'
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

async function sanitizeAndSerializeRawData(rawData: unknown): Promise<string> {
  const original = JSON.stringify(rawData)

  try {
    const sanitized = await sanitizeData(rawData)
    const serialized = JSON.stringify(sanitized)
    const compressed = await gzipAsync(Buffer.from(serialized, 'utf-8'))
    return compressed.toString('base64')
  } catch (err) {
    // Sanitization should never break JSON when operating on parsed objects,
    // but if it does: log warning and fall back to gzipped unsanitized data.
    console.warn(
      '[tracy] sanitizeAndSerializeRawData failed, falling back to unsanitized:',
      (err as Error).message
    )
    const compressed = await gzipAsync(Buffer.from(original, 'utf-8'))
    return compressed.toString('base64')
  }
}

function chunkByPayloadSize<T>(items: T[], maxBytes: number): T[][] {
  const chunks: T[][] = []
  let currentChunk: T[] = []
  let currentSize = 0

  for (const item of items) {
    const itemSize = Buffer.byteLength(JSON.stringify(item), 'utf-8')
    if (currentChunk.length > 0 && currentSize + itemSize > maxBytes) {
      chunks.push(currentChunk)
      currentChunk = [item]
      currentSize = itemSize
    } else {
      currentChunk.push(item)
      currentSize += itemSize
    }
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }
  return chunks
}

function is413Error(err: unknown): boolean {
  if (err instanceof Error) {
    const message = err.message.toLowerCase()
    return message.includes('413') || message.includes('payload too large')
  }
  return false
}

async function sendChunkWithS3Fallback(
  client: GQLClient,
  records: TracyRecordInput[]
) {
  try {
    return await client.uploadTracyRecords({ records })
  } catch (err) {
    if (!is413Error(err)) {
      throw err
    }

    debug('Batch rejected (413). Uploading large rawData to S3...')

    const recordsWithLargeData = records.filter(
      (r) => r.rawData && r.rawData.length > 1_000_000 // 1MB+ likely culprits for 413
    )

    if (recordsWithLargeData.length === 0) {
      throw err
    }

    const uploadUrlsResult = await client.getTracyRawDataUploadUrls({
      recordIds: recordsWithLargeData.map((r) => r.recordId),
    })

    const uploads = uploadUrlsResult.getTracyRawDataUploadUrls.uploads
    if (!uploads || uploads.length === 0) {
      throw err
    }

    const s3KeyByRecordId = new Map<string, string>()

    for (const upload of uploads) {
      const record = records.find((r) => r.recordId === upload.recordId)
      if (!record?.rawData) {
        continue
      }

      await uploadFile({
        file: Buffer.from(record.rawData, 'utf-8'),
        url: upload.url,
        uploadKey: upload.uploadKey,
        uploadFields: JSON.parse(upload.uploadFieldsJSON),
      })

      s3KeyByRecordId.set(upload.recordId, upload.uploadKey)
    }

    const updatedRecords = records.map((r) => {
      const s3Key = s3KeyByRecordId.get(r.recordId)
      if (s3Key) {
        return { ...r, rawDataS3Key: s3Key, rawData: undefined }
      }
      return r
    })

    return await client.uploadTracyRecords({ records: updatedRecords })
  }
}

export async function prepareAndSendTracyRecords(
  client: GQLClient,
  rawRecords: TracyRecordClientInput[]
): Promise<TracyBatchUploadResult> {
  const repositoryUrl = await getRepositoryUrl()
  const { computerName, userName } = getSystemInfo()
  const clientVersion = packageJson.version

  const records: TracyRecordInput[] = await Promise.all(
    rawRecords.map(async (record) => ({
      ...record,
      repositoryUrl: repositoryUrl ?? undefined,
      computerName,
      userName,
      clientVersion,
      rawData:
        record.rawData != null
          ? await sanitizeAndSerializeRawData(record.rawData)
          : undefined,
    }))
  )

  const chunks = chunkByPayloadSize(records, MAX_BATCH_PAYLOAD_BYTES)

  const allErrors: string[] = []

  for (const chunk of chunks) {
    try {
      const result = await sendChunkWithS3Fallback(client, chunk)
      if (result.uploadTracyRecords.status !== 'OK') {
        allErrors.push(
          result.uploadTracyRecords.error ?? 'Unknown server error'
        )
      }
    } catch (err) {
      debug(
        'Chunk upload failed (%d records): %s',
        chunk.length,
        (err as Error).message
      )
      allErrors.push(
        `Chunk of ${chunk.length} records failed: ${(err as Error).message}`
      )
    }
  }

  return {
    ok: allErrors.length === 0,
    errors: allErrors.length ? allErrors : null,
  }
}
