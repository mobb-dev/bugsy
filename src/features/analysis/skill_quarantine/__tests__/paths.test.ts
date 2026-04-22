import { homedir } from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  getQuarantinedHashDir,
  getQuarantinedTargetPath,
  getQuarantineRoot,
  getStagingDir,
  STAGING_DIR_REGEX,
} from '../paths'

describe('skill_quarantine/paths', () => {
  it('returns ~/.tracy/quarantine/claude/skills/ as the root', () => {
    expect(getQuarantineRoot()).toBe(
      path.join(homedir(), '.tracy', 'quarantine', 'claude', 'skills')
    )
  })

  it('hash dir nests the md5 under root', () => {
    const md5 = 'a'.repeat(32)
    expect(getQuarantinedHashDir(md5)).toBe(path.join(getQuarantineRoot(), md5))
  })

  it('target path puts origName inside the hash dir', () => {
    const md5 = 'a'.repeat(32)
    expect(getQuarantinedTargetPath(md5, 'evil')).toBe(
      path.join(getQuarantineRoot(), md5, 'evil')
    )
    expect(getQuarantinedTargetPath(md5, 'inline.md')).toBe(
      path.join(getQuarantineRoot(), md5, 'inline.md')
    )
  })

  it('staging dir includes md5 + pid + uuid and matches STAGING_DIR_REGEX', () => {
    const md5 = 'a'.repeat(32)
    const staging = getStagingDir(md5, 12345, 'some-uuid-goes-here')
    const basename = path.basename(staging)
    expect(STAGING_DIR_REGEX.test(basename)).toBe(true)
    expect(basename.startsWith(`${md5}_tmp_12345_some-uuid`)).toBe(true)
  })

  it('STAGING_DIR_REGEX does not match final hash dirs', () => {
    expect(STAGING_DIR_REGEX.test('a'.repeat(32))).toBe(false)
  })
})
