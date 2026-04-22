import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Logger } from '../../../../utils/shared-logger/create-logger'
import type { SkillVerdict } from '../queryVerdicts'

// Redirect homedir() so quarantine lands under the temp dir.
let fakeHome: tmp.DirectoryResult
let workspace: tmp.DirectoryResult

// Minimal Logger-shaped mock that satisfies the shared-logger interface.
// The quarantine module only calls .info / .warn / .error / .debug in prod,
// but the interface requires more methods; we stub them as no-ops.
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

const makeVerdict = (overrides: Partial<SkillVerdict> = {}): SkillVerdict => ({
  md5: 'a'.repeat(32),
  verdict: 'MALICIOUS',
  summary: 'test reason',
  scannerName: 'mobb-internal',
  scannerVersion: 'v-1',
  scannedAt: '2026-04-22T08:00:00.000Z',
  ...overrides,
})

async function loadModule() {
  vi.resetModules()
  vi.doMock('node:os', async () => {
    const actual = await vi.importActual<typeof import('node:os')>('node:os')
    return { ...actual, homedir: () => fakeHome.path }
  })
  return await import('../quarantineSkill')
}

describe('quarantineSkill', () => {
  beforeEach(async () => {
    fakeHome = await tmp.dir({ unsafeCleanup: true })
    workspace = await tmp.dir({ unsafeCleanup: true })
  })

  afterEach(async () => {
    await fakeHome.cleanup()
    await workspace.cleanup()
    vi.resetModules()
    vi.doUnmock('node:os')
  })

  it('moves a folder skill wholesale, writes stub, creates {md5}/ marker', async () => {
    const { quarantineSkill } = await loadModule()
    // Set up a fake malicious folder skill.
    const skillDir = path.join(workspace.path, '.claude', 'skills', 'evil')
    mkdirSync(skillDir, { recursive: true })
    writeFileSync(path.join(skillDir, 'SKILL.md'), '# evil SKILL')
    writeFileSync(path.join(skillDir, 'setup.sh'), '#!/bin/sh')

    const verdict = makeVerdict()
    const result = await quarantineSkill({
      skillPath: skillDir,
      isFolder: true,
      md5: verdict.md5,
      origName: 'evil',
      verdict,
      log: silentLog,
    })

    expect(result.status).toBe('quarantined')
    const quarantineRoot = path.join(
      fakeHome.path,
      '.tracy',
      'quarantine',
      'claude',
      'skills'
    )
    // Hash dir exists with contents.
    expect(
      existsSync(path.join(quarantineRoot, verdict.md5, 'evil', 'SKILL.md'))
    ).toBe(true)
    expect(
      existsSync(path.join(quarantineRoot, verdict.md5, 'evil', 'setup.sh'))
    ).toBe(true)
    // Original path rebuilt with stub only.
    expect(existsSync(path.join(skillDir, 'SKILL.md'))).toBe(true)
    expect(existsSync(path.join(skillDir, 'setup.sh'))).toBe(false)
    const stub = readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8')
    expect(stub).toContain('⛔ QUARANTINED BY TRACY')
    // No leftover staging dirs.
    const entries = (await import('node:fs')).readdirSync(quarantineRoot)
    expect(entries.filter((e) => e.includes('_tmp_')).length).toBe(0)
  })

  it('moves a standalone .md skill, stub is a file not a dir', async () => {
    const { quarantineSkill } = await loadModule()
    const skillFile = path.join(
      workspace.path,
      '.claude',
      'skills',
      'inline.md'
    )
    mkdirSync(path.dirname(skillFile), { recursive: true })
    writeFileSync(skillFile, '# inline malicious')

    const verdict = makeVerdict({ md5: 'b'.repeat(32) })
    const result = await quarantineSkill({
      skillPath: skillFile,
      isFolder: false,
      md5: verdict.md5,
      origName: 'inline.md',
      verdict,
      log: silentLog,
    })
    expect(result.status).toBe('quarantined')
    const quarantineRoot = path.join(
      fakeHome.path,
      '.tracy',
      'quarantine',
      'claude',
      'skills'
    )
    // Quarantined as a file, not a folder.
    expect(
      existsSync(path.join(quarantineRoot, verdict.md5, 'inline.md'))
    ).toBe(true)
    // Stub is written as a single .md file back at the original path.
    const stub = readFileSync(skillFile, 'utf8')
    expect(stub).toContain('⛔ QUARANTINED BY TRACY')
  })

  it('short-circuits when {md5}/ already exists (already_quarantined)', async () => {
    const { quarantineSkill } = await loadModule()
    const skillDir = path.join(workspace.path, '.claude', 'skills', 'evil')
    mkdirSync(skillDir, { recursive: true })
    writeFileSync(path.join(skillDir, 'SKILL.md'), '# evil')

    const verdict = makeVerdict({ md5: 'c'.repeat(32) })
    // Pre-create the hash dir to simulate prior quarantine.
    const quarantineRoot = path.join(
      fakeHome.path,
      '.tracy',
      'quarantine',
      'claude',
      'skills'
    )
    mkdirSync(path.join(quarantineRoot, verdict.md5), { recursive: true })

    const result = await quarantineSkill({
      skillPath: skillDir,
      isFolder: true,
      md5: verdict.md5,
      origName: 'evil',
      verdict,
      log: silentLog,
    })
    expect(result.status).toBe('already_quarantined')
    // Skill untouched — user control is preserved.
    expect(existsSync(path.join(skillDir, 'SKILL.md'))).toBe(true)
  })

  it('sweepOrphanStagingDirs removes stale *_tmp_* dirs', async () => {
    const { sweepOrphanStagingDirs } = await loadModule()
    const quarantineRoot = path.join(
      fakeHome.path,
      '.tracy',
      'quarantine',
      'claude',
      'skills'
    )
    mkdirSync(quarantineRoot, { recursive: true })

    // Stale tmp
    const staleMd5 = 'd'.repeat(32)
    const staleTmp = path.join(quarantineRoot, `${staleMd5}_tmp_1_old`)
    mkdirSync(staleTmp)
    // Backdate mtime by 1 hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const { utimesSync } = await import('node:fs')
    utimesSync(staleTmp, oneHourAgo / 1000, oneHourAgo / 1000)

    // Fresh tmp (recent)
    const freshMd5 = 'e'.repeat(32)
    const freshTmp = path.join(quarantineRoot, `${freshMd5}_tmp_2_new`)
    mkdirSync(freshTmp)

    // Final hash dir (not a tmp, must not be swept)
    const finalDir = path.join(quarantineRoot, 'f'.repeat(32))
    mkdirSync(finalDir)

    const swept = await sweepOrphanStagingDirs(silentLog)
    expect(swept).toBe(1)
    expect(existsSync(staleTmp)).toBe(false)
    expect(existsSync(freshTmp)).toBe(true)
    expect(existsSync(finalDir)).toBe(true)
  })

  it('sweepOrphanStagingDirs no-ops when root does not exist', async () => {
    const { sweepOrphanStagingDirs } = await loadModule()
    // fakeHome is fresh; .tracy/quarantine/claude/skills/ does not yet exist.
    expect(await sweepOrphanStagingDirs(silentLog)).toBe(0)
  })
})
