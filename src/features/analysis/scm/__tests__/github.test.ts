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
    expect(typeof status.remaining).toBe('number')
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

// ============================================================================
// Regression Tests for GitHub SCM Optimizations
// These tests verify existing behavior before optimizations are applied
// ============================================================================

describe('getSubmitRequests - PR list with metadata', () => {
  let scmLib: GithubSCMLib

  beforeAll(async () => {
    scmLib = (await createScmLib({
      url: GITHUB_URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: env.PLAYWRIGHT_GH_CLOUD_PAT,
      scmOrg: undefined,
    })) as GithubSCMLib
  })

  it('returns PR list with all required fields', async () => {
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)

    expect(Array.isArray(submitRequests)).toBe(true)
    expect(submitRequests.length).toBeGreaterThan(0)

    // Verify structure of first PR
    const pr = submitRequests[0]
    expect(pr).toHaveProperty('submitRequestId')
    expect(pr).toHaveProperty('submitRequestNumber')
    expect(pr).toHaveProperty('title')
    expect(pr).toHaveProperty('status')
    expect(pr).toHaveProperty('sourceBranch')
    expect(pr).toHaveProperty('targetBranch')
    expect(pr).toHaveProperty('createdAt')
    expect(pr).toHaveProperty('updatedAt')
    expect(pr).toHaveProperty('changedLines')
    expect(pr).toHaveProperty('tickets')
  })

  it('returns correct changedLines with added and removed as non-negative numbers', async () => {
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)
    const pr = submitRequests[0]!

    expect(pr.changedLines).toHaveProperty('added')
    expect(pr.changedLines).toHaveProperty('removed')
    expect(typeof pr.changedLines.added).toBe('number')
    expect(typeof pr.changedLines.removed).toBe('number')
    expect(pr.changedLines.added).toBeGreaterThanOrEqual(0)
    expect(pr.changedLines.removed).toBeGreaterThanOrEqual(0)
  })

  it('returns valid status values', async () => {
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)

    const validStatuses = ['open', 'closed', 'merged', 'draft']
    for (const pr of submitRequests) {
      expect(validStatuses).toContain(pr.status)
    }
  })

  it('parses dates correctly as Date objects', async () => {
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)
    const pr = submitRequests[0]!

    expect(pr.createdAt).toBeInstanceOf(Date)
    expect(pr.updatedAt).toBeInstanceOf(Date)
    expect(isNaN(pr.createdAt.getTime())).toBe(false)
    expect(isNaN(pr.updatedAt.getTime())).toBe(false)
  })

  it('returns tickets as an array (may be empty)', async () => {
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)
    const pr = submitRequests[0]!

    expect(Array.isArray(pr.tickets)).toBe(true)
    // If tickets exist, verify structure
    if (pr.tickets.length > 0) {
      expect(pr.tickets[0]).toHaveProperty('name')
      expect(pr.tickets[0]).toHaveProperty('title')
      expect(pr.tickets[0]).toHaveProperty('url')
    }
  })

  it('returns submitRequestId as string and submitRequestNumber as number', async () => {
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)
    const pr = submitRequests[0]!

    expect(typeof pr.submitRequestId).toBe('string')
    expect(typeof pr.submitRequestNumber).toBe('number')
    expect(pr.submitRequestId).toBe(String(pr.submitRequestNumber))
  })
})

describe('changedLines accuracy validation', () => {
  let scmLib: GithubSCMLib

  beforeAll(async () => {
    scmLib = (await createScmLib({
      url: GITHUB_URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: env.PLAYWRIGHT_GH_CLOUD_PAT,
      scmOrg: undefined,
    })) as GithubSCMLib
  })

  // Note: REST API pulls.list does NOT return additions/deletions fields
  // Those are only available from pulls.get (single PR endpoint)
  // The current implementation fetches diff for each PR to calculate changedLines

  it('changedLines values are consistent across multiple calls', async () => {
    // Call getSubmitRequests twice and verify consistency
    const submitRequests1 = await scmLib.getSubmitRequests(GITHUB_URL)
    const submitRequests2 = await scmLib.getSubmitRequests(GITHUB_URL)

    // Find the same PR in both responses
    const pr1 = submitRequests1[0]!
    const pr2 = submitRequests2.find(
      (p) => p.submitRequestNumber === pr1.submitRequestNumber
    )

    expect(pr2).toBeDefined()
    expect(pr1.changedLines.added).toBe(pr2!.changedLines.added)
    expect(pr1.changedLines.removed).toBe(pr2!.changedLines.removed)
  })

  it('changedLines values are reasonable for PRs', async () => {
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)

    // At least some PRs should have changes
    const prsWithChanges = submitRequests.filter(
      (pr) => pr.changedLines.added > 0 || pr.changedLines.removed > 0
    )

    expect(prsWithChanges.length).toBeGreaterThan(0)
  })
})

describe('getSubmitRequestDiff - PR diff with commits', () => {
  let scmLib: GithubSCMLib

  beforeAll(async () => {
    scmLib = (await createScmLib({
      url: GITHUB_URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: env.PLAYWRIGHT_GH_CLOUD_PAT,
      scmOrg: undefined,
    })) as GithubSCMLib
  })

  it('returns diff result with all required fields', async () => {
    // First get a PR number from the list
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)
    const openPr = submitRequests.find((pr) => pr.status === 'open')

    if (!openPr) {
      console.log('No open PRs found, skipping test')
      return
    }

    const diffResult = await scmLib.getSubmitRequestDiff(openPr.submitRequestId)

    expect(diffResult).toHaveProperty('diff')
    expect(diffResult).toHaveProperty('createdAt')
    expect(diffResult).toHaveProperty('updatedAt')
    expect(diffResult).toHaveProperty('submitRequestId')
    expect(diffResult).toHaveProperty('submitRequestNumber')
    expect(diffResult).toHaveProperty('sourceBranch')
    expect(diffResult).toHaveProperty('targetBranch')
    expect(diffResult).toHaveProperty('commits')
    expect(diffResult).toHaveProperty('diffLines')

    expect(typeof diffResult.diff).toBe('string')
    expect(diffResult.createdAt).toBeInstanceOf(Date)
    expect(diffResult.updatedAt).toBeInstanceOf(Date)
    expect(Array.isArray(diffResult.commits)).toBe(true)
    expect(Array.isArray(diffResult.diffLines)).toBe(true)
  })

  it('returns commit details with timestamps', async () => {
    const submitRequests = await scmLib.getSubmitRequests(GITHUB_URL)
    const openPr = submitRequests.find((pr) => pr.status === 'open')

    if (!openPr) {
      console.log('No open PRs found, skipping test')
      return
    }

    const diffResult = await scmLib.getSubmitRequestDiff(openPr.submitRequestId)

    if (diffResult.commits.length > 0) {
      const commit = diffResult.commits[0]!
      expect(commit).toHaveProperty('diff')
      expect(commit).toHaveProperty('commitTimestamp')
      expect(commit).toHaveProperty('commitSha')
      expect(commit.commitTimestamp).toBeInstanceOf(Date)
      expect(typeof commit.commitSha).toBe('string')
    }
  })
})

describe('getCommitDiff - individual commit diff', () => {
  let scmLib: GithubSCMLib

  beforeAll(async () => {
    scmLib = (await createScmLib({
      url: GITHUB_URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: env.PLAYWRIGHT_GH_CLOUD_PAT,
      scmOrg: undefined,
    })) as GithubSCMLib
  })

  it('returns commit diff with all required fields', async () => {
    // Use a known commit SHA from facebook/react
    const commitSha = 'c7967b194b41cb16907eed718b78d89120089f6a'

    const result = await scmLib.getCommitDiff(commitSha)

    expect(result).toHaveProperty('diff')
    expect(result).toHaveProperty('commitTimestamp')
    expect(result).toHaveProperty('commitSha')
    expect(typeof result.diff).toBe('string')
    expect(result.commitTimestamp).toBeInstanceOf(Date)
    expect(result.commitSha).toBe(commitSha)
  })

  it('includes repositoryCreatedAt in result', async () => {
    const commitSha = 'c7967b194b41cb16907eed718b78d89120089f6a'

    const result = await scmLib.getCommitDiff(commitSha)

    // repositoryCreatedAt should be present (may be undefined if fetch fails)
    expect(result).toHaveProperty('repositoryCreatedAt')
    if (result.repositoryCreatedAt) {
      expect(result.repositoryCreatedAt).toBeInstanceOf(Date)
    }
  })

  it('includes parentCommits in result', async () => {
    const commitSha = 'c7967b194b41cb16907eed718b78d89120089f6a'

    const result = await scmLib.getCommitDiff(commitSha)

    // parentCommits should be present for non-root commits
    expect(result).toHaveProperty('parentCommits')
    if (result.parentCommits && result.parentCommits.length > 0) {
      const parent = result.parentCommits[0]!
      expect(parent).toHaveProperty('sha')
      expect(parent).toHaveProperty('timestamp')
      expect(typeof parent.sha).toBe('string')
      expect(parent.timestamp).toBeInstanceOf(Date)
    }
  })
})
