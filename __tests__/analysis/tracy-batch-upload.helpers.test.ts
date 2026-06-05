import { describe, expect, it } from 'vitest'

import {
  classifyUploadError,
  isStructurallyEmptyPayload,
} from '../../src/features/analysis/graphql/tracy-batch-upload'
import { S3UploadError } from '../../src/features/analysis/upload-file'

describe('isStructurallyEmptyPayload', () => {
  it.each(['', '   ', '{}', '[]', '""', 'null', '  {}  ', '{ }', '[  ]'])(
    'treats %j as empty',
    (s) => {
      expect(isStructurallyEmptyPayload(s)).toBe(true)
    }
  )

  it.each(['{"a":1}', '[1]', '"x"', '0', 'false', '{"bubble":{}}'])(
    'treats %j as non-empty',
    (s) => {
      expect(isStructurallyEmptyPayload(s)).toBe(false)
    }
  )
})

describe('S3UploadError', () => {
  it('keeps the legacy message format for backward compatibility', () => {
    const err = new S3UploadError(403, 'ExpiredToken', 'The token expired')
    expect(err.message).toBe('Failed to upload the file: 403')
    expect(err.status).toBe(403)
    expect(err.s3Code).toBe('ExpiredToken')
  })
})

describe('classifyUploadError', () => {
  it('marks 403 (expiry / expired-token) retryable with a fresh URL', () => {
    const k = classifyUploadError(new S3UploadError(403, 'AccessDenied'))
    expect(k).toEqual({ status: 403, s3Code: 'AccessDenied', retryable: true })
  })

  it('marks 503 (throttle) retryable', () => {
    expect(
      classifyUploadError(new S3UploadError(503, 'SlowDown')).retryable
    ).toBe(true)
  })

  it('marks 400 (EntityTooSmall/Large/malformed) NOT retryable — a fresh URL would not help', () => {
    expect(
      classifyUploadError(new S3UploadError(400, 'EntityTooSmall')).retryable
    ).toBe(false)
  })

  it('marks 401 NOT retryable', () => {
    expect(classifyUploadError(new S3UploadError(401)).retryable).toBe(false)
  })

  it('treats timeouts and network errors as retryable transient failures', () => {
    expect(
      classifyUploadError(new Error('uploadFile x timed out after 30000ms'))
        .retryable
    ).toBe(true)
    expect(
      classifyUploadError(new Error('getaddrinfo ENOTFOUND s3...')).retryable
    ).toBe(true)
  })
})
