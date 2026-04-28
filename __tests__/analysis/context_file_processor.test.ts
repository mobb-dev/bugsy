import path from 'node:path'

import AdmZip from 'adm-zip'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { processContextFiles } from '../../src/features/analysis/context_file_processor'
import type {
  ContextFileEntry,
  SkillGroup,
} from '../../src/features/analysis/context_file_scanner'

const mocks = vi.hoisted(() => ({
  sanitize: vi.fn(),
}))

vi.mock('../../src/utils/sanitize-sensitive-data', () => ({
  sanitizeDataWithCounts: mocks.sanitize,
}))

function makeFile(
  absPath: string,
  content: string,
  category = 'rule'
): ContextFileEntry {
  return {
    name: path.basename(absPath),
    path: absPath,
    content,
    sizeBytes: Buffer.byteLength(content, 'utf-8'),
    category,
    mtimeMs: 1000,
  }
}

function makeSkillGroup(
  skillPath: string,
  files: ContextFileEntry[],
  isFolder: boolean
): SkillGroup {
  return {
    name: path.basename(skillPath),
    root: 'home',
    skillPath,
    files,
    isFolder,
    maxMtimeMs: Math.max(...files.map((f) => f.mtimeMs)),
    sessionKey: `skill:home:${path.basename(skillPath)}`,
  }
}

beforeEach(() => {
  // Default: sanitize is a no-op pass-through
  mocks.sanitize.mockImplementation(async (content: string) => ({
    sanitizedData: content,
    counts: { detections: { total: 0 } },
  }))
})

describe('processContextFiles — regular files (no zip)', () => {
  it('returns ProcessedFile entries with sanitized content and MD5', async () => {
    const files = [
      makeFile('/proj/CLAUDE.md', 'hello world'),
      makeFile('/proj/.claude/rules/sec.md', 'rule body'),
    ]

    const { files: result, skills } = await processContextFiles(files, [])

    expect(skills).toHaveLength(0)
    expect(result).toHaveLength(2)

    const r0 = result[0]!
    expect(r0.sanitizedContent).toBe('hello world')
    expect(r0.md5).toMatch(/^[a-f0-9]{32}$/)
    expect(r0.sizeBytes).toBe(Buffer.byteLength('hello world', 'utf-8'))

    // Two different content strings → different MD5s
    expect(result[0]!.md5).not.toBe(result[1]!.md5)
  })

  it('computes MD5 AFTER sanitization (not on raw content)', async () => {
    mocks.sanitize.mockResolvedValue({
      sanitizedData: 'SANITIZED',
      counts: { detections: { total: 1 } },
    })

    const { files: result } = await processContextFiles(
      [makeFile('/proj/secrets.md', 'raw-secret-here')],
      []
    )

    expect(result[0]!.sanitizedContent).toBe('SANITIZED')
    // MD5 is of "SANITIZED", not "raw-secret-here"
    const { createHash } = await import('node:crypto')
    const expected = createHash('md5')
      .update(Buffer.from('SANITIZED', 'utf-8'))
      .digest('hex')
    expect(result[0]!.md5).toBe(expected)
  })

  it('returns empty arrays when both inputs are empty', async () => {
    const { files, skills } = await processContextFiles([], [])
    expect(files).toHaveLength(0)
    expect(skills).toHaveLength(0)
  })
})

describe('processContextFiles — skill groups produce zip buffers', () => {
  it('standalone skill produces a zip with one entry named after the file basename', async () => {
    const file = makeFile(
      '/home/.claude/skills/my-skill.md',
      '# skill',
      'skill'
    )
    const group = makeSkillGroup(
      '/home/.claude/skills/my-skill.md',
      [file],
      false
    )

    const { skills } = await processContextFiles([], [group])

    expect(skills).toHaveLength(1)
    const ps = skills[0]!
    expect(ps.zipBuffer).toBeInstanceOf(Buffer)
    expect(ps.zipBuffer.length).toBeGreaterThan(0)
    expect(ps.md5).toMatch(/^[a-f0-9]{32}$/)

    const zip = new AdmZip(ps.zipBuffer)
    const entries = zip.getEntries().map((e) => e.entryName)
    expect(entries).toHaveLength(1)
    expect(entries[0]).toBe('my-skill.md')
  })

  it('standalone skill zip contains only itself even when a folder skill exists in the same batch', async () => {
    // Simulate what scanContextFiles produces when both skill types coexist:
    // one standalone group (single file) and one folder group (multiple files)
    const standaloneFile = makeFile(
      '/home/.claude/skills/solo.md',
      '# Solo',
      'skill'
    )
    const standaloneGroup = makeSkillGroup(
      '/home/.claude/skills/solo.md',
      [standaloneFile],
      false
    )

    const folderSkillPath = '/home/.claude/skills/big-skill'
    const folderFiles = [
      makeFile(`${folderSkillPath}/SKILL.md`, '# Big', 'skill'),
      makeFile(`${folderSkillPath}/helper.ts`, 'export {}', 'skill'),
      makeFile(`${folderSkillPath}/sub/util.md`, 'util', 'skill'),
    ]
    const folderGroup = makeSkillGroup(folderSkillPath, folderFiles, true)

    const { skills } = await processContextFiles(
      [],
      [standaloneGroup, folderGroup]
    )

    expect(skills).toHaveLength(2)

    const solo = skills.find((s) => s.group.name === 'solo.md')!
    const big = skills.find((s) => s.group.name === 'big-skill')!

    // Standalone zip contains ONLY solo.md — no folder files leak in
    const soloEntries = new AdmZip(solo.zipBuffer)
      .getEntries()
      .map((e) => e.entryName)
    expect(soloEntries).toEqual(['solo.md'])

    // Folder zip contains all 3 folder files — standalone doesn't leak in
    const bigEntries = new AdmZip(big.zipBuffer)
      .getEntries()
      .map((e) => e.entryName)
      .sort()
    expect(bigEntries).toEqual(['SKILL.md', 'helper.ts', 'sub/util.md'])
  })

  it('folder skill produces a zip with entry names relative to the skill root', async () => {
    const skillPath = '/home/.claude/skills/my-skill'
    const files = [
      makeFile(`${skillPath}/SKILL.md`, '# main', 'skill'),
      makeFile(`${skillPath}/helper.ts`, 'export const x = 1', 'skill'),
    ]
    const group = makeSkillGroup(skillPath, files, true)

    const { skills } = await processContextFiles([], [group])

    expect(skills).toHaveLength(1)
    const zip = new AdmZip(skills[0]!.zipBuffer)
    const entries = zip
      .getEntries()
      .map((e) => e.entryName)
      .sort()

    expect(entries).toEqual(['SKILL.md', 'helper.ts'])
  })

  it('folder skill with subfolders preserves the subdirectory path inside the zip', async () => {
    const skillPath = '/home/.claude/skills/deep-skill'
    const files = [
      makeFile(`${skillPath}/main.md`, 'top-level', 'skill'),
      makeFile(`${skillPath}/sub/helper.md`, 'nested', 'skill'),
      makeFile(`${skillPath}/sub/deep/util.ts`, 'very nested', 'skill'),
    ]
    const group = makeSkillGroup(skillPath, files, true)

    const { skills } = await processContextFiles([], [group])

    const zip = new AdmZip(skills[0]!.zipBuffer)
    const entries = zip
      .getEntries()
      .map((e) => e.entryName)
      .sort()

    expect(entries).toEqual(['main.md', 'sub/deep/util.ts', 'sub/helper.md'])
  })

  it('zip entries never start with "../" (no path traversal)', async () => {
    const skillPath = '/home/.claude/skills/my-skill'
    const files = [
      makeFile(`${skillPath}/SKILL.md`, 'content', 'skill'),
      makeFile(`${skillPath}/sub/file.md`, 'nested', 'skill'),
    ]
    const group = makeSkillGroup(skillPath, files, true)

    const { skills } = await processContextFiles([], [group])

    const zip = new AdmZip(skills[0]!.zipBuffer)
    for (const entry of zip.getEntries()) {
      expect(entry.entryName).not.toMatch(/^\.\./)
      expect(entry.entryName).not.toContain('../')
    }
  })

  it('skill zip entry content matches sanitized file content', async () => {
    mocks.sanitize.mockImplementation(async (content: string) => ({
      sanitizedData: `[sanitized:${content}]`,
      counts: { detections: { total: 0 } },
    }))

    const skillPath = '/home/.claude/skills/my-skill'
    const files = [makeFile(`${skillPath}/SKILL.md`, 'raw content', 'skill')]
    const group = makeSkillGroup(skillPath, files, true)

    const { skills } = await processContextFiles([], [group])

    const zip = new AdmZip(skills[0]!.zipBuffer)
    const entry = zip.getEntry('SKILL.md')!
    expect(entry.getData().toString('utf-8')).toBe('[sanitized:raw content]')
  })

  it('skill zip entries are sorted by path for deterministic MD5', async () => {
    const skillPath = '/home/.claude/skills/my-skill'
    // Provide files in reverse alphabetical order
    const files = [
      makeFile(`${skillPath}/z-last.md`, 'z', 'skill'),
      makeFile(`${skillPath}/a-first.md`, 'a', 'skill'),
    ]
    const group = makeSkillGroup(skillPath, files, true)

    const { skills: run1 } = await processContextFiles([], [group])

    // Reverse the file array — MD5 must be identical (sort is internal)
    const groupReversed = { ...group, files: [...files].reverse() }
    const { skills: run2 } = await processContextFiles([], [groupReversed])

    expect(run1[0]!.md5).toBe(run2[0]!.md5)
  })

  it('skill groups with no files are filtered out', async () => {
    const empty = makeSkillGroup('/home/.claude/skills/ghost', [], true)
    const { skills } = await processContextFiles([], [empty])
    expect(skills).toHaveLength(0)
  })
})

describe('processContextFiles — mixed regular files and skills', () => {
  it('regular files are not zipped; skills are zipped', async () => {
    const regular = makeFile('/proj/CLAUDE.md', 'rule', 'rule')
    const skillPath = '/home/.claude/skills/my-skill'
    const skillFile = makeFile(`${skillPath}/SKILL.md`, 'skill', 'skill')
    const group = makeSkillGroup(skillPath, [skillFile], true)

    const { files, skills } = await processContextFiles([regular], [group])

    expect(files).toHaveLength(1)
    expect(files[0]!.sanitizedContent).toBe('rule') // plain string, not a zip
    expect(Buffer.isBuffer(files[0]!.sanitizedContent as unknown)).toBe(false)

    expect(skills).toHaveLength(1)
    expect(skills[0]!.zipBuffer).toBeInstanceOf(Buffer)
    // Zip magic bytes: PK\x03\x04
    expect(skills[0]!.zipBuffer.subarray(0, 4).toString('hex')).toBe('504b0304')
  })
})
