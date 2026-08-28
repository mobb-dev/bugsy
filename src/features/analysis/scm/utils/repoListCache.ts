/**
 * Short-TTL cache for full repository drains (ADO always; GHES with Search
 * disabled) — collapses a typing session's searches into one drain. Never used
 * on native search paths, where caching buys staleness for no gain.
 *
 * Keyed by token-hash + origin(+org): the list is what THIS token can see, so
 * an org-only key would leak one user's private repos to another. The token
 * itself is never stored. ponytail: FIFO cap, LRU if eviction ever shows up.
 */
import { createHash } from 'node:crypto'

import type { ScmRepoInfo } from '../types'

const TTL_MS = 90_000
const MAX_ENTRIES = 30

type Entry = {
  repos: Promise<ScmRepoInfo[]>
  /** Set when the fetch RESOLVES — the TTL must not run on an in-flight drain,
   * or a slow drain "expires" mid-flight and callers launch parallel drains. */
  settledAt: number | null
}

const cache = new Map<string, Entry>()

export function repoListCacheKey(params: {
  accessToken: string
  origin: string
  scmOrg?: string
}): string {
  const tokenHash = createHash('sha256')
    .update(params.accessToken)
    .digest('hex')
  return `${tokenHash}|${params.origin}|${params.scmOrg ?? ''}`
}

/**
 * Cached list or fetch-and-cache. Stores the PROMISE so concurrent same-key
 * callers share one drain (the picker issues several at mount); a rejected
 * fetch evicts itself so failures are never cached for the TTL.
 */
export function getCachedRepoList(
  key: string,
  fetchAll: () => Promise<ScmRepoInfo[]>
): Promise<ScmRepoInfo[]> {
  const now = Date.now()
  const hit = cache.get(key)
  // In-flight entries (settledAt null) are always shared; the TTL applies only
  // once the drain has resolved.
  if (hit && (hit.settledAt === null || now - hit.settledAt < TTL_MS)) {
    return hit.repos
  }
  const repos = fetchAll()
  const entry: Entry = { repos, settledAt: null }
  repos.then(
    () => {
      entry.settledAt = Date.now()
    },
    () => {
      // A rejected fetch must not be cached for the TTL.
      if (cache.get(key) === entry) {
        cache.delete(key)
      }
    }
  )
  // Sweep expired entries first (they'd otherwise linger until FIFO pressure),
  // and evict only when adding a NEW key would grow past the cap — refreshing
  // an existing key must not push out an unrelated live entry.
  for (const [k, e] of cache) {
    if (e.settledAt !== null && now - e.settledAt >= TTL_MS) {
      cache.delete(k)
    }
  }
  if (!cache.has(key) && cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) {
      cache.delete(oldest)
    }
  }
  // Delete-then-set so a refreshed key moves to newest insertion position
  // instead of staying "oldest" and being first evicted despite being hot.
  cache.delete(key)
  cache.set(key, entry)
  return repos
}

/** Test hook. */
export function clearRepoListCache(): void {
  cache.clear()
}
