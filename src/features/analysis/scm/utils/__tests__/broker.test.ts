import { describe, expect, it } from 'vitest'

import { getBrokerEffectiveUrl } from '../broker'

describe('getBrokerEffectiveUrl', () => {
  const brokerHosts = [
    { virtualDomain: 'virtual1.example.com', realDomain: 'real1.example.com' },
    { virtualDomain: 'virtual2.example.com', realDomain: 'real2.example.com' },
  ]

  it('should return the original URL when brokerHosts is not provided', () => {
    const url = 'https://example.com/path'
    expect(getBrokerEffectiveUrl({ url })).toBe(url)
  })

  it('should return the original URL when no matching broker is found', () => {
    const url = 'https://nonexistent.example.com/path'
    expect(getBrokerEffectiveUrl({ url, brokerHosts })).toBe(url)
  })

  it('should replace the domain with virtual domain when a matching broker is found', () => {
    const url = 'https://real1.example.com/path?query=value'
    const expected = 'https://virtual1.example.com/path?query=value'
    expect(getBrokerEffectiveUrl({ url, brokerHosts })).toBe(expected)
  })

  it('should handle case-insensitive hostname matching', () => {
    const url = 'https://REAL2.EXAMPLE.COM/path'
    const expected = 'https://virtual2.example.com/path'
    expect(getBrokerEffectiveUrl({ url, brokerHosts })).toBe(expected)
  })

  /**
   * A server on a non-default port enrols as `real3.example.com:8443` — that is
   * the host the app canonicalises to — and matching only the bare hostname sent
   * every request straight past the tunnel while the UI reported a live broker.
   */
  it('matches a broker enrolled for a host with a port', () => {
    const withPort = [
      {
        virtualDomain: 'virtual3.example.com',
        realDomain: 'real3.example.com:8443',
      },
    ]
    expect(
      getBrokerEffectiveUrl({
        url: 'https://real3.example.com:8443/path',
        brokerHosts: withPort,
      })
    ).toBe('https://virtual3.example.com/path')
    // A different port is a different server, and must not be routed there.
    expect(
      getBrokerEffectiveUrl({
        url: 'https://real3.example.com:9443/path',
        brokerHosts: withPort,
      })
    ).toBe('https://real3.example.com:9443/path')
  })

  it('should preserve the path and query parameters', () => {
    const url =
      'https://real1.example.com/some/long/path?param1=value1&param2=value2'
    const expected =
      'https://virtual1.example.com/some/long/path?param1=value1&param2=value2'
    expect(getBrokerEffectiveUrl({ url, brokerHosts })).toBe(expected)
  })
})
