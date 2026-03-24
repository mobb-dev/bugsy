import Configstore from 'configstore'

import { DEFAULT_API_URL } from '../constants'

/**
 * Returns the sanitized domain string used as a suffix in Configstore file names.
 * Shared by the global config store and per-session stores so they all land
 * in the same XDG config directory with a consistent naming convention.
 */
function getSanitizedDomain(): string {
  const API_URL = process.env['API_URL'] || DEFAULT_API_URL

  let domain = ''
  try {
    const url = new URL(API_URL)
    domain = url.hostname
  } catch {
    domain = API_URL.replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/:\d+$/, '')
  }

  return domain.replace(/\./g, '_')
}

/**
 * Creates the shared (global) Configstore instance.
 */
function createConfigStore(
  defaultValues: Record<string, unknown> = { apiToken: '' }
): Configstore {
  return new Configstore(`mobbdev-${getSanitizedDomain()}`, defaultValues)
}

/**
 * Creates a per-session Configstore instance.
 * Each Claude Code session gets its own JSON file so concurrent hook
 * invocations from different sessions never compete for the same file.
 * The 10 s cooldown within a session prevents overlapping writes.
 */
export function createSessionConfigStore(sessionId: string): Configstore {
  return new Configstore(`mobbdev-${getSanitizedDomain()}-session-${sessionId}`)
}

/**
 * Returns the glob prefix used to find per-session config files on disk.
 * e.g. "mobbdev-api_mobb_ai-session-"
 */
export function getSessionFilePrefix(): string {
  return `mobbdev-${getSanitizedDomain()}-session-`
}

// Export a singleton instance for direct use
export const configStore = createConfigStore()
