// In-memory cache of the analyzer-owned issue-type catalog (value + display
// metadata), fetched once from the `issueTypes` endpoint and hydrated here so
// the synchronous display helpers (getIssueTypeFriendlyString, fix details)
// can stay synchronous while the source of truth lives in the analyzer.
//
// Each runtime hydrates once at an init/gate point (CLI startup, app
// user-context load gate, node_general_backend request entry). Until hydrated,
// the helpers fall back to their existing behavior, so this is additive.
//
// TRUST: the content (labels, descriptions, fix instructions) is first-party,
// analyzer-owned display metadata — the same trust level as the static maps it
// replaces. It is rendered as Markdown (e.g. into SCM commit/PR descriptions)
// and intentionally NOT escaped, because some entries contain deliberate
// markup. Do not hydrate this cache from untrusted / user-supplied input.

import type { IssueTypesQuery } from '../../generates/client_generates'

// Pin the cache entry shape to the generated `issueTypes` query result so the
// in-memory contract can't silently drift from the analyzer wire schema.
export type IssueTypeCatalogEntry = IssueTypesQuery['issueTypes'][number]

let catalog: Map<string, IssueTypeCatalogEntry> | null = null

export function hydrateIssueTypeCatalog(
  entries: readonly IssueTypeCatalogEntry[]
): void {
  catalog = new Map(entries.map((entry) => [entry.value, entry]))
}

export function isIssueTypeCatalogHydrated(): boolean {
  return catalog !== null
}

/** Test-only: clear the cache so each test starts from an unhydrated state. */
export function resetIssueTypeCatalog(): void {
  catalog = null
}

export function getIssueTypeCatalogEntry(
  value: string | null | undefined
): IssueTypeCatalogEntry | undefined {
  if (!catalog || !value) {
    return undefined
  }
  return catalog.get(value)
}
