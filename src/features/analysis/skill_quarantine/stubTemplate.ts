/**
 * T-467 — quarantine stub `SKILL.md` template.
 *
 * Pure function. No I/O. The stub is the only artifact the user sees when
 * their skill stops working, so it must be self-contained (no external
 * links required to recover). Answers four things: what happened, why,
 * how to undo, how to report (plan §3.3).
 */

import path from 'node:path'

import { quote } from 'shell-quote'

import { STUB_MARKER } from './constants'

export type StubParams = {
  /** MD5 of the original (malicious) skill zip, as known to the server. */
  md5: string
  /** Whether the original was a folder or a single `.md` file. */
  isFolder: boolean
  /** Absolute path of the `<md5>.zip` archive that holds the original. */
  quarantinedZipPath: string
  /** Original path at which the skill used to live (pre-quarantine). */
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
  // The archive reconstructs `origName` at its top level, so unzipping
  // into the parent of `origPath` rebuilds the skill exactly where it
  // used to live. All three interpolated paths are shell-quoted because
  // `origPath` embeds an attacker-controlled filename (CWE-078).
  const extractParent = path.dirname(params.origPath)
  const recoverCommand =
    `rm -rf ${quote([params.origPath])} && ` +
    `unzip -o ${quote([params.quarantinedZipPath])} -d ${quote([extractParent])}`

  return `# ${STUB_MARKER}

This skill was flagged **MALICIOUS** by the Mobb security scanner and has been
archived out of your skills folder. **Claude Code will not execute it** while
this stub is in place.

## Why this skill was flagged

- **Reason:** ${reason}
- **Scanner:** ${params.scannerName} @ ${params.scannerVersion}
- **Scanned at:** ${params.scannedAt}
- **Content hash (MD5):** \`${params.md5}\`

## Where the original is now

The original ${folderOrFile} has been archived to:

    ${params.quarantinedZipPath}

Nothing has been deleted. The archive preserves the skill exactly as it was,
including any secrets or local-only edits.

## If this is a false positive — how to recover

If you're confident this skill is safe and want to restore it:

    ${recoverCommand}

Tracy will not re-quarantine it as long as \`${params.md5}.zip\` remains in
the quarantine folder. If you delete the archive, the next heartbeat will
re-evaluate the skill from scratch.

## How to report a false positive

Please email **security@mobb.ai** with:

- The MD5 above
- A short description of why you believe the flag was wrong
- (Optional) the skill folder contents

Your report helps tune the scanner for everyone.
`
}
