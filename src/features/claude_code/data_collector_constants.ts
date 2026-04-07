export const CC_VERSION_CACHE_KEY = 'claudeCode.detectedCCVersion'
export const CC_VERSION_CLI_KEY = 'claudeCode.detectedCCVersionCli'

export const GLOBAL_COOLDOWN_MS = 5_000 // 5 seconds — throttle across all sessions on this machine
export const HOOK_COOLDOWN_MS = 15_000 // 15 seconds — skip invocations within cooldown (per session)
export const ACTIVE_LOCK_TTL_MS = 60_000 // 60 seconds — stale lock fallback if hook crashes without clearing
export const GQL_AUTH_TIMEOUT_MS = 15_000 // 15 seconds — max wait for GQL authentication
export const STALE_KEY_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000 // 14 days
export const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000 // Run cleanup at most once per day
export const MAX_ENTRIES_PER_INVOCATION = 200 // Cap entries per hook run to avoid CPU spikes on large transcripts

export const COOLDOWN_KEY = 'lastHookRunAt'
export const ACTIVE_KEY = 'hookActiveAt'

export const STDIN_TIMEOUT_MS = 10_000 // 10 seconds
