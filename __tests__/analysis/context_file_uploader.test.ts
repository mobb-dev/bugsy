import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  ProcessedFile,
  ProcessedSkill,
} from '../../src/features/analysis/context_file_processor'
import type { SkillGroup } from '../../src/features/analysis/context_file_scanner'
import { runContextFileUploadPipeline } from '../../src/features/analysis/context_file_uploader'

const mocks = vi.hoisted(() => ({
  uploadFile: vi.fn(),
  markContextFilesUploaded: vi.fn(),
}))

vi.mock('../../src/features/analysis/upload-file', () => ({
  uploadFile: mocks.uploadFile,
}))

vi.mock('../../src/features/analysis/context_file_scanner', async (orig) => {
  const actual =
    await orig<
      typeof import('../../src/features/analysis/context_file_scanner')
    >()
  return { ...actual, markContextFilesUploaded: mocks.markContextFilesUploaded }
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

    expect(result).toEqual({ fileCount: 0, skillCount: 0 })
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

    expect(result).toEqual({ fileCount: 1, skillCount: 1 })
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
  })
})
