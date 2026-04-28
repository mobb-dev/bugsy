import { homedir } from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  COMMITTED_ZIP_REGEX,
  getQuarantineRoot,
  getQuarantineZipPath,
  getTmpZipPath,
  TMP_ZIP_REGEX,
} from '../paths'

describe('skill_quarantine/paths', () => {
  const md5 = 'a'.repeat(32)
  const uuid = 'deadbeef-dead-beef-dead-beefdeadbeef'

  it('returns ~/.tracy/quarantine/claude/skills/ as the root', () => {
    expect(getQuarantineRoot()).toBe(
      path.join(homedir(), '.tracy', 'quarantine', 'claude', 'skills')
    )
  })

  it('getQuarantineZipPath puts `<md5>.zip` under the root', () => {
    expect(getQuarantineZipPath(md5)).toBe(
      path.join(getQuarantineRoot(), `${md5}.zip`)
    )
  })

  it('getTmpZipPath embeds md5 and uuid', () => {
    expect(getTmpZipPath(md5, uuid)).toBe(
      path.join(getQuarantineRoot(), `${md5}_tmp_${uuid}.zip`)
    )
  })

  it('TMP_ZIP_REGEX captures md5 and rejects committed / non-tmp names', () => {
    const tmp = path.basename(getTmpZipPath(md5, uuid))
    expect(TMP_ZIP_REGEX.exec(tmp)?.[1]).toBe(md5)
    expect(TMP_ZIP_REGEX.test(`${md5}.zip`)).toBe(false)
    expect(TMP_ZIP_REGEX.test(md5)).toBe(false)
  })

  it('COMMITTED_ZIP_REGEX captures md5 only on `<md5>.zip`', () => {
    expect(COMMITTED_ZIP_REGEX.exec(`${md5}.zip`)?.[1]).toBe(md5)
    expect(COMMITTED_ZIP_REGEX.test(`${md5}_tmp_${uuid}.zip`)).toBe(false)
    expect(COMMITTED_ZIP_REGEX.test(md5)).toBe(false)
  })
})
