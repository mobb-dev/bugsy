import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { GetGitlabTokenParams, GitlabTokenRequestTypeEnum } from '../../gitlab'
import {
  getGitlabBranchList,
  getGitlabReferenceData,
  getGitlabRepoDefaultBranch,
  getGitlabToken,
  parseGitlabOwnerAndRepo,
} from '../../gitlab/gitlab'
import { createScmLib } from '../../scmFactory'
import { ScmLibScmType } from '../../types'
import { RepoConfig } from '../common'
import { env } from '../env'

function isArrayWithBrachOrLength(response: string[], name: string): boolean {
  return response.includes(name) || response.length === 100
}

const reposConfig: RepoConfig[] = [
  {
    url: {
      valid: 'https://gitlab.com/zj-gitlab/gitlab-ce',
      invalid: 'https://invalid.com/zj-gitlab',
      nonExisting: 'https://gitlab.com/zj-gitlab/gitlab-ce1111',
    },
    commit: {
      date: new Date('2019-06-20T10:21:54.000Z'),
      sha: '4298a28a993363f4ab6b63c14820492393a3ae94',
    },
    branch: {
      name: 'master',
      date: new Date('2019-06-20T10:21:54.000Z'),
      sha: '4298a28a993363f4ab6b63c14820492393a3ae94',
    },
    tag: {
      name: 'v8.17.8',
      date: new Date('2017-08-09T15:40:49.000Z'),
      sha: 'ff7d664bf96a77e09cadb66bb70186aa1a0751d2',
    },
  },
  {
    url: {
      valid: env.PLAYWRIGHT_GL_ON_PREM_REPO_URL,
      invalid: 'https://invalid.com/org',
      nonExisting: `${env.PLAYWRIGHT_GL_ON_PREM_URL}/org/I_DONT_EXIST`,
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
    accessToken: env.PLAYWRIGHT_GL_ON_PREM_PAT,
  },
]

describe.each(Object.entries(reposConfig))(
  'Gitlab reference',
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
        getGitlabRepoDefaultBranch(repoConfig.url.nonExisting, {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        })
      ).rejects.toThrow('Not Found')
    })
    it('test existing repo', async () => {
      expect(
        await getGitlabRepoDefaultBranch(repoConfig.url.valid, {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        })
      ).toEqual(repoConfig.branch.name)
    })
    it('branch list non existing repo', async () => {
      await expect(
        getGitlabBranchList({
          repoUrl: repoConfig.url.nonExisting,
          accessToken: repoConfig.accessToken!,
        })
      ).resolves.toEqual([])
    })
    it('branch list existing repo', async () => {
      const response = await getGitlabBranchList({
        repoUrl: repoConfig.url.valid,
        accessToken: repoConfig.accessToken!,
      })
      expect(isArrayWithBrachOrLength(response, repoConfig.branch.name)).toBe(
        true
      )
    })
    it('test if date is correct for commit', async () => {
      const response = await getGitlabReferenceData(
        {
          gitlabUrl: repoConfig.url.valid,
          ref: repoConfig.commit.sha,
        },
        {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        }
      )
      expect(response).toStrictEqual({
        date: repoConfig.commit.date,
        sha: repoConfig.commit.sha,
        type: 'COMMIT',
      })
    })
    it('test if date is correct for branch', async () => {
      const response = await getGitlabReferenceData(
        {
          gitlabUrl: repoConfig.url.valid,
          ref: repoConfig.branch.name,
        },
        {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        }
      )
      expect(response).toStrictEqual({
        date: repoConfig.branch.date,
        sha: repoConfig.branch.sha,
        type: 'BRANCH',
      })
    })
    it('test if date is correct for tag', async () => {
      const response = await getGitlabReferenceData(
        {
          gitlabUrl: repoConfig.url.valid,
          ref: repoConfig.tag.name,
        },
        {
          gitlabAuthToken: repoConfig.accessToken,
          url: repoConfig.url.valid,
        }
      )
      expect(response).toStrictEqual({
        date: repoConfig.tag.date,
        sha: repoConfig.tag.sha,
        type: 'TAG',
      })
    })
    it('test we get an error for incorrect tag', async () => {
      await expect(
        getGitlabReferenceData(
          {
            gitlabUrl: repoConfig.url.valid,
            ref: 'I_DO_NOT_EXIST',
          },
          {
            gitlabAuthToken: repoConfig.accessToken,
            url: repoConfig.url.valid,
          }
        )
      ).rejects.toThrow('ref')
    })
  }
)

const GITLAB_URL = 'https://gitlab.com/zj-gitlab/gitlab-ce'
const INVALID_URL = 'https://invalid.com/zj-gitlab'
const TEST_GITLAB_REPO = 'https://gitlab.com/generaldev1/WebGoat'

describe('scm instance tests', () => {
  it('should return the correct headers for basic auth type ', async () => {
    const scmLib = await createScmLib({
      url: TEST_GITLAB_REPO,
      scmType: ScmLibScmType.GITLAB,
      accessToken: env.TEST_MINIMAL_WEBGOAT_GITLAB_TOKEN,
      scmOrg: undefined,
    })
    const authHeaders = scmLib.getAuthHeaders()
    expect(authHeaders).toStrictEqual({
      'Private-Token': env.TEST_MINIMAL_WEBGOAT_GITLAB_TOKEN,
    })
  })
})

describe('parsing gitlab url', () => {
  it('should parse the url', () => {
    const response = parseGitlabOwnerAndRepo(GITLAB_URL)
    expect(response).toStrictEqual({
      owner: 'zj-gitlab',
      projectPath: 'zj-gitlab/gitlab-ce',
      repo: 'gitlab-ce',
    })
  })
  it('should work with trailing slash', () => {
    const response = parseGitlabOwnerAndRepo(`${GITLAB_URL}/`)
    expect(response).toStrictEqual({
      owner: 'zj-gitlab',
      projectPath: 'zj-gitlab/gitlab-ce',
      repo: 'gitlab-ce',
    })
  })
  it('fail if the url is invalid', () => {
    expect(() => parseGitlabOwnerAndRepo(INVALID_URL)).toThrow()
  })
  it.each<{ tokenType: GetGitlabTokenParams['tokenType'] }>([
    { tokenType: GitlabTokenRequestTypeEnum.REFRESH_TOKEN },
    { tokenType: GitlabTokenRequestTypeEnum.CODE },
  ])('should fail on invalid $tokenType', async ({ tokenType }) => {
    const result = await getGitlabToken({
      token: 'refresh_token',
      gitlabClientId: 'mock_client_id',
      gitlabClientSecret: 'mock_client_secret',
      callbackUrl: 'http://callback.example.com',
      tokenType,
    })
    expect(result.success).toBe(false)
  })
})
