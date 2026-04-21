import fs from 'node:fs/promises'
import path from 'node:path'

import tmp from 'tmp-promise'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Scanner is imported dynamically inside the `scan()` helper below so that
// the `vi.doMock('node:os', ...)` hook can take effect via vi.resetModules().

async function writeFile(dir: string, relPath: string, content: string) {
  const fullPath = path.join(dir, relPath)
  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  await fs.writeFile(fullPath, content, 'utf-8')
  return fullPath
}

describe('scanContextFiles', () => {
  let workspace: tmp.DirectoryResult
  let fakeHome: tmp.DirectoryResult

  beforeEach(async () => {
    workspace = await tmp.dir({ unsafeCleanup: true })
    fakeHome = await tmp.dir({ unsafeCleanup: true })
    // Redirect homedir() to our fake home
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

  async function scan(platform: string) {
    const { scanContextFiles: fresh } =
      await import('../../src/features/analysis/context_file_scanner')
    const result = await fresh(workspace.path, platform)
    return result.regularFiles
  }

  async function scanFull(platform: string) {
    const { scanContextFiles: fresh } =
      await import('../../src/features/analysis/context_file_scanner')
    return fresh(workspace.path, platform)
  }

  describe('platform isolation', () => {
    it('returns empty for unknown platform', async () => {
      await writeFile(workspace.path, 'CLAUDE.md', 'hi')
      const files = await scan('windsurf')
      expect(files).toEqual([])
    })

    it('claude-code does not return Cursor or Copilot files', async () => {
      await writeFile(workspace.path, '.cursorrules', 'cursor rule')
      await writeFile(
        workspace.path,
        '.github/copilot-instructions.md',
        'copilot'
      )
      await writeFile(workspace.path, 'CLAUDE.md', 'claude')
      const files = await scan('claude-code')
      const names = files.map((f) => f.name)
      expect(names).toContain('CLAUDE.md')
      expect(names).not.toContain('.cursorrules')
      expect(names).not.toContain('.github/copilot-instructions.md')
    })

    it('cursor does not return Claude Code files', async () => {
      await writeFile(workspace.path, 'CLAUDE.md', 'claude')
      await writeFile(workspace.path, '.cursorrules', 'cursor rule')
      await writeFile(workspace.path, '.cursor/rules/foo.mdc', 'rule')
      const files = await scan('cursor')
      const names = files.map((f) => f.name)
      expect(names).toContain('.cursorrules')
      expect(names).toContain('.cursor/rules/foo.mdc')
      expect(names).not.toContain('CLAUDE.md')
    })
  })

  describe('claude-code globs', () => {
    it('matches workspace CLAUDE.md at root', async () => {
      await writeFile(workspace.path, 'CLAUDE.md', 'root claude')
      const files = await scan('claude-code')
      const claude = files.find((f) => f.name === 'CLAUDE.md')
      expect(claude).toBeDefined()
      expect(claude!.content).toBe('root claude')
      expect(claude!.category).toBe('rule')
    })

    it('recursively matches .claude/rules/**/*.md', async () => {
      await writeFile(workspace.path, '.claude/rules/a.md', 'a')
      await writeFile(workspace.path, '.claude/rules/nested/b.md', 'b')
      await writeFile(workspace.path, '.claude/rules/deep/x/c.md', 'c')
      // Non-matching file in same dir
      await writeFile(workspace.path, '.claude/rules/foo.txt', 'skip')

      const files = await scan('claude-code')
      const names = files.map((f) => f.name).sort()
      expect(names).toContain('.claude/rules/a.md')
      expect(names).toContain('.claude/rules/nested/b.md')
      expect(names).toContain('.claude/rules/deep/x/c.md')
      expect(names).not.toContain('.claude/rules/foo.txt')
    })

    it('matches skills, commands, agents', async () => {
      await writeFile(workspace.path, '.claude/skills/s1/SKILL.md', 's1')
      await writeFile(workspace.path, '.claude/commands/cmd.md', 'cmd')
      await writeFile(workspace.path, '.claude/agents/agent.md', 'a')

      const result = await scanFull('claude-code')
      // Skill folder files land in skillGroups, not regularFiles
      expect(result.skillGroups.length).toBeGreaterThanOrEqual(1)
      expect(result.skillGroups.some((sg) => sg.name === 's1')).toBe(true)
      const byName = Object.fromEntries(
        result.regularFiles.map((f) => [f.name, f])
      )
      expect(byName['.claude/commands/cmd.md']?.category).toBe('command')
      expect(byName['.claude/agents/agent.md']?.category).toBe('agent-config')
    })

    it('matches config files', async () => {
      await writeFile(workspace.path, '.claude/settings.json', '{}')
      await writeFile(workspace.path, '.mcp.json', '{}')

      const files = await scan('claude-code')
      const byName = Object.fromEntries(files.map((f) => [f.name, f]))
      expect(byName['.claude/settings.json']?.category).toBe('config')
      expect(byName['.mcp.json']?.category).toBe('mcp-config')
    })
  })

  describe('home-rooted globs', () => {
    it('resolves .claude/CLAUDE.md against home dir', async () => {
      await writeFile(fakeHome.path, '.claude/CLAUDE.md', 'global claude')
      // Also write workspace CLAUDE.md so we can tell them apart
      await writeFile(workspace.path, 'CLAUDE.md', 'project claude')

      const files = await scan('claude-code')
      const homeClaudeMd = files.find((f) => f.path.includes(fakeHome.path))
      expect(homeClaudeMd).toBeDefined()
      expect(homeClaudeMd!.content).toBe('global claude')

      const projectClaudeMd = files.find((f) => f.path.includes(workspace.path))
      expect(projectClaudeMd!.content).toBe('project claude')
    })

    it('finds memory files under .claude/projects/*/memory/', async () => {
      await writeFile(
        fakeHome.path,
        '.claude/projects/proj-hash/memory/MEMORY.md',
        'index'
      )
      await writeFile(
        fakeHome.path,
        '.claude/projects/proj-hash/memory/user.md',
        'user memory'
      )

      const files = await scan('claude-code')
      const memoryFiles = files.filter((f) => f.category === 'memory')
      expect(memoryFiles.length).toBe(2)
    })
  })

  describe('graceful failure', () => {
    it('returns empty array when workspace has no matching files', async () => {
      const files = await scan('claude-code')
      expect(files).toEqual([])
    })

    it("doesn't throw when directories are missing", async () => {
      // No .claude/, no CLAUDE.md, just an unrelated file
      await writeFile(workspace.path, 'src/index.ts', 'console.log(1)')
      await expect(scan('claude-code')).resolves.toEqual([])
    })

    it('ignores .git directories when recursing', async () => {
      await writeFile(workspace.path, '.git/hooks/README.md', 'should skip')
      await writeFile(workspace.path, 'CLAUDE.md', 'ok')
      const files = await scan('claude-code')
      const names = files.map((f) => f.name)
      expect(names).toContain('CLAUDE.md')
      expect(names).not.toContain('.git/hooks/README.md')
    })

    it('dedupes files matched by multiple globs by absolute path', async () => {
      // .claude/rules/**/*.md matches both workspace and home config,
      // but with the same absolute path the scanner dedupes
      await writeFile(workspace.path, '.claude/rules/foo.md', 'once')
      const files = await scan('claude-code')
      const fooMatches = files.filter((f) => f.path.endsWith('foo.md'))
      expect(fooMatches.length).toBe(1)
    })
  })

  describe('content integrity', () => {
    it('returns UTF-8 content and correct byte size', async () => {
      const content = '# Rules — with emoji 🚀 and unicode ñ\n\nBody'
      await writeFile(workspace.path, 'CLAUDE.md', content)
      const files = await scan('claude-code')
      const entry = files.find((f) => f.name === 'CLAUDE.md')
      expect(entry!.content).toBe(content)
      expect(entry!.sizeBytes).toBe(Buffer.byteLength(content, 'utf-8'))
    })

    it('exposes absolute path', async () => {
      await writeFile(workspace.path, 'CLAUDE.md', 'x')
      const files = await scan('claude-code')
      expect(files[0]!.path).toBe(path.join(workspace.path, 'CLAUDE.md'))
    })
  })

  describe('file size limit', () => {
    it('excludes files larger than 20 MB', async () => {
      // 20 MB + 1 byte — should be excluded
      const oversized = 'x'.repeat(20 * 1024 * 1024 + 1)
      await writeFile(workspace.path, 'CLAUDE.md', oversized)
      const files = await scan('claude-code')
      expect(files.find((f) => f.name === 'CLAUDE.md')).toBeUndefined()
    })

    it('includes files under 20 MB', async () => {
      // 19 MB — should be included
      const underLimit = 'x'.repeat(19 * 1024 * 1024)
      await writeFile(workspace.path, 'CLAUDE.md', underLimit)
      const files = await scan('claude-code')
      expect(files.find((f) => f.name === 'CLAUDE.md')).toBeDefined()
    })
  })

  describe('isFile check', () => {
    it('skips directories that match a context file name', async () => {
      // Create a directory named CLAUDE.md instead of a file
      const dirPath = path.join(workspace.path, 'CLAUDE.md')
      await fs.mkdir(dirPath, { recursive: true })

      const files = await scan('claude-code')
      expect(files.find((f) => f.name === 'CLAUDE.md')).toBeUndefined()
    })
  })

  describe('mtimeMs field', () => {
    it('returns entries with a positive numeric mtimeMs', async () => {
      await writeFile(workspace.path, 'CLAUDE.md', 'hello')
      await writeFile(workspace.path, '.claude/rules/a.md', 'rule a')

      const files = await scan('claude-code')
      expect(files.length).toBeGreaterThanOrEqual(2)
      for (const f of files) {
        expect(typeof f.mtimeMs).toBe('number')
        expect(f.mtimeMs).toBeGreaterThan(0)
      }
    })
  })

  describe('per-session mtime tracking', () => {
    // These tests need the SAME module instance across calls to preserve
    // the sessionMtimes Map, so we import once and reuse.
    it('tracks upload state per session and detects changes', async () => {
      vi.resetModules()
      const mod =
        await import('../../src/features/analysis/context_file_scanner')

      await writeFile(workspace.path, 'CLAUDE.md', 'original')
      await writeFile(workspace.path, '.claude/rules/a.md', 'rule a')

      // First scan — returns all files
      const first = await mod.scanContextFiles(
        workspace.path,
        'claude-code',
        'sess-1'
      )
      expect(first.regularFiles.length).toBeGreaterThanOrEqual(2)

      // Mark as uploaded
      mod.markContextFilesUploaded(
        'sess-1',
        first.regularFiles,
        first.skillGroups
      )

      // Rescan same session — nothing changed, should be empty
      const second = await mod.scanContextFiles(
        workspace.path,
        'claude-code',
        'sess-1'
      )
      expect(second.regularFiles).toEqual([])

      // Touch one file by rewriting it (updates mtime)
      // Small delay to ensure mtime differs
      await new Promise((r) => setTimeout(r, 50))
      await fs.writeFile(
        path.join(workspace.path, 'CLAUDE.md'),
        'modified',
        'utf-8'
      )

      // Rescan same session — only the touched file should appear
      const third = await mod.scanContextFiles(
        workspace.path,
        'claude-code',
        'sess-1'
      )
      expect(third.regularFiles.length).toBe(1)
      expect(third.regularFiles[0]!.name).toBe('CLAUDE.md')
      expect(third.regularFiles[0]!.content).toBe('modified')

      // Different session should see ALL files (it has no upload history)
      const differentSession = await mod.scanContextFiles(
        workspace.path,
        'claude-code',
        'sess-2'
      )
      expect(differentSession.regularFiles.length).toBeGreaterThanOrEqual(2)
      const names = differentSession.regularFiles.map((f) => f.name).sort()
      expect(names).toContain('CLAUDE.md')
      expect(names).toContain('.claude/rules/a.md')
    })
  })

  describe('skills glob matching', () => {
    it('matches all files under .claude/skills/**/* as a skill group', async () => {
      await writeFile(
        workspace.path,
        '.claude/skills/my-skill/SKILL.md',
        'skill content'
      )
      await writeFile(
        workspace.path,
        '.claude/skills/my-skill/helper.ts',
        'export const x = 1'
      )

      const result = await scanFull('claude-code')
      const mySkill = result.skillGroups.find((sg) => sg.name === 'my-skill')
      expect(mySkill).toBeDefined()
      expect(mySkill!.isFolder).toBe(true)
      const fileNames = mySkill!.files.map((f) => f.name).sort()
      expect(fileNames).toContain('.claude/skills/my-skill/SKILL.md')
      expect(fileNames).toContain('.claude/skills/my-skill/helper.ts')
    })

    it('copilot .github/prompts/*.prompt.md are treated as standalone skills (no skills/ dir)', async () => {
      await writeFile(
        workspace.path,
        '.github/prompts/my-prompt.prompt.md',
        'prompt content'
      )

      const result = await scanFull('copilot')
      expect(result.skillGroups.length).toBe(1)
      const skill = result.skillGroups[0]!
      expect(skill.name).toBe('my-prompt.prompt')
      expect(skill.isFolder).toBe(false)
      expect(skill.files.length).toBe(1)
    })

    it('copilot .github/chatmodes/*.chatmode.md are treated as standalone skills', async () => {
      await writeFile(
        workspace.path,
        '.github/chatmodes/pair-program.chatmode.md',
        'chatmode content'
      )

      const result = await scanFull('copilot')
      expect(result.skillGroups.length).toBe(1)
      const skill = result.skillGroups[0]!
      expect(skill.name).toBe('pair-program.chatmode')
      expect(skill.isFolder).toBe(false)
    })

    it('workspace path containing "skills/" does not interfere with copilot skill detection', async () => {
      // Even if the workspace root itself contains 'skills/' in its path,
      // copilot prompt files (no skills/ dir in relative path) should be standalone.
      await writeFile(workspace.path, '.github/prompts/test.prompt.md', 'test')

      const result = await scanFull('copilot')
      const skill = result.skillGroups.find((sg) => sg.name === 'test.prompt')
      expect(skill).toBeDefined()
      expect(skill!.isFolder).toBe(false)
    })

    it('folder skill with subfolders has skillPath pointing at skill root, not a subfolder', async () => {
      await writeFile(
        workspace.path,
        '.claude/skills/deep-skill/main.md',
        'main content'
      )
      await writeFile(
        workspace.path,
        '.claude/skills/deep-skill/sub/helper.md',
        'helper content'
      )

      const result = await scanFull('claude-code')
      const skill = result.skillGroups.find((sg) => sg.name === 'deep-skill')
      expect(skill).toBeDefined()
      expect(skill!.isFolder).toBe(true)
      expect(skill!.files.length).toBe(2)
      // skillPath must be the root of the skill folder, not any sub-directory
      expect(skill!.skillPath).toMatch(/deep-skill$/)
      // All files should be relative to the skill root (no "../" entries)
      for (const f of skill!.files) {
        const rel = f.path.replace(skill!.skillPath + '/', '')
        expect(rel).not.toMatch(/^\.\./)
      }
    })

    it('standalone .claude/skills/*.md is treated as standalone (not folder) skill', async () => {
      await writeFile(
        workspace.path,
        '.claude/skills/solo-skill.md',
        'standalone skill'
      )

      const result = await scanFull('claude-code')
      const skill = result.skillGroups.find((sg) => sg.name === 'solo-skill')
      expect(skill).toBeDefined()
      expect(skill!.isFolder).toBe(false)
      expect(skill!.files.length).toBe(1)
    })
  })
})
