import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  filterEntries,
  processTranscript,
  readNewTranscriptEntries,
  resolveTranscriptPath,
  type TranscriptProcessInput,
} from '../../src/features/claude_code/data_collector'

// Per-session configstore mock — each session gets its own in-memory store.
// The factory returns a mock Configstore-like object backed by sessionStoreData.
const sessionStoreData = new Map<string, unknown>()
const mockSessionGet = vi.fn((key: string) => sessionStoreData.get(key))
const mockSessionSet = vi.fn((key: string, value: unknown) => {
  if (value === undefined) {
    sessionStoreData.delete(key)
  } else {
    sessionStoreData.set(key, value)
  }
})

// Build a nested object from the flat dot-notation Map (mirrors configstore's .all)
function buildNestedAll(): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [dotKey, value] of sessionStoreData.entries()) {
    const parts = (dotKey as string).split('.')
    let current: Record<string, unknown> = result
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i]! in current) || typeof current[parts[i]!] !== 'object') {
        current[parts[i]!] = {}
      }
      current = current[parts[i]!] as Record<string, unknown>
    }
    current[parts[parts.length - 1]!] = value
  }
  return result
}

const mockSessionDelete = vi.fn((key: string) => {
  sessionStoreData.delete(key)
})

const mockSessionStore = {
  get: (...args: unknown[]) => mockSessionGet(...(args as [string])),
  set: (...args: unknown[]) => mockSessionSet(...(args as [string, unknown])),
  delete: (...args: unknown[]) => mockSessionDelete(...(args as [string])),
  get all() {
    return buildNestedAll()
  },
  get path() {
    return '/tmp/fake-configstore/mobbdev-test-session-fake.json'
  },
}

// Global configStore mock — only used for the cleanup-throttle timestamp
const globalStoreData = new Map<string, unknown>()
const mockGlobalGet = vi.fn((key: string) => globalStoreData.get(key))
const mockGlobalSet = vi.fn((key: string, value: unknown) => {
  globalStoreData.set(key, value)
})

vi.mock('../../src/utils/ConfigStoreService', () => ({
  configStore: {
    get: (...args: unknown[]) => mockGlobalGet(...(args as [string])),
    set: (...args: unknown[]) => mockGlobalSet(...(args as [string, unknown])),
  },
  createSessionConfigStore: vi.fn(() => mockSessionStore),
  getSessionFilePrefix: vi.fn(() => 'mobbdev-test-session-'),
}))

// Mock child_process.execFile (used by detectClaudeCodeVersion via promisify)
const mockExecFile = vi.fn()
vi.mock('node:child_process', () => {
  const execFileFn = (...args: unknown[]): void => {
    const cb = args[args.length - 1] as (
      err: Error | null,
      stdout: string,
      stderr: string
    ) => void
    try {
      const result = mockExecFile(...args.slice(0, -1))
      cb(null, result as string, '')
    } catch (err) {
      cb(err as Error, '', '')
    }
  }
  // Attach promisify.custom so promisify(execFile) returns our mock
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
  const { promisify } = require('node:util') as typeof import('node:util')
  ;(execFileFn as unknown as Record<symbol, unknown>)[promisify.custom] =
    async (...args: unknown[]) => {
      const result = mockExecFile(...args)
      return { stdout: result as string, stderr: '' }
    }
  return { execFile: execFileFn }
})

// Mock GQL client (needed by getAuthenticatedGQLClient)
const mockGetGQLClient = vi.fn(async () => ({}))
vi.mock('../../src/commands/handleMobbLogin', () => ({
  getAuthenticatedGQLClient: (...args: unknown[]) =>
    mockGetGQLClient(...(args as Parameters<typeof mockGetGQLClient>)),
}))

// Mock prepareAndSendTracyRecords
const mockPrepareAndSend = vi.fn()
vi.mock('../../src/features/analysis/graphql/tracy-batch-upload', () => ({
  prepareAndSendTracyRecords: (...args: unknown[]) =>
    mockPrepareAndSend(...args),
}))

// Override DAEMON_CHUNK_SIZE to 50 so existing 54-entry fixtures trigger the cap
vi.mock(
  '../../src/features/claude_code/data_collector_constants',
  async (importOriginal) => {
    const mod =
      await importOriginal<
        typeof import('../../src/features/claude_code/data_collector_constants')
      >()
    return { ...mod, DAEMON_CHUNK_SIZE: 50 }
  }
)

// Authentic transcript files from real Claude Code sessions
const EDIT_TRANSCRIPT = path.join(
  __dirname,
  'assets',
  'dcc484f5-c9f4-4c34-b5c0-791b746026b4.jsonl'
)
const EDIT_SESSION_ID = 'dcc484f5-c9f4-4c34-b5c0-791b746026b4'
const EDIT_ENTRY_COUNT = 50 // 54 raw entries, capped at DAEMON_CHUNK_SIZE (50)

const WRITE_TRANSCRIPT = path.join(
  __dirname,
  'assets',
  '2e251410-b29f-4ff4-817a-7bc61c76d1fb.jsonl'
)
const WRITE_SESSION_ID = '2e251410-b29f-4ff4-817a-7bc61c76d1fb'

// Mock logger for processTranscript
const mockLog = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  heartbeat: vi.fn(),
  flushLogs: vi.fn(),
  timed: vi.fn(async (_label: string, fn: () => Promise<unknown>) => fn()),
  flushDdAsync: vi.fn(),
  disposeDd: vi.fn(),
  setScopePath: vi.fn(),
  updateDdTags: vi.fn(),
}

describe('processTranscript', () => {
  let tmpDirs: tmp.DirectoryResult[] = []

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStoreData.clear()
    globalStoreData.clear()
    tmpDirs = []
    mockExecFile.mockReturnValue('2.1.87 (Claude Code)\n')
    mockGetGQLClient.mockResolvedValue({})
    vi.spyOn(console, 'log').mockImplementation(() => {
      return
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {
      return
    })
  })

  afterEach(async () => {
    vi.unstubAllGlobals()
    for (const tmpDir of tmpDirs) {
      await tmpDir.cleanup()
    }
  })

  function cursorKeyFor(transcriptPath: string): string {
    const hash = createHash('sha256')
      .update(transcriptPath)
      .digest('hex')
      .slice(0, 12)
    return `cursor.${hash}`
  }

  function makeInput(
    transcriptPath: string,
    sessionId: string,
    cwd: string | undefined = '/tmp/test-workspace'
  ): TranscriptProcessInput {
    return { session_id: sessionId, transcript_path: transcriptPath, cwd }
  }

  it('should upload all entries on first invocation (edit transcript)', async () => {
    mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

    const result = await processTranscript(
      makeInput(tmpTranscriptPath, EDIT_SESSION_ID),
      mockSessionStore as any,
      mockLog as any
    )

    expect(result.entriesUploaded).toBe(EDIT_ENTRY_COUNT)
    expect(result.errors).toBe(0)

    // prepareAndSendTracyRecords called once with all entries
    expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)
    const [, records] = mockPrepareAndSend.mock.calls[0]!
    expect(records).toHaveLength(EDIT_ENTRY_COUNT)

    // Verify record structure
    const firstRecord = records[0]
    expect(firstRecord.platform).toBe('CLAUDE_CODE')
    expect(firstRecord.recordId).toBe('ed1d1e3c-2fa7-4ad4-9ebb-4c0d65afca46')
    expect(firstRecord.blameType).toBe('CHAT')

    // rawData is the entry object (not serialized), without _recordId
    expect(firstRecord.rawData.type).toBe('user')
    expect(firstRecord.rawData.sessionId).toBe(EDIT_SESSION_ID)
    expect(firstRecord.rawData._recordId).toBeUndefined()

    // cursor advance = 1 sessionStore.set call
    expect(mockSessionSet).toHaveBeenCalledWith(
      expect.stringContaining('cursor.'),
      expect.anything()
    )
  })

  it('should upload only new entries on subsequent invocation', async () => {
    mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

    // Calculate byte offset at the 40th line boundary
    const fullContent = await fs.readFile(EDIT_TRANSCRIPT, 'utf-8')
    const allLines = fullContent.split('\n').filter((l) => l.trim().length > 0)
    const first40Lines = allLines.slice(0, 40).join('\n') + '\n'
    const byteOffset = Buffer.byteLength(first40Lines, 'utf-8')

    // Set cursor with byte offset (simulates a previous upload of first 40 entries)
    sessionStoreData.set(cursorKeyFor(tmpTranscriptPath), {
      id: 'prev-cursor',
      byteOffset,
      updatedAt: Date.now(),
    })

    const result = await processTranscript(
      makeInput(tmpTranscriptPath, EDIT_SESSION_ID),
      mockSessionStore as any,
      mockLog as any
    )

    const expectedNewEntries = 54 - 40 // 54 total raw entries minus 40 already uploaded
    expect(result.entriesUploaded).toBe(expectedNewEntries)
    expect(result.errors).toBe(0)

    const [, records] = mockPrepareAndSend.mock.calls[0]!
    expect(records).toHaveLength(expectedNewEntries)
  })

  it('should upload only appended lines after file grows between invocations', async () => {
    mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)
    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')

    // Start with a small transcript (first 10 lines of the edit transcript)
    const fullContent = await fs.readFile(EDIT_TRANSCRIPT, 'utf-8')
    const allLines = fullContent.split('\n').filter((l) => l.trim().length > 0)
    const initialLines = allLines.slice(0, 10)
    await fs.writeFile(tmpTranscriptPath, initialLines.join('\n') + '\n')

    // First invocation: uploads all 10 entries
    const result1 = await processTranscript(
      makeInput(tmpTranscriptPath, EDIT_SESSION_ID),
      mockSessionStore as any,
      mockLog as any
    )
    expect(result1.entriesUploaded).toBe(10)

    // Append 5 more lines to simulate file growth
    const appendedLines = allLines.slice(10, 15)
    await fs.appendFile(tmpTranscriptPath, appendedLines.join('\n') + '\n')

    // Second invocation: should upload only the 5 new lines
    mockPrepareAndSend.mockClear()
    const result2 = await processTranscript(
      makeInput(tmpTranscriptPath, EDIT_SESSION_ID),
      mockSessionStore as any,
      mockLog as any
    )
    expect(result2.entriesUploaded).toBe(5)

    const [, records] = mockPrepareAndSend.mock.calls[0]!
    expect(records).toHaveLength(5)
  })

  it('should not advance cursor on batch failure', async () => {
    mockPrepareAndSend.mockResolvedValue({
      ok: false,
      errors: ['Chunk of 10 records failed: Network error'],
    })

    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.copyFile(WRITE_TRANSCRIPT, tmpTranscriptPath)

    const result = await processTranscript(
      makeInput(tmpTranscriptPath, WRITE_SESSION_ID),
      mockSessionStore as any,
      mockLog as any
    )

    expect(result.entriesUploaded).toBe(0)
    expect(result.errors).toBeGreaterThan(0)

    // No cursor advance on failure
    expect(mockSessionSet).not.toHaveBeenCalledWith(
      expect.stringContaining('cursor.'),
      expect.anything()
    )
  })

  it('should generate synthetic IDs for entries without uuid', async () => {
    const { entries } = await readNewTranscriptEntries(
      EDIT_TRANSCRIPT,
      EDIT_SESSION_ID,
      mockSessionStore as any
    )

    // Entry at index 1 is a summary with no uuid — should have synth: prefix
    expect(entries[1]!._recordId).toMatch(/^synth:[0-9a-f]{16}$/)

    // Entries with uuid should use the actual uuid
    expect(entries[0]!._recordId).toBe('ed1d1e3c-2fa7-4ad4-9ebb-4c0d65afca46')

    // Verify determinism — reading again produces the same IDs
    const { entries: entries2 } = await readNewTranscriptEntries(
      EDIT_TRANSCRIPT,
      EDIT_SESSION_ID,
      mockSessionStore as any
    )
    expect(entries[1]!._recordId).toBe(entries2[1]!._recordId)
    expect(entries[2]!._recordId).toBe(entries2[2]!._recordId)
  })

  it('should return zero counts for empty transcript', async () => {
    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.writeFile(tmpTranscriptPath, '')

    const result = await processTranscript(
      makeInput(tmpTranscriptPath, 'empty-session'),
      mockSessionStore as any,
      mockLog as any
    )

    expect(result.entriesUploaded).toBe(0)
    expect(result.entriesSkipped).toBe(0)
    expect(result.errors).toBe(0)
    expect(mockPrepareAndSend).not.toHaveBeenCalled()
  })

  describe('filterEntries', () => {
    function entry(
      overrides: Record<string, unknown>
    ): { _recordId: string } & Record<string, unknown> {
      return { _recordId: 'test-id', ...overrides }
    }

    it('should filter out file-history-snapshot entries', () => {
      const entries = [
        entry({ type: 'user' }),
        entry({ type: 'file-history-snapshot' }),
        entry({ type: 'assistant' }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(2)
      expect(filteredOut).toBe(1)
      expect(filtered.every((e) => e.type !== 'file-history-snapshot')).toBe(
        true
      )
    })

    it('should filter out queue-operation entries', () => {
      const entries = [
        entry({ type: 'queue-operation' }),
        entry({ type: 'user' }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(1)
      expect(filteredOut).toBe(1)
      expect(filtered[0]!.type).toBe('user')
    })

    it('should filter out last-prompt entries', () => {
      const entries = [
        entry({
          type: 'last-prompt',
          lastPrompt: 'rebuild cli',
          sessionId: 's1',
        }),
        entry({ type: 'user' }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(1)
      expect(filteredOut).toBe(1)
      expect(filtered[0]!.type).toBe('user')
    })

    it('should filter out bash_progress, hook_progress, waiting_for_task, mcp_progress progress subtypes', () => {
      const entries = [
        entry({ type: 'progress', data: { type: 'bash_progress' } }),
        entry({ type: 'progress', data: { type: 'hook_progress' } }),
        entry({ type: 'progress', data: { type: 'waiting_for_task' } }),
        entry({ type: 'progress', data: { type: 'mcp_progress' } }),
        entry({ type: 'progress', data: { type: 'agent_progress' } }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(1)
      expect(filteredOut).toBe(4)
      expect((filtered[0]!['data'] as { type: string }).type).toBe(
        'agent_progress'
      )
    })

    it('should keep progress entries with non-filtered subtypes', () => {
      const entries = [
        entry({ type: 'progress', data: { type: 'agent_progress' } }),
        entry({ type: 'progress', data: { type: 'tool_progress' } }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(2)
      expect(filteredOut).toBe(0)
    })

    // TaskOutput / ToolSearch are NO LONGER filtered (T-447): these assistant
    // tool_use entries carry real `message.usage` token counts we need for
    // per-model token attribution. They're now uploaded like any other
    // assistant tool_use entry.
    it('should keep assistant TaskOutput tool_use entries (no longer filtered, carries tokens)', () => {
      const entries = [
        entry({
          type: 'assistant',
          message: {
            content: [{ type: 'tool_use', name: 'TaskOutput' }],
          },
        }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(1)
      expect(filteredOut).toBe(0)
    })

    it('should keep assistant ToolSearch tool_use entries (no longer filtered, carries tokens)', () => {
      const entries = [
        entry({
          type: 'assistant',
          message: {
            content: [{ type: 'tool_use', name: 'ToolSearch' }],
          },
        }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(1)
      expect(filteredOut).toBe(0)
    })

    it('should keep assistant entries with non-filtered tools', () => {
      const entries = [
        entry({
          type: 'assistant',
          message: {
            content: [{ type: 'tool_use', name: 'Edit' }],
          },
        }),
        entry({
          type: 'assistant',
          message: {
            content: [{ type: 'text', text: 'hello' }],
          },
        }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(2)
      expect(filteredOut).toBe(0)
    })

    it('should return zero filteredOut when nothing is filtered', () => {
      const entries = [
        entry({ type: 'user' }),
        entry({ type: 'assistant' }),
        entry({ type: 'system' }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(3)
      expect(filteredOut).toBe(0)
    })

    it('should handle empty input', () => {
      const { filtered, filteredOut } = filterEntries([])
      expect(filtered).toHaveLength(0)
      expect(filteredOut).toBe(0)
    })
  })

  it('should not upload when all entries already uploaded', async () => {
    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.copyFile(WRITE_TRANSCRIPT, tmpTranscriptPath)

    // Set cursor byte offset to end of file (all entries already uploaded)
    const stat = await fs.stat(tmpTranscriptPath)
    sessionStoreData.set(cursorKeyFor(tmpTranscriptPath), {
      id: 'prev-cursor',
      byteOffset: stat.size,
      updatedAt: Date.now(),
    })

    const result = await processTranscript(
      makeInput(tmpTranscriptPath, WRITE_SESSION_ID),
      mockSessionStore as any,
      mockLog as any
    )

    expect(result.entriesUploaded).toBe(0)
    expect(result.errors).toBe(0)
    expect(mockPrepareAndSend).not.toHaveBeenCalled()
  })

  describe('resolveTranscriptPath', () => {
    it('should return original path when file exists', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const transcriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.writeFile(transcriptPath, '{"test":true}\n')

      const result = await resolveTranscriptPath(transcriptPath, 'session-1')
      expect(result).toBe(transcriptPath)
    })

    it('should resolve worktree path by stripping worktree suffix', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const projectsDir = path.join(tmpDir.path, 'projects')
      const baseDir = path.join(projectsDir, '-Users-me-repo')
      const worktreeDir = path.join(
        projectsDir,
        '-Users-me-repo-claude-worktrees-fix'
      )
      await fs.mkdir(baseDir, { recursive: true })
      await fs.mkdir(worktreeDir, { recursive: true })

      const transcript = path.join(baseDir, 'session.jsonl')
      await fs.writeFile(transcript, '{"test":true}\n')

      const worktreePath = path.join(worktreeDir, 'session.jsonl')
      const result = await resolveTranscriptPath(worktreePath, 'session-1')
      expect(result).toBe(transcript)
    })

    it('should resolve via sibling scan when worktree strip fails', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const projectsDir = path.join(tmpDir.path, 'projects')
      const dirA = path.join(projectsDir, 'dir-a')
      const dirB = path.join(projectsDir, 'dir-b')
      await fs.mkdir(dirA, { recursive: true })
      await fs.mkdir(dirB, { recursive: true })

      const transcript = path.join(dirA, 'session.jsonl')
      await fs.writeFile(transcript, '{"test":true}\n')

      const missingPath = path.join(dirB, 'session.jsonl')
      const result = await resolveTranscriptPath(missingPath, 'session-1')
      expect(result).toBe(transcript)
    })

    it('should return original path when no fallback matches', async () => {
      const fakePath = '/tmp/nonexistent-projects/dir/session.jsonl'
      const result = await resolveTranscriptPath(fakePath, 'session-1')
      expect(result).toBe(fakePath)
    })
  })

  describe('readNewTranscriptEntries — malformed lines', () => {
    it('should skip malformed JSON lines and parse valid ones', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const tmpPath = path.join(tmpDir.path, 'mixed.jsonl')
      await fs.writeFile(
        tmpPath,
        [
          '{"type":"user","uuid":"aaa","sessionId":"s1","timestamp":"2025-01-01T00:00:00Z"}',
          'NOT VALID JSON{{{',
          '{"type":"assistant","uuid":"bbb","sessionId":"s1","timestamp":"2025-01-01T00:00:01Z"}',
          '',
        ].join('\n')
      )

      const { entries } = await readNewTranscriptEntries(
        tmpPath,
        's1',
        mockSessionStore as any
      )

      expect(entries).toHaveLength(2)
      expect(entries[0]!._recordId).toBe('aaa')
      expect(entries[1]!._recordId).toBe('bbb')
    })

    it('should return empty entries for fully malformed transcript', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const tmpPath = path.join(tmpDir.path, 'bad.jsonl')
      await fs.writeFile(tmpPath, 'NOT JSON\nALSO NOT JSON\n')

      const { entries } = await readNewTranscriptEntries(
        tmpPath,
        's1',
        mockSessionStore as any
      )

      expect(entries).toHaveLength(0)
    })
  })

  describe('readNewTranscriptEntries — cursor beyond file size', () => {
    it('should return empty entries when byte offset exceeds file size', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const tmpPath = path.join(tmpDir.path, 'small.jsonl')
      await fs.writeFile(tmpPath, '{"type":"user","sessionId":"s1"}\n')

      // Set cursor far beyond file size (file was truncated/rotated)
      sessionStoreData.set(cursorKeyFor(tmpPath), {
        id: 'old-cursor',
        byteOffset: 999999,
        updatedAt: Date.now(),
      })

      const { entries } = await readNewTranscriptEntries(
        tmpPath,
        's1',
        mockSessionStore as any
      )

      expect(entries).toHaveLength(0)
    })
  })

  describe('GQL auth failure', () => {
    it('should return errors count when GQL auth fails', async () => {
      mockGetGQLClient.mockRejectedValue(new Error('Auth0 token expired'))

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      const result = await processTranscript(
        makeInput(tmpTranscriptPath, EDIT_SESSION_ID),
        mockSessionStore as any,
        mockLog as any
      )

      expect(result.entriesUploaded).toBe(0)
      expect(result.errors).toBeGreaterThan(0)
      expect(mockPrepareAndSend).not.toHaveBeenCalled()
    })
  })

  describe('model propagation', () => {
    it('should propagate model from assistant entry to subsequent entries without model', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      await fs.writeFile(
        tmpPath,
        [
          '{"type":"assistant","uuid":"a1","sessionId":"s1","timestamp":"2025-01-01T00:00:00Z","message":{"role":"assistant","model":"claude-sonnet-4","content":[]}}',
          '{"type":"user","uuid":"u1","sessionId":"s1","timestamp":"2025-01-01T00:00:01Z","message":{"role":"user","content":"hello"}}',
          '{"type":"assistant","uuid":"a2","sessionId":"s1","timestamp":"2025-01-01T00:00:02Z","message":{"role":"assistant","model":"claude-opus-4","content":[]}}',
          '{"type":"user","uuid":"u2","sessionId":"s1","timestamp":"2025-01-01T00:00:03Z","message":{"role":"user","content":"bye"}}',
          '',
        ].join('\n')
      )

      await processTranscript(
        makeInput(tmpPath, 's1'),
        mockSessionStore as any,
        mockLog as any
      )

      expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)
      const [, records] = mockPrepareAndSend.mock.calls[0]!

      expect(records[0].rawData.message.model).toBe('claude-sonnet-4')
      expect(records[1].rawData.message.model).toBe('claude-sonnet-4')
      expect(records[2].rawData.message.model).toBe('claude-opus-4')
      expect(records[3].rawData.message.model).toBe('claude-opus-4')
    })

    it('should restore last model from cursor on subsequent invocations', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      const line =
        '{"type":"user","uuid":"u1","sessionId":"s1","timestamp":"2025-01-01T00:00:00Z","message":{"role":"user","content":"hello"}}\n'
      await fs.writeFile(tmpPath, line)

      // Simulate cursor from previous invocation that saw claude-sonnet-4
      sessionStoreData.set(cursorKeyFor(tmpPath), {
        id: 'prev',
        byteOffset: 0,
        updatedAt: Date.now() - 60_000,
        lastModel: 'claude-sonnet-4',
      })

      await processTranscript(
        makeInput(tmpPath, 's1'),
        mockSessionStore as any,
        mockLog as any
      )

      expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)
      const [, records] = mockPrepareAndSend.mock.calls[0]!

      expect(records[0].rawData.message.model).toBe('claude-sonnet-4')
    })

    it('should persist lastModel in cursor after successful upload', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      await fs.writeFile(
        tmpPath,
        '{"type":"assistant","uuid":"a1","sessionId":"s1","timestamp":"2025-01-01T00:00:00Z","message":{"role":"assistant","model":"claude-opus-4","content":[]}}\n'
      )

      await processTranscript(
        makeInput(tmpPath, 's1'),
        mockSessionStore as any,
        mockLog as any
      )

      const cursorSetCall = mockSessionSet.mock.calls.find(
        ([key]) => typeof key === 'string' && key.startsWith('cursor.')
      )
      expect(cursorSetCall).toBeDefined()
      const cursorValue = cursorSetCall![1] as { lastModel?: string }
      expect(cursorValue.lastModel).toBe('claude-opus-4')
    })

    it('should not inject <synthetic> as model', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      await fs.writeFile(
        tmpPath,
        [
          '{"type":"assistant","uuid":"a1","sessionId":"s1","timestamp":"2025-01-01T00:00:00Z","message":{"role":"assistant","model":"claude-sonnet-4","content":[]}}',
          '{"type":"assistant","uuid":"a2","sessionId":"s1","timestamp":"2025-01-01T00:00:01Z","message":{"role":"assistant","model":"<synthetic>","content":[]}}',
          '{"type":"user","uuid":"u1","sessionId":"s1","timestamp":"2025-01-01T00:00:02Z","message":{"role":"user","content":"test"}}',
          '',
        ].join('\n')
      )

      await processTranscript(
        makeInput(tmpPath, 's1'),
        mockSessionStore as any,
        mockLog as any
      )

      const [, records] = mockPrepareAndSend.mock.calls[0]!
      expect(records[2].rawData.message.model).toBe('claude-sonnet-4')
    })
  })

  describe('filtered-only batches', () => {
    it('should advance cursor when all entries are filtered out', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      await fs.writeFile(
        tmpPath,
        [
          '{"type":"file-history-snapshot","uuid":"f1","sessionId":"s1","timestamp":"2025-01-01T00:00:00Z"}',
          '{"type":"queue-operation","uuid":"f2","sessionId":"s1","timestamp":"2025-01-01T00:00:01Z"}',
          '',
        ].join('\n')
      )

      const result = await processTranscript(
        makeInput(tmpPath, 's1'),
        mockSessionStore as any,
        mockLog as any
      )

      expect(result.entriesUploaded).toBe(0)
      expect(result.entriesSkipped).toBe(2)
      expect(result.errors).toBe(0)
      expect(mockPrepareAndSend).not.toHaveBeenCalled()

      // Cursor should still have been advanced (so we don't reprocess)
      const cursorSetCall = mockSessionSet.mock.calls.find(
        ([key]) => typeof key === 'string' && key.startsWith('cursor.')
      )
      expect(cursorSetCall).toBeDefined()
    })
  })

  describe('sessionId injection for sub-agent events', () => {
    it('should inject sessionId into entries that lack it (role-based sub-agent format)', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      const SESSION_ID = 'test-session-id-inject'

      const normalEntry = JSON.stringify({
        type: 'assistant',
        sessionId: SESSION_ID,
        uuid: 'normal-1',
        timestamp: '2026-01-01T00:00:01Z',
        message: {
          model: 'claude-opus-4-6',
          content: [{ type: 'text', text: 'Hello' }],
        },
      })

      const subagentEntry = JSON.stringify({
        role: 'assistant',
        timestamp: '2026-01-01T00:00:02Z',
        message: {
          content: [
            { type: 'text', text: 'Running build' },
            {
              type: 'tool_use',
              id: 'toolu_1',
              name: 'Shell',
              input: { command: 'pnpm build' },
            },
          ],
        },
      })

      await fs.writeFile(tmpPath, normalEntry + '\n' + subagentEntry + '\n')

      await processTranscript(
        makeInput(tmpPath, SESSION_ID),
        mockSessionStore as any,
        mockLog as any
      )

      expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)
      const [, records] = mockPrepareAndSend.mock.calls[0]!

      expect(records[0].rawData.sessionId).toBe(SESSION_ID)
      expect(records[1].rawData.sessionId).toBe(SESSION_ID)
      expect(records[1].rawData.role).toBe('assistant')
    })
  })

  describe('DAEMON_CHUNK_SIZE cap', () => {
    it('should cap entries at 50 and defer remaining', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      // The EDIT_TRANSCRIPT has 54 entries — should cap at 50
      const { entries } = await readNewTranscriptEntries(
        EDIT_TRANSCRIPT,
        EDIT_SESSION_ID,
        mockSessionStore as any
      )

      expect(entries).toHaveLength(50)
    })

    it('should upload deferred entries on next invocation', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      // First invocation: uploads 50 (capped)
      const result1 = await processTranscript(
        makeInput(tmpTranscriptPath, EDIT_SESSION_ID),
        mockSessionStore as any,
        mockLog as any
      )
      expect(result1.entriesUploaded).toBe(50)

      // Second invocation: should upload remaining 4
      mockPrepareAndSend.mockClear()
      const result2 = await processTranscript(
        makeInput(tmpTranscriptPath, EDIT_SESSION_ID),
        mockSessionStore as any,
        mockLog as any
      )
      expect(result2.entriesUploaded).toBe(4)
    })
  })
})
