import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock external dependencies before importing daemon
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
  createScopedHookLog: vi.fn().mockReturnValue({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    timed: vi.fn(async (_label: string, fn: () => Promise<unknown>) => fn()),
    heartbeat: vi.fn(),
    flushLogs: vi.fn(),
  }),
  flushDdLogs: vi.fn().mockResolvedValue(undefined),
  setClaudeCodeVersion: vi.fn(),
}))

vi.mock('../install_hook', () => ({
  autoUpgradeMatcherIfStale: vi.fn().mockResolvedValue(false),
  writeDaemonCheckScript: vi.fn(),
}))

vi.mock('../data_collector', () => ({
  processTranscript: vi.fn().mockResolvedValue({
    entriesUploaded: 0,
    entriesSkipped: 0,
    errors: 0,
  }),
  cleanupStaleSessions: vi.fn().mockResolvedValue(undefined),
  detectClaudeCodeVersion: vi.fn().mockResolvedValue('1.0.0'),
}))

// Mock transcript_scanner to return no transcripts by default
vi.mock('../transcript_scanner', () => ({
  scanForTranscripts: vi.fn().mockResolvedValue([]),
  extractCwdFromTranscript: vi.fn().mockResolvedValue(undefined),
}))

let tmpDir: string

vi.mock('node:os', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    default: {
      ...(actual['default'] as Record<string, unknown>),
      homedir: () => tmpDir,
    },
  }
})

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'daemon-test-'))
  vi.clearAllMocks()
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('daemon', () => {
  it('exits immediately if another daemon heartbeat is fresh (self-dedup)', async () => {
    const { DaemonPidFile } = await import('../daemon_pid_file')
    const pf = new DaemonPidFile()
    pf.ensureDir()

    // Write a PID file with fresh heartbeat for current process
    fs.writeFileSync(
      path.join(tmpDir, '.mobbdev', 'daemon.pid'),
      JSON.stringify({
        pid: process.pid,
        startedAt: Date.now(),
        heartbeat: Date.now(),
      }),
      'utf8'
    )

    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((code?: number) => {
        throw new Error(`process.exit(${code})`)
      })

    const { startDaemon } = await import('../daemon')
    await expect(startDaemon()).rejects.toThrow('process.exit(0)')

    expect(exitSpy).toHaveBeenCalledWith(0)
    exitSpy.mockRestore()
  })

  it('exits on auth failure', async () => {
    const { DaemonPidFile } = await import('../daemon_pid_file')
    const pf = new DaemonPidFile()
    pf.ensureDir()

    // Make auth fail
    const { getAuthenticatedGQLClient } =
      await import('../../../commands/handleMobbLogin')
    vi.mocked(getAuthenticatedGQLClient).mockRejectedValueOnce(
      new Error('401 Unauthorized')
    )

    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((code?: number) => {
        throw new Error(`process.exit(${code})`)
      })

    const { startDaemon } = await import('../daemon')
    await expect(startDaemon()).rejects.toThrow('process.exit(1)')

    expect(exitSpy).toHaveBeenCalledWith(1)
    exitSpy.mockRestore()
  })
})
