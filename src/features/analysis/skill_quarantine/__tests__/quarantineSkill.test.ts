import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  utimesSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

import AdmZip from 'adm-zip'
import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Logger } from '../../../../utils/shared-logger/create-logger'
import { STUB_MARKER } from '../constants'
import type { SkillVerdict } from '../queryVerdicts'

let fakeHome: tmp.DirectoryResult
let workspace: tmp.DirectoryResult

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

function rootOf(): string {
  return path.join(fakeHome.path, '.tracy', 'quarantine', 'claude', 'skills')
}

/** Produce a valid zip buffer for reconcile tests. */
function makeZipBuffer(entries: { name: string; content: string }[]): Buffer {
  const z = new AdmZip()
  for (const e of entries) z.addFile(e.name, Buffer.from(e.content))
  return z.toBuffer()
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

  it('archives a folder skill, replaces original with stub, publishes <md5>.zip', async () => {
    const { quarantineSkill } = await loadModule()
    const skillDir = path.join(workspace.path, '.claude', 'skills', 'evil')
    mkdirSync(skillDir, { recursive: true })
    writeFileSync(path.join(skillDir, 'SKILL.md'), '# evil SKILL')
    writeFileSync(path.join(skillDir, 'setup.sh'), '#!/bin/sh\necho pwned')

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

    const finalZip = path.join(rootOf(), `${verdict.md5}.zip`)
    expect(existsSync(finalZip)).toBe(true)

    // Raw (unsanitized) content preserved for recovery.
    const zip = new AdmZip(finalZip)
    const entries = zip
      .getEntries()
      .map((e) => e.entryName)
      .sort()
    expect(entries).toContain('evil/SKILL.md')
    expect(entries).toContain('evil/setup.sh')
    expect(zip.readAsText('evil/setup.sh')).toBe('#!/bin/sh\necho pwned')

    expect(readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8')).toContain(
      STUB_MARKER
    )
    expect(existsSync(path.join(skillDir, 'setup.sh'))).toBe(false)
  })

  it('archives a standalone .md skill; stub replaces the file', async () => {
    const { quarantineSkill } = await loadModule()
    const skillFile = path.join(
      workspace.path,
      '.claude',
      'skills',
      'inline.md'
    )
    mkdirSync(path.dirname(skillFile), { recursive: true })
    writeFileSync(skillFile, '# inline malicious\nsecret=SUPER_SECRET')

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
    const zip = new AdmZip(path.join(rootOf(), `${verdict.md5}.zip`))
    expect(zip.readAsText('inline.md')).toBe(
      '# inline malicious\nsecret=SUPER_SECRET'
    )
    expect(readFileSync(skillFile, 'utf8')).toContain(STUB_MARKER)
  })

  it('short-circuits when <md5>.zip already exists', async () => {
    const { quarantineSkill } = await loadModule()
    const skillDir = path.join(workspace.path, '.claude', 'skills', 'evil')
    mkdirSync(skillDir, { recursive: true })
    writeFileSync(path.join(skillDir, 'SKILL.md'), '# still-malicious')

    const verdict = makeVerdict({ md5: 'c'.repeat(32) })
    const root = rootOf()
    mkdirSync(root, { recursive: true })
    writeFileSync(path.join(root, `${verdict.md5}.zip`), 'sentinel')

    const result = await quarantineSkill({
      skillPath: skillDir,
      isFolder: true,
      md5: verdict.md5,
      origName: 'evil',
      verdict,
      log: silentLog,
    })

    expect(result.status).toBe('already_quarantined')
    expect(readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8')).toBe(
      '# still-malicious'
    )
  })

  // T-492 layer 2 — pre-register the stub's md5 after writeStub so the next
  // heartbeat can't kick off a second quarantine of our own artifact even
  // when the LLM flakes and re-flags the stub MALICIOUS.
  it('pre-registers the stub md5 so a follow-up quarantine of the stub short-circuits', async () => {
    const { quarantineSkill } = await loadModule()
    const skillDir = path.join(workspace.path, '.claude', 'skills', 'evil')
    mkdirSync(skillDir, { recursive: true })
    writeFileSync(path.join(skillDir, 'SKILL.md'), '# original-malicious')

    const verdict = makeVerdict({ md5: 'd'.repeat(32) })
    const first = await quarantineSkill({
      skillPath: skillDir,
      isFolder: true,
      md5: verdict.md5,
      origName: 'evil',
      verdict,
      log: silentLog,
    })
    expect(first.status).toBe('quarantined')

    // Two zips are now in the quarantine root: the archived original
    // (`<original-md5>.zip`) and the stub-md5 sentinel.
    const root = rootOf()
    const zips = readdirSync(root)
      .filter((f) => f.endsWith('.zip') && !f.includes('_tmp_'))
      .sort()
    expect(zips).toHaveLength(2)
    const stubZipName = zips.find((n: string) => !n.startsWith(verdict.md5))!
    const stubMd5 = stubZipName.replace(/\.zip$/, '')
    expect(stubMd5).not.toBe(verdict.md5)

    // Simulate the next heartbeat re-quarantining the stub (e.g. LLM
    // flake): same skillPath (now contains the stub) + the stub's md5.
    // The presence check at the top of `quarantineSkill` MUST hit and
    // skip without rewriting the stub.
    const stubVerdict = makeVerdict({ md5: stubMd5 })
    const second = await quarantineSkill({
      skillPath: skillDir,
      isFolder: true,
      md5: stubMd5,
      origName: 'evil',
      verdict: stubVerdict,
      log: silentLog,
    })
    expect(second.status).toBe('already_quarantined')

    // The stub the user sees is unchanged — no second-generation stub
    // referencing yet another md5 was written.
    const stubAfter = readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8')
    expect(stubAfter).toContain(STUB_MARKER)
    expect(stubAfter).toContain(verdict.md5)
  })

  describe('reconcileAndSweep', () => {
    const backdate = (p: string, minutesAgo: number): void => {
      const t = (Date.now() - minutesAgo * 60_000) / 1000
      utimesSync(p, t, t)
    }
    // UUIDs use hex + dashes only — what TMP_ZIP_REGEX expects.
    const uuidA = '00000000-0000-0000-0000-00000000000a'
    const uuidB = '00000000-0000-0000-0000-00000000000b'

    it('publishes a valid leftover tmp as `<md5>.zip` when no sibling exists', async () => {
      const { reconcileAndSweep } = await loadModule()
      const root = rootOf()
      mkdirSync(root, { recursive: true })

      const md5 = '3'.repeat(32)
      const tmpZip = path.join(root, `${md5}_tmp_${uuidA}.zip`)
      writeFileSync(
        tmpZip,
        makeZipBuffer([{ name: 'evil/SKILL.md', content: '# x' }])
      )

      await reconcileAndSweep(silentLog)

      expect(existsSync(tmpZip)).toBe(false)
      const finalZip = path.join(root, `${md5}.zip`)
      expect(existsSync(finalZip)).toBe(true)
      // Published content is still the same zip bytes.
      expect(new AdmZip(finalZip).getEntries()[0]!.entryName).toBe(
        'evil/SKILL.md'
      )
    })

    it('unlinks a tmp whose `<md5>.zip` sibling already exists', async () => {
      const { reconcileAndSweep } = await loadModule()
      const root = rootOf()
      mkdirSync(root, { recursive: true })

      const md5 = '4'.repeat(32)
      const tmpZip = path.join(root, `${md5}_tmp_${uuidA}.zip`)
      const finalZip = path.join(root, `${md5}.zip`)
      writeFileSync(tmpZip, makeZipBuffer([{ name: 'x', content: 'x' }]))
      writeFileSync(finalZip, 'already-published')

      await reconcileAndSweep(silentLog)

      expect(existsSync(tmpZip)).toBe(false)
      expect(readFileSync(finalZip, 'utf8')).toBe('already-published')
    })

    it('sweeps a stale broken tmp (partial write from crash)', async () => {
      const { reconcileAndSweep } = await loadModule()
      const root = rootOf()
      mkdirSync(root, { recursive: true })

      const md5 = '5'.repeat(32)
      const broken = path.join(root, `${md5}_tmp_${uuidA}.zip`)
      writeFileSync(broken, 'not-a-zip-partial-bytes')
      backdate(broken, 60) // 1h ago

      await reconcileAndSweep(silentLog)

      expect(existsSync(broken)).toBe(false)
      expect(existsSync(path.join(root, `${md5}.zip`))).toBe(false)
    })

    it('leaves a fresh broken tmp alone (may be an in-flight write)', async () => {
      const { reconcileAndSweep } = await loadModule()
      const root = rootOf()
      mkdirSync(root, { recursive: true })

      const md5 = '6'.repeat(32)
      const broken = path.join(root, `${md5}_tmp_${uuidB}.zip`)
      writeFileSync(broken, 'partial')

      await reconcileAndSweep(silentLog)

      expect(existsSync(broken)).toBe(true)
      expect(existsSync(path.join(root, `${md5}.zip`))).toBe(false)
    })

    it('leaves `<md5>.zip` files and unknown entries alone', async () => {
      const { reconcileAndSweep } = await loadModule()
      const root = rootOf()
      mkdirSync(root, { recursive: true })

      const final = path.join(root, `${'7'.repeat(32)}.zip`)
      const unknown = path.join(root, 'README.txt')
      writeFileSync(final, 'committed')
      writeFileSync(unknown, 'notes')

      await reconcileAndSweep(silentLog)

      expect(existsSync(final)).toBe(true)
      expect(existsSync(unknown)).toBe(true)
    })

    it('no-ops when the quarantine root does not exist', async () => {
      const { reconcileAndSweep } = await loadModule()
      await expect(reconcileAndSweep(silentLog)).resolves.toBeUndefined()
    })
  })
})
