/**
 * T-467 — quarantine stub `SKILL.md` template.
 *
 * Pure function. No I/O. The stub is the only artifact the user sees when
 * their skill stops working, so it must be self-contained (no external
 * links required to recover). Answers four things: what happened, why,
 * how to undo, how to report (plan §3.3).
 */

export type StubParams = {
  /** MD5 of the original (malicious) skill zip. */
  md5: string
  /** Whether the original was a folder or a single `.md` file. */
  isFolder: boolean
  /** Absolute path where the quarantined content now lives. */
  quarantinedPath: string
  /** Original path at which the skill used to live (pre-move). */
  origPath: string
  /** Server-provided short reason; may be null for legacy scan rows. */
  summary: string | null
  /** Scanner name ('mobb-internal' in MVP). */
  scannerName: string
  /** Scanner version (runtime self-hash from the scanner). */
  scannerVersion: string
  /** ISO-8601 timestamp of the scan that produced the verdict. */
  scannedAt: string
}

const LEGACY_SUMMARY_FALLBACK = 'not available (scan predates current schema)'

export function renderStub(params: StubParams): string {
  const folderOrFile = params.isFolder ? 'skill folder' : 'skill file'
  const reason = params.summary ?? LEGACY_SUMMARY_FALLBACK
  return `# ⛔ QUARANTINED BY TRACY

This skill was flagged **MALICIOUS** by the Mobb security scanner and has been
moved out of your skills folder. **Claude Code will not execute it** while this
stub is in place.

## Why this skill was flagged

- **Reason:** ${reason}
- **Scanner:** ${params.scannerName} @ ${params.scannerVersion}
- **Scanned at:** ${params.scannedAt}
- **Content hash (MD5):** \`${params.md5}\`

## Where the original is now

The original ${folderOrFile} has been moved to:

    ${params.quarantinedPath}

Nothing has been deleted. The contents are intact; only the location changed.

## If this is a false positive — how to recover

If you're confident this skill is safe and want to restore it:

    mv ${params.quarantinedPath} ${params.origPath}

Tracy will not re-quarantine it as long as the directory
\`~/.tracy/quarantine/claude/skills/${params.md5}/\` still exists on your
machine (even if it's empty after you moved the contents out). If you delete
that directory entirely, the next heartbeat will re-evaluate the skill from
scratch.

## How to report a false positive

Please email **security@mobb.ai** with:

- The MD5 above
- A short description of why you believe the flag was wrong
- (Optional) the skill folder contents

Your report helps tune the scanner for everyone.
`
}
