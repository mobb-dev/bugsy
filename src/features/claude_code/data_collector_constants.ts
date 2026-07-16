export const CC_VERSION_CACHE_KEY = 'claudeCode.detectedCCVersion'
export const CC_VERSION_CLI_KEY = 'claudeCode.detectedCCVersionCli'

export const GQL_AUTH_TIMEOUT_MS = 15_000 // 15 seconds — max wait for GQL authentication
export const STALE_KEY_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000 // 14 days
export const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000 // Run cleanup at most once per day

// Daemon-specific constants
export const DAEMON_TTL_MS = 30 * 60 * 1000 // 30 minutes — daemon self-terminates after this
// Poll interval defaults to 10s; override via MOBB_DAEMON_POLL_INTERVAL_MS
// (e.g. test harnesses). Clamped to [100ms, 60_000ms].
export const DAEMON_POLL_INTERVAL_MS = (() => {
  const raw = Number(process.env['MOBB_DAEMON_POLL_INTERVAL_MS'])
  if (!Number.isFinite(raw) || raw <= 0) return 10_000
  return Math.min(Math.max(raw, 100), 60_000)
})()
export const HEARTBEAT_STALE_MS = 30_000 // 30 seconds — shim considers daemon dead if heartbeat older
export const TRANSCRIPT_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours — skip files not modified recently
export const DAEMON_CHUNK_SIZE = 50 // entries per chunk — bounds memory, enables crash recovery

// Context/skill files (CLAUDE.md, commands, skills) change on human-edit
// timescales, not per-second — scanning/uploading them is never time-sensitive.
// This is the cadence at which the daemon scans context files for ALL active
// sessions. Per-tick bursts are bounded not by spreading sessions across ticks
// but by the global serialized upload limiter + content-addressed dedup (see
// context_file_uploader.ts), so most ticks are cheap no-ops. Default 15 min.
// Override via MOBB_CONTEXT_SCAN_INTERVAL_MS; clamped to [10s, 60min].
export const CONTEXT_SCAN_INTERVAL_MS = (() => {
  const raw = Number(process.env['MOBB_CONTEXT_SCAN_INTERVAL_MS'])
  if (!Number.isFinite(raw) || raw <= 0) return 15 * 60_000
  return Math.min(Math.max(raw, 10_000), 60 * 60_000)
})()

// Max time to await in-flight context uploads on daemon shutdown before forcing
// exit. Lets fire-and-forget uploads finish (avoiding aborted-on-teardown
// errors) without hanging shutdown if the network is wedged.
export const DAEMON_SHUTDOWN_DRAIN_MS = 6_000
