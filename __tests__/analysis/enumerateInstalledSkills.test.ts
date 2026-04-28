import fs from 'node:fs/promises'
import path from 'node:path'

import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// processContextFiles calls sanitizeDataWithCounts; stub it out so the test
// does not depend on the real sanitizer binary.
vi.mock('../../src/utils/sanitize-sensitive-data', () => ({
  sanitizeDataWithCounts: async (content: string) => ({
    sanitizedData: content,
    counts: { detections: { total: 0 } },
  }),
}))

describe('enumerateInstalledSkills', () => {
  let workspace: tmp.DirectoryResult
  let fakeHome: tmp.DirectoryResult

  beforeEach(async () => {
    workspace = await tmp.dir({ unsafeCleanup: true })
    fakeHome = await tmp.dir({ unsafeCleanup: true })
    vi.doMock('node:os', async () => {
      const actual = await vi.importActual<typeof import('node:os')>('node:os')
      return { ...actual, homedir: () => fakeHome.path }
    })
    vi.resetModules()
  })

  afterEach(async () => {
    await workspace.cleanup()
    await fakeHome.cleanup()
    vi.resetModules()
    vi.doUnmock('node:os')
  })

  async function loadModule() {
    return import('../../src/features/analysis/skill_quarantine/enumerateInstalledSkills')
  }

  it('includes home-level agent-config files as quarantine candidates', async () => {
    const agentDir = path.join(fakeHome.path, '.claude', 'agents')
    await fs.mkdir(agentDir, { recursive: true })
    await fs.writeFile(
      path.join(agentDir, 'my-agent.md'),
      '# My Agent\n\nA custom agent.'
    )

    const { enumerateInstalledSkills } = await loadModule()
    const result = await enumerateInstalledSkills(workspace.path)

    const agentEntry = result.find((s) => s.origName === 'my-agent.md')
    expect(agentEntry).toBeDefined()
    expect(agentEntry!.isFolder).toBe(false)
    expect(agentEntry!.md5).toBeTruthy()
    expect(agentEntry!.skillPath).toContain('my-agent.md')
  })

  it('includes workspace-level agent-config files as quarantine candidates', async () => {
    const agentDir = path.join(workspace.path, '.claude', 'agents')
    await fs.mkdir(agentDir, { recursive: true })
    await fs.writeFile(
      path.join(agentDir, 'project-agent.md'),
      '# Project Agent\n\nWorkspace-scoped.'
    )

    const { enumerateInstalledSkills } = await loadModule()
    const result = await enumerateInstalledSkills(workspace.path)

    const agentEntry = result.find((s) => s.origName === 'project-agent.md')
    expect(agentEntry).toBeDefined()
    expect(agentEntry!.isFolder).toBe(false)
    expect(agentEntry!.md5).toBeTruthy()
  })

  it('regular folder skills are still included alongside agent configs', async () => {
    const skillDir = path.join(workspace.path, '.claude', 'skills', 'my-skill')
    await fs.mkdir(skillDir, { recursive: true })
    await fs.writeFile(path.join(skillDir, 'SKILL.md'), '# My Skill')

    const agentDir = path.join(workspace.path, '.claude', 'agents')
    await fs.mkdir(agentDir, { recursive: true })
    await fs.writeFile(path.join(agentDir, 'co-agent.md'), '# Co Agent')

    const { enumerateInstalledSkills } = await loadModule()
    const result = await enumerateInstalledSkills(workspace.path)

    const skillEntry = result.find((s) => s.origName === 'my-skill')
    expect(skillEntry).toBeDefined()
    expect(skillEntry!.isFolder).toBe(true)

    const agentEntry = result.find((s) => s.origName === 'co-agent.md')
    expect(agentEntry).toBeDefined()
    expect(agentEntry!.isFolder).toBe(false)
  })

  it('returns empty when no skills or agent configs are present', async () => {
    const { enumerateInstalledSkills } = await loadModule()
    const result = await enumerateInstalledSkills(workspace.path)
    expect(result).toEqual([])
  })
})
