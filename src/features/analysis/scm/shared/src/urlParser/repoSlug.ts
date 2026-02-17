import { parseScmURL } from './urlParser'

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
