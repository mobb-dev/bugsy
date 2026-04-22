/**
 * T-467 — constants for the skill quarantine module.
 */

/**
 * Minimum gap between quarantine checks per session. Default 30s.
 * Override via MOBB_TRACY_SKILL_QUARANTINE_DEBOUNCE_MS for test harnesses.
 * Clamped to [0, 300_000].
 */
export const HEARTBEAT_DEBOUNCE_MS = (() => {
  const raw = Number(process.env['MOBB_TRACY_SKILL_QUARANTINE_DEBOUNCE_MS'])
  if (!Number.isFinite(raw) || raw < 0) return 30_000
  return Math.min(raw, 300_000)
})()

/** Hard-kill env var name. When set to '1' the whole check is skipped. */
export const KILL_SWITCH_ENV = 'MOBB_TRACY_SKILL_QUARANTINE_DISABLE'

/** Only act on this verdict string (server returns UPPERCASE). */
export const MALICIOUS_VERDICT = 'MALICIOUS'

/**
 * Orphan sweep grace period. `*_tmp_*` staging dirs younger than this are
 * skipped (they may belong to an in-flight quarantine or a phase-2 failure
 * we intentionally preserved for manual recovery).
 */
export const ORPHAN_SWEEP_GRACE_MS = 10 * 60 * 1000
