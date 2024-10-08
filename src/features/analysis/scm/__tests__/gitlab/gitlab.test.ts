import { describe, expect, it } from 'vitest'

import { GetGitlabTokenParams, GitlabTokenRequestTypeEnum } from '../../gitlab'
import {
  getGitlabReferenceData,
  getGitlabRepoDefaultBranch,
  getGitlabToken,
  parseGitlabOwnerAndRepo,
} from '../../gitlab/gitlab'
import { SCMLib } from '../../scm'
import { ScmLibScmType } from '../../types'
import { env } from '../env'

const GITLAB_URL = 'https://gitlab.com/zj-gitlab/gitlab-ce'
const NON_EXISTING_GITLAB_URL = 'https://gitlab.com/zj-gitlab/gitlab-ce1111'
const INVALID_URL = 'https://invalid.com/zj-gitlab'
const EXISTING_COMMIT = '4298a28a993363f4ab6b63c14820492393a3ae94'
const EXISTING_BRANCH = 'zj-commit-caching'
const NON_EXISTING_BRANCH = 'non-existing-branch'
const EXISTING_TAG = 'v8.17.8'
const TEST_GITLAB_REPO = 'https://gitlab.com/generaldev1/WebGoat'

describe('gitlab reference', () => {
  it('test non existing repo', async () => {
    await expect(() =>
      getGitlabRepoDefaultBranch(NON_EXISTING_GITLAB_URL)
    ).rejects.toThrow()
  })
  it('test existing repo', async () => {
    expect(await getGitlabRepoDefaultBranch(GITLAB_URL)).toEqual('master')
  })
  it('test if date is correct for commit', async () => {
    expect(
      await getGitlabReferenceData({
        gitlabUrl: GITLAB_URL,
        ref: EXISTING_COMMIT,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2019-06-20T10:21:54.000Z,
        "sha": "4298a28a993363f4ab6b63c14820492393a3ae94",
        "type": "COMMIT",
      }
    `)
  })
  it('test if date is correct for branch', async () => {
    expect(
      await getGitlabReferenceData({
        gitlabUrl: GITLAB_URL,
        ref: EXISTING_BRANCH,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2018-03-21T09:29:35.000Z,
        "sha": "be2f8ccc6b1e25c8bd9bd78f45473930b6d1debb",
        "type": "BRANCH",
      }
    `)
  })
  it('test if date is correct for tag', async () => {
    expect(
      await getGitlabReferenceData({ gitlabUrl: GITLAB_URL, ref: EXISTING_TAG })
    ).toMatchInlineSnapshot(`
      {
        "date": 2017-08-09T15:40:49.000Z,
        "sha": "ff7d664bf96a77e09cadb66bb70186aa1a0751d2",
        "type": "TAG",
      }
    `)
  })
  it('test we get an error for incorrect tag', async () => {
    await expect(
      getGitlabReferenceData({
        gitlabUrl: GITLAB_URL,
        ref: NON_EXISTING_BRANCH,
      })
    ).rejects.toThrow()
  })
})
describe('scm intance tests', () => {
  it('should return the correct headers for basic auth type ', async () => {
    const scmLib = await SCMLib.init({
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
    expect(parseGitlabOwnerAndRepo(GITLAB_URL)).toMatchInlineSnapshot(`
      {
        "owner": "zj-gitlab",
        "projectPath": "zj-gitlab/gitlab-ce",
        "repo": "gitlab-ce",
      }
    `)
  })
  it('should work with trailing slash', () => {
    expect(parseGitlabOwnerAndRepo(`${GITLAB_URL}/`)).toMatchInlineSnapshot(`
      {
        "owner": "zj-gitlab",
        "projectPath": "zj-gitlab/gitlab-ce",
        "repo": "gitlab-ce",
      }
    `)
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
