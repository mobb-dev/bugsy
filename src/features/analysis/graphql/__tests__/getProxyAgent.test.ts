import { HttpsProxyAgent } from 'https-proxy-agent'
import { describe, expect, it, vi } from 'vitest'

const REQUIRED_ENV = {
  WEB_APP_URL: 'https://example.com',
  API_URL: 'https://example.com/v1/graphql',
  HASURA_ACCESS_KEY: 'test',
  LOCAL_GRAPHQL_ENDPOINT: 'http://localhost:8080/v1/graphql',
}

describe('getProxyAgent', () => {
  const originalEnv = { ...process.env }

  function resetEnv(overrides: Record<string, string | undefined> = {}) {
    process.env = { ...originalEnv, ...REQUIRED_ENV, ...overrides }
  }

  it('uses HttpsProxyAgent for http:// API URLs when HTTP_PROXY is set', async () => {
    vi.resetModules()
    resetEnv({ HTTP_PROXY: 'http://proxy.local:3128', HTTPS_PROXY: '' })

    const { getProxyAgent } = await import('../gql')

    const agent = getProxyAgent('http://localhost:8080/v1/graphql')
    expect(agent).toBeInstanceOf(HttpsProxyAgent)
  })

  it('uses HttpsProxyAgent for https:// API URLs when HTTPS_PROXY is set', async () => {
    vi.resetModules()
    resetEnv({ HTTP_PROXY: '', HTTPS_PROXY: 'http://proxy.local:3128' })

    const { getProxyAgent } = await import('../gql')

    const agent = getProxyAgent('https://api.example.com/v1/graphql')
    expect(agent).toBeInstanceOf(HttpsProxyAgent)
  })

  it('falls back to HTTP_PROXY for https:// API URLs when HTTPS_PROXY is not set', async () => {
    vi.resetModules()
    resetEnv({ HTTP_PROXY: 'http://proxy.local:3128', HTTPS_PROXY: '' })

    const { getProxyAgent } = await import('../gql')

    const agent = getProxyAgent('https://api.example.com/v1/graphql')
    expect(agent).toBeInstanceOf(HttpsProxyAgent)
  })

  it('returns undefined when no proxy is configured', async () => {
    vi.resetModules()
    resetEnv({ HTTP_PROXY: '', HTTPS_PROXY: '' })

    const { getProxyAgent } = await import('../gql')

    const agent = getProxyAgent('http://localhost:8080/v1/graphql')
    expect(agent).toBeUndefined()
  })

  it('returns undefined for invalid URLs', async () => {
    vi.resetModules()
    resetEnv({ HTTP_PROXY: 'http://proxy.local:3128', HTTPS_PROXY: '' })

    const { getProxyAgent } = await import('../gql')

    const agent = getProxyAgent('not a url')
    expect(agent).toBeUndefined()
  })
})
