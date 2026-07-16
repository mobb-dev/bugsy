import Configstore from 'configstore'

/**
 * Persistent, content-addressed ledger for context/skill S3 uploads.
 *
 * Why this exists: the daemon self-terminates every 30 min and is restarted by
 * the shim. All in-memory skip/backoff state (see `context_file_scanner.ts`) is
 * lost on restart, so a fresh daemon re-uploads the entire context corpus — and
 * because scanning is per-session, the same `~/.claude` files are re-uploaded
 * once per active session. On a large corpus behind a corporate proxy this
 * compounds into hundreds of thousands of failed uploads/day (ephemeral-port
 * exhaustion, proxy resets, aborted requests).
 *
 * S3 keys are already content-addressed (`ctx-<md5>.bin` / `skill-<md5>.zip`),
 * so once a given md5 is uploaded it never needs re-uploading until the content
 * changes (→ new md5). This ledger records, on disk and keyed by md5:
 *   - which blobs are already in S3 (skip the upload; the caller still emits the
 *     per-session Tracy record so attribution is preserved),
 *   - per-md5 failure backoff (survives restarts, shared across sessions),
 *   - a global circuit breaker so a mass outage pauses ALL uploads instead of
 *     hammering the network per-key.
 */

/**
 * How long a successfully-uploaded blob is treated as "already in S3" before it
 * is re-uploaded (not verified — after this window `isUploaded` simply returns
 * false and the blob is re-POSTed). This MUST stay <= the upload bucket's object
 * lifecycle/retention, otherwise dedup can suppress re-upload while per-session
 * Tracy records still reference an expired S3 key. If the bucket lifecycle is
 * shortened, lower this constant with margin.
 */
const UPLOADED_TTL_MS = 14 * 24 * 60 * 60 * 1000 // 14 days
/** Per-md5 failure backoff: 1 min, doubling per consecutive failure, capped 1 h. */
const FAILURE_BACKOFF_BASE_MS = 60 * 1000
const FAILURE_BACKOFF_MAX_MS = 60 * 60 * 1000
/** Only re-log a persistently-failing md5 once per this window (log-once). */
const FAILURE_LOG_WINDOW_MS = 30 * 60 * 1000 // 30 min
/** Consecutive upload failures (across all keys) that trip the breaker. */
const BREAKER_FAILURE_THRESHOLD = 8
/**
 * The breaker is meant to catch a *simultaneous* outage, so the consecutive-
 * failure counter decays: if this long passes with no new failure, the streak
 * resets. Without this, isolated failures spread across hours/days (steady state
 * is mostly dedup hits that never call onSuccess to reset the counter) could
 * accumulate to the threshold and spuriously pause all uploads on a healthy box.
 */
const BREAKER_FAILURE_WINDOW_MS = 5 * 60 * 1000 // 5 min
/** Breaker cooldown: 30 s, doubling per consecutive trip, capped 10 min. */
const BREAKER_BASE_COOLDOWN_MS = 30 * 1000
const BREAKER_MAX_COOLDOWN_MS = 10 * 60 * 1000
/** Cap total ledger entries; oldest-touched are evicted past this. */
const MAX_LEDGER_ENTRIES = 5_000

const LEDGER_NAMESPACE = 'mobbdev-context-upload-ledger'
const ENTRIES_KEY = 'entries'
const BREAKER_KEY = 'breaker'

/** Per-md5 ledger entry. */
type LedgerEntry = {
  /** Epoch ms of last successful upload; absent if never succeeded. */
  uploadedAt?: number
  /** Consecutive failed attempts (drives per-md5 backoff). */
  attempts?: number
  /** Epoch ms before which this md5 must not be re-attempted. */
  nextRetryAt?: number
  /** Epoch ms this md5's failure was last logged (drives log-once). */
  lastLoggedAt?: number
  /** Epoch ms of last touch (drives eviction). */
  touchedAt: number
}

type BreakerState = {
  /** Consecutive failures since the last success (decays after the window). */
  consecutiveFailures: number
  /** Epoch ms of the most recent failure (drives the decay window). */
  lastFailureAt: number
  /** Number of times the breaker has tripped in the current failure streak. */
  trips: number
  /** Epoch ms until which the breaker is open (all uploads paused). */
  openUntil: number
}

export type UploadLedger = {
  /** Blob already in S3 and fresh → skip the upload (caller still emits record). */
  isUploaded(md5: string, now: number): boolean
  /** In per-md5 failure backoff → skip this cycle without attempting/logging. */
  isBackedOff(md5: string, now: number): boolean
  /** Global breaker open → skip ALL upload attempts this cycle. */
  isBreakerOpen(now: number): boolean
  /** Record a successful upload (clears backoff, resets breaker). */
  onSuccess(md5: string, now: number): void
  /**
   * Record a failed upload. Returns `true` if this failure should be logged
   * (first occurrence for this md5 within the log window), `false` to suppress.
   */
  onFailure(md5: string, now: number): boolean
  /** Persist in-memory state to disk. Call once per cycle and on shutdown. */
  flush(): void
}

/** No-op ledger — used by callers that opt out of persistence (e.g. tests). */
export const NOOP_UPLOAD_LEDGER: UploadLedger = {
  isUploaded: () => false,
  isBackedOff: () => false,
  isBreakerOpen: () => false,
  onSuccess: () => {
    /* noop */
  },
  onFailure: () => true,
  flush: () => {
    /* noop */
  },
}

/**
 * Configstore-backed {@link UploadLedger}. State is loaded once, mutated in
 * memory, and written to disk only via {@link flush} (so a busy poll cycle does
 * at most one disk write, not one per upload).
 */
export class ConfigstoreUploadLedger implements UploadLedger {
  private readonly store: Configstore
  private readonly entries: Map<string, LedgerEntry>
  private breaker: BreakerState
  private dirty = false

  constructor(store?: Configstore) {
    this.store = store ?? new Configstore(LEDGER_NAMESPACE)
    this.entries = loadEntries(this.store)
    this.breaker = loadBreaker(this.store)
  }

  isUploaded(md5: string, now: number): boolean {
    const entry = this.entries.get(md5)
    if (!entry?.uploadedAt) {
      return false
    }
    if (now - entry.uploadedAt > UPLOADED_TTL_MS) {
      return false
    }
    // Refresh recency for LRU eviction and mark dirty so the touch is persisted
    // even on a cycle that is otherwise all dedup hits (no success/failure).
    entry.touchedAt = now
    this.dirty = true
    return true
  }

  isBackedOff(md5: string, now: number): boolean {
    const entry = this.entries.get(md5)
    return entry?.nextRetryAt !== undefined && entry.nextRetryAt > now
  }

  isBreakerOpen(now: number): boolean {
    return this.breaker.openUntil > now
  }

  onSuccess(md5: string, now: number): void {
    const entry = this.getOrCreate(md5, now)
    entry.uploadedAt = now
    entry.touchedAt = now
    delete entry.attempts
    delete entry.nextRetryAt
    delete entry.lastLoggedAt
    this.breaker.consecutiveFailures = 0
    this.breaker.lastFailureAt = 0
    this.breaker.trips = 0
    this.breaker.openUntil = 0
    this.dirty = true
  }

  onFailure(md5: string, now: number): boolean {
    const entry = this.getOrCreate(md5, now)
    const attempts = (entry.attempts ?? 0) + 1
    const delay = Math.min(
      FAILURE_BACKOFF_BASE_MS * 2 ** (attempts - 1),
      FAILURE_BACKOFF_MAX_MS
    )
    entry.attempts = attempts
    entry.nextRetryAt = now + delay
    entry.touchedAt = now

    // Decay the streak: an isolated failure long after the previous one starts a
    // fresh count, so only a burst of failures (a real outage) trips the breaker.
    if (now - this.breaker.lastFailureAt > BREAKER_FAILURE_WINDOW_MS) {
      this.breaker.consecutiveFailures = 0
    }
    this.breaker.lastFailureAt = now
    // Trip the global breaker after enough consecutive failures.
    this.breaker.consecutiveFailures += 1
    if (
      this.breaker.consecutiveFailures >= BREAKER_FAILURE_THRESHOLD &&
      this.breaker.openUntil <= now
    ) {
      const cooldown = Math.min(
        BREAKER_BASE_COOLDOWN_MS * 2 ** this.breaker.trips,
        BREAKER_MAX_COOLDOWN_MS
      )
      this.breaker.trips += 1
      this.breaker.openUntil = now + cooldown
    }

    // Log-once: only the first failure per md5 within the window is logged.
    const shouldLog =
      entry.lastLoggedAt === undefined ||
      now - entry.lastLoggedAt >= FAILURE_LOG_WINDOW_MS
    if (shouldLog) {
      entry.lastLoggedAt = now
    }
    this.dirty = true
    return shouldLog
  }

  flush(): void {
    if (!this.dirty) {
      return
    }
    this.evictIfNeeded()
    try {
      this.store.set(ENTRIES_KEY, Object.fromEntries(this.entries))
      this.store.set(BREAKER_KEY, this.breaker)
      this.dirty = false
    } catch {
      // Non-critical: a failed persist just means we re-derive state after the
      // next restart. Never let ledger I/O break the upload path.
    }
  }

  private getOrCreate(md5: string, now: number): LedgerEntry {
    let entry = this.entries.get(md5)
    if (!entry) {
      entry = { touchedAt: now }
      this.entries.set(md5, entry)
    }
    return entry
  }

  /** Evict least-recently-touched entries when over the cap. */
  private evictIfNeeded(): void {
    if (this.entries.size <= MAX_LEDGER_ENTRIES) {
      return
    }
    const sorted = [...this.entries.entries()].sort(
      (a, b) => a[1].touchedAt - b[1].touchedAt
    )
    const removeCount = this.entries.size - MAX_LEDGER_ENTRIES
    for (let i = 0; i < removeCount; i++) {
      this.entries.delete(sorted[i]![0])
    }
  }
}

/** Coerce a persisted value to a finite non-negative number, or `undefined`. */
function finiteOrUndefined(value: unknown): number | undefined {
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

function loadEntries(store: Configstore): Map<string, LedgerEntry> {
  const map = new Map<string, LedgerEntry>()
  try {
    const raw = store.get(ENTRIES_KEY) as
      Record<string, Partial<LedgerEntry>> | undefined
    if (raw && typeof raw === 'object') {
      for (const [md5, entry] of Object.entries(raw)) {
        if (!entry || typeof entry !== 'object') {
          continue
        }
        // Coerce every persisted numeric field: a corrupt/tampered value (e.g. a
        // far-future uploadedAt that would permanently skip an upload, or a NaN
        // touchedAt that breaks eviction sorting) is dropped rather than trusted.
        map.set(md5, {
          uploadedAt: finiteOrUndefined(entry.uploadedAt),
          attempts: finiteOrUndefined(entry.attempts),
          nextRetryAt: finiteOrUndefined(entry.nextRetryAt),
          lastLoggedAt: finiteOrUndefined(entry.lastLoggedAt),
          touchedAt: finiteOrUndefined(entry.touchedAt) ?? 0,
        })
      }
    }
  } catch {
    // Corrupt/unreadable ledger — start fresh rather than crash.
  }
  return map
}

function loadBreaker(store: Configstore): BreakerState {
  try {
    const raw = store.get(BREAKER_KEY) as Partial<BreakerState> | undefined
    if (raw && typeof raw === 'object') {
      return {
        consecutiveFailures: finiteOrUndefined(raw.consecutiveFailures) ?? 0,
        lastFailureAt: finiteOrUndefined(raw.lastFailureAt) ?? 0,
        trips: finiteOrUndefined(raw.trips) ?? 0,
        openUntil: finiteOrUndefined(raw.openUntil) ?? 0,
      }
    }
  } catch {
    // fall through
  }
  return { consecutiveFailures: 0, lastFailureAt: 0, trips: 0, openUntil: 0 }
}
