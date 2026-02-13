import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { resolveSkillScanInput } from '@mobb/bugsy/commands/scan_skill_input'
import { CliError } from '@mobb/bugsy/utils'
import AdmZip from 'adm-zip'
import { describe, expect, it } from 'vitest'

function createTempDir(files: Record<string, string | Buffer>) {
  const dirPath = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-skill-input-'))

  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(dirPath, relativePath)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    if (typeof content === 'string') {
      fs.writeFileSync(fullPath, content, 'utf-8')
    } else {
      fs.writeFileSync(fullPath, content)
    }
  }

  return {
    dirPath,
    cleanup: () => fs.rmSync(dirPath, { recursive: true, force: true }),
  }
}

describe('resolveSkillScanInput', () => {
  it('returns remote URLs unchanged', async () => {
    const input = 'https://github.com/mobb-dev/example-skill'
    await expect(resolveSkillScanInput(input)).resolves.toBe(input)
  })

  it('packages local directories as zip data URLs', async () => {
    const { dirPath, cleanup } = createTempDir({
      'SKILL.md': '---\nname: local-skill\n---\n# Local skill',
      'scripts/run.sh': '#!/bin/bash\necho hello',
      'references/notes.txt': 'some notes',
    })

    try {
      const resolved = await resolveSkillScanInput(dirPath)
      expect(resolved.startsWith('data:application/zip;base64,')).toBe(true)

      const encoded = resolved.slice('data:application/zip;base64,'.length)
      const zipBuffer = Buffer.from(encoded, 'base64')
      const zip = new AdmZip(zipBuffer)
      const entryNames = zip
        .getEntries()
        .map((entry) => entry.entryName)
        .sort()

      expect(entryNames).toEqual([
        'SKILL.md',
        'references/notes.txt',
        'scripts/run.sh',
      ])
      expect(zip.readAsText('SKILL.md', 'utf-8')).toContain('local-skill')
    } finally {
      cleanup()
    }
  })

  it('rejects local directories that do not contain SKILL.md', async () => {
    const { dirPath, cleanup } = createTempDir({
      'README.md': '# no skill',
    })

    try {
      await expect(resolveSkillScanInput(dirPath)).rejects.toThrow(CliError)
      await expect(resolveSkillScanInput(dirPath)).rejects.toThrow(
        'Local skill directory must contain a SKILL.md file'
      )
    } finally {
      cleanup()
    }
  })

  it('rejects local files and requires a directory path', async () => {
    const { dirPath, cleanup } = createTempDir({
      'SKILL.md': '# only file',
    })

    try {
      const skillMdPath = path.join(dirPath, 'SKILL.md')
      await expect(resolveSkillScanInput(skillMdPath)).rejects.toThrow(CliError)
      await expect(resolveSkillScanInput(skillMdPath)).rejects.toThrow(
        'Local skill input must be a directory containing SKILL.md'
      )
    } finally {
      cleanup()
    }
  })
})
