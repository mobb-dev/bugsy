import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ScmRepoInfo } from '../../types'
import {
  clearRepoListCache,
  getCachedRepoList,
  repoListCacheKey,
} from '../repoListCache'

const repo = (name: string): ScmRepoInfo => ({
  repoName: name,
  repoUrl: `https://example.com/org/${name}`,
  repoOwner: 'org',
  repoLanguages: [],
  repoIsPublic: false,
  repoUpdatedAt: null,
  repoDefaultBranch: null,
  repoIsArchived: false,
})

describe('repoListCache', () => {
  afterEach(() => {
    clearRepoListCache()
    vi.useRealTimers()
  })

  it('serves a second call from cache within the TTL', async () => {
    const fetchAll = vi.fn().mockResolvedValue([repo('a')])
    const key = repoListCacheKey({
      accessToken: 'tok',
      origin: 'https://ghes.corp',
      scmOrg: 'org',
    })

    await getCachedRepoList(key, fetchAll)
    const second = await getCachedRepoList(key, fetchAll)

    expect(fetchAll).toHaveBeenCalledTimes(1)
    expect(second.map((r) => r.repoName)).toEqual(['a'])
  })

  it('refetches after the TTL expires', async () => {
    vi.useFakeTimers()
    const fetchAll = vi.fn().mockResolvedValue([repo('a')])
    const key = repoListCacheKey({
      accessToken: 'tok',
      origin: 'https://ghes.corp',
      scmOrg: 'org',
    })

    await getCachedRepoList(key, fetchAll)
    vi.advanceTimersByTime(90_001)
    await getCachedRepoList(key, fetchAll)

    expect(fetchAll).toHaveBeenCalledTimes(2)
  })

  it('isolates different tokens even for the same org', async () => {
    // The list is what THIS token can see — a shared entry would hand one
    // user's private-repo list to another.
    const keyA = repoListCacheKey({
      accessToken: 'user-a',
      origin: 'https://ghes.corp',
      scmOrg: 'org',
    })
    const keyB = repoListCacheKey({
      accessToken: 'user-b',
      origin: 'https://ghes.corp',
      scmOrg: 'org',
    })
    expect(keyA).not.toEqual(keyB)

    await getCachedRepoList(keyA, vi.fn().mockResolvedValue([repo('private')]))
    const fetchB = vi.fn().mockResolvedValue([repo('public')])
    const listB = await getCachedRepoList(keyB, fetchB)

    expect(fetchB).toHaveBeenCalledTimes(1)
    expect(listB.map((r) => r.repoName)).toEqual(['public'])
  })

  it('never stores the raw token in the key', () => {
    const key = repoListCacheKey({
      accessToken: 'glpat-super-secret',
      origin: 'https://gitlab.corp',
      scmOrg: 'org',
    })
    expect(key).not.toContain('glpat-super-secret')
  })
})

describe('repoListCache in-flight dedup', () => {
  afterEach(() => clearRepoListCache())

  it('shares one fetch between concurrent same-key callers', async () => {
    // Definite assignment: the Promise executor runs synchronously.
    let resolveFetch!: (v: ScmRepoInfo[]) => void
    const fetchAll = vi.fn(
      () => new Promise<ScmRepoInfo[]>((res) => (resolveFetch = res))
    )
    const key = repoListCacheKey({ accessToken: 't', origin: 'o' })

    const first = getCachedRepoList(key, fetchAll)
    const second = getCachedRepoList(key, fetchAll)
    resolveFetch([repo('a')])

    expect(await first).toEqual(await second)
    expect(fetchAll).toHaveBeenCalledTimes(1)
  })

  it('does not cache a rejected fetch for the TTL', async () => {
    const key = repoListCacheKey({ accessToken: 't', origin: 'o' })
    await expect(
      getCachedRepoList(key, () => Promise.reject(new Error('boom')))
    ).rejects.toThrow('boom')

    const retry = vi.fn().mockResolvedValue([repo('a')])
    await getCachedRepoList(key, retry)
    expect(retry).toHaveBeenCalledTimes(1)
  })
})

describe('repoListCache slow-drain and eviction behavior', () => {
  afterEach(() => {
    clearRepoListCache()
    vi.useRealTimers()
  })

  it('keeps sharing an in-flight drain even past the TTL', async () => {
    vi.useFakeTimers()
    let resolveFetch!: (v: ScmRepoInfo[]) => void
    const fetchAll = vi.fn(
      () => new Promise<ScmRepoInfo[]>((res) => (resolveFetch = res))
    )
    const key = repoListCacheKey({ accessToken: 't', origin: 'o' })

    const first = getCachedRepoList(key, fetchAll)
    // The drain outlives the TTL — the entry must still be shared, not
    // treated as expired (which restarted a parallel drain per caller).
    vi.advanceTimersByTime(90_001)
    const second = getCachedRepoList(key, fetchAll)

    resolveFetch([repo('a')])
    expect(await first).toEqual(await second)
    expect(fetchAll).toHaveBeenCalledTimes(1)
  })

  it('refreshing an existing key does not evict an unrelated entry', async () => {
    vi.useFakeTimers()
    const keyFor = (i: number) =>
      repoListCacheKey({ accessToken: `t${i}`, origin: 'o' })
    // Fill to capacity (30).
    for (let i = 0; i < 30; i++) {
      await getCachedRepoList(keyFor(i), () => Promise.resolve([repo(`r${i}`)]))
    }
    // Expire everything, then refresh key 0: the expired sweep plus the
    // has(key) guard must not evict a fresh unrelated entry.
    vi.advanceTimersByTime(90_001)
    const refetch0 = vi.fn().mockResolvedValue([repo('r0-new')])
    await getCachedRepoList(keyFor(0), refetch0)
    expect(refetch0).toHaveBeenCalledTimes(1)

    // Key 0 is now fresh; asking again within TTL must hit the cache.
    const again0 = vi.fn().mockResolvedValue([repo('never')])
    await getCachedRepoList(keyFor(0), again0)
    expect(again0).not.toHaveBeenCalled()
  })
})
