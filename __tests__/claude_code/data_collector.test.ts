import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  extractSessionIdFromTranscript,
  filterEntries,
  processAndUploadTranscriptEntries,
  readNewTranscriptEntries,
  resolveTranscriptPath,
  validateHookData,
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

// Authentic transcript files from real Claude Code sessions
const EDIT_TRANSCRIPT = path.join(
  __dirname,
  'assets',
  'dcc484f5-c9f4-4c34-b5c0-791b746026b4.jsonl'
)
const EDIT_SESSION_ID = 'dcc484f5-c9f4-4c34-b5c0-791b746026b4'
const EDIT_ENTRY_COUNT = 50 // 54 raw entries, capped at MAX_ENTRIES_PER_INVOCATION (50)

const WRITE_TRANSCRIPT = path.join(
  __dirname,
  'assets',
  '2e251410-b29f-4ff4-817a-7bc61c76d1fb.jsonl'
)
const WRITE_SESSION_ID = '2e251410-b29f-4ff4-817a-7bc61c76d1fb'

describe('processAndUploadTranscriptEntries', () => {
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

  function mockStdin(data: string) {
    const mockStdinObj = {
      setEncoding: vi.fn(),
      on: vi.fn((event: string, callback: (data?: string) => void) => {
        if (event === 'data') {
          callback(data)
        } else if (event === 'end') {
          callback()
        }
      }),
    }

    vi.stubGlobal(
      'process',
      new Proxy(process, {
        get(target, prop) {
          if (prop === 'stdin') {
            return mockStdinObj
          }
          return Reflect.get(target, prop, target)
        },
      })
    )
  }

  function cursorKeyFor(transcriptPath: string): string {
    const hash = createHash('sha256')
      .update(transcriptPath)
      .digest('hex')
      .slice(0, 12)
    return `cursor.${hash}`
  }

  function createHookStdinData(
    transcriptPath: string,
    sessionId: string,
    cwd = '/tmp/test-workspace'
  ): string {
    return JSON.stringify({
      session_id: sessionId,
      transcript_path: transcriptPath,
      cwd,
      hook_event_name: 'PostToolUse',
      tool_name: 'Edit',
      tool_input: { file_path: '/tmp/test.js', old_string: '', new_string: '' },
      tool_response: { filePath: '/tmp/test.js', structuredPatch: [] },
    })
  }

  it('should upload all entries on first invocation (edit transcript)', async () => {
    // No cursor set — first invocation
    mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

    mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

    const result = await processAndUploadTranscriptEntries()

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

    // active lock + cooldown + cursor advance = 3 sessionStore.set calls (active cleared via delete)
    expect(mockSessionSet).toHaveBeenCalledTimes(3)
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

    mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

    const result = await processAndUploadTranscriptEntries()

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
    mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))
    const result1 = await processAndUploadTranscriptEntries()
    expect(result1.entriesUploaded).toBe(10)

    // Append 5 more lines to simulate file growth
    const appendedLines = allLines.slice(10, 15)
    await fs.appendFile(tmpTranscriptPath, appendedLines.join('\n') + '\n')

    // Second invocation: should upload only the 5 new lines
    mockPrepareAndSend.mockClear()
    mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))
    // Reset cooldown and active lock so we're not skipped
    sessionStoreData.delete('lastHookRunAt')
    sessionStoreData.delete('hookActiveAt')
    globalStoreData.delete('claudeCode.globalLastHookRunAt')
    const result2 = await processAndUploadTranscriptEntries()
    expect(result2.entriesUploaded).toBe(5)

    const [, records] = mockPrepareAndSend.mock.calls[0]!
    expect(records).toHaveLength(5)
  })

  it('should not advance cursor on batch failure', async () => {
    // No cursor set — first invocation
    mockPrepareAndSend.mockResolvedValue({
      ok: false,
      errors: ['Chunk of 10 records failed: Network error'],
    })

    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.copyFile(WRITE_TRANSCRIPT, tmpTranscriptPath)

    mockStdin(createHookStdinData(tmpTranscriptPath, WRITE_SESSION_ID))

    const result = await processAndUploadTranscriptEntries()

    expect(result.entriesUploaded).toBe(0)
    expect(result.errors).toBeGreaterThan(0)

    // active lock + cooldown (no cursor advance on failure) = 2 sessionStore.set calls (active cleared via delete)
    expect(mockSessionSet).toHaveBeenCalledTimes(2)
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
    // No cursor set — first invocation with empty file

    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.writeFile(tmpTranscriptPath, '')

    mockStdin(createHookStdinData(tmpTranscriptPath, 'empty-session'))

    const result = await processAndUploadTranscriptEntries()

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

    it('should filter out assistant TaskOutput tool_use entries', () => {
      const entries = [
        entry({
          type: 'assistant',
          message: {
            content: [{ type: 'tool_use', name: 'TaskOutput' }],
          },
        }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(0)
      expect(filteredOut).toBe(1)
    })

    it('should filter out assistant ToolSearch tool_use entries', () => {
      const entries = [
        entry({
          type: 'assistant',
          message: {
            content: [{ type: 'tool_use', name: 'ToolSearch' }],
          },
        }),
      ]
      const { filtered, filteredOut } = filterEntries(entries)
      expect(filtered).toHaveLength(0)
      expect(filteredOut).toBe(1)
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

    mockStdin(createHookStdinData(tmpTranscriptPath, WRITE_SESSION_ID))

    const result = await processAndUploadTranscriptEntries()

    expect(result.entriesUploaded).toBe(0)
    expect(result.errors).toBe(0)
    expect(mockPrepareAndSend).not.toHaveBeenCalled()
  })

  it('should skip when invoked within cooldown period for the same session', async () => {
    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

    // Set per-session cooldown timestamp to 5 seconds ago (within 10s cooldown)
    sessionStoreData.set('lastHookRunAt', Date.now() - 5_000)

    mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

    const result = await processAndUploadTranscriptEntries()

    expect(result.entriesUploaded).toBe(0)
    expect(result.entriesSkipped).toBe(0)
    expect(result.errors).toBe(0)
    expect(mockPrepareAndSend).not.toHaveBeenCalled()
  })

  it('should proceed when cooldown has expired', async () => {
    mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

    // Set per-session cooldown timestamp to 15 seconds ago (beyond 10s cooldown)
    sessionStoreData.set('lastHookRunAt', Date.now() - 15_000)

    const tmpDir = await tmp.dir({ unsafeCleanup: true })
    tmpDirs.push(tmpDir)

    const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
    await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

    mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

    const result = await processAndUploadTranscriptEntries()

    expect(result.entriesUploaded).toBe(EDIT_ENTRY_COUNT)
    expect(result.errors).toBe(0)
    expect(mockPrepareAndSend).toHaveBeenCalled()
  })

  describe('missing hook fields (graceful degradation)', () => {
    it('should return zero counts when transcript_path is missing', async () => {
      mockStdin(
        JSON.stringify({
          session_id: 'some-session',
          transcript_path: null,
          cwd: '/tmp/test',
          hook_event_name: 'PostToolUse',
          tool_name: 'Edit',
          tool_input: {},
          tool_response: {},
        })
      )

      const result = await processAndUploadTranscriptEntries()

      expect(result.entriesUploaded).toBe(0)
      expect(result.errors).toBe(0)
      expect(mockPrepareAndSend).not.toHaveBeenCalled()
    })

    it('should fall back to session_id from transcript when missing in hook data', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      // Send hook data WITHOUT session_id
      mockStdin(
        JSON.stringify({
          transcript_path: tmpTranscriptPath,
          cwd: '/tmp/test-workspace',
          hook_event_name: 'PostToolUse',
          tool_name: 'Edit',
          tool_input: {},
          tool_response: {},
        })
      )

      const result = await processAndUploadTranscriptEntries()

      // Should succeed by extracting session_id from transcript entries
      expect(result.entriesUploaded).toBe(EDIT_ENTRY_COUNT)
      expect(result.errors).toBe(0)
      expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)
    })

    it('should return zero counts when session_id is missing and transcript has no sessionId', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      // Write a transcript with entries that have no sessionId field
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.writeFile(
        tmpTranscriptPath,
        '{"type":"user","timestamp":"2025-01-01T00:00:00Z"}\n'
      )

      mockStdin(
        JSON.stringify({
          transcript_path: tmpTranscriptPath,
          cwd: '/tmp/test',
          hook_event_name: 'PostToolUse',
          tool_name: 'Edit',
          tool_input: {},
          tool_response: {},
        })
      )

      const result = await processAndUploadTranscriptEntries()

      expect(result.entriesUploaded).toBe(0)
      expect(result.errors).toBe(0)
      expect(mockPrepareAndSend).not.toHaveBeenCalled()
    })

    it('should upload successfully when cwd is missing', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      // Send hook data WITHOUT cwd
      mockStdin(
        JSON.stringify({
          session_id: EDIT_SESSION_ID,
          transcript_path: tmpTranscriptPath,
          hook_event_name: 'PostToolUse',
          tool_name: 'Edit',
          tool_input: {},
          tool_response: {},
        })
      )

      const result = await processAndUploadTranscriptEntries()

      expect(result.entriesUploaded).toBe(EDIT_ENTRY_COUNT)
      expect(result.errors).toBe(0)
      expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)

      // cwd passed to prepareAndSendTracyRecords should be undefined
      const [, , cwd] = mockPrepareAndSend.mock.calls[0]!
      expect(cwd).toBeUndefined()
    })

    it('should upload successfully when both session_id and cwd are missing', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      // Send hook data WITHOUT session_id AND cwd
      mockStdin(
        JSON.stringify({
          transcript_path: tmpTranscriptPath,
          hook_event_name: 'PostToolUse',
          tool_name: 'Edit',
          tool_input: {},
          tool_response: {},
        })
      )

      const result = await processAndUploadTranscriptEntries()

      // Should succeed by extracting session_id from transcript
      expect(result.entriesUploaded).toBe(EDIT_ENTRY_COUNT)
      expect(result.errors).toBe(0)
    })
  })

  describe('extractSessionIdFromTranscript', () => {
    it('should extract sessionId from first transcript entry', async () => {
      const result = await extractSessionIdFromTranscript(EDIT_TRANSCRIPT)
      expect(result).toBe(EDIT_SESSION_ID)
    })

    it('should return null for empty transcript', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const tmpPath = path.join(tmpDir.path, 'empty.jsonl')
      await fs.writeFile(tmpPath, '')

      const result = await extractSessionIdFromTranscript(tmpPath)
      expect(result).toBeNull()
    })

    it('should return null for transcript with no sessionId in first entry', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      const tmpPath = path.join(tmpDir.path, 'no-session.jsonl')
      await fs.writeFile(tmpPath, '{"type":"user","timestamp":"2025-01-01"}\n')

      const result = await extractSessionIdFromTranscript(tmpPath)
      expect(result).toBeNull()
    })

    it('should return null for non-existent file', async () => {
      const result = await extractSessionIdFromTranscript(
        '/tmp/non-existent-transcript.jsonl'
      )
      expect(result).toBeNull()
    })
  })

  describe('validateHookData', () => {
    it('should accept valid hook data with all fields', () => {
      const data = {
        session_id: 'abc',
        transcript_path: '/tmp/t.jsonl',
        cwd: '/tmp',
        hook_event_name: 'PostToolUse',
        tool_name: 'Edit',
        tool_input: {},
        tool_response: {},
      }
      const result = validateHookData(data)
      expect(result.session_id).toBe('abc')
      expect(result.cwd).toBe('/tmp')
    })

    it('should accept hook data with null optional fields', () => {
      const data = {
        session_id: null,
        transcript_path: null,
        cwd: null,
        hook_event_name: 'PostToolUse',
        tool_name: 'Edit',
        tool_input: {},
        tool_response: {},
      }
      const result = validateHookData(data)
      expect(result.session_id).toBeNull()
      expect(result.cwd).toBeNull()
    })

    it('should accept hook data with missing optional fields', () => {
      const data = {
        hook_event_name: 'PostToolUse',
        tool_name: 'Edit',
        tool_input: {},
        tool_response: {},
      }
      const result = validateHookData(data)
      expect(result.session_id).toBeUndefined()
    })

    it('should reject data missing required fields', () => {
      expect(() => validateHookData({ session_id: 'abc' })).toThrow()
    })

    it('should reject non-object input', () => {
      expect(() => validateHookData('not-an-object')).toThrow()
      expect(() => validateHookData(null)).toThrow()
    })
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

      // Simulate Claude Code projects directory structure:
      // projects/-Users-me-repo/transcript.jsonl  (exists)
      // projects/-Users-me-repo-claude-worktrees-fix/transcript.jsonl  (doesn't exist)
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

      // Request the worktree path (file doesn't exist there)
      const worktreePath = path.join(worktreeDir, 'session.jsonl')
      const result = await resolveTranscriptPath(worktreePath, 'session-1')
      expect(result).toBe(transcript)
    })

    it('should resolve via sibling scan when worktree strip fails', async () => {
      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)

      // projects/dir-a/session.jsonl (exists)
      // projects/dir-b/session.jsonl (requested but doesn't exist)
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

  describe('global cooldown', () => {
    it('should skip when invoked within global cooldown', async () => {
      globalStoreData.set(
        'claudeCode.globalLastHookRunAt',
        Date.now() - 2_000 // 2 seconds ago (within 5s global cooldown)
      )

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

      const result = await processAndUploadTranscriptEntries()

      expect(result.entriesUploaded).toBe(0)
      expect(result.errors).toBe(0)
      expect(mockPrepareAndSend).not.toHaveBeenCalled()
    })
  })

  describe('active lock', () => {
    it('should skip when another hook is actively running for the session', async () => {
      // Set active lock to 10 seconds ago (within 60s TTL)
      sessionStoreData.set('hookActiveAt', Date.now() - 10_000)

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

      const result = await processAndUploadTranscriptEntries()

      expect(result.entriesUploaded).toBe(0)
      expect(result.errors).toBe(0)
      expect(mockPrepareAndSend).not.toHaveBeenCalled()
    })

    it('should proceed when active lock has expired (stale)', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      // Set active lock to 90 seconds ago (beyond 60s TTL)
      sessionStoreData.set('hookActiveAt', Date.now() - 90_000)

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

      const result = await processAndUploadTranscriptEntries()

      expect(result.entriesUploaded).toBe(EDIT_ENTRY_COUNT)
      expect(result.errors).toBe(0)
    })
  })

  describe('GQL auth failure', () => {
    it('should return errors count when GQL auth fails', async () => {
      mockGetGQLClient.mockRejectedValue(new Error('Auth0 token expired'))

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

      const result = await processAndUploadTranscriptEntries()

      expect(result.entriesUploaded).toBe(0)
      expect(result.errors).toBeGreaterThan(0)
      expect(mockPrepareAndSend).not.toHaveBeenCalled()
    })
  })

  describe('detectClaudeCodeVersion (via processAndUploadTranscriptEntries)', () => {
    it('should detect Claude Code version and cache it', async () => {
      mockExecFile.mockReturnValue('2.1.87 (Claude Code)\n')
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

      await processAndUploadTranscriptEntries()

      expect(mockExecFile).toHaveBeenCalledWith(
        'claude',
        ['--version'],
        expect.objectContaining({ timeout: 3_000 })
      )
      // Version should be cached in global configStore
      expect(mockGlobalSet).toHaveBeenCalledWith(
        'claudeCode.detectedCCVersion',
        '2.1.87'
      )
    })

    it('should not fail the hook when claude is not in PATH', async () => {
      mockExecFile.mockImplementation(() => {
        throw new Error('ENOENT: claude not found')
      })
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

      const result = await processAndUploadTranscriptEntries()

      // Hook should still succeed
      expect(result.entriesUploaded).toBe(EDIT_ENTRY_COUNT)
      expect(result.errors).toBe(0)
    })

    it('should use cached version on subsequent invocations', async () => {
      // Simulate cached version from a previous run with same CLI version
      const pkgVersion =
        (await import('../../src/utils/check_node_version')).packageJson
          .version ?? 'unknown'
      globalStoreData.set('claudeCode.detectedCCVersionCli', pkgVersion)
      globalStoreData.set('claudeCode.detectedCCVersion', '2.0.0')
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpTranscriptPath = path.join(tmpDir.path, 'transcript.jsonl')
      await fs.copyFile(EDIT_TRANSCRIPT, tmpTranscriptPath)

      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))

      await processAndUploadTranscriptEntries()

      // Should NOT have called execFile — used cache
      expect(mockExecFile).not.toHaveBeenCalled()
    })
  })

  describe('model propagation', () => {
    it('should propagate model from assistant entry to subsequent entries without model', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      // Entry 1: assistant with model
      // Entry 2: user (no model) — should get model injected
      // Entry 3: assistant with different model
      // Entry 4: user (no model) — should get second model
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

      mockStdin(createHookStdinData(tmpPath, 's1'))

      await processAndUploadTranscriptEntries()

      expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)
      const [, records] = mockPrepareAndSend.mock.calls[0]!

      // Entry 1: has its own model
      expect(records[0].rawData.message.model).toBe('claude-sonnet-4')
      // Entry 2: should have model injected from entry 1
      expect(records[1].rawData.message.model).toBe('claude-sonnet-4')
      // Entry 3: has its own model
      expect(records[2].rawData.message.model).toBe('claude-opus-4')
      // Entry 4: should have model injected from entry 3
      expect(records[3].rawData.message.model).toBe('claude-opus-4')
    })

    it('should restore last model from cursor on subsequent invocations', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      // Single user entry with no model — needs injection from cursor
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

      mockStdin(createHookStdinData(tmpPath, 's1'))

      await processAndUploadTranscriptEntries()

      expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)
      const [, records] = mockPrepareAndSend.mock.calls[0]!

      // Model should be injected from cursor's lastModel
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

      mockStdin(createHookStdinData(tmpPath, 's1'))

      await processAndUploadTranscriptEntries()

      // Find the cursor.set call that stores the cursor value
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

      mockStdin(createHookStdinData(tmpPath, 's1'))

      await processAndUploadTranscriptEntries()

      const [, records] = mockPrepareAndSend.mock.calls[0]!
      // <synthetic> should NOT override the last real model
      expect(records[2].rawData.message.model).toBe('claude-sonnet-4')
    })
  })

  describe('filtered-only batches', () => {
    it('should advance cursor when all entries are filtered out', async () => {
      mockPrepareAndSend.mockResolvedValue({ ok: true, errors: null })

      const tmpDir = await tmp.dir({ unsafeCleanup: true })
      tmpDirs.push(tmpDir)
      const tmpPath = path.join(tmpDir.path, 'transcript.jsonl')

      // Write only entries that will be filtered out
      await fs.writeFile(
        tmpPath,
        [
          '{"type":"file-history-snapshot","uuid":"f1","sessionId":"s1","timestamp":"2025-01-01T00:00:00Z"}',
          '{"type":"queue-operation","uuid":"f2","sessionId":"s1","timestamp":"2025-01-01T00:00:01Z"}',
          '',
        ].join('\n')
      )

      mockStdin(createHookStdinData(tmpPath, 's1'))

      const result = await processAndUploadTranscriptEntries()

      expect(result.entriesUploaded).toBe(0)
      expect(result.entriesSkipped).toBe(2)
      expect(result.errors).toBe(0)
      // Should NOT have called upload
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

      // Entry 1: normal entry with sessionId
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

      // Entry 2: sub-agent entry with role but NO sessionId
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
      mockStdin(createHookStdinData(tmpPath, SESSION_ID))

      await processAndUploadTranscriptEntries()

      expect(mockPrepareAndSend).toHaveBeenCalledTimes(1)
      const [, records] = mockPrepareAndSend.mock.calls[0]!

      // Normal entry should keep its sessionId
      expect(records[0].rawData.sessionId).toBe(SESSION_ID)

      // Sub-agent entry should have sessionId injected
      expect(records[1].rawData.sessionId).toBe(SESSION_ID)
      expect(records[1].rawData.role).toBe('assistant')
    })
  })

  describe('MAX_ENTRIES_PER_INVOCATION cap', () => {
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
      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))
      const result1 = await processAndUploadTranscriptEntries()
      expect(result1.entriesUploaded).toBe(50)

      // Second invocation: should upload remaining 4
      mockPrepareAndSend.mockClear()
      sessionStoreData.delete('lastHookRunAt')
      sessionStoreData.delete('hookActiveAt')
      globalStoreData.delete('claudeCode.globalLastHookRunAt')
      mockStdin(createHookStdinData(tmpTranscriptPath, EDIT_SESSION_ID))
      const result2 = await processAndUploadTranscriptEntries()
      expect(result2.entriesUploaded).toBe(4)
    })
  })
})
