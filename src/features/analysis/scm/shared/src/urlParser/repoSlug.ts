import { parseScmURL } from './urlParser'

/**
 * Normalizes a repository URL to its canonical (lowercased) form.
 * Throws if the URL cannot be parsed — callers must supply valid repo URLs.
 *
 * Use this anywhere a repo URL needs to be normalized for consistent
 * DB queries, S3 key generation, or string comparisons.
 */
export function normalizeRepoUrl(repoUrl: string): string {
  const parsed = parseScmURL(repoUrl)
  if (parsed) {
    return parsed.canonicalUrl
  }
  throw new Error(`[normalizeRepoUrl] failed to parse repo URL: ${repoUrl}`)
}

/**
 * Gets a standardized repository slug from a repository URL.
 * Uses parseScmURL which handles both known SCM providers and unknown hosts.
 * Converts URL format to: hostname-projectPath (with dots/slashes replaced by dashes)
 *
 * URLs with embedded credentials (e.g., https://token@github.com/org/repo) are
 * handled correctly — parseScmURL uses the standard URL parser which strips credentials.
 *
 * @param repoUrl - The repository URL (HTTPS, SSH, or credentialed format)
 * @returns Standardized repo slug (e.g., "github-com-myorg-myrepo")
 */
export function getRepoSlug(repoUrl: string): string {
  const parsed = parseScmURL(repoUrl)
  if (!parsed) {
    throw new Error(`Invalid repository URL: ${repoUrl}`)
  }
  const hostname = parsed.hostname.replace(/\./g, '-')
  const projectPath = parsed.projectPath.replace(/\//g, '-')
  return `${hostname}-${projectPath}`
}
