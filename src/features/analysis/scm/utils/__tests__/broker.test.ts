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

  it('should preserve the path and query parameters', () => {
    const url =
      'https://real1.example.com/some/long/path?param1=value1&param2=value2'
    const expected =
      'https://virtual1.example.com/some/long/path?param1=value1&param2=value2'
    expect(getBrokerEffectiveUrl({ url, brokerHosts })).toBe(expected)
  })
})
