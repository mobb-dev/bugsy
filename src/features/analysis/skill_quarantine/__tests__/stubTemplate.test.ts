import { describe, expect, it } from 'vitest'

import { renderStub } from '../stubTemplate'

describe('renderStub', () => {
  const base = {
    md5: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    quarantinedPath:
      '/home/u/.tracy/quarantine/claude/skills/a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4/evil',
    origPath: '/proj/.claude/skills/evil',
    summary: 'eval(curl) pattern in setup.sh',
    scannerName: 'mobb-internal',
    scannerVersion: 'abcdef1234567890',
    scannedAt: '2026-04-22T08:00:00.000Z',
  }

  it('renders all fields for folder skill', () => {
    const out = renderStub({ ...base, isFolder: true })
    expect(out).toContain('# ⛔ QUARANTINED BY TRACY')
    expect(out).toContain(base.md5)
    expect(out).toContain(base.quarantinedPath)
    expect(out).toContain(base.origPath)
    expect(out).toContain(base.summary)
    expect(out).toContain(base.scannerName)
    expect(out).toContain(base.scannerVersion)
    expect(out).toContain(base.scannedAt)
  })

  it('uses "skill file" wording for standalone skill', () => {
    const out = renderStub({ ...base, isFolder: false })
    expect(out).toContain('original skill file has been moved')
    expect(out).not.toContain('original skill folder has been moved')
  })

  it('uses "skill folder" wording for folder skill', () => {
    const out = renderStub({ ...base, isFolder: true })
    expect(out).toContain('original skill folder has been moved')
    expect(out).not.toContain('original skill file has been moved')
  })

  it('falls back when summary is null (legacy row)', () => {
    const out = renderStub({ ...base, isFolder: true, summary: null })
    expect(out).toContain('not available (scan predates current schema)')
  })

  it('includes a copy-paste recovery mv command', () => {
    const out = renderStub({ ...base, isFolder: true })
    expect(out).toContain(`mv ${base.quarantinedPath} ${base.origPath}`)
  })
})
