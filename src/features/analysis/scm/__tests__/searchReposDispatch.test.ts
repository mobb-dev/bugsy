/**
 * Hermetic tests for the searchRepos dispatch decisions — the paths a live
 * suite can't force: cursor-domain stickiness, the empty-first-page substring
 * rescue, the GHES search-disabled degrade, and Bitbucket's per-workspace
 * pagination state. Provider APIs are stubbed at the SDK boundary.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BitbucketSCMLib } from '../bitbucket/BitbucketSCMLib'
import { GithubSCMLib } from '../github/GithubSCMLib'
import type { ScmRepoInfo } from '../types'
import { clearRepoListCache } from '../utils/repoListCache'

const repo = (name: string, owner = 'mobb-dev'): ScmRepoInfo => ({
  repoName: name,
  repoUrl: `https://github.com/${owner}/${name}`,
  repoOwner: owner,
  repoLanguages: [],
  repoIsPublic: false,
  repoUpdatedAt: '2026-01-01T00:00:00Z',
  repoDefaultBranch: 'main',
  repoIsArchived: false,
})

/** Fresh lib per test with a unique token, so the drain cache never crosses. */
let tokenSeq = 0
function githubLib(scmOrg?: string) {
  const lib = new GithubSCMLib(undefined, `test-token-${tokenSeq++}`, scmOrg)
  const searchApi = vi.spyOn(lib.githubSdk, 'searchRepositories')
  const ownerKind = vi
    .spyOn(lib.githubSdk, 'getUserProfile')
    .mockResolvedValue({ type: 'Organization' } as never)
  const drain = vi
    .spyOn(lib, 'getRepoList')
    .mockResolvedValue([
      repo('autofixer'),
      repo('engine'),
      repo('other', 'someone-else'),
    ])
  return { lib, searchApi, ownerKind, drain }
}

afterEach(() => {
  clearRepoListCache()
  vi.restoreAllMocks()
})

describe('GithubSCMLib.searchRepos dispatch', () => {
  it("an 'offset:' cursor pins the session to the drained path", async () => {
    const { lib, searchApi, drain } = githubLib('mobb-dev')

    const page = await lib.searchRepos({
      scmOrg: 'mobb-dev',
      query: 'fixer',
      limit: 1,
      cursor: 'offset:1',
    })

    expect(searchApi).not.toHaveBeenCalled()
    expect(drain).toHaveBeenCalled()
    // Offset 1 of the single substring match set -> past the end, done.
    expect(page.hasMore).toBe(false)
  })

  it('an empty native first page re-checks the drain for substring matches', async () => {
    const { lib, searchApi, drain } = githubLib('mobb-dev')
    searchApi.mockResolvedValue({ items: [], totalCount: 0, hasMore: false })

    const page = await lib.searchRepos({
      scmOrg: 'mobb-dev',
      query: 'fixer', // substring of 'autofixer'; in:name would return nothing
      limit: 10,
    })

    expect(drain).toHaveBeenCalled()
    expect(page.results.map((r) => r.repoName)).toEqual(['autofixer'])
    // A one-off rescue on a working provider is not a degraded capability.
    expect(page.searchMode).toBe('native')
    // The drain is owner-filtered — the other org's repos never leak in.
    expect(page.results.every((r) => r.repoOwner === 'mobb-dev')).toBe(true)
  })

  it('Search-unavailable (GHES) degrades to the drain and says so', async () => {
    const { lib, searchApi } = githubLib('mobb-dev')
    const disabled = Object.assign(new Error('Search is disabled'), {
      status: 404,
    })
    searchApi.mockRejectedValue(disabled)

    const page = await lib.searchRepos({ scmOrg: 'mobb-dev', limit: 10 })

    expect(page.searchMode).toBe('fallback')
    expect(page.results.length).toBeGreaterThan(0)
  })

  it('rate limits propagate instead of silently draining', async () => {
    const { lib, searchApi } = githubLib('mobb-dev')
    searchApi.mockRejectedValue(new Error('API rate limit exceeded'))

    await expect(
      lib.searchRepos({ scmOrg: 'mobb-dev', query: 'x', limit: 10 })
    ).rejects.toThrow('rate limit')
  })

  it('no-owner queries use the drain (collaborator completeness) and report it', async () => {
    const { lib, searchApi } = githubLib()

    const page = await lib.searchRepos({
      scmOrg: undefined,
      query: 'other',
      limit: 10,
    })

    expect(searchApi).not.toHaveBeenCalled()
    // Finds the repo owned by an account the Search API could not scope to.
    expect(page.results.map((r) => r.repoName)).toEqual(['other'])
    // Systematic drain the user feels — surfaced as fallback.
    expect(page.searchMode).toBe('fallback')
  })
})

describe('BitbucketSCMLib.searchRepos multi-workspace pagination', () => {
  it('round-trips per-workspace page state through the cursor', async () => {
    const lib = new BitbucketSCMLib(
      undefined,
      `bb-token-${tokenSeq++}`,
      undefined
    )
    const sdk = (lib as unknown as { bitbucketSdk: { searchRepos: unknown } })
      .bitbucketSdk
    const sdkSearch = vi
      .spyOn(sdk as { searchRepos: (p: unknown) => unknown }, 'searchRepos')
      .mockResolvedValue({
        items: [repo('a', 'ws1')],
        hasMore: true,
        workspacePages: { ws1: 2, ws2: null },
      })

    const page1 = await lib.searchRepos({ scmOrg: undefined, limit: 100 })
    expect(page1.nextCursor).toBe(JSON.stringify({ ws1: 2, ws2: null }))

    await lib.searchRepos({
      scmOrg: undefined,
      limit: 100,
      cursor: page1.nextCursor,
    })
    // The exhausted workspace stays exhausted; the deep one resumes at page 2.
    expect(sdkSearch).toHaveBeenLastCalledWith(
      expect.objectContaining({ workspacePages: { ws1: 2, ws2: null } })
    )
  })

  it('a foreign or corrupt cursor restarts cleanly instead of throwing', async () => {
    const lib = new BitbucketSCMLib(
      undefined,
      `bb-token-${tokenSeq++}`,
      undefined
    )
    const sdk = (lib as unknown as { bitbucketSdk: { searchRepos: unknown } })
      .bitbucketSdk
    const sdkSearch = vi
      .spyOn(sdk as { searchRepos: (p: unknown) => unknown }, 'searchRepos')
      .mockResolvedValue({ items: [], hasMore: false, workspacePages: {} })

    await lib.searchRepos({ scmOrg: undefined, limit: 100, cursor: 'page:2' })

    expect(sdkSearch).toHaveBeenCalledWith(
      expect.objectContaining({ workspacePages: undefined })
    )
  })
})
