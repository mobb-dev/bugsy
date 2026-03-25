import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  filterEntries,
  processAndUploadTranscriptEntries,
  readNewTranscriptEntries,
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

// Mock GQL client (needed by getAuthenticatedGQLClient)
vi.mock('../../src/commands/handleMobbLogin', () => ({
  getAuthenticatedGQLClient: vi.fn(async () => ({})),
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
const EDIT_ENTRY_COUNT = 54

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

    const expectedNewEntries = EDIT_ENTRY_COUNT - 40
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
})
