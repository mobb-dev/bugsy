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
      expect(result.skillGroups.some((sg) => sg.name === 's1')).toBe(true)
      // .claude/agents/*.md is intentionally categorized as 'skill' — agents
      // carry system-prompt instructions and are real attack surface, so they
      // ride the same scan/quarantine path as skills.
      expect(result.skillGroups.some((sg) => sg.name === 'agent')).toBe(true)
      // .claude/commands/*.md is NOT a skill (T-491). It must NOT appear in
      // skillGroups; it should be uploaded as a regular file with
      // category 'command' so the server-side scan trigger drops it.
      expect(result.skillGroups.some((sg) => sg.name === 'cmd')).toBe(false)
      const cmdRegular = result.regularFiles.find(
        (f) => f.name === '.claude/commands/cmd.md'
      )
      expect(cmdRegular?.category).toBe('command')
    })

    it('picks up standalone .md files directly in .claude/skills/', async () => {
      await writeFile(
        workspace.path,
        '.claude/skills/standalone_skill.md',
        '# Standalone Skill\nDoes something useful.'
      )
      await writeFile(
        workspace.path,
        '.claude/skills/folder_skill/SKILL.md',
        'folder'
      )

      const result = await scanFull('claude-code')
      const names = result.skillGroups.map((sg) => sg.name)
      expect(names).toContain('standalone_skill')
      expect(names).toContain('folder_skill')
      const standalone = result.skillGroups.find(
        (sg) => sg.name === 'standalone_skill'
      )
      expect(standalone?.isFolder).toBe(false)
      expect(standalone?.files).toHaveLength(1)
    })

    it('picks up standalone .md skill files from home .claude/skills/', async () => {
      await writeFile(
        fakeHome.path,
        '.claude/skills/my_tool.md',
        '# My Tool\nA home-level skill.'
      )

      const result = await scanFull('claude-code')
      const names = result.skillGroups.map((sg) => sg.name)
      expect(names).toContain('my_tool')
      const sg = result.skillGroups.find((sg) => sg.name === 'my_tool')
      expect(sg?.isFolder).toBe(false)
      expect(sg?.root).toBe('home')
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

  describe('skill-bundle enumeration', () => {
    it('uploads all files inside a skill directory (manifest + siblings + nested subfolders)', async () => {
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
      await writeFile(
        workspace.path,
        '.claude/skills/my-skill/templates/foo.py',
        '# nested resource'
      )

      const result = await scanFull('claude-code')
      const mySkill = result.skillGroups.find((sg) => sg.name === 'my-skill')
      expect(mySkill).toBeDefined()
      const allFiles = mySkill!.files
      const names = allFiles.map((f) => f.name)
      const byName = Object.fromEntries(allFiles.map((f) => [f.name, f]))
      expect(byName['.claude/skills/my-skill/SKILL.md']?.category).toBe('skill')
      // Sibling and nested files are now included so the zip pipeline can
      // bundle the full skill directory.
      expect(names).toContain('.claude/skills/my-skill/helper.ts')
      expect(names).toContain('.claude/skills/my-skill/templates/foo.py')
    })

    it('includes standalone .md files AND folder skills under the skills root', async () => {
      // Proper skill with SKILL.md folder
      await writeFile(
        workspace.path,
        '.claude/skills/tracy/SKILL.md',
        'real skill'
      )
      // Standalone .md files are also valid single-file skills
      await writeFile(workspace.path, '.claude/skills/loose-note.md', 'ad hoc')
      await writeFile(
        workspace.path,
        '.claude/skills/another-loose.md',
        'ad hoc'
      )

      const result = await scanFull('claude-code')
      const groupNames = result.skillGroups.map((sg) => sg.name)
      // Folder skill is found
      expect(groupNames).toContain('tracy')
      // Standalone .md files are also found as individual skill groups
      expect(groupNames).toContain('loose-note')
      expect(groupNames).toContain('another-loose')
      // Standalone groups are not folder-based
      expect(
        result.skillGroups.find((sg) => sg.name === 'loose-note')?.isFolder
      ).toBe(false)
    })

    it('includes all files from valid skill dirs but skips dirs without a SKILL.md manifest', async () => {
      // Valid skill with manifest
      await writeFile(
        workspace.path,
        '.claude/skills/good/SKILL.md',
        'manifest'
      )
      await writeFile(
        workspace.path,
        '.claude/skills/good/helper.sh',
        'echo hi'
      )
      // Not a skill — directory exists but has no SKILL.md manifest
      await writeFile(
        workspace.path,
        '.claude/skills/no-manifest/random.md',
        'orphaned'
      )
      await writeFile(
        workspace.path,
        '.claude/skills/no-manifest/other.py',
        'orphaned'
      )

      const result = await scanFull('claude-code')
      const names = result.skillGroups.flatMap((sg) =>
        sg.files.map((f) => f.name)
      )
      expect(names).toContain('.claude/skills/good/SKILL.md')
      // Sibling files of a valid manifest are now included for full zip bundling.
      expect(names).toContain('.claude/skills/good/helper.sh')
      // Directories without a SKILL.md are not valid skill dirs — excluded.
      expect(names).not.toContain('.claude/skills/no-manifest/random.md')
      expect(names).not.toContain('.claude/skills/no-manifest/other.py')
    })

    it('finds a folder skill installed as a directory symlink', async () => {
      // Real skill folder lives outside the .claude/skills directory.
      const realDir = path.join(
        workspace.path,
        'external-skills',
        'linked-skill'
      )
      await fs.mkdir(realDir, { recursive: true })
      await fs.writeFile(path.join(realDir, 'SKILL.md'), '# Linked Skill')
      await fs.writeFile(path.join(realDir, 'helper.ts'), 'export const x = 1')

      // Install the skill as a symlink inside the skills directory.
      const skillsDir = path.join(workspace.path, '.claude', 'skills')
      await fs.mkdir(skillsDir, { recursive: true })
      await fs.symlink(realDir, path.join(skillsDir, 'linked-skill'))

      const result = await scanFull('claude-code')
      const skill = result.skillGroups.find((sg) => sg.name === 'linked-skill')
      expect(skill).toBeDefined()
      expect(skill!.isFolder).toBe(true)
      const fileBasenames = skill!.files.map((f) => path.basename(f.path))
      expect(fileBasenames).toContain('SKILL.md')
      expect(fileBasenames).toContain('helper.ts')
      // skillPath points at the symlink location, not the real directory.
      expect(skill!.skillPath).toContain('linked-skill')
      expect(skill!.skillPath).toContain(skillsDir)
    })

    it('finds a standalone .md skill installed as a file symlink', async () => {
      // Real .md file lives outside the .claude/skills directory.
      const realFile = path.join(workspace.path, 'external-skills', 'solo.md')
      await fs.mkdir(path.dirname(realFile), { recursive: true })
      await fs.writeFile(realFile, '# Solo Skill')

      // Install as a symlink inside the skills directory.
      const skillsDir = path.join(workspace.path, '.claude', 'skills')
      await fs.mkdir(skillsDir, { recursive: true })
      await fs.symlink(realFile, path.join(skillsDir, 'solo.md'))

      const result = await scanFull('claude-code')
      const skill = result.skillGroups.find((sg) => sg.name === 'solo')
      expect(skill).toBeDefined()
      expect(skill!.isFolder).toBe(false)
      // skillPath uses the symlink path so quarantine writes the stub correctly.
      expect(skill!.skillPath).toContain(path.join(skillsDir, 'solo.md'))
    })

    it('skips symlinked directories that have no SKILL.md manifest', async () => {
      // Real folder has no SKILL.md — not a valid skill.
      const realDir = path.join(
        workspace.path,
        'external-skills',
        'not-a-skill'
      )
      await fs.mkdir(realDir, { recursive: true })
      await fs.writeFile(path.join(realDir, 'random.txt'), 'not a skill')

      const skillsDir = path.join(workspace.path, '.claude', 'skills')
      await fs.mkdir(skillsDir, { recursive: true })
      await fs.symlink(realDir, path.join(skillsDir, 'not-a-skill'))

      const result = await scanFull('claude-code')
      const groupNames = result.skillGroups.map((sg) => sg.name)
      expect(groupNames).not.toContain('not-a-skill')
    })
  })

  describe('copilot custom location settings (.vscode/settings.json)', () => {
    it('picks up chat.agentSkillsLocations with object-shape values', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        JSON.stringify({
          'chat.agentSkillsLocations': {
            'my-skills': true,
            'disabled-skills': false,
          },
        })
      )
      await writeFile(workspace.path, 'my-skills/demo/SKILL.md', 'demo skill')
      await writeFile(
        workspace.path,
        'disabled-skills/nope/SKILL.md',
        'should be ignored'
      )

      const result = await scanFull('copilot')
      const allSkillFiles = result.skillGroups.flatMap((sg) => sg.files)
      const paths = allSkillFiles.map((f) => f.path)
      expect(paths.some((p) => p.endsWith('my-skills/demo/SKILL.md'))).toBe(
        true
      )
      expect(
        paths.some((p) => p.endsWith('disabled-skills/nope/SKILL.md'))
      ).toBe(false)
      const skillFile = allSkillFiles.find((f) =>
        f.path.endsWith('my-skills/demo/SKILL.md')
      )
      expect(skillFile!.category).toBe('skill')
    })

    it('supports array-shape, JSONC comments, and trailing commas', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        `{
          // workspace config
          "chat.promptFilesLocations": [
            "custom-prompts", /* inline */
          ],
        }`
      )
      await writeFile(workspace.path, 'custom-prompts/greet.prompt.md', 'hi')

      const result = await scanFull('copilot')
      // Prompt files use category 'prompt' since T-491; they go through
      // regularFiles, not skillGroups, so the server-side scan trigger
      // skips them.
      const entry = result.regularFiles.find((f) =>
        f.path.endsWith('custom-prompts/greet.prompt.md')
      )
      expect(entry).toBeDefined()
      expect(entry!.category).toBe('prompt')
    })

    it('resolves the workspaceFolder variable and home-relative paths', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        JSON.stringify({
          'chat.instructionsFilesLocations': {
            '${workspaceFolder}/ws-rules': true,
            '~/home-rules': true,
          },
        })
      )
      await writeFile(
        workspace.path,
        'ws-rules/a.instructions.md',
        'workspace rule'
      )
      await writeFile(
        fakeHome.path,
        'home-rules/b.instructions.md',
        'home rule'
      )

      const files = await scan('copilot')
      const wsMatch = files.find((f) =>
        f.path.endsWith('ws-rules/a.instructions.md')
      )
      const homeMatch = files.find((f) =>
        f.path.endsWith('home-rules/b.instructions.md')
      )
      expect(wsMatch).toBeDefined()
      expect(wsMatch!.category).toBe('rule')
      expect(homeMatch).toBeDefined()
      expect(homeMatch!.category).toBe('rule')
    })

    it('is a no-op when .vscode/settings.json is missing or malformed — static entries still scan', async () => {
      // Malformed JSON plus a static copilot entry + a file that would only
      // be returned if the broken settings got parsed.
      await writeFile(workspace.path, '.vscode/settings.json', '{ not json')
      await writeFile(
        workspace.path,
        '.github/copilot-instructions.md',
        'static copilot rule'
      )
      await writeFile(workspace.path, 'stealth/a/SKILL.md', 'should not load')

      const files = await scan('copilot')
      const names = files.map((f) => f.name)
      expect(names).toContain('.github/copilot-instructions.md')
      expect(files.some((f) => f.path.endsWith('stealth/a/SKILL.md'))).toBe(
        false
      )
    })

    it('ignores custom locations for non-copilot platforms', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        JSON.stringify({
          'chat.agentSkillsLocations': { 'my-skills': true },
        })
      )
      await writeFile(workspace.path, 'my-skills/a/SKILL.md', 'skill')
      const files = await scan('claude-code')
      expect(files.some((f) => f.path.endsWith('my-skills/a/SKILL.md'))).toBe(
        false
      )
    })
  })

  describe('claude-code autoMemoryDirectory override', () => {
    it('honors autoMemoryDirectory from ~/.claude/settings.json', async () => {
      await writeFile(
        fakeHome.path,
        '.claude/settings.json',
        JSON.stringify({ autoMemoryDirectory: '~/custom-memory' })
      )
      await writeFile(
        fakeHome.path,
        'custom-memory/proj-hash/memory/MEMORY.md',
        'index'
      )
      await writeFile(
        fakeHome.path,
        'custom-memory/proj-hash/memory/user.md',
        'user memory'
      )

      const files = await scan('claude-code')
      const memoryPaths = files
        .filter((f) => f.category === 'memory')
        .map((f) => f.path)
      expect(
        memoryPaths.some((p) =>
          p.endsWith('custom-memory/proj-hash/memory/MEMORY.md')
        )
      ).toBe(true)
      expect(
        memoryPaths.some((p) =>
          p.endsWith('custom-memory/proj-hash/memory/user.md')
        )
      ).toBe(true)
    })

    it('falls back to default path when autoMemoryDirectory is absent', async () => {
      await writeFile(
        fakeHome.path,
        '.claude/settings.json',
        JSON.stringify({ theme: 'dark' })
      )
      await writeFile(
        fakeHome.path,
        '.claude/projects/proj-hash/memory/MEMORY.md',
        'default content'
      )
      const files = await scan('claude-code')
      const memoryFiles = files.filter((f) => f.category === 'memory')
      expect(memoryFiles.length).toBe(1)
      expect(memoryFiles[0]!.name).toBe(
        '.claude/projects/proj-hash/memory/MEMORY.md'
      )
      expect(memoryFiles[0]!.content).toBe('default content')
    })

    it('ignores autoMemoryDirectory declared in workspace settings (user-only key)', async () => {
      await writeFile(
        workspace.path,
        '.claude/settings.json',
        JSON.stringify({ autoMemoryDirectory: '~/should-not-scan' })
      )
      await writeFile(
        fakeHome.path,
        'should-not-scan/proj/memory/MEMORY.md',
        'nope'
      )
      const files = await scan('claude-code')
      expect(
        files.some((f) =>
          f.path.endsWith('should-not-scan/proj/memory/MEMORY.md')
        )
      ).toBe(false)
    })

    it('narrow glob rejects stray markdown outside the memory/ convention', async () => {
      await writeFile(
        fakeHome.path,
        '.claude/settings.json',
        JSON.stringify({ autoMemoryDirectory: '~/custom-memory' })
      )
      // Matches the `*/memory/*.md` pattern
      await writeFile(
        fakeHome.path,
        'custom-memory/proj/memory/MEMORY.md',
        'ok'
      )
      // Does NOT match — at the override root, or one level deep without memory/
      await writeFile(fakeHome.path, 'custom-memory/README.md', 'skip me')
      await writeFile(fakeHome.path, 'custom-memory/proj/notes.md', 'skip me')

      const files = await scan('claude-code')
      const memoryNames = files
        .filter((f) => f.category === 'memory')
        .map((f) => f.path)
      expect(
        memoryNames.some((p) =>
          p.endsWith('custom-memory/proj/memory/MEMORY.md')
        )
      ).toBe(true)
      expect(
        memoryNames.some((p) => p.endsWith('custom-memory/README.md'))
      ).toBe(false)
      expect(
        memoryNames.some((p) => p.endsWith('custom-memory/proj/notes.md'))
      ).toBe(false)
    })
  })

  describe('security containment — hostile .vscode/settings.json', () => {
    it('refuses sensitive home subdirectories (~/.ssh, ~/.aws, ~/.config)', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        JSON.stringify({
          'chat.agentSkillsLocations': {
            '~/.ssh': true,
            '~/.aws': true,
            '~/.config': true,
          },
        })
      )
      await writeFile(fakeHome.path, '.ssh/id_rsa', 'SECRET KEY')
      await writeFile(fakeHome.path, '.aws/credentials', 'aws secret')
      await writeFile(fakeHome.path, '.config/important', 'config')

      const files = await scan('copilot')
      const paths = files.map((f) => f.path)
      expect(paths.some((p) => p.includes('/.ssh/'))).toBe(false)
      expect(paths.some((p) => p.includes('/.aws/'))).toBe(false)
      expect(paths.some((p) => p.includes('/.config/'))).toBe(false)
    })

    it('refuses filesystem root and bare $HOME', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        JSON.stringify({
          'chat.agentSkillsLocations': { '/': true, '~': true },
        })
      )
      await writeFile(workspace.path, 'file.md', 'inside workspace')

      const files = await scan('copilot')
      // Should not walk '/' or $HOME — resulting files must all be inside
      // workspaceRoot (from static globs) or none.
      for (const f of files) {
        expect(f.path.startsWith(workspace.path)).toBe(true)
      }
    })

    it('refuses ..-escape via the workspaceFolder variable', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        JSON.stringify({
          'chat.agentSkillsLocations': {
            '${workspaceFolder}/../../../etc': true,
          },
        })
      )
      await writeFile(workspace.path, 'src/a.md', 'inside')
      const files = await scan('copilot')
      for (const f of files) {
        expect(f.path.startsWith(workspace.path)).toBe(true)
      }
    })

    it('refuses `~foo` (no slash — POSIX other-user syntax)', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        JSON.stringify({
          'chat.agentSkillsLocations': { '~someuser/skills': true },
        })
      )
      // Create the weird literal directory to prove we don't silently scan it
      // as workspace-relative (historical behavior).
      await writeFile(
        workspace.path,
        '~someuser/skills/secret.md',
        'should not load'
      )
      const files = await scan('copilot')
      expect(
        files.some((f) => f.path.endsWith('~someuser/skills/secret.md'))
      ).toBe(false)
    })

    it('category-specific glob filters non-instruction files from chat.instructionsFilesLocations', async () => {
      await writeFile(
        workspace.path,
        '.vscode/settings.json',
        JSON.stringify({
          'chat.instructionsFilesLocations': { docs: true },
        })
      )
      await writeFile(workspace.path, 'docs/foo.instructions.md', 'rule')
      await writeFile(workspace.path, 'docs/random.png', 'binary')
      await writeFile(workspace.path, 'docs/other.md', 'not an instruction')

      const files = await scan('copilot')
      const docs = files.filter((f) => f.path.includes('/docs/'))
      const names = docs.map((f) => f.name)
      expect(names).toContain('foo.instructions.md')
      expect(docs.some((f) => f.path.endsWith('random.png'))).toBe(false)
      expect(docs.some((f) => f.path.endsWith('other.md'))).toBe(false)
    })

    it('stamps scope=user-global on home-rooted entries', async () => {
      await writeFile(fakeHome.path, '.claude/CLAUDE.md', 'global')
      const files = await scan('claude-code')
      const homeFile = files.find((f) => f.path.includes(fakeHome.path))
      expect(homeFile).toBeDefined()
      expect(homeFile!.scope).toBe('user-global')
    })

    it('leaves scope undefined on workspace-rooted entries (server infers)', async () => {
      await writeFile(workspace.path, 'CLAUDE.md', 'project')
      const files = await scan('claude-code')
      const wsFile = files.find((f) => f.name === 'CLAUDE.md')
      expect(wsFile).toBeDefined()
      expect(wsFile!.scope).toBeUndefined()
    })
  })

  describe('groupSkills behavior', () => {
    it('copilot .github/prompts/*.prompt.md are categorized as prompt, not as skills (T-491)', async () => {
      await writeFile(
        workspace.path,
        '.github/prompts/my-prompt.prompt.md',
        'prompt content'
      )

      const result = await scanFull('copilot')
      // Prompts must NOT enter the skill pipeline — that was the upstream
      // cause of the 2026-04-28 production loop. They go through regular
      // file upload with category 'prompt' so the server-side trigger drops
      // them.
      expect(result.skillGroups.length).toBe(0)
      const prompt = result.regularFiles.find((f) =>
        f.path.includes('my-prompt.prompt.md')
      )
      expect(prompt).toBeDefined()
      expect(prompt!.category).toBe('prompt')
    })

    it('copilot .github/chatmodes/*.chatmode.md are treated as agent-config (not skills)', async () => {
      await writeFile(
        workspace.path,
        '.github/chatmodes/pair-program.chatmode.md',
        'chatmode content'
      )

      const result = await scanFull('copilot')
      // Chatmodes are agent-config, not skills — they appear in regularFiles, not skillGroups.
      expect(result.skillGroups.length).toBe(0)
      const chatmodeFile = result.regularFiles.find((f) =>
        f.path.includes('pair-program.chatmode.md')
      )
      expect(chatmodeFile).toBeDefined()
      expect(chatmodeFile!.category).toBe('agent-config')
    })

    it('folder skill with subfolders has skillPath pointing at skill root, not a subfolder', async () => {
      await writeFile(
        workspace.path,
        '.claude/skills/deep-skill/SKILL.md',
        'skill manifest'
      )
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
      expect(skill!.files.length).toBe(3)
      // skillPath must be the root of the skill folder, not any sub-directory
      expect(skill!.skillPath).toMatch(/deep-skill$/)
      // All files should be relative to the skill root (no "../" entries)
      for (const f of skill!.files) {
        const rel = f.path.replace(skill!.skillPath + '/', '')
        expect(rel).not.toMatch(/^\.\./)
      }
    })

    it('standalone .md files under .claude/skills/ create their own skill groups', async () => {
      await writeFile(
        workspace.path,
        '.claude/skills/solo-skill.md',
        'standalone skill'
      )
      // A valid skill dir should still work alongside standalone files
      await writeFile(
        workspace.path,
        '.claude/skills/real-skill/SKILL.md',
        'real skill'
      )

      const result = await scanFull('claude-code')
      // Standalone .md creates a non-folder skill group
      const standalone = result.skillGroups.find(
        (sg) => sg.name === 'solo-skill'
      )
      expect(standalone).toBeDefined()
      expect(standalone!.isFolder).toBe(false)
      // Folder-based skill is still found
      const realSkill = result.skillGroups.find(
        (sg) => sg.name === 'real-skill'
      )
      expect(realSkill).toBeDefined()
      expect(realSkill!.isFolder).toBe(true)
    })
  })
})
