/**
 * Shared helpers for repository name search across SCM providers.
 *
 * GitHub Search treats `:` as a qualifier separator (`org:`, `user:`). Neither
 * the typed term nor the owner may be interpolated raw, or `org:other` hijacks
 * the query. GitLab/Bitbucket/ADO take a free-text filter and do not have that
 * problem; they still share `repoMatchesSearch` for in-memory fallbacks.
 */

/**
 * GitHub's documented free-text ceiling. It explicitly excludes qualifiers:
 * "queries longer than 256 characters (not including operators or qualifiers)".
 * https://docs.github.com/en/search-github/searching-on-github/searching-code
 */
const GITHUB_SEARCH_TERM_MAX = 128

/**
 * Owner qualifiers are not counted against the 256, so the only real ceiling is
 * URL length. Generous enough that a user's whole org list fits in one query.
 */
const GITHUB_SEARCH_QUALIFIER_BUDGET = 1500

/**
 * The Search API serves only the first 1000 matches; asking for more is a 422.
 * https://docs.github.com/en/rest/search/search#about-search
 */
export const GITHUB_SEARCH_MAX_RESULTS = 1000

export function sanitizeGithubRepoNameQuery(raw: string): string {
  return raw
    .replace(/[:\\"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, GITHUB_SEARCH_TERM_MAX)
}

/**
 * GitHub logins are `[A-Za-z0-9-]` only, so anything else is either a typo or an
 * injection attempt — dropping it is safe and keeps the qualifier well-formed.
 */
export function sanitizeGithubOwner(raw: string): string {
  return raw.replace(/[^A-Za-z0-9-]/g, '')
}

export function githubOwnerQualifier(
  owner: string,
  kind: 'User' | 'Organization'
): string {
  const safeOwner = sanitizeGithubOwner(owner)
  return kind === 'Organization' ? `org:${safeOwner}` : `user:${safeOwner}`
}

/**
 * Build `q` for GET /search/repositories.
 * https://docs.github.com/en/rest/search/search#search-repositories
 *
 * `fork:true` is required — the Search API excludes forks otherwise, which
 * would silently drop a large fraction of an org.
 */
export function buildGithubRepoSearchQuery(params: {
  nameQuery?: string
  ownerQualifiers: string[]
}): string {
  const parts: string[] = ['fork:true']
  const nameQuery = params.nameQuery
    ? sanitizeGithubRepoNameQuery(params.nameQuery)
    : ''
  if (nameQuery) {
    parts.push(`${nameQuery} in:name`)
  }
  const packed: string[] = [parts.join(' ')]
  for (const qualifier of params.ownerQualifiers) {
    if (!/^(org|user):.+/.test(qualifier)) {
      continue
    }
    const next = `${packed.join(' ')} ${qualifier}`
    if (next.length > GITHUB_SEARCH_QUALIFIER_BUDGET) {
      break
    }
    packed.push(qualifier)
  }
  return packed.join(' ')
}

export function repoMatchesSearch(
  repo: { repoName: string; repoOwner: string },
  query: string
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) {
    return true
  }
  // No bare repoOwner match: fallback lists are owner-uniform, so it made any
  // query overlapping the org name match EVERY repo. The owner participates
  // only in the owner/name form, signalled by a '/' in the query.
  if (repo.repoName.toLowerCase().includes(q)) {
    return true
  }
  return (
    q.includes('/') &&
    `${repo.repoOwner}/${repo.repoName}`.toLowerCase().includes(q)
  )
}

export function escapeBitbucketFilterValue(raw: string): string {
  return raw.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/**
 * Shared updated-desc ordering with a name tie-break — the tie-break keeps
 * offset pagination stable when timestamps collide (ADO reports project-level
 * dates, so whole projects tie). Returns a new array.
 */
export function sortByUpdatedDesc<
  T extends { repoName: string; repoUpdatedAt: string | null },
>(repos: T[]): T[] {
  return [...repos].sort((a, b) => {
    const aDate = a.repoUpdatedAt ? Date.parse(a.repoUpdatedAt) : 0
    const bDate = b.repoUpdatedAt ? Date.parse(b.repoUpdatedAt) : 0
    return bDate - aDate || a.repoName.localeCompare(b.repoName)
  })
}
