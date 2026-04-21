import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { resolveTranscriptPath } from '../data_collector'

describe('resolveTranscriptPath', () => {
  let tmpDir: string
  let projectsDir: string

  beforeEach(async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'transcript-test-'))
    projectsDir = path.join(tmpDir, 'projects')
    await mkdir(projectsDir)
  })

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true })
  })

  it('returns original path when file exists', async () => {
    const projectDir = path.join(projectsDir, '-Users-dev-proj-autofixer')
    await mkdir(projectDir)
    const transcriptPath = path.join(projectDir, 'session-123.jsonl')
    await writeFile(transcriptPath, '{"test": true}\n')

    const result = await resolveTranscriptPath(transcriptPath, 'session-123')
    expect(result).toBe(transcriptPath)
  })

  it('strips worktree suffix to find transcript (regex-strip)', async () => {
    const mainDir = path.join(projectsDir, '-Users-dev-proj-autofixer')
    await mkdir(mainDir)

    const filename = 'session-abc.jsonl'
    const realFile = path.join(mainDir, filename)
    await writeFile(realFile, '{"test": true}\n')

    // Worktree path with double-dash before claude-worktrees
    const worktreePath = path.join(
      projectsDir,
      '-Users-dev-proj-autofixer--claude-worktrees-my-worktree',
      filename
    )
    const result = await resolveTranscriptPath(worktreePath, 'session-abc')
    expect(result).toBe(realFile)
  })

  it('strips worktree suffix with dot prefix (.claude)', async () => {
    const mainDir = path.join(projectsDir, '-Users-dev-proj-repo')
    await mkdir(mainDir)

    const filename = 'session-def.jsonl'
    const realFile = path.join(mainDir, filename)
    await writeFile(realFile, '{"test": true}\n')

    // Worktree path with dot-claude prefix
    const worktreePath = path.join(
      projectsDir,
      '-Users-dev-proj-repo.claude-worktrees-some-name',
      filename
    )
    const result = await resolveTranscriptPath(worktreePath, 'session-def')
    expect(result).toBe(realFile)
  })

  it('falls back to sibling scan when strip does not match', async () => {
    // Main dir has a name that doesn't match the strip pattern
    const mainDir = path.join(projectsDir, '-Users-dev-other-project')
    await mkdir(mainDir)

    const filename = 'session-ghi.jsonl'
    const realFile = path.join(mainDir, filename)
    await writeFile(realFile, '{"test": true}\n')

    // Non-worktree path that simply doesn't exist
    const missingDir = path.join(projectsDir, '-Users-dev-renamed-project')
    const missingPath = path.join(missingDir, filename)
    const result = await resolveTranscriptPath(missingPath, 'session-ghi')
    expect(result).toBe(realFile)
  })

  it('falls back to sibling scan when strip resolves to wrong dir', async () => {
    // Strip produces a dir name that exists but doesn't have the file
    const strippedDir = path.join(projectsDir, '-Users-dev-proj-repo')
    await mkdir(strippedDir)
    // No transcript file here

    // The file is in a different sibling
    const actualDir = path.join(projectsDir, '-Users-dev-proj-repo-v2')
    await mkdir(actualDir)
    const filename = 'session-jkl.jsonl'
    const realFile = path.join(actualDir, filename)
    await writeFile(realFile, '{"test": true}\n')

    const worktreePath = path.join(
      projectsDir,
      '-Users-dev-proj-repo-claude-worktrees-wt1',
      filename
    )
    const result = await resolveTranscriptPath(worktreePath, 'session-jkl')
    expect(result).toBe(realFile)
  })

  it('returns original path when no fallback found', async () => {
    const missingPath = path.join(
      projectsDir,
      '-Users-dev-proj-autofixer--claude-worktrees-gone',
      'session-xyz.jsonl'
    )

    const result = await resolveTranscriptPath(missingPath, 'session-xyz')
    expect(result).toBe(missingPath)
  })

  it('returns original path when projects directory does not exist', async () => {
    const missingPath = path.join(
      tmpDir,
      'nonexistent',
      'subdir',
      'session.jsonl'
    )

    const result = await resolveTranscriptPath(missingPath, 'session')
    expect(result).toBe(missingPath)
  })
})

// ---------- processTranscript + context file upload tests ----------

// These tests require module-level mocks so we use a dynamic import after
// vi.mock calls, matching the pattern used in daemon.test.ts.

const ptMocks = vi.hoisted(() => ({
  scanContextFiles: vi.fn(),
  markContextFilesUploaded: vi.fn(),
  prepareAndSendTracyRecords: vi.fn(),
  processContextFiles: vi.fn(),
  uploadFile: vi.fn(),
}))

vi.mock('../../../features/analysis/context_file_scanner', () => ({
  scanContextFiles: ptMocks.scanContextFiles,
  markContextFilesUploaded: ptMocks.markContextFilesUploaded,
}))

vi.mock('../../../features/analysis/context_file_processor', () => ({
  processContextFiles: ptMocks.processContextFiles,
}))

vi.mock('../../../features/analysis/upload-file', () => ({
  uploadFile: ptMocks.uploadFile,
}))

vi.mock('../../../features/analysis/graphql/tracy-batch-upload', () => ({
  prepareAndSendTracyRecords: ptMocks.prepareAndSendTracyRecords,
}))

vi.mock('../../../commands/handleMobbLogin', () => ({
  getAuthenticatedGQLClient: vi.fn().mockResolvedValue({ query: vi.fn() }),
}))

vi.mock('../../../utils/ConfigStoreService', () => ({
  configStore: {
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
  },
  createSessionConfigStore: vi.fn().mockReturnValue({
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
    path: '/tmp/test-configstore/session.json',
  }),
  getSessionFilePrefix: vi.fn().mockReturnValue('claude-session-'),
}))

vi.mock('../../../utils/check_node_version', () => ({
  packageJson: { version: '1.0.0-test' },
}))

vi.mock('../../../utils/with-timeout', () => ({
  withTimeout: vi.fn(async (p: Promise<unknown>) => p),
}))

vi.mock('../hook_logger', () => ({
  hookLog: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  getClaudeCodeVersion: vi.fn().mockReturnValue('1.0.0'),
}))

const { processTranscript } = await import('../data_collector')

function makeMockLogger() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    heartbeat: vi.fn(),
    timed: vi.fn(async (_label: string, fn: () => Promise<unknown>) => fn()),
    flushLogs: vi.fn(),
    flushDdAsync: vi.fn().mockResolvedValue(undefined),
    disposeDd: vi.fn(),
    setScopePath: vi.fn(),
    updateDdTags: vi.fn(),
  }
}

function makeMockSessionStore() {
  return {
    get: vi.fn().mockReturnValue(undefined),
    set: vi.fn(),
    delete: vi.fn(),
    path: '/tmp/test-session.json',
    all: {},
    size: 0,
    clear: vi.fn(),
    has: vi.fn(),
  }
}

describe('processTranscript — context file upload', () => {
  let ptTmpDir: string
  let transcriptPath: string
  const sessionId = 'ctx-session-1'

  beforeEach(async () => {
    vi.clearAllMocks()
    ptTmpDir = await mkdtemp(path.join(os.tmpdir(), 'pt-ctx-test-'))
    transcriptPath = path.join(ptTmpDir, 'transcript.jsonl')

    // Write a minimal valid transcript JSONL entry so readNewTranscriptEntries returns data.
    const entry = {
      uuid: 'entry-1',
      sessionId,
      timestamp: '2024-01-01T00:00:00Z',
      type: 'user',
      message: { model: 'claude-4', role: 'user', content: 'hi' },
    }
    await writeFile(transcriptPath, JSON.stringify(entry) + '\n')

    // Default: batch upload succeeds
    ptMocks.prepareAndSendTracyRecords.mockResolvedValue({
      ok: true,
      errors: [],
    })

    // Default: processContextFiles returns 2 processed files, no skills
    ptMocks.processContextFiles.mockResolvedValue({
      files: [
        {
          entry: {
            name: 'CLAUDE.md',
            path: '/proj/CLAUDE.md',
            content: '# Rules',
            sizeBytes: 7,
            category: 'rule',
            mtimeMs: 1000,
          },
          sanitizedContent: '# Rules',
          md5: 'abc1',
          sizeBytes: 7,
        },
        {
          entry: {
            name: '.cursor/rules/sec.mdc',
            path: '/proj/.cursor/rules/sec.mdc',
            content: 'sec',
            sizeBytes: 3,
            category: 'rule',
            mtimeMs: 2000,
          },
          sanitizedContent: 'sec',
          md5: 'abc2',
          sizeBytes: 3,
        },
      ],
      skills: [],
    })

    // Default: S3 upload succeeds
    ptMocks.uploadFile.mockResolvedValue(undefined)

    // Default: scanner returns 2 regular files, no skill groups
    ptMocks.scanContextFiles.mockResolvedValue({
      regularFiles: [
        {
          name: 'CLAUDE.md',
          path: '/proj/CLAUDE.md',
          content: '# Rules',
          sizeBytes: 7,
          category: 'rule',
          mtimeMs: 1000,
        },
        {
          name: '.cursor/rules/sec.mdc',
          path: '/proj/.cursor/rules/sec.mdc',
          content: 'sec',
          sizeBytes: 3,
          category: 'rule',
          mtimeMs: 2000,
        },
      ],
      skillGroups: [],
    })
  })

  afterEach(async () => {
    await rm(ptTmpDir, { recursive: true, force: true })
  })

  function makeMockGqlClient() {
    return {
      query: vi.fn(),
      getTracyRawDataUploadUrl: vi.fn().mockResolvedValue({
        getTracyRawDataUploadUrl: {
          url: 'https://s3.example.com',
          uploadFieldsJSON: '{}',
          keyPrefix: 'test/',
        },
      }),
    } as never
  }

  it('uploads context files after successful batch upload', async () => {
    const log = makeMockLogger()
    const sessionStore = makeMockSessionStore()
    const gqlClient = makeMockGqlClient()

    await processTranscript(
      { session_id: sessionId, transcript_path: transcriptPath, cwd: '/proj' },
      sessionStore as never,
      log as never,
      50,
      gqlClient
    )

    // Let the fire-and-forget context upload resolve
    await vi.waitFor(() => {
      expect(ptMocks.scanContextFiles).toHaveBeenCalledWith(
        '/proj',
        'claude-code',
        sessionId
      )
    })
  })

  it('does not crash when scanContextFiles throws', async () => {
    ptMocks.scanContextFiles.mockRejectedValue(new Error('scan failed'))

    const log = makeMockLogger()
    const sessionStore = makeMockSessionStore()
    const gqlClient = { query: vi.fn() } as never

    const result = await processTranscript(
      { session_id: sessionId, transcript_path: transcriptPath, cwd: '/proj' },
      sessionStore as never,
      log as never,
      50,
      gqlClient
    )

    // Pipeline itself should succeed — context file failure is swallowed by .catch
    expect(result.errors).toBe(0)
    expect(result.entriesUploaded).toBeGreaterThan(0)
  })

  it('does not scan context files when cwd is undefined', async () => {
    const log = makeMockLogger()
    const sessionStore = makeMockSessionStore()
    const gqlClient = { query: vi.fn() } as never

    await processTranscript(
      {
        session_id: sessionId,
        transcript_path: transcriptPath,
        cwd: undefined,
      },
      sessionStore as never,
      log as never,
      50,
      gqlClient
    )

    // Give any fire-and-forget promises a tick to resolve
    await new Promise((r) => setTimeout(r, 50))

    expect(ptMocks.scanContextFiles).not.toHaveBeenCalled()
  })

  it('calls markContextFilesUploaded on successful upload', async () => {
    const log = makeMockLogger()
    const sessionStore = makeMockSessionStore()
    const gqlClient = makeMockGqlClient()

    await processTranscript(
      { session_id: sessionId, transcript_path: transcriptPath, cwd: '/proj' },
      sessionStore as never,
      log as never,
      50,
      gqlClient
    )

    // Wait for the fire-and-forget context upload to complete
    await vi.waitFor(() => {
      expect(ptMocks.markContextFilesUploaded).toHaveBeenCalledWith(
        sessionId,
        expect.arrayContaining([
          expect.objectContaining({ name: 'CLAUDE.md' }),
          expect.objectContaining({ name: '.cursor/rules/sec.mdc' }),
        ]),
        [] // no skill groups
      )
    })
  })
})
