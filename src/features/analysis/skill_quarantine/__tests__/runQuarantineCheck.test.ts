import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Logger } from '../../../../utils/shared-logger/create-logger'

const silentLog: Logger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  heartbeat: vi.fn(),
  timed: async (_label, fn) => fn(),
  flushLogs: vi.fn(),
  flushDdAsync: () => Promise.resolve(),
  disposeDd: vi.fn(),
  setScopePath: vi.fn(),
  updateDdTags: vi.fn(),
}

async function loadModule() {
  vi.resetModules()
  return await import('../runQuarantineCheck')
}

describe('runQuarantineCheckIfNeeded', () => {
  let origEnv: NodeJS.ProcessEnv
  beforeEach(() => {
    origEnv = { ...process.env }
    delete process.env['MOBB_TRACY_SKILL_QUARANTINE_DISABLE']
  })
  afterEach(() => {
    process.env = origEnv
    vi.resetModules()
    vi.doUnmock('../enumerateInstalledSkills')
    vi.doUnmock('../queryVerdicts')
    vi.doUnmock('../quarantineSkill')
  })

  it('kill switch skips enumeration', async () => {
    process.env['MOBB_TRACY_SKILL_QUARANTINE_DISABLE'] = '1'
    const enumerateSpy = vi.fn()
    vi.doMock('../enumerateInstalledSkills', () => ({
      enumerateInstalledSkills: enumerateSpy,
    }))
    const { runQuarantineCheckIfNeeded, __resetQuarantineCheckStateForTests } =
      await loadModule()
    __resetQuarantineCheckStateForTests()
    await runQuarantineCheckIfNeeded({
      sessionId: 's1',
      cwd: '/nowhere',
      gqlClient: {} as never,
      log: silentLog,
    })
    expect(enumerateSpy).not.toHaveBeenCalled()
  })

  it('debounces: second call within 30s skips verdict fetch and enumeration (mtime unchanged)', async () => {
    const enumerateSpy = vi.fn(async () => [])
    vi.doMock('../enumerateInstalledSkills', () => ({
      enumerateInstalledSkills: enumerateSpy,
    }))
    const reconcileSpy = vi.fn().mockResolvedValue(undefined)
    vi.doMock('../quarantineSkill', () => ({
      quarantineSkill: vi.fn(),
      reconcileAndSweep: reconcileSpy,
    }))
    const { runQuarantineCheckIfNeeded, __resetQuarantineCheckStateForTests } =
      await loadModule()
    __resetQuarantineCheckStateForTests()
    await runQuarantineCheckIfNeeded({
      sessionId: 's1',
      cwd: '/cwd',
      gqlClient: {} as never,
      log: silentLog,
    })
    await runQuarantineCheckIfNeeded({
      sessionId: 's1',
      cwd: '/cwd',
      gqlClient: {} as never,
      log: silentLog,
    })
    // Enumeration is skipped on the 2nd call: mtime pre-check sees unchanged
    // skill dirs (both stat() calls return 0) and short-circuits before enumeration.
    expect(enumerateSpy).toHaveBeenCalledTimes(1)
    // The full check (sweep + verdict fetch) only runs once within the debounce window.
    expect(reconcileSpy).toHaveBeenCalledTimes(1)
  })

  it('quarantines only MALICIOUS skills; others are left alone', async () => {
    vi.doMock('../enumerateInstalledSkills', () => ({
      enumerateInstalledSkills: vi.fn(async () => [
        { skillPath: '/a', md5: 'aaa', origName: 'a', isFolder: true },
        { skillPath: '/b', md5: 'bbb', origName: 'b', isFolder: true },
      ]),
    }))
    vi.doMock('../queryVerdicts', () => ({
      queryVerdicts: vi.fn(async () => ({
        quarantineEnabled: true,
        verdicts: new Map([
          [
            'aaa',
            {
              md5: 'aaa',
              verdict: 'MALICIOUS',
              summary: null,
              scannerName: 'x',
              scannerVersion: 'v',
              scannedAt: 't',
            },
          ],
          [
            'bbb',
            {
              md5: 'bbb',
              verdict: 'BENIGN',
              summary: null,
              scannerName: 'x',
              scannerVersion: 'v',
              scannedAt: 't',
            },
          ],
        ]),
      })),
    }))
    const quarantineSpy = vi.fn(async () => ({
      status: 'quarantined' as const,
    }))
    vi.doMock('../quarantineSkill', () => ({
      quarantineSkill: quarantineSpy,
      reconcileAndSweep: vi.fn().mockResolvedValue(undefined),
    }))
    const { runQuarantineCheckIfNeeded, __resetQuarantineCheckStateForTests } =
      await loadModule()
    __resetQuarantineCheckStateForTests()
    await runQuarantineCheckIfNeeded({
      sessionId: 's1',
      cwd: '/cwd',
      gqlClient: {} as never,
      log: silentLog,
    })
    expect(quarantineSpy).toHaveBeenCalledTimes(1)
    expect(quarantineSpy).toHaveBeenCalledWith(
      expect.objectContaining({ md5: 'aaa' })
    )
  })

  // T-493 — when no org the user belongs to has opted in, on-disk
  // quarantine MUST NOT happen even if the verdict says MALICIOUS.
  it('skips on-disk quarantine when quarantineEnabled is false', async () => {
    vi.doMock('../enumerateInstalledSkills', () => ({
      enumerateInstalledSkills: vi.fn(async () => [
        { skillPath: '/a', md5: 'aaa', origName: 'a', isFolder: true },
      ]),
    }))
    vi.doMock('../queryVerdicts', () => ({
      queryVerdicts: vi.fn(async () => ({
        quarantineEnabled: false,
        verdicts: new Map([
          [
            'aaa',
            {
              md5: 'aaa',
              verdict: 'MALICIOUS',
              summary: null,
              scannerName: 'x',
              scannerVersion: 'v',
              scannedAt: 't',
            },
          ],
        ]),
      })),
    }))
    const quarantineSpy = vi.fn(async () => ({
      status: 'quarantined' as const,
    }))
    vi.doMock('../quarantineSkill', () => ({
      quarantineSkill: quarantineSpy,
      reconcileAndSweep: vi.fn().mockResolvedValue(undefined),
    }))
    const { runQuarantineCheckIfNeeded, __resetQuarantineCheckStateForTests } =
      await loadModule()
    __resetQuarantineCheckStateForTests()
    await runQuarantineCheckIfNeeded({
      sessionId: 's1',
      cwd: '/cwd',
      gqlClient: {} as never,
      log: silentLog,
    })
    expect(quarantineSpy).not.toHaveBeenCalled()
  })
})
