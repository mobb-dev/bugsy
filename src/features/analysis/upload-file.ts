import { Agent } from 'node:http'

import Debug from 'debug'
import fetch, { File, fileFrom, FormData } from 'node-fetch'

import { getProxyAgent } from '../../utils/proxy'

const debug = Debug('mobbdev:upload-file')

/**
 * Per-request timeout bounds. Scaled to payload size so a stalled/reset socket
 * can't hang forever, while a genuinely large (up to 20MB) upload on a thin
 * link isn't aborted prematurely and then falsely retried. Small uploads get
 * the floor (fast failure on a hostile network); large ones get headroom.
 */
const MIN_UPLOAD_TIMEOUT_MS = 10_000
const MAX_UPLOAD_TIMEOUT_MS = 60_000
/** Assumed worst-case acceptable link: ~512 KB/s → bytes / this = added ms. */
const SLOW_LINK_BYTES_PER_MS = 512

/** Size-scaled request timeout. Unknown size (path uploads) → generous max. */
function computeUploadTimeoutMs(file: string | Buffer): number {
  if (typeof file === 'string') {
    return MAX_UPLOAD_TIMEOUT_MS
  }
  const sizeAllowanceMs = Math.ceil(file.byteLength / SLOW_LINK_BYTES_PER_MS)
  return Math.min(
    MAX_UPLOAD_TIMEOUT_MS,
    MIN_UPLOAD_TIMEOUT_MS + sizeAllowanceMs
  )
}

/** Transport-level error codes that are worth retrying (proxy/network blips). */
const TRANSIENT_ERROR_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'EPIPE',
  'EAI_AGAIN',
  'ENETUNREACH',
  'ENOTFOUND',
])

/**
 * True for transient transport failures (connection resets, timeouts, DNS
 * blips) where a retry may succeed. An {@link S3UploadError} is an HTTP-level
 * rejection from S3 (e.g. AccessDenied, ExpiredToken) and is NOT transient.
 * node-fetch wraps system errors in a `FetchError` carrying `code`/`type`,
 * and an aborted request (our timeout) surfaces as an `AbortError`.
 */
export function isTransientUploadError(err: unknown): boolean {
  if (err instanceof S3UploadError) {
    return false
  }
  if (typeof err !== 'object' || err === null) {
    return false
  }
  const e = err as { code?: string; type?: string; name?: string }
  if (e.code !== undefined && TRANSIENT_ERROR_CODES.has(e.code)) {
    return true
  }
  // node-fetch system errors and timeout aborts
  return (
    e.type === 'system' || e.name === 'AbortError' || e.name === 'TimeoutError'
  )
}

/**
 * Thrown when S3 rejects the upload. Carries the HTTP status and the parsed
 * S3 error `<Code>` so callers can distinguish causes (e.g. `AccessDenied` +
 * "Request has expired" = presigned policy expiry, `ExpiredToken` = the
 * signing credentials rotated, `EntityTooSmall` = empty body, `SlowDown` =
 * throttle). The `message` is kept byte-for-byte compatible with the previous
 * `Error` (`Failed to upload the file: <status>`) so existing string matching
 * keeps working.
 */
export class S3UploadError extends Error {
  constructor(
    public readonly status: number,
    public readonly s3Code?: string,
    public readonly s3Message?: string
  ) {
    super(`Failed to upload the file: ${status}`)
    this.name = 'S3UploadError'
  }
}

/** Extract `<Code>`/`<Message>` from S3's XML error document (best-effort). */
function parseS3ErrorBody(body: string): {
  code?: string
  message?: string
} {
  return {
    code: body.match(/<Code>([^<]+)<\/Code>/)?.[1],
    message: body.match(/<Message>([^<]+)<\/Message>/)?.[1],
  }
}

export async function uploadFile({
  file,
  url,
  uploadKey,
  uploadFields,
  logger,
  signal,
}: {
  file: string | Buffer
  url: string
  uploadKey: string
  uploadFields: Record<string, string>
  logger?: (message: string, data?: unknown) => void
  /** Aborts the underlying request (e.g. on a timeout) so it doesn't keep
   * running in the background and pile up sockets/Buffers past the caller's
   * concurrency cap. */
  signal?: AbortSignal
}) {
  const logInfo =
    logger ||
    ((_message: string, _data?: unknown) => {
      /*noop*/
    })

  logInfo(`FileUpload: upload file start ${url}`)
  logInfo(`FileUpload: upload fields`, uploadFields)
  logInfo(`FileUpload: upload key ${uploadKey}`)

  debug('upload file start %s', url)
  debug('upload fields %o', uploadFields)
  debug('upload key %s', uploadKey)
  const form = new FormData()
  Object.entries(uploadFields).forEach(([key, value]) => {
    form.append(key, value)
  })

  // Always set the key explicitly — required for MinIO and for starts-with presigned URLs
  // where the presigned fields may contain a placeholder key that must be overridden.
  form.set('key', uploadKey)
  if (typeof file === 'string') {
    debug('upload file from path %s', file)
    logInfo(`FileUpload: upload file from path ${file}`)

    form.append('file', await fileFrom(file))
  } else {
    debug('upload file from buffer')
    logInfo(`FileUpload: upload file from buffer`)
    // Zero-copy Uint8Array view over the Buffer's memory (a valid BlobPart),
    // instead of `new Uint8Array(file)` which copies the whole payload. The
    // cast narrows ArrayBufferLike→ArrayBuffer (these Buffers never wrap a
    // SharedArrayBuffer) so the view satisfies node-fetch's BlobPart type.
    form.append(
      'file',
      new File(
        [
          new Uint8Array(
            file.buffer as ArrayBuffer,
            file.byteOffset,
            file.byteLength
          ),
        ],
        'file'
      )
    )
  }
  const agent = getProxyAgent(url)
  // Bound every request: callers that don't pass a signal still get a timeout
  // (scaled to payload size) so a stalled or silently-reset socket can't hang
  // the upload indefinitely.
  const effectiveSignal =
    signal ?? AbortSignal.timeout(computeUploadTimeoutMs(file))
  const response = await fetch(url, {
    method: 'POST',
    body: form,
    agent: agent as unknown as Agent,
    signal: effectiveSignal,
  })

  if (!response.ok) {
    let bodyText = ''
    try {
      bodyText = await response.text()
    } catch {
      /* body unreadable/already consumed — fall back to status only */
    }
    const { code, message } = parseS3ErrorBody(bodyText)
    debug(
      'error from S3 status=%d code=%s message=%s',
      response.status,
      code,
      message
    )
    logInfo(
      `FileUpload: error from S3 status=${response.status} code=${code ?? 'unknown'}`
    )
    throw new S3UploadError(response.status, code, message)
  }
  debug('upload file done')
  logInfo(`FileUpload: upload file done`)
}
