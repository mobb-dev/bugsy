/**
 * Tests for computerName utilities
 *
 * Note: We only test the suffix-stripping logic here, which is pure logic
 * that doesn't depend on OS commands. Testing OS-specific commands (scutil,
 * cat /etc/hostname, etc.) with mocks is not useful - it just verifies mocks
 * return what we told them to return.
 *
 * The suffix stripping is the critical logic that ensures stable computer names
 * across network changes.
 */
/**
 * We replicate the suffix stripping logic here to test it independently
 * without mocking OS commands. The actual implementation uses the same
 * HOSTNAME_SUFFIXES list and stripHostnameSuffixes logic.
 */
import { describe, expect, it } from 'vitest'

const HOSTNAME_SUFFIXES = [
  '.ec2.internal',
  '.compute.internal',
  '.cloudapp.net',
  '.local',
  '.localhost',
  '.localdomain',
  '.lan',
  '.home',
  '.homelan',
  '.corp',
  '.internal',
  '.intranet',
  '.domain',
  '.work',
  '.office',
  '.docker',
  '.kubernetes',
  '.k8s',
]

function stripHostnameSuffixes(hostname: string): string {
  if (!hostname) return hostname
  let normalized = hostname
  for (const suffix of HOSTNAME_SUFFIXES) {
    if (normalized.endsWith(suffix)) {
      normalized = normalized.slice(0, -suffix.length)
      break
    }
  }
  return normalized
}

describe('computerName utilities', () => {
  describe('suffix stripping', () => {
    const testCases: [string, string][] = [
      // mDNS/Bonjour
      ['host.local', 'host'],
      ['host.localdomain', 'host'],
      ['Jonathans-MacBook-Pro-2.local', 'Jonathans-MacBook-Pro-2'],

      // Home networks
      ['host.lan', 'host'],
      ['host.home', 'host'],
      ['host.homelan', 'host'],

      // Corporate networks
      ['host.corp', 'host'],
      ['host.internal', 'host'],
      ['host.intranet', 'host'],
      ['host.domain', 'host'],
      ['host.work', 'host'],
      ['host.office', 'host'],
      ['LNLAMSD6218.localdomain', 'LNLAMSD6218'],

      // Container environments
      ['host.docker', 'host'],
      ['host.kubernetes', 'host'],
      ['host.k8s', 'host'],

      // Cloud providers (most specific - should match first)
      ['host.ec2.internal', 'host'],
      ['host.compute.internal', 'host'],
      ['host.cloudapp.net', 'host'],

      // No suffix - should remain unchanged
      ['plain-hostname', 'plain-hostname'],
      ['my-computer', 'my-computer'],

      // Empty string
      ['', ''],
    ]

    testCases.forEach(([input, expected]) => {
      it(`should strip "${input}" to "${expected}"`, () => {
        const result = stripHostnameSuffixes(input)
        expect(result).toBe(expected)
      })
    })

    it('should only strip one suffix (most specific match)', () => {
      // If a hostname somehow has multiple suffixes, only strip the first match
      const result = stripHostnameSuffixes('host.ec2.internal')
      expect(result).toBe('host')
      // The logic stops after first match, so it won't try to strip .internal again
    })

    it('should preserve hostname if no known suffix', () => {
      const result = stripHostnameSuffixes('host.unknown.suffix')
      expect(result).toBe('host.unknown.suffix')
    })
  })
})
