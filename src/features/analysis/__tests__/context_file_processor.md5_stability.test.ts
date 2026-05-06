import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let workspace: tmp.DirectoryResult
let fakeHome: tmp.DirectoryResult

async function loadModules() {
  vi.resetModules()
  vi.doMock('node:os', async () => {
    const actual = await vi.importActual<typeof import('node:os')>('node:os')
    return { ...actual, homedir: () => fakeHome.path }
  })
  const { processContextFiles } = await import('../context_file_processor')
  const { scanContextFiles } = await import('../context_file_scanner')
  return { processContextFiles, scanContextFiles }
}

describe('processContextFiles — md5 stability (T-496)', () => {
  beforeEach(async () => {
    workspace = await tmp.dir({ unsafeCleanup: true })
    fakeHome = await tmp.dir({ unsafeCleanup: true })
  })

  afterEach(async () => {
    await workspace.cleanup()
    await fakeHome.cleanup()
    vi.resetModules()
    vi.doUnmock('node:os')
  })

  it('produces a stable md5 across scans when the same skill is installed under two scan roots', async () => {
    // Cursor users routinely have a skill present under multiple scan roots
    // (the cursor SCAN_PATHS list includes .cursor/skills, .agents/skills,
    // .claude/skills, .codex/skills — all marked root=workspace). When the
    // same skill name appears in two of them, groupSkills currently collapses
    // both into a single SkillGroup, processContextFiles emits a duplicate
    // zip entry whose mtime escapes the epoch fix, and the resulting md5
    // drifts between scans even though the file contents are identical.
    const skillContent =
      '# web-design-guidelines\nfetch and execute remote rules\n'
    for (const root of ['.agents', '.claude']) {
      const dir = path.join(
        workspace.path,
        root,
        'skills',
        'web-design-guidelines'
      )
      mkdirSync(dir, { recursive: true })
      writeFileSync(path.join(dir, 'SKILL.md'), skillContent)
    }

    const { processContextFiles, scanContextFiles } = await loadModules()

    const { skillGroups } = await scanContextFiles(workspace.path, 'cursor')
    expect(skillGroups.length).toBeGreaterThan(0)

    const run1 = await processContextFiles([], skillGroups)
    // DOS time encoded in zip entry headers has 2-second resolution. Wait long
    // enough that a second `new AdmZip()` build inside processContextFiles
    // would stamp a different mtime if the epoch fix doesn't apply to every
    // entry.
    await sleep(2100)
    const run2 = await processContextFiles([], skillGroups)

    const md5s1 = run1.skills.map((s) => s.md5).sort()
    const md5s2 = run2.skills.map((s) => s.md5).sort()
    expect(md5s1.length).toBeGreaterThan(0)
    expect(md5s1).toEqual(md5s2)
  })
})
