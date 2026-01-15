import { execSync } from 'child_process'
import os from 'os'

import { configStore } from './ConfigStoreService'

const STABLE_COMPUTER_NAME_CONFIG_KEY = 'stableComputerName'

// Common network hostname suffixes to strip
// ORDER MATTERS: More specific suffixes (e.g., .ec2.internal) must come before less specific ones (e.g., .internal)
const HOSTNAME_SUFFIXES = [
  // Cloud providers (must be first - most specific)
  '.ec2.internal',
  '.compute.internal',
  '.cloudapp.net',
  // mDNS/Bonjour
  '.local',
  '.localhost',
  '.localdomain',
  // Home networks
  '.lan',
  '.home',
  '.homelan',
  // Corporate networks
  '.corp',
  '.internal',
  '.intranet',
  '.domain',
  '.work',
  '.office',
  // Container environments
  '.docker',
  '.kubernetes',
  '.k8s',
]

// Removed MAC address and device ID generation logic
// We only use stable computer names now (simpler and more reliable)

/**
 * Gets OS-specific stable computer name
 * @returns Stable computer name without network suffixes
 */
function getOsSpecificComputerName(): string | null {
  const platform = os.platform()

  try {
    if (platform === 'darwin') {
      // macOS: Use scutil to get LocalHostName (most stable)
      const result = execSync('scutil --get LocalHostName', {
        encoding: 'utf-8',
        timeout: 1000,
      })
      return result.trim()
    } else if (platform === 'win32') {
      // Windows: Use COMPUTERNAME environment variable
      return process.env['COMPUTERNAME'] || null
    } else {
      // Linux: Try hostnamectl first (systemd systems), then fall back to /etc/hostname
      try {
        const result = execSync('hostnamectl --static', {
          encoding: 'utf-8',
          timeout: 1000,
        })
        const hostname = result.trim()
        if (hostname) return hostname
      } catch {
        // hostnamectl not available or failed, try /etc/hostname
      }

      // Fallback: read from /etc/hostname (works on all distros)
      const result = execSync('cat /etc/hostname', {
        encoding: 'utf-8',
        timeout: 1000,
      })
      return result.trim()
    }
  } catch (error) {
    // Command failed or not available
    return null
  }
}

/**
 * Strips common network suffixes from hostname
 * @param hostname Hostname to normalize
 * @returns Hostname without network suffixes
 */
function stripHostnameSuffixes(hostname: string): string {
  if (!hostname) return hostname

  let normalized = hostname

  // Try each suffix (only strip the first match since they're ordered by specificity)
  for (const suffix of HOSTNAME_SUFFIXES) {
    if (normalized.endsWith(suffix)) {
      normalized = normalized.slice(0, -suffix.length)
      break // Only strip one suffix to avoid over-stripping
    }
  }

  return normalized
}

/**
 * Gets a stable computer name that doesn't change with network configuration
 * Uses OS-specific commands when available, falls back to normalized hostname
 * @returns Stable computer name
 */
function generateStableComputerName(): string {
  // Try OS-specific method first
  const osSpecificName = getOsSpecificComputerName()
  if (osSpecificName) {
    return osSpecificName
  }

  // Fallback: normalize the current hostname by stripping suffixes
  const currentHostname = os.hostname()
  return stripHostnameSuffixes(currentHostname)
}

/**
 * Gets or generates a stable computer name using OS-specific methods
 * This is the PRIMARY identifier for grouping developers
 * Computer name is OS-specific and normalized, cached in config
 * @returns Stable computer name without network suffixes
 */
export function getStableComputerName(): string {
  // Check cache first
  const cached = configStore.get(STABLE_COMPUTER_NAME_CONFIG_KEY) as
    | string
    | undefined

  if (cached) {
    // Return cached value
    return cached
  }

  // Generate stable name if not cached
  const currentName = generateStableComputerName()

  // Cache it
  configStore.set(STABLE_COMPUTER_NAME_CONFIG_KEY, currentName)

  return currentName
}
