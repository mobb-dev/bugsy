import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  ProcessedFile,
  ProcessedSkill,
} from '../../src/features/analysis/context_file_processor'
import type { SkillGroup } from '../../src/features/analysis/context_file_scanner'
import { runContextFileUploadPipeline } from '../../src/features/analysis/context_file_uploader'
import type { UploadLedger } from '../../src/features/analysis/context_upload_ledger'

const mocks = vi.hoisted(() => ({
  uploadFile: vi.fn(),
  isTransientUploadError: vi.fn(() => false),
  markContextFilesUploaded: vi.fn(),
  markContextUploadFailed: vi.fn(),
}))

vi.mock('../../src/features/analysis/upload-file', () => ({
  uploadFile: mocks.uploadFile,
  isTransientUploadError: mocks.isTransientUploadError,
}))

vi.mock('../../src/features/analysis/context_file_scanner', async (orig) => {
  const actual =
    await orig<
      typeof import('../../src/features/analysis/context_file_scanner')
    >()
  return {
    ...actual,
    markContextFilesUploaded: mocks.markContextFilesUploaded,
    markContextUploadFailed: mocks.markContextUploadFailed,
  }
})

const VALID_FIELDS = JSON.stringify({ key: 'value' })

function makeFile(
  md5 = 'aaa',
  content = 'hello',
  filePath = '/proj/CLAUDE.md'
): ProcessedFile {
  return {
    entry: {
      name: filePath.split('/').pop()!,
      path: filePath,
      content,
      sizeBytes: content.length,
      category: 'rule',
      mtimeMs: 1000,
    },
    sanitizedContent: content,
    md5,
    sizeBytes: content.length,
  }
}

function makeSkill(md5 = 'bbb'): ProcessedSkill {
  return {
    group: {
      name: 'my-skill',
      root: 'home',
      skillPath: '/home/.claude/skills/my-skill',
      files: [],
      isFolder: true,
      maxMtimeMs: 2000,
      sessionKey: 'skill:home:my-skill',
    } as SkillGroup,
    zipBuffer: Buffer.from('PK\x03\x04'),
    md5,
    sizeBytes: 4,
  }
}

const baseOpts = {
  sessionId: 'sess-1',
  platform: 'claude-code',
  url: 'https://s3.example.com',
  keyPrefix: 'prefix/',
  repositoryUrl: undefined,
  clientVersion: '1.0.0',
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.uploadFile.mockResolvedValue(undefined)
})

describe('runContextFileUploadPipeline — malformed JSON', () => {
  it('returns null when uploadFieldsJSON is not valid JSON', async () => {
    const result = await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [makeFile()],
      processedSkills: [],
      uploadFieldsJSON: '{bad json',
      submitRecords: vi.fn(),
    })
    expect(result).toBeNull()
  })
})

describe('runContextFileUploadPipeline — empty input', () => {
  it('returns { fileCount: 0, skillCount: 0 } and skips submitRecords when no files or skills', async () => {
    const submitRecords = vi.fn()
    const result = await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords,
    })

    expect(result).toEqual(
      expect.objectContaining({ fileCount: 0, skillCount: 0 })
    )
    expect(submitRecords).not.toHaveBeenCalled()
    expect(mocks.markContextFilesUploaded).not.toHaveBeenCalled()
  })
})

describe('runContextFileUploadPipeline — successful upload', () => {
  it('calls submitRecords and markContextFilesUploaded after successful uploads', async () => {
    const submitRecords = vi.fn().mockResolvedValue(undefined)
    const file = makeFile()
    const skill = makeSkill()

    const result = await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [file],
      processedSkills: [skill],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords,
    })

    expect(result).toEqual(
      expect.objectContaining({ fileCount: 1, skillCount: 1 })
    )
    expect(submitRecords).toHaveBeenCalledOnce()
    expect(mocks.markContextFilesUploaded).toHaveBeenCalledOnce()
  })
})

describe('runContextFileUploadPipeline — submitRecords throws', () => {
  it('does NOT call markContextFilesUploaded when submitRecords throws', async () => {
    const submitRecords = vi
      .fn()
      .mockRejectedValue(new Error('batch upload failed'))

    await expect(
      runContextFileUploadPipeline({
        ...baseOpts,
        processedFiles: [makeFile()],
        processedSkills: [],
        uploadFieldsJSON: VALID_FIELDS,
        submitRecords,
      })
    ).rejects.toThrow('batch upload failed')

    expect(mocks.markContextFilesUploaded).not.toHaveBeenCalled()
  })
})

describe('runContextFileUploadPipeline — partial S3 failure', () => {
  it('only marks successfully uploaded files (not failed ones)', async () => {
    const goodFile = makeFile('good-md5', 'good content', '/proj/CLAUDE.md')
    const badFile = makeFile('bad-md5', 'bad content', '/proj/INSIGHTS.md')

    mocks.uploadFile
      .mockResolvedValueOnce(undefined) // good file succeeds
      .mockRejectedValueOnce(new Error('S3 error')) // bad file fails

    const submitRecords = vi.fn().mockResolvedValue(undefined)
    const onFileError = vi.fn()

    await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [goodFile, badFile],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords,
      onFileError,
    })

    expect(onFileError).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Error)
    )

    // markContextFilesUploaded should only see the good file
    const firstCall = mocks.markContextFilesUploaded.mock.calls[0]!
    const markedPaths = (firstCall[1] as { path: string }[]).map((f) => f.path)
    expect(markedPaths).toContain(goodFile.entry.path)
    expect(markedPaths).not.toContain(badFile.entry.path)

    // the failed file must be recorded for upload-failure backoff
    expect(mocks.markContextUploadFailed).toHaveBeenCalledOnce()
    const failCall = mocks.markContextUploadFailed.mock.calls[0]!
    const failedPaths = (failCall[1] as { path: string }[]).map((f) => f.path)
    expect(failedPaths).toEqual([badFile.entry.path])
  })
})

describe('runContextFileUploadPipeline — transient retry', () => {
  it('retries transient upload errors and does not record a failure on eventual success', async () => {
    // First attempt rejects with a transient error, second succeeds.
    mocks.uploadFile
      .mockRejectedValueOnce(
        Object.assign(new Error('reset'), { code: 'ECONNRESET' })
      )
      .mockResolvedValueOnce(undefined)
    mocks.isTransientUploadError.mockReturnValueOnce(true)

    const submitRecords = vi.fn().mockResolvedValue(undefined)
    const result = await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [makeFile()],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords,
    })

    expect(mocks.uploadFile).toHaveBeenCalledTimes(2)
    expect(result).toEqual(
      expect.objectContaining({ fileCount: 1, skillCount: 0 })
    )
    expect(mocks.markContextUploadFailed).not.toHaveBeenCalled()
    expect(mocks.markContextFilesUploaded).toHaveBeenCalledOnce()
  })
})

/** Configurable fake ledger for exercising dedup/backoff/breaker branches. */
function fakeLedger(overrides: Partial<UploadLedger> = {}): UploadLedger {
  return {
    isUploaded: () => false,
    isBackedOff: () => false,
    isBreakerOpen: () => false,
    onSuccess: vi.fn(),
    onFailure: vi.fn(() => true),
    flush: vi.fn(),
    ...overrides,
  }
}

describe('runContextFileUploadPipeline — ledger dedup', () => {
  it('skips the S3 upload for an already-uploaded md5 but still emits the record', async () => {
    const submitRecords = vi.fn().mockResolvedValue(undefined)
    const onSuccess = vi.fn()

    const result = await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [makeFile('dup-md5')],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords,
      ledger: fakeLedger({ isUploaded: () => true, onSuccess }),
    })

    // No network upload, but the per-session record is still submitted.
    expect(mocks.uploadFile).not.toHaveBeenCalled()
    expect(submitRecords).toHaveBeenCalledOnce()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(result).toEqual(
      expect.objectContaining({ fileCount: 1, dedupedCount: 1 })
    )
    expect(mocks.markContextFilesUploaded).toHaveBeenCalledOnce()
  })
})

describe('runContextFileUploadPipeline — ledger suppression', () => {
  it('does not attempt or log an upload while in backoff', async () => {
    const submitRecords = vi.fn().mockResolvedValue(undefined)
    const onFileError = vi.fn()

    const result = await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [makeFile('backed-off')],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords,
      onFileError,
      ledger: fakeLedger({ isBackedOff: () => true }),
    })

    expect(mocks.uploadFile).not.toHaveBeenCalled()
    expect(onFileError).not.toHaveBeenCalled()
    expect(submitRecords).not.toHaveBeenCalled()
    expect(result).toEqual(
      expect.objectContaining({ fileCount: 0, suppressedCount: 1 })
    )
  })

  it('skips all attempts when the circuit breaker is open', async () => {
    const result = await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [makeFile('a'), makeFile('b', 'x', '/proj/AGENTS.md')],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords: vi.fn(),
      ledger: fakeLedger({ isBreakerOpen: () => true }),
    })

    expect(mocks.uploadFile).not.toHaveBeenCalled()
    expect(result).toEqual(
      expect.objectContaining({ suppressedCount: 2, breakerOpen: true })
    )
  })
})

describe('runContextFileUploadPipeline — ledger log-once', () => {
  it('suppresses onFileError when the ledger says not to log', async () => {
    mocks.uploadFile.mockRejectedValue(new Error('S3 error'))
    const onFileError = vi.fn()

    await runContextFileUploadPipeline({
      ...baseOpts,
      processedFiles: [makeFile('fail-md5')],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords: vi.fn(),
      onFileError,
      ledger: fakeLedger({ onFailure: vi.fn(() => false) }),
    })

    // Upload was attempted and failed, but logging is suppressed by log-once.
    expect(mocks.uploadFile).toHaveBeenCalledOnce()
    expect(onFileError).not.toHaveBeenCalled()
  })
})

describe('runContextFileUploadPipeline — in-flight coalescing', () => {
  it('collapses concurrent uploads of the same md5 into a single POST', async () => {
    // Hold the upload open so both sessions overlap on the same key.
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    mocks.uploadFile.mockReturnValueOnce(gate)

    const submitA = vi.fn().mockResolvedValue(undefined)
    const submitB = vi.fn().mockResolvedValue(undefined)

    const pA = runContextFileUploadPipeline({
      ...baseOpts,
      sessionId: 'sess-A',
      processedFiles: [makeFile('shared-md5')],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords: submitA,
    })
    const pB = runContextFileUploadPipeline({
      ...baseOpts,
      sessionId: 'sess-B',
      processedFiles: [makeFile('shared-md5')],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords: submitB,
    })

    release()
    await Promise.all([pA, pB])

    // One network POST for the shared blob, but both sessions emit their record.
    expect(mocks.uploadFile).toHaveBeenCalledOnce()
    expect(submitA).toHaveBeenCalledOnce()
    expect(submitB).toHaveBeenCalledOnce()
  })

  it('on a coalesced failure, both sessions mark failed but only the leader records/logs', async () => {
    let reject!: (e: unknown) => void
    const gate = new Promise<void>((_, r) => {
      reject = r
    })
    mocks.uploadFile.mockReturnValueOnce(gate)

    const onFailure = vi.fn(() => true)
    const ledger = fakeLedger({ onFailure })
    const onFileErrorA = vi.fn()
    const onFileErrorB = vi.fn()

    const pA = runContextFileUploadPipeline({
      ...baseOpts,
      sessionId: 'sess-A',
      processedFiles: [makeFile('shared-fail')],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords: vi.fn(),
      onFileError: onFileErrorA,
      ledger,
    })
    const pB = runContextFileUploadPipeline({
      ...baseOpts,
      sessionId: 'sess-B',
      processedFiles: [makeFile('shared-fail')],
      processedSkills: [],
      uploadFieldsJSON: VALID_FIELDS,
      submitRecords: vi.fn(),
      onFileError: onFileErrorB,
      ledger,
    })

    reject(new Error('boom'))
    await Promise.all([pA, pB])

    expect(mocks.uploadFile).toHaveBeenCalledOnce() // coalesced to one POST
    expect(onFailure).toHaveBeenCalledOnce() // leader-only ledger recording
    // Exactly one session (the leader) logged the failure.
    expect(
      onFileErrorA.mock.calls.length + onFileErrorB.mock.calls.length
    ).toBe(1)
  })
})
