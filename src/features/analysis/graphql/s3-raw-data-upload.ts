import { setTimeout as sleep } from 'node:timers/promises'

import Debug from 'debug'

import { withTimeout } from '../../../utils/with-timeout'
import { S3UploadError, uploadFile } from '../upload-file'
import type { GQLClient } from './gql'

const debug = Debug('mobbdev:tracy-s3-upload')

/** Per-S3-operation timeout (one presigned PUT or one upload-URL fetch). */
const S3_OP_TIMEOUT_MS = 30_000
/** Hard ceiling on the whole S3 phase across all retry passes, so a slow/large
 * batch can't run for minutes and overlap the next daemon poll. */
const MAX_TOTAL_S3_UPLOAD_MS = 120_000
/** Bounded concurrency — caps in-flight Buffers (a 50-record all-at-once flush
 * spiked ~309MB RSS in stress tests). */
const MAX_CONCURRENT_S3_UPLOADS = 5
/** Refresh the presigned URL once older than this. The server signs URLs for
 * 30 min, but a long/slow/backlogged batch (or rotated signing creds) can
 * outlive that window and 403 the tail; staying under 30 min keeps every chunk
 * uploading against a fresh URL. */
const URL_REFRESH_MS = 20 * 60 * 1000
/** Initial pass + this many refresh-and-retry passes for retryable failures. */
const MAX_UPLOAD_ATTEMPTS = 3
/** Backoff before a retry pass (multiplied by the attempt number). */
const RETRY_BACKOFF_MS = 500
/** Cap on the server-supplied <Message> text we echo into diagnostics. */
const MAX_S3_MESSAGE_CHARS = 120

const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : String(e)

export type UploadFailureKind = {
  status?: number
  s3Code?: string
  s3Message?: string
  /** Whether a fresh URL + retry could plausibly succeed. */
  retryable: boolean
}

/**
 * Classify an S3 upload rejection. A fresh presigned URL can recover expiry
 * (403 AccessDenied / ExpiredToken), throttling (503), and transient
 * network/timeout errors — but NOT a 400 (EntityTooSmall/Large/malformed) or
 * 401, which would just fail again and head-of-line-block the batch.
 */
export function classifyUploadError(reason: unknown): UploadFailureKind {
  if (reason instanceof S3UploadError) {
    return {
      status: reason.status,
      s3Code: reason.s3Code,
      s3Message: reason.s3Message,
      retryable: reason.status !== 400 && reason.status !== 401,
    }
  }
  // withTimeout rejection or network error (ECONNRESET / ENOTFOUND) — transient.
  return { retryable: true }
}

type S3Creds = {
  url: string
  uploadFields: Record<string, string>
  keyPrefix: string
}

export type UploadEntry = { recordId: string; index: number }

type UploadFailure = {
  entry: UploadEntry
  kind: UploadFailureKind
  message: string
}

/**
 * Lazily fetches and caches a presigned upload URL, refreshing on demand
 * (`refresh`) or when the cached one nears the server's 30-min expiry
 * (`current`). Encapsulates the credential state so callers never juggle a
 * nullable `creds` / `force` flag.
 */
function createPresignedUrlProvider(client: GQLClient) {
  let creds: S3Creds | null = null
  let fetchedAt = 0

  const fetchFresh = async (): Promise<S3Creds> => {
    let res
    try {
      res = await withTimeout(
        client.getTracyRawDataUploadUrl(),
        S3_OP_TIMEOUT_MS,
        '[step:s3-url] getTracyRawDataUploadUrl'
      )
    } catch (err) {
      throw new Error(
        `[step:s3-url] Failed to fetch S3 upload URL: ${errorMessage(err)}`
      )
    }
    const { url, uploadFieldsJSON, keyPrefix } = res.getTracyRawDataUploadUrl
    if (!url || !uploadFieldsJSON || !keyPrefix) {
      throw new Error(
        `[step:s3-url] Missing S3 upload fields (url=${!!url}, fields=${!!uploadFieldsJSON}, prefix=${!!keyPrefix})`
      )
    }
    try {
      return { url, uploadFields: JSON.parse(uploadFieldsJSON), keyPrefix }
    } catch {
      throw new Error('[step:s3-url] Malformed uploadFieldsJSON from server')
    }
  }

  const refresh = async (): Promise<S3Creds> => {
    creds = await fetchFresh()
    fetchedAt = Date.now()
    return creds
  }

  return {
    refresh,
    /** Cached creds, refreshed if missing or near expiry. */
    async current(): Promise<S3Creds> {
      if (!creds || Date.now() - fetchedAt > URL_REFRESH_MS) return refresh()
      return creds
    },
  }
}

export type S3UploadResult = {
  /** record index → uploaded S3 key, for every record that landed. */
  uploaded: Map<number, string>
  /** Step-prefixed error strings, or null when every record uploaded. */
  errors: string[] | null
}

/**
 * Upload each entry's serialized rawData to S3 via a presigned POST URL, with
 * bounded concurrency, proactive URL refresh, and refresh-and-retry for
 * retryable failures. A single bad record cannot head-of-line-block the batch:
 * non-retryable failures (400/401) are recorded but never retried, and the
 * whole phase is time-bounded by MAX_TOTAL_S3_UPLOAD_MS.
 *
 * Successfully-uploaded entries are dropped from `serializedByIndex` so their
 * Buffers can be GC'd mid-flight.
 */
export async function uploadRawDataToS3(
  client: GQLClient,
  entries: UploadEntry[],
  serializedByIndex: Map<number, string>
): Promise<S3UploadResult> {
  const uploaded = new Map<number, string>()
  const urls = createPresignedUrlProvider(client)

  debug(
    '[step:s3-upload] Uploading %d files to S3 (concurrency=%d)',
    entries.length,
    MAX_CONCURRENT_S3_UPLOADS
  )
  const start = Date.now()
  const deadline = start + MAX_TOTAL_S3_UPLOAD_MS

  const uploadPass = async (pass: UploadEntry[]): Promise<UploadFailure[]> => {
    const failures: UploadFailure[] = []
    for (let i = 0; i < pass.length; i += MAX_CONCURRENT_S3_UPLOADS) {
      if (Date.now() > deadline) {
        // Out of budget — fail the rest as non-retryable so the loop stops
        // rather than advancing the cursor past un-uploaded records.
        for (const entry of pass.slice(i)) {
          failures.push({
            entry,
            kind: { retryable: false },
            message: `[step:s3-upload] aborted: exceeded ${MAX_TOTAL_S3_UPLOAD_MS}ms total upload budget`,
          })
        }
        break
      }
      const { url, uploadFields, keyPrefix } = await urls.current()
      const chunk = pass.slice(i, i + MAX_CONCURRENT_S3_UPLOADS)
      const settled = await Promise.allSettled(
        chunk.map(async (entry) => {
          const rawDataJson = serializedByIndex.get(entry.index)
          if (!rawDataJson) {
            debug('No serialized rawData for recordId=%s', entry.recordId)
            return
          }
          const uploadKey = `${keyPrefix}${entry.recordId}.json`
          // Abort the request on timeout (don't just race a timer) so a slow
          // upload can't keep running past the concurrency cap. Preserve the
          // familiar "timed out after" message for the existing Datadog query.
          const signal = AbortSignal.timeout(S3_OP_TIMEOUT_MS)
          try {
            await uploadFile({
              file: Buffer.from(rawDataJson, 'utf-8'),
              url,
              uploadKey,
              uploadFields,
              signal,
            })
          } catch (err) {
            if (signal.aborted) {
              throw new Error(
                `[step:s3-upload] uploadFile ${entry.recordId} timed out after ${S3_OP_TIMEOUT_MS}ms`
              )
            }
            throw err
          }
          uploaded.set(entry.index, uploadKey)
          // Free the Buffer/string now that it's safely uploaded.
          serializedByIndex.delete(entry.index)
        })
      )
      settled.forEach((outcome, idx) => {
        if (outcome.status === 'rejected') {
          failures.push({
            entry: chunk[idx]!,
            kind: classifyUploadError(outcome.reason),
            message: errorMessage(outcome.reason),
          })
        }
      })
    }
    return failures
  }

  // Accumulate the latest failure per record across attempts so a non-retryable
  // failure (e.g. 400) from an early pass survives into the final diagnostics
  // even after later passes retry only the retryable ones.
  const failuresByRecord = new Map<string, UploadFailure>()
  try {
    await urls.refresh()
    let pending = entries
    for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
      const failures = await uploadPass(pending)
      // Clear prior status for records retried this pass (succeeded → gone;
      // failed → re-set below with the latest failure).
      for (const entry of pending) failuresByRecord.delete(entry.recordId)
      for (const failure of failures)
        failuresByRecord.set(failure.entry.recordId, failure)

      const retryable = failures.filter((failure) => failure.kind.retryable)
      if (
        retryable.length === 0 ||
        attempt === MAX_UPLOAD_ATTEMPTS ||
        Date.now() > deadline
      ) {
        break
      }
      debug(
        '[step:s3-upload] attempt %d failed for %d record(s); refreshing URL and retrying',
        attempt,
        retryable.length
      )
      await sleep(RETRY_BACKOFF_MS * attempt)
      await urls.refresh()
      pending = retryable.map((failure) => failure.entry)
    }
  } catch (err) {
    // URL fetch failed (initial or mid-retry) — nothing could upload.
    return { uploaded, errors: [errorMessage(err)] }
  }

  debug('[perf] s3-upload %d files: %dms', entries.length, Date.now() - start)

  const missing = entries.filter((entry) => !uploaded.has(entry.index))
  if (missing.length === 0) {
    debug('[step:s3-upload] S3 uploads complete')
    return { uploaded, errors: null }
  }

  // Surface the S3 status/code/message per failing record (across all passes)
  // so Datadog shows *why* (expiry vs ExpiredToken vs size), not a bare status.
  const detail = missing.map((entry) => {
    const failure = failuresByRecord.get(entry.recordId)
    const code = failure?.kind.s3Code ? ` ${failure.kind.s3Code}` : ''
    const message = failure?.kind.s3Message
      ? ` "${failure.kind.s3Message.slice(0, MAX_S3_MESSAGE_CHARS)}"`
      : ''
    return `[step:s3-upload] ${entry.recordId}: HTTP ${failure?.kind.status ?? 'n/a'}${code}${message} (${failure?.message ?? 'unknown'})`
  })
  debug(
    '[step:s3-upload] Records missing S3 keys: %O',
    missing.map((entry) => entry.recordId)
  )
  return {
    uploaded,
    errors: [
      `[step:s3-upload] Failed to upload rawData for ${missing.length} record(s): ${missing
        .map((entry) => entry.recordId)
        .join(', ')}`,
      ...detail,
    ],
  }
}
