import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { getGithubSdk, parseGithubOwnerAndRepo } from '../github'
import { GithubSCMLib } from '../github/GithubSCMLib'
import { createScmLib } from '../scmFactory'
import { ScmLibScmType } from '../types'
import { RepoConfig } from './common'
import { env } from './env'

const reposConfig: RepoConfig[] = [
  {
    url: {
      valid: 'https://github.com/facebook/react',
      invalid: 'https://invalid.com/facebook',
      nonExisting: 'https://github.com/facebook/react1111',
    },
    commit: {
      date: new Date('2023-02-20T21:16:23.000Z'),
      sha: 'c7967b194b41cb16907eed718b78d89120089f6a',
    },
    branch: {
      name: 'portals',
      date: new Date('2020-02-05T00:00:59.000Z'),
      sha: '628f6f50b514529101a142242846985f7b4be048',
    },
    tag: {
      name: 'v18.2.0',
      date: new Date('2022-06-14T19:51:27.000Z'),
      sha: '8cab1b4d64ca7f52e5e1b45c4e6a6a99cc1ed591',
    },
    //We need a real token to have better rate limits, even though it is a public repo
    accessToken: env.PLAYWRIGHT_GH_CLOUD_PAT,
  },
  {
    url: {
      valid: env.PLAYWRIGHT_GH_ON_PREM_REPO_URL,
      invalid: 'https://invalid.com/org',
      nonExisting: `${env.PLAYWRIGHT_GH_ON_PREM_URL}/org/I_DONT_EXIST`,
    },
    commit: {
      date: new Date('2024-09-04T19:44:38.000Z'),
      sha: 'bb6e84ddcf98f4a65f51dd6114fe939d2fbf83d8',
    },
    branch: {
      name: 'main',
      date: new Date('2024-09-04T19:44:38.000Z'),
      sha: 'bb6e84ddcf98f4a65f51dd6114fe939d2fbf83d8',
    },
    tag: {
      name: '0.0.1',
      date: new Date('2024-09-04T19:44:38.000Z'),
      sha: 'bb6e84ddcf98f4a65f51dd6114fe939d2fbf83d8',
    },
    accessToken: env.PLAYWRIGHT_GH_ON_PREM_PAT,
  },
]

describe.each(Object.entries(reposConfig))(
  'Github reference',
  (_, repoConfig: RepoConfig) => {
    beforeAll(async () => {
      // Disable the certificate check when calling a resource and avoids the 'self-signed certificate' error.
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    })
    afterAll(async () => {
      // Enabling it again, just in case. The certificate check gets disabled on the `beforeAll` clause.
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
    })
    it('test non existing repo', async () => {
      await expect(() =>
        getGithubSdk({
          auth: repoConfig.accessToken,
          url: repoConfig.url.valid,
          isEnableRetries: true,
        }).getGithubRepoDefaultBranch(repoConfig.url.nonExisting)
      ).rejects.toThrow('Not Found')
    })
    it('test existing repo', async () => {
      expect(
        await getGithubSdk({
          auth: repoConfig.accessToken,
          url: repoConfig.url.valid,
          isEnableRetries: true,
        }).getGithubRepoDefaultBranch(repoConfig.url.valid)
      ).toEqual('main')
    })
    it('branch list non existing repo', async () => {
      await expect(() =>
        getGithubSdk({
          auth: repoConfig.accessToken,
          url: repoConfig.url.valid,
          isEnableRetries: true,
        }).getGithubBranchList(repoConfig.url.nonExisting)
      ).rejects.toThrow('Not Found')
    })
    it('branch list existing repo', async () => {
      const response = await getGithubSdk({
        auth: repoConfig.accessToken,
        url: repoConfig.url.valid,
        isEnableRetries: true,
      }).getGithubBranchList(repoConfig.url.valid)
      expect(response.data.length).toEqual(100)
    })

    it('test if date is correct for commit', async () => {
      const response = await getGithubSdk({
        auth: repoConfig.accessToken,
        url: repoConfig.url.valid,
        isEnableRetries: true,
      }).getGithubReferenceData({
        gitHubUrl: repoConfig.url.valid,
        ref: repoConfig.commit.sha,
      })
      expect(response).toStrictEqual({
        date: repoConfig.commit.date,
        sha: repoConfig.commit.sha,
        type: 'COMMIT',
      })
    })
    it('test if date is correct for branch', async () => {
      const response = await getGithubSdk({
        auth: repoConfig.accessToken,
        url: repoConfig.url.valid,
        isEnableRetries: true,
      }).getGithubReferenceData({
        gitHubUrl: repoConfig.url.valid,
        ref: repoConfig.branch.name,
      })
      expect(response).toStrictEqual({
        date: repoConfig.branch.date,
        sha: repoConfig.branch.sha,
        type: 'BRANCH',
      })
    })
    it('test if date is correct for tag', async () => {
      const response = await getGithubSdk({
        auth: repoConfig.accessToken,
        url: repoConfig.url.valid,
        isEnableRetries: true,
      }).getGithubReferenceData({
        gitHubUrl: repoConfig.url.valid,
        ref: repoConfig.tag.name,
      })
      expect(response).toStrictEqual({
        date: repoConfig.tag.date,
        sha: repoConfig.tag.sha,
        type: 'TAG',
      })
    })
    it('test we get an error for incorrect tag', async () => {
      await expect(
        getGithubSdk({
          auth: repoConfig.accessToken,
          url: repoConfig.url.valid,
          isEnableRetries: true,
        }).getGithubReferenceData({
          gitHubUrl: repoConfig.url.valid,
          ref: 'I_DO_NOT_EXIST',
        })
      ).rejects.toThrow('ref')
    })
  }
)

const OWNER = 'facebook'
const REPO = 'react'
const GITHUB_URL = `https://github.com/${OWNER}/${REPO}`
const GITHUB_ON_PREM_URL = `https://my.custom-onprem-domain.com/${OWNER}/${REPO}`
const INVALID_URL = 'https://invalid.com/facebook'

describe('scm instance tests', () => {
  it('should return the correct headers for basic auth type ', async () => {
    const scmLib = await createScmLib({
      url: env.PLAYWRIGHT_GH_CLOUD_REPO_URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: env.PLAYWRIGHT_GH_CLOUD_PAT,
      scmOrg: undefined,
    })
    const authHeaders = scmLib.getAuthHeaders()
    expect(authHeaders).toStrictEqual({
      authorization: `Bearer ${env.PLAYWRIGHT_GH_CLOUD_PAT}`,
    })
  })
})

describe('parsing github url', () => {
  it.each([GITHUB_ON_PREM_URL, GITHUB_URL])('should parse the url', (url) => {
    expect(parseGithubOwnerAndRepo(url)).toEqual({
      owner: OWNER,
      repo: REPO,
    })
  })
  it('should work with trailing slash', () => {
    const response = parseGithubOwnerAndRepo(`${GITHUB_URL}/`)
    expect(response).toStrictEqual({
      owner: OWNER,
      repo: REPO,
    })
  })
  it('fail if the url is invalid', () => {
    expect(() => parseGithubOwnerAndRepo(INVALID_URL)).toThrow(
      `invalid github repo Url ${INVALID_URL}`
    )
  })
})

describe('GitHub SDK rate limits and recent commits', () => {
  it('getRateLimitStatus returns remaining and limit', async () => {
    const sdk = getGithubSdk({
      auth: env.PLAYWRIGHT_GH_CLOUD_PAT,
      url: GITHUB_URL,
      isEnableRetries: true,
    })
    const status = await sdk.getRateLimitStatus()
    expect(typeof status.remaining).toBe('number')
    expect(typeof status.limit).toBe('number')
  })

  it('getRecentCommits returns commits since a given timestamp', async () => {
    const sdk = getGithubSdk({
      auth: env.PLAYWRIGHT_GH_CLOUD_PAT,
      url: GITHUB_URL,
      isEnableRetries: true,
    })
    const since = new Date('2020-01-01T00:00:00Z').toISOString()
    const res = await sdk.getRecentCommits({ owner: OWNER, repo: REPO, since })
    expect(Array.isArray(res.data)).toBe(true)
  })
})

describe('GithubSCMLib wrappers for rate limit and recent commits', () => {
  it('exposes getRateLimitStatus and getRecentCommits', async () => {
    const scmLib = await createScmLib({
      url: GITHUB_URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: env.PLAYWRIGHT_GH_CLOUD_PAT,
      scmOrg: undefined,
    })
    // Expect wrappers to work
    const status = await (scmLib as GithubSCMLib).getRateLimitStatus()
    expect(status).not.toBeNull()
    expect(typeof status!.remaining).toBe('number')
    const since = new Date('2020-01-01T00:00:00Z').toISOString()
    const commits = await (scmLib as GithubSCMLib).getRecentCommits(since)
    expect(Array.isArray(commits.data)).toBe(true)
  })
})

describe('getPrCommitsBatch - batch fetch PR commits via GraphQL', () => {
  it('fetches commits for multiple PRs in a single request', async () => {
    const sdk = getGithubSdk({
      auth: env.PLAYWRIGHT_GH_CLOUD_PAT,
      url: GITHUB_URL,
      isEnableRetries: true,
    })

    // Use known merged PRs from facebook/react that have commits
    // PR #28379, #28378, #28377 are recent PRs that should exist
    const prNumbers = [28379, 28378, 28377]

    const result = await sdk.getPrCommitsBatch({
      owner: OWNER,
      repo: REPO,
      prNumbers,
    })

    // Should return a Map with entries for each PR
    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(prNumbers.length)

    // Each PR should have an array of commit SHAs
    for (const prNumber of prNumbers) {
      const commits = result.get(prNumber)
      expect(Array.isArray(commits)).toBe(true)
      // Each commit SHA should be a string (40 char hex)
      if (commits && commits.length > 0) {
        expect(typeof commits[0]).toBe('string')
        expect(commits[0]).toMatch(/^[a-f0-9]{40}$/)
      }
    }
  })

  it('handles non-existent PR numbers gracefully', async () => {
    const sdk = getGithubSdk({
      auth: env.PLAYWRIGHT_GH_CLOUD_PAT,
      url: GITHUB_URL,
      isEnableRetries: true,
    })

    // Mix of existing and non-existing PRs
    const prNumbers = [28379, 999999999]

    const result = await sdk.getPrCommitsBatch({
      owner: OWNER,
      repo: REPO,
      prNumbers,
    })

    expect(result).toBeInstanceOf(Map)
    // Existing PR should have commits
    expect(result.get(28379)?.length).toBeGreaterThan(0)
    // Non-existing PR should have empty array
    expect(result.get(999999999)).toEqual([])
  })

  it('returns empty map for empty input', async () => {
    const sdk = getGithubSdk({
      auth: env.PLAYWRIGHT_GH_CLOUD_PAT,
      url: GITHUB_URL,
      isEnableRetries: true,
    })

    const result = await sdk.getPrCommitsBatch({
      owner: OWNER,
      repo: REPO,
      prNumbers: [],
    })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(0)
  })

  it('works via GithubSCMLib wrapper', async () => {
    // Instantiate GithubSCMLib directly to avoid createScmLib's fallback behavior
    const scmLib = new GithubSCMLib(
      GITHUB_URL,
      env.PLAYWRIGHT_GH_CLOUD_PAT,
      undefined
    )

    const prNumbers = [28379, 28378]
    const result = await scmLib.getPrCommitsBatch(GITHUB_URL, prNumbers)

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(2)
    expect(result.get(28379)?.length).toBeGreaterThan(0)
  })
})

describe('getPullRequestMetrics', () => {
  const TEST_REPO_URL = 'https://github.com/mobbcitestjob/ai-blame-e2e-tests'
  const TEST_PR_NUMBER = 2303

  it('returns comprehensive PR metrics for closed PR', async () => {
    const scmLib = await createScmLib({
      url: TEST_REPO_URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: env.PLAYWRIGHT_GH_CLOUD_PAT,
      scmOrg: undefined,
    })

    const metrics = await (scmLib as GithubSCMLib).getPullRequestMetrics(
      TEST_PR_NUMBER
    )

    // Verify basic fields
    expect(metrics.prId).toBe(String(TEST_PR_NUMBER))
    expect(metrics.repositoryUrl).toBe(TEST_REPO_URL)

    // Verify PR status is one of the valid types
    expect(['ACTIVE', 'CLOSED', 'MERGED', 'DRAFT']).toContain(metrics.prStatus)

    // Verify dates are valid Date objects
    expect(metrics.prCreatedAt).toBeInstanceOf(Date)
    expect(metrics.prCreatedAt.getTime()).toBeGreaterThan(0)

    // prMergedAt can be null for unmerged PRs
    if (metrics.prMergedAt !== null) {
      expect(metrics.prMergedAt).toBeInstanceOf(Date)
    }

    // Verify numeric fields are valid
    expect(typeof metrics.linesAdded).toBe('number')
    expect(metrics.linesAdded).toBeGreaterThanOrEqual(0)

    expect(Array.isArray(metrics.commentIds)).toBe(true)
    expect(metrics.commentIds.length).toBeGreaterThanOrEqual(0)
  })
})

describe('GithubSCMLib pagination methods', () => {
  const GITHUB_ORG = 'facebook'
  const GITHUB_REPO_URL = 'https://github.com/facebook/react'

  describe('searchRepos', () => {
    it('should search repositories with pagination using GitHub Search API', async () => {
      const scmLib = new GithubSCMLib(
        undefined,
        env.PLAYWRIGHT_GH_CLOUD_PAT,
        GITHUB_ORG
      )

      const result = await scmLib.searchRepos({
        scmOrg: GITHUB_ORG,
        sort: { field: 'updated', order: 'desc' },
        limit: 5,
      })

      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
      expect(result.results.length).toBeLessThanOrEqual(5)
      expect(result.hasMore).toBeDefined()
      expect(typeof result.hasMore).toBe('boolean')

      // Verify structure of repo objects
      if (result.results.length > 0) {
        const repo = result.results[0]!
        expect(repo.repoName).toBeDefined()
        expect(repo.repoUrl).toBeDefined()
        expect(repo.repoOwner).toBeDefined()
      }
    })

    it('should fallback to base implementation when scmOrg is undefined', async () => {
      const scmLib = new GithubSCMLib(
        undefined,
        env.PLAYWRIGHT_GH_CLOUD_PAT,
        undefined
      )

      const result = await scmLib.searchRepos({
        scmOrg: undefined,
        sort: { field: 'updated', order: 'desc' },
        limit: 5,
      })

      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      // Should use base class implementation (getRepoList + in-memory pagination)
      expect(result.hasMore).toBeDefined()
    })

    it('should handle cursor-based pagination', async () => {
      const scmLib = new GithubSCMLib(
        undefined,
        env.PLAYWRIGHT_GH_CLOUD_PAT,
        GITHUB_ORG
      )

      // Get first page
      const firstPage = await scmLib.searchRepos({
        scmOrg: GITHUB_ORG,
        sort: { field: 'updated', order: 'desc' },
        limit: 3,
      })

      expect(firstPage.results.length).toBeGreaterThan(0)

      // Get second page if available
      if (firstPage.hasMore && firstPage.nextCursor) {
        const secondPage = await scmLib.searchRepos({
          scmOrg: GITHUB_ORG,
          sort: { field: 'updated', order: 'desc' },
          limit: 3,
          cursor: firstPage.nextCursor,
        })

        expect(secondPage.results.length).toBeGreaterThan(0)
        // Verify pages are different
        const firstPageRepoNames = new Set(
          firstPage.results.map((r) => r.repoName)
        )
        const secondPageRepoNames = new Set(
          secondPage.results.map((r) => r.repoName)
        )
        const overlap = [...firstPageRepoNames].filter((name) =>
          secondPageRepoNames.has(name)
        )
        expect(overlap.length).toBe(0)
      }
    })
  })

  describe('searchSubmitRequests', () => {
    it('should search pull requests with pagination using GitHub Search API', async () => {
      const scmLib = new GithubSCMLib(
        GITHUB_REPO_URL,
        env.PLAYWRIGHT_GH_CLOUD_PAT,
        GITHUB_ORG
      )

      const result = await scmLib.searchSubmitRequests({
        repoUrl: GITHUB_REPO_URL,
        sort: { field: 'updated', order: 'desc' },
        limit: 5,
      })

      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.hasMore).toBeDefined()
      expect(typeof result.hasMore).toBe('boolean')

      // Verify structure of PR objects
      if (result.results.length > 0) {
        const pr = result.results[0]!
        expect(pr.submitRequestId).toBeDefined()
        expect(pr.submitRequestNumber).toBeDefined()
        expect(pr.title).toBeDefined()
        expect(pr.status).toBeDefined()
        expect(pr.createdAt).toBeInstanceOf(Date)
        expect(pr.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('should handle cursor-based pagination for PRs', async () => {
      const scmLib = new GithubSCMLib(
        GITHUB_REPO_URL,
        env.PLAYWRIGHT_GH_CLOUD_PAT,
        GITHUB_ORG
      )

      // Get first page
      const firstPage = await scmLib.searchSubmitRequests({
        repoUrl: GITHUB_REPO_URL,
        sort: { field: 'updated', order: 'desc' },
        limit: 3,
      })

      // Get second page if available
      if (firstPage.hasMore && firstPage.nextCursor) {
        const secondPage = await scmLib.searchSubmitRequests({
          repoUrl: GITHUB_REPO_URL,
          sort: { field: 'updated', order: 'desc' },
          limit: 3,
          cursor: firstPage.nextCursor,
        })

        expect(secondPage.results).toBeDefined()
        // Verify pages are different
        if (firstPage.results.length > 0 && secondPage.results.length > 0) {
          const firstPageNumbers = new Set(
            firstPage.results.map((r) => r.submitRequestNumber)
          )
          const secondPageNumbers = new Set(
            secondPage.results.map((r) => r.submitRequestNumber)
          )
          const overlap = [...firstPageNumbers].filter((num) =>
            secondPageNumbers.has(num)
          )
          expect(overlap.length).toBe(0)
        }
      }
    })

    it('should filter PRs by state', async () => {
      const scmLib = new GithubSCMLib(
        GITHUB_REPO_URL,
        env.PLAYWRIGHT_GH_CLOUD_PAT,
        GITHUB_ORG
      )

      const result = await scmLib.searchSubmitRequests({
        repoUrl: GITHUB_REPO_URL,
        sort: { field: 'updated', order: 'desc' },
        limit: 5,
        filters: {
          state: 'open',
        },
      })

      // Verify all returned PRs are open
      result.results.forEach((pr) => {
        expect(['open', 'draft']).toContain(pr.status)
      })
    })
  })
})
