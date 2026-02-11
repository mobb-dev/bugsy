import { Gitlab } from '@gitbeaker/rest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getGitlabRateLimitStatus } from '../../gitlab/gitlab'

// Mock @gitbeaker/rest so getGitBeaker returns our controlled API object
vi.mock('@gitbeaker/rest', () => ({
  Gitlab: vi.fn(),
  AccessLevel: {
    DEVELOPER: 30,
    MAINTAINER: 40,
    OWNER: 50,
    ADMIN: 60,
  },
}))

// Mock @gitbeaker/requester-utils
vi.mock('@gitbeaker/requester-utils', () => ({
  createRequesterFn: vi.fn((_middleware: unknown, handler: unknown) => handler),
}))

// Mock undici to prevent real HTTP calls
vi.mock('undici', () => ({
  ProxyAgent: vi.fn(),
  Agent: vi.fn(),
  fetch: vi.fn(),
}))

describe('getGitlabRateLimitStatus', () => {
  const defaultParams = {
    repoUrl: 'https://gitlab.com/owner/repo',
    accessToken: 'glpat-test-token',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return rate limit status when all headers are present', async () => {
    const mockShowCurrentUser = vi.fn().mockResolvedValue({
      headers: {
        'ratelimit-remaining': '950',
        'ratelimit-reset': '1700000000',
        'ratelimit-limit': '1000',
      },
    })

    vi.mocked(Gitlab).mockImplementation(
      () =>
        ({
          Users: { showCurrentUser: mockShowCurrentUser },
        }) as unknown as InstanceType<typeof Gitlab>
    )

    const result = await getGitlabRateLimitStatus(defaultParams)

    expect(result).toEqual({
      remaining: 950,
      reset: new Date(1700000000 * 1000),
      limit: 1000,
    })
    expect(mockShowCurrentUser).toHaveBeenCalledWith({ showExpanded: true })
  })

  it('should return null when response.headers is undefined', async () => {
    const mockShowCurrentUser = vi.fn().mockResolvedValue({
      headers: undefined,
    })

    vi.mocked(Gitlab).mockImplementation(
      () =>
        ({
          Users: { showCurrentUser: mockShowCurrentUser },
        }) as unknown as InstanceType<typeof Gitlab>
    )

    const result = await getGitlabRateLimitStatus(defaultParams)

    expect(result).toBeNull()
  })

  it('should return null when required headers are missing', async () => {
    const mockShowCurrentUser = vi.fn().mockResolvedValue({
      headers: {
        'some-other-header': 'value',
      },
    })

    vi.mocked(Gitlab).mockImplementation(
      () =>
        ({
          Users: { showCurrentUser: mockShowCurrentUser },
        }) as unknown as InstanceType<typeof Gitlab>
    )

    const result = await getGitlabRateLimitStatus(defaultParams)

    expect(result).toBeNull()
  })

  it('should return null when API call throws', async () => {
    const mockShowCurrentUser = vi
      .fn()
      .mockRejectedValue(new Error('API error'))

    vi.mocked(Gitlab).mockImplementation(
      () =>
        ({
          Users: { showCurrentUser: mockShowCurrentUser },
        }) as unknown as InstanceType<typeof Gitlab>
    )

    const result = await getGitlabRateLimitStatus(defaultParams)

    expect(result).toBeNull()
  })

  it('should return limit as undefined when ratelimit-limit header is missing', async () => {
    const mockShowCurrentUser = vi.fn().mockResolvedValue({
      headers: {
        'ratelimit-remaining': '500',
        'ratelimit-reset': '1700000000',
      },
    })

    vi.mocked(Gitlab).mockImplementation(
      () =>
        ({
          Users: { showCurrentUser: mockShowCurrentUser },
        }) as unknown as InstanceType<typeof Gitlab>
    )

    const result = await getGitlabRateLimitStatus(defaultParams)

    expect(result).toEqual({
      remaining: 500,
      reset: new Date(1700000000 * 1000),
      limit: undefined,
    })
  })

  it('should return null for malformed header values', async () => {
    const mockShowCurrentUser = vi.fn().mockResolvedValue({
      headers: {
        'ratelimit-remaining': 'not-a-number',
        'ratelimit-reset': 'also-not-a-number',
        'ratelimit-limit': 'bad',
      },
    })

    vi.mocked(Gitlab).mockImplementation(
      () =>
        ({
          Users: { showCurrentUser: mockShowCurrentUser },
        }) as unknown as InstanceType<typeof Gitlab>
    )

    const result = await getGitlabRateLimitStatus(defaultParams)

    expect(result).toBeNull()
  })

  it('should return null when only ratelimit-remaining is present but not ratelimit-reset', async () => {
    const mockShowCurrentUser = vi.fn().mockResolvedValue({
      headers: {
        'ratelimit-remaining': '500',
      },
    })

    vi.mocked(Gitlab).mockImplementation(
      () =>
        ({
          Users: { showCurrentUser: mockShowCurrentUser },
        }) as unknown as InstanceType<typeof Gitlab>
    )

    const result = await getGitlabRateLimitStatus(defaultParams)

    expect(result).toBeNull()
  })
})
