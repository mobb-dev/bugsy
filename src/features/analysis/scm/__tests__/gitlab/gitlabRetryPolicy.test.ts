import { describe, expect, it } from 'vitest'

import {
  getGitlabRetryDelayMs,
  isGitlabDuplicateMergeRequest,
  isRetryableGitlabStatus,
  isTransientNetworkError,
} from '../../gitlab/gitlab'

// The retry policy is what turned a slow GitLab into a hard CI failure: 408 was
// treated as non-retryable, so `MergeRequests.create` threw on the first attempt
// even though the branch had already been pushed. These tests pin the policy so
// that classification can't silently regress again.
describe('isRetryableGitlabStatus', () => {
  it.each([408, 429, 500, 502, 503, 504, 520, 522, 524])(
    'retries %i',
    (status) => {
      expect(isRetryableGitlabStatus(status)).toBe(true)
    }
  )

  it('retries 408, which is a 4xx but means GitLab gave up on its upstream', () => {
    expect(isRetryableGitlabStatus(408)).toBe(true)
  })

  it.each([200, 201, 301, 400, 401, 403, 404, 409, 422])(
    'does not retry %i',
    (status) => {
      expect(isRetryableGitlabStatus(status)).toBe(false)
    }
  )
})

describe('getGitlabRetryDelayMs', () => {
  it('backs off exponentially, with jitter on top of each step', () => {
    for (const [attempt, base] of [
      [1, 1_000],
      [2, 2_000],
      [3, 4_000],
    ] as const) {
      const waitMs = getGitlabRetryDelayMs({ attempt })
      expect(waitMs).toBeGreaterThanOrEqual(base)
      expect(waitMs).toBeLessThan(base + 1_000)
    }
  })

  it('caps the exponential growth so late attempts stay bounded', () => {
    // Attempt 10 would be 512s uncapped.
    const waitMs = getGitlabRetryDelayMs({ attempt: 10 })
    expect(waitMs).toBeGreaterThanOrEqual(8_000)
    expect(waitMs).toBeLessThan(9_000)
  })

  it('honours a Retry-After given in seconds', () => {
    expect(getGitlabRetryDelayMs({ attempt: 1, retryAfterHeader: '5' })).toBe(
      5_000
    )
  })

  it('caps a large Retry-After so it cannot outlast the callers waiting on us', () => {
    expect(
      getGitlabRetryDelayMs({ attempt: 1, retryAfterHeader: '3600' })
    ).toBe(30_000)
  })

  it.each([
    ['an HTTP-date', 'Wed, 21 Oct 2026 07:28:00 GMT'],
    ['a non-numeric value', 'soon'],
    ['zero', '0'],
    ['a negative value', '-5'],
    ['an absent header', null],
    ['an undefined header', undefined],
  ])('falls back to backoff for %s', (_label, header) => {
    const waitMs = getGitlabRetryDelayMs({
      attempt: 1,
      retryAfterHeader: header,
    })
    expect(waitMs).toBeGreaterThanOrEqual(1_000)
    expect(waitMs).toBeLessThan(2_000)
  })
})

// Retrying a POST means `MergeRequests.create` can land on a branch GitLab
// already opened an MR for. That conflict has to read as success, or the retry
// turns a recoverable timeout into a permanent failure.
describe('isGitlabDuplicateMergeRequest', () => {
  it('recognises the 409 that brokerRequestHandler now carries a status on', () => {
    const error = Object.assign(new Error('gitbeaker: Conflict'), {
      status: 409,
    })
    expect(isGitlabDuplicateMergeRequest(error)).toBe(true)
  })

  it("recognises GitLab's validation message when only text is available", () => {
    expect(
      isGitlabDuplicateMergeRequest(
        new Error(
          'Another open merge request already exists for this source branch: !42'
        )
      )
    ).toBe(true)
  })

  it('does not swallow unrelated failures', () => {
    const forbidden = Object.assign(new Error('gitbeaker: Forbidden'), {
      status: 403,
    })
    expect(isGitlabDuplicateMergeRequest(forbidden)).toBe(false)
    expect(isGitlabDuplicateMergeRequest(new Error('merge conflict'))).toBe(
      false
    )
    expect(isGitlabDuplicateMergeRequest(undefined)).toBe(false)
  })
})

describe('isTransientNetworkError', () => {
  it('retries a native TimeoutError', () => {
    const err = new Error('timeout')
    err.name = 'TimeoutError'
    expect(isTransientNetworkError(err)).toBe(true)
  })

  it('retries an AbortError', () => {
    const err = new Error('aborted')
    err.name = 'AbortError'
    expect(isTransientNetworkError(err)).toBe(true)
  })

  it.each([
    'UND_ERR_HEADERS_TIMEOUT',
    'UND_ERR_BODY_TIMEOUT',
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_SOCKET',
  ])('retries undici TypeError with cause code %s', (code) => {
    const cause = Object.assign(new Error('undici error'), { code })
    const err = Object.assign(new TypeError('fetch failed'), { cause })
    expect(isTransientNetworkError(err)).toBe(true)
  })

  it('does not retry a TypeError without a transient cause', () => {
    const err = Object.assign(new TypeError('fetch failed'), {
      cause: Object.assign(new Error('dns'), { code: 'ENOTFOUND' }),
    })
    expect(isTransientNetworkError(err)).toBe(false)
  })

  it('does not retry arbitrary errors', () => {
    expect(isTransientNetworkError(new Error('something else'))).toBe(false)
    expect(isTransientNetworkError(null)).toBe(false)
    expect(isTransientNetworkError(undefined)).toBe(false)
  })
})
