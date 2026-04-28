import { homedir } from 'node:os'
import path from 'node:path'

/**
 * T-467 — filesystem layout for client-side skill quarantine.
 *
 * Two on-disk shapes:
 *   <md5>_tmp_<uuid>.zip  — an in-flight or crashed zip write. Reconcile
 *                           parses it; valid archives get published, broken
 *                           ones are swept after the grace window.
 *   <md5>.zip             — the final addressing key. Presence is the
 *                           "fully quarantined" lock.
 */

export function getQuarantineRoot(): string {
  return path.join(homedir(), '.tracy', 'quarantine', 'claude', 'skills')
}

export function getQuarantineZipPath(md5: string): string {
  return path.join(getQuarantineRoot(), `${md5}.zip`)
}

export function getTmpZipPath(md5: string, uuid: string): string {
  return path.join(getQuarantineRoot(), `${md5}_tmp_${uuid}.zip`)
}

/** `<md5>_tmp_<uuid>.zip` — capture 1 is md5. */
export const TMP_ZIP_REGEX = /^([0-9a-f]{32})_tmp_[0-9a-f-]+\.zip$/

/** `<md5>.zip` (final) — capture 1 is md5. */
export const COMMITTED_ZIP_REGEX = /^([0-9a-f]{32})\.zip$/
