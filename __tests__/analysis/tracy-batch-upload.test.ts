import { beforeEach, describe, expect, it, vi } from 'vitest'

import { prepareAndSendTracyRecords } from '../../src/features/analysis/graphql/tracy-batch-upload'
import { S3UploadError } from '../../src/features/analysis/upload-file'

// --- mocks -----------------------------------------------------------------
const ptMocks = vi.hoisted(() => ({
  uploadFile: vi.fn(),
  sanitizeData: vi.fn(async (d: unknown) => d),
}))

// Partial-mock upload-file: keep the real S3UploadError (classifyUploadError
// uses `instanceof`), stub only the network-touching uploadFile.
vi.mock('../../src/features/analysis/upload-file', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('../../src/features/analysis/upload-file')
    >()
  return { ...actual, uploadFile: ptMocks.uploadFile }
})
vi.mock('../../src/args/commands/upload_ai_blame', () => ({
  getSystemInfo: () => ({ computerName: 'test-host', userName: 'tester' }),
  readRepoState: async () => ({
    repositoryUrl: null,
    branch: null,
    commitSha: null,
  }),
}))
vi.mock('../../src/utils/check_node_version', () => ({
  packageJson: { version: '9.9.9' },
}))
vi.mock('../../src/utils/sanitize-sensitive-data', () => ({
  sanitizeData: ptMocks.sanitizeData,
}))

// --- helpers ---------------------------------------------------------------
function makeClient() {
  return {
    getTracyRawDataUploadUrl: vi.fn().mockResolvedValue({
      getTracyRawDataUploadUrl: {
        url: 'https://s3.example/upload',
        uploadFieldsJSON: JSON.stringify({
          policy: 'p',
          'x-amz-signature': 's',
        }),
        keyPrefix: 'tracy-uploads/aaaa/u1/agent-events/',
      },
    }),
    uploadTracyRecords: vi
      .fn()
      .mockResolvedValue({ uploadTracyRecords: { status: 'OK', error: null } }),
  }
}

const rec = (recordId: string, rawData: unknown) =>
  ({
    platform: 'cursor',
    recordId,
    recordTimestamp: '2026-06-03T00:00:00Z',
    rawData,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

// cast helpers to keep the test free of generated GQL/enum types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const send = (client: any, records: unknown[], sanitize = false) =>
  prepareAndSendTracyRecords(client, records as never, undefined, { sanitize })

beforeEach(() => {
  vi.clearAllMocks()
  ptMocks.sanitizeData.mockImplementation(async (d: unknown) => d)
})

// --- tests -----------------------------------------------------------------
describe('prepareAndSendTracyRecords — retry + URL refresh', () => {
  it('retries a 403 with a freshly-fetched URL and recovers', async () => {
    ptMocks.uploadFile
      .mockRejectedValueOnce(new S3UploadError(403, 'AccessDenied'))
      .mockResolvedValueOnce(undefined)
    const client = makeClient()

    const res = await send(client, [rec('r1', { a: 1 })])

    expect(res.ok).toBe(true)
    expect(res.errors).toBeNull()
    expect(ptMocks.uploadFile).toHaveBeenCalledTimes(2)
    // initial fetch + one refresh before the retry pass
    expect(client.getTracyRawDataUploadUrl).toHaveBeenCalledTimes(2)
  })

  it('preserves a non-retryable 400 diagnostic from an early pass after a later retry pass runs', async () => {
    const calls: Record<string, number> = {}
    ptMocks.uploadFile.mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async ({ uploadKey }: any) => {
        const id = uploadKey.includes('bad') ? 'bad' : 'good'
        calls[id] = (calls[id] ?? 0) + 1
        if (id === 'bad') throw new S3UploadError(400, 'EntityTooSmall')
        if (calls['good'] === 1) throw new S3UploadError(403, 'AccessDenied')
        return undefined
      }
    )
    const client = makeClient()

    const res = await send(client, [
      rec('bad', { a: 1 }),
      rec('good', { b: 2 }),
    ])

    expect(res.ok).toBe(false)
    const joined = (res.errors ?? []).join('\n')
    // Finding 5: the 400 from attempt 1 survives into the final detail even
    // though only 'good' was retried afterwards.
    expect(joined).toContain('bad: HTTP 400 EntityTooSmall')
    expect(joined).toContain('Failed to upload rawData for 1 record(s): bad')
    // 'good' recovered on retry and must not appear as a failure
    expect(joined).not.toContain('good: HTTP')
  })
})

describe('prepareAndSendTracyRecords — degenerate (empty) records', () => {
  it('skips an empty payload before S3, redacts the sample when sanitization is off, and still submits metadata', async () => {
    const client = makeClient()

    const res = await send(client, [rec('empty', {})])

    expect(res.ok).toBe(true)
    expect(res.degenerate).toHaveLength(1)
    expect(res.degenerate?.[0]).toMatchObject({
      recordId: 'empty',
      sample: '<redacted: sanitization disabled>',
    })
    // never attempted an S3 upload (no URL fetched, no uploadFile)
    expect(ptMocks.uploadFile).not.toHaveBeenCalled()
    expect(client.getTracyRawDataUploadUrl).not.toHaveBeenCalled()
    // metadata record still submitted
    expect(client.uploadTracyRecords).toHaveBeenCalledTimes(1)
  })

  it('includes the real (sanitized) sample when sanitization is on', async () => {
    const client = makeClient()

    const res = await send(client, [rec('empty', {})], /* sanitize */ true)

    expect(res.degenerate?.[0]?.sample).toBe('{}')
  })
})
