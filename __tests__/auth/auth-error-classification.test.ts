import { ClientError } from 'graphql-request'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthManager, type AuthResult } from '../../src/commands/AuthManager'
import {
  GQLClient,
  isAuthError,
  isTransientError,
} from '../../src/features/analysis/graphql'

// Prevent real browser windows from opening during tests
vi.mock('open', () => ({ default: vi.fn() }))

// ──────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────

function makeClientError(opts: {
  status?: number
  code?: string
  message?: string
}): ClientError {
  const response = {
    status: opts.status ?? 200,
    headers: {} as unknown as Headers,
    errors:
      opts.code || opts.message
        ? [
            {
              message: opts.message ?? 'error',
              extensions: opts.code ? { code: opts.code } : undefined,
            },
          ]
        : undefined,
  } as ClientError['response']
  return new ClientError(response, { query: '' })
}

function makeFetchError(msg = 'FetchError: request failed'): Error {
  const err = new Error(msg)
  err.name = 'FetchError'
  return err
}

// ──────────────────────────────────────────────────
// isAuthError
// ──────────────────────────────────────────────────

describe('isAuthError', () => {
  it('returns true for access-denied ClientError', () => {
    expect(isAuthError(makeClientError({ code: 'access-denied' }))).toBe(true)
  })

  it('returns true for Authentication hook unauthorized', () => {
    expect(
      isAuthError(
        makeClientError({ message: 'Authentication hook unauthorized' })
      )
    ).toBe(true)
  })

  it('returns false for 504 ClientError', () => {
    expect(isAuthError(makeClientError({ status: 504 }))).toBe(false)
  })

  it('returns false for network error (FetchError)', () => {
    expect(isAuthError(makeFetchError())).toBe(false)
  })

  it('returns false for plain Error', () => {
    expect(isAuthError(new Error('something'))).toBe(false)
  })
})

// ──────────────────────────────────────────────────
// isTransientError
// ──────────────────────────────────────────────────

describe('isTransientError', () => {
  it.each([
    ['FetchError', makeFetchError()],
    ['ECONNREFUSED', new Error('ECONNREFUSED 127.0.0.1:443')],
    ['ETIMEDOUT', new Error('ETIMEDOUT')],
    ['ENOTFOUND', new Error('ENOTFOUND api.mobb.ai')],
    ['UND_ERR', new Error('UND_ERR_CONNECT_TIMEOUT')],
  ])('returns true for network error containing %s', (_label, err) => {
    expect(isTransientError(err)).toBe(true)
  })

  it.each([502, 503, 504])('returns true for HTTP %d ClientError', (status) => {
    expect(isTransientError(makeClientError({ status }))).toBe(true)
  })

  it('returns true for HTML "Gateway Time-out" body', () => {
    const err = new Error(
      '<html><body><h1>504 Gateway Time-out</h1></body></html>'
    )
    expect(isTransientError(err)).toBe(true)
  })

  it('returns true for HTML "Bad Gateway" body', () => {
    const err = new Error('Bad Gateway')
    expect(isTransientError(err)).toBe(true)
  })

  it('returns true for "Service Unavailable" body', () => {
    const err = new Error('Service Unavailable')
    expect(isTransientError(err)).toBe(true)
  })

  it('returns false for access-denied ClientError', () => {
    expect(isTransientError(makeClientError({ code: 'access-denied' }))).toBe(
      false
    )
  })

  it('returns false for generic JS Error', () => {
    expect(isTransientError(new Error('something broke'))).toBe(false)
  })
})

// ──────────────────────────────────────────────────
// validateUserToken (via GQLClient)
// ──────────────────────────────────────────────────

describe('GQLClient.validateUserToken', () => {
  let client: GQLClient

  beforeEach(() => {
    client = new GQLClient({ apiKey: 'test-key', type: 'apiKey' })
  })

  it('returns email on success', async () => {
    vi.spyOn(client, 'createCommunityUser').mockResolvedValue(undefined)
    vi.spyOn(client, 'getUserInfo').mockResolvedValue({
      email: 'test@example.com',
    } as Awaited<ReturnType<GQLClient['getUserInfo']>>)

    const result = await client.validateUserToken()
    expect(result).toBe('test@example.com')
  })

  it('returns false on access-denied', async () => {
    vi.spyOn(client, 'createCommunityUser').mockResolvedValue(undefined)
    vi.spyOn(client, 'getUserInfo').mockRejectedValue(
      makeClientError({ code: 'access-denied' })
    )

    const result = await client.validateUserToken()
    expect(result).toBe(false)
  })

  it('throws on 504 (transient)', async () => {
    vi.spyOn(client, 'createCommunityUser').mockResolvedValue(undefined)
    vi.spyOn(client, 'getUserInfo').mockRejectedValue(
      makeClientError({ status: 504 })
    )

    await expect(client.validateUserToken()).rejects.toThrow()
  })

  it('throws on network error', async () => {
    vi.spyOn(client, 'createCommunityUser').mockResolvedValue(undefined)
    vi.spyOn(client, 'getUserInfo').mockRejectedValue(makeFetchError())

    await expect(client.validateUserToken()).rejects.toThrow()
  })
})

// ──────────────────────────────────────────────────
// AuthManager.checkAuthentication
// ──────────────────────────────────────────────────

describe('AuthManager.checkAuthentication', () => {
  let authManager: AuthManager
  let mockClient: GQLClient

  beforeEach(() => {
    authManager = new AuthManager()
    mockClient = new GQLClient({ apiKey: 'test-key', type: 'apiKey' })
    authManager.setGQLClient(mockClient)
  })

  it('returns isAuthenticated: true when token valid', async () => {
    vi.spyOn(mockClient, 'verifyApiConnection').mockResolvedValue(true)
    vi.spyOn(mockClient, 'validateUserToken').mockResolvedValue(
      'test@example.com'
    )

    const result = await authManager.checkAuthentication()
    expect(result.isAuthenticated).toBe(true)
  })

  it('returns reason: invalid on access-denied', async () => {
    vi.spyOn(mockClient, 'verifyApiConnection').mockResolvedValue(true)
    vi.spyOn(mockClient, 'validateUserToken').mockResolvedValue(false)

    const result = await authManager.checkAuthentication()
    expect(result.isAuthenticated).toBe(false)
    expect(
      (result as Extract<AuthResult, { isAuthenticated: false }>).reason
    ).toBe('invalid')
  })

  it('returns reason: unknown on 504', async () => {
    vi.spyOn(mockClient, 'verifyApiConnection').mockResolvedValue(true)
    vi.spyOn(mockClient, 'validateUserToken').mockRejectedValue(
      makeClientError({ status: 504 })
    )

    const result = await authManager.checkAuthentication()
    expect(result.isAuthenticated).toBe(false)
    expect(
      (result as Extract<AuthResult, { isAuthenticated: false }>).reason
    ).toBe('unknown')
  })

  it('returns reason: unknown on network error', async () => {
    vi.spyOn(mockClient, 'verifyApiConnection').mockResolvedValue(true)
    vi.spyOn(mockClient, 'validateUserToken').mockRejectedValue(
      makeFetchError()
    )

    const result = await authManager.checkAuthentication()
    expect(result.isAuthenticated).toBe(false)
    expect(
      (result as Extract<AuthResult, { isAuthenticated: false }>).reason
    ).toBe('unknown')
  })

  it('returns reason: unknown when server unreachable', async () => {
    vi.spyOn(mockClient, 'verifyApiConnection').mockResolvedValue(false)

    const result = await authManager.checkAuthentication()
    expect(result.isAuthenticated).toBe(false)
    expect(
      (result as Extract<AuthResult, { isAuthenticated: false }>).reason
    ).toBe('unknown')
  })
})

// ──────────────────────────────────────────────────
// Browser cooldown
// ──────────────────────────────────────────────────

describe('AuthManager browser cooldown', () => {
  beforeEach(() => {
    AuthManager.resetCooldown()
  })

  it('opens browser when no cooldown set', () => {
    const authManager = new AuthManager()
    // Set a URL to open
    ;(
      authManager as unknown as { currentBrowserUrl: string }
    ).currentBrowserUrl = 'https://example.com/login'

    const result = authManager.openUrlInBrowser()
    expect(result).toBe(true)
  })

  it('opens browser when cooldown expired', () => {
    AuthManager.setBrowserCooldown(1000)
    // Set lastBrowserOpenTime to far in the past
    ;(
      AuthManager as unknown as { lastBrowserOpenTime: number }
    ).lastBrowserOpenTime = Date.now() - 2000

    const authManager = new AuthManager()
    ;(
      authManager as unknown as { currentBrowserUrl: string }
    ).currentBrowserUrl = 'https://example.com/login'

    const result = authManager.openUrlInBrowser()
    expect(result).toBe(true)
  })

  it('returns false when within cooldown period', () => {
    AuthManager.setBrowserCooldown(60000) // 60s cooldown
    // Simulate a recent browser open
    ;(
      AuthManager as unknown as { lastBrowserOpenTime: number }
    ).lastBrowserOpenTime = Date.now()

    const authManager = new AuthManager()
    ;(
      authManager as unknown as { currentBrowserUrl: string }
    ).currentBrowserUrl = 'https://example.com/login'

    const result = authManager.openUrlInBrowser()
    expect(result).toBe(false)
  })

  it('returns false when no browser URL set', () => {
    const authManager = new AuthManager()
    const result = authManager.openUrlInBrowser()
    expect(result).toBe(false)
  })
})
