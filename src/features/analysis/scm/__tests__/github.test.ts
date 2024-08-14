import { describe, expect, it } from 'vitest'

import { getGithubSdk, parseGithubOwnerAndRepo } from '../github'
import { SCMLib } from '../scm'
import { ScmLibScmType } from '../types'
import { env } from './env'

const OWNER = 'facebook'
const REPO = 'react'
const GITHUB_URL = `https://github.com/${OWNER}/${REPO}`
const GITHUB_ON_PREM_URL = `https://my.custom-onprem-domain.com/${OWNER}/${REPO}`
const NON_EXISTING_GITHUB_URL = 'https://github.com/facebook/react1111'
const INVALID_URL = 'https://invalid.com/facebook'
const EXISTING_COMMIT = 'c7967b194b41cb16907eed718b78d89120089f6a'
const EXISTING_BRANCH = 'portals'
const NON_EXISTING_BRANCH = 'non-existing-branch'
const EXISTING_TAG = 'v18.2.0'
const TEST_REPO_URL = 'https://github.com/mobbgeneraldev/WebGoat'

describe('github reference', () => {
  it('test non existing repo', async () => {
    await expect(() =>
      getGithubSdk().getGithubRepoDefaultBranch(NON_EXISTING_GITHUB_URL)
    ).rejects.toThrow()
  })
  it('test existing repo', async () => {
    expect(await getGithubSdk().getGithubRepoDefaultBranch(GITHUB_URL)).toEqual(
      'main'
    )
  })
  it('test if date is correct for commit', async () => {
    expect(
      await getGithubSdk().getGithubReferenceData({
        gitHubUrl: GITHUB_URL,
        ref: EXISTING_COMMIT,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2023-02-20T21:16:23.000Z,
        "sha": "c7967b194b41cb16907eed718b78d89120089f6a",
        "type": "COMMIT",
      }
    `)
  })
  it('test if date is correct for branch', async () => {
    expect(
      await getGithubSdk().getGithubReferenceData({
        gitHubUrl: GITHUB_URL,
        ref: EXISTING_BRANCH,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2020-02-05T00:00:59.000Z,
        "sha": "628f6f50b514529101a142242846985f7b4be048",
        "type": "BRANCH",
      }
    `)
  })
  it('test if date is correct for tag', async () => {
    expect(
      await getGithubSdk().getGithubReferenceData({
        gitHubUrl: GITHUB_URL,
        ref: EXISTING_TAG,
      })
    ).toMatchInlineSnapshot(`
      {
        "date": 2022-06-14T19:51:27.000Z,
        "sha": "8cab1b4d64ca7f52e5e1b45c4e6a6a99cc1ed591",
        "type": "TAG",
      }
    `)
  })
  it('test we get an error for incorrect tag', async () => {
    await expect(
      getGithubSdk().getGithubReferenceData({
        gitHubUrl: GITHUB_URL,
        ref: NON_EXISTING_BRANCH,
      })
    ).rejects.toThrow()
  })
})

describe('scm intance tests', () => {
  it('should return the correct headers for basic auth type ', async () => {
    const scmLib = await SCMLib.init({
      url: TEST_REPO_URL,
      scmType: ScmLibScmType.GITHUB,
      accessToken: env.TEST_MINIMAL_WEBGOAT_GITHUB_TOKEN,
      scmOrg: undefined,
    })
    const authHeaders = scmLib.getAuthHeaders()
    expect(authHeaders).toStrictEqual({
      authorization: `Bearer ${env.TEST_MINIMAL_WEBGOAT_GITHUB_TOKEN}`,
    })
  })
})

describe('parsing github url', () => {
  it.each([GITHUB_ON_PREM_URL, GITHUB_URL])('should parse the url', (url) => {
    expect(parseGithubOwnerAndRepo(url)).toEqual({
      owner: 'facebook',
      repo: 'react',
    })
  })
  it('should work with trailing slash', () => {
    expect(parseGithubOwnerAndRepo(`${GITHUB_URL}/`)).toMatchInlineSnapshot(`
      {
        "owner": "facebook",
        "repo": "react",
      }
    `)
  })
  it('fail if the url is invalid', () => {
    expect(() => parseGithubOwnerAndRepo(INVALID_URL)).toThrow()
  })
})
