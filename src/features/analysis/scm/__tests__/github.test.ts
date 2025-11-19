import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { getGithubSdk, parseGithubOwnerAndRepo } from '../github'
import type { GithubSCMLib } from '../github/GithubSCMLib'
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
