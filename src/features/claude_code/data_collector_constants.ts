export const CC_VERSION_CACHE_KEY = 'claudeCode.detectedCCVersion'
export const CC_VERSION_CLI_KEY = 'claudeCode.detectedCCVersionCli'

export const GQL_AUTH_TIMEOUT_MS = 15_000 // 15 seconds — max wait for GQL authentication
export const STALE_KEY_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000 // 14 days
export const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000 // Run cleanup at most once per day

// Daemon-specific constants
export const DAEMON_TTL_MS = 30 * 60 * 1000 // 30 minutes — daemon self-terminates after this
export const DAEMON_POLL_INTERVAL_MS = 10_000 // 10 seconds — poll cycle interval
export const HEARTBEAT_STALE_MS = 30_000 // 30 seconds — shim considers daemon dead if heartbeat older
export const TRANSCRIPT_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours — skip files not modified recently
export const DAEMON_CHUNK_SIZE = 50 // entries per chunk — bounds memory, enables crash recovery
