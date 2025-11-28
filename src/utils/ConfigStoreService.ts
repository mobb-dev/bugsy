import Configstore from 'configstore'

import { DEFAULT_API_URL } from '../constants'

/**
 * Creates a Configstore instance with a name based on the API URL
 * This allows for different configurations for different API endpoints
 *
 * @param defaultValues Default values for the config store
 * @returns Configstore instance
 */
function createConfigStore(
  defaultValues: Record<string, unknown> = { apiToken: '' }
): Configstore {
  // Get the API URL for the current instance
  const API_URL = process.env['API_URL'] || DEFAULT_API_URL

  // Extract just the domain part from the URL
  let domain = ''
  try {
    const url = new URL(API_URL)
    domain = url.hostname
  } catch (e) {
    // If URL parsing fails, use the original sanitization approach as fallback
    domain = API_URL.replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '') // Remove path
      .replace(/:\d+$/, '') // Remove port
  }

  // Replace dots with underscores for filesystem compatibility
  const sanitizedDomain = domain.replace(/\./g, '_')

  // Create a configstore with domain suffix to avoid conflicts between different instances
  return new Configstore(`mobbdev-${sanitizedDomain}`, defaultValues)
}

/**
 * Gets the shared Configstore instance
 * @returns Shared Configstore instance
 */
function getConfigStore(): Configstore {
  return createConfigStore()
}

// Export a singleton instance for direct use
export const configStore = getConfigStore()
