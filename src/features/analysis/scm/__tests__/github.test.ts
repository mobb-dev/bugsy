import { describe, expect, it } from 'vitest'

import {
  getGithubReferenceData,
  getGithubRepoDefaultBranch,
  parseOwnerAndRepo,
} from '../github'

const OWNER = 'facebook'
const REPO = 'react'
const GITHUB_URL = `https://github.com/${OWNER}/${REPO}`
const NON_EXISTING_GITHUB_URL = 'https://github.com/facebook/react1111'
const INVALID_URL = 'https://invalid.com/facebook'
const EXISTING_COMMIT = 'c7967b194b41cb16907eed718b78d89120089f6a'
const EXISTING_BRANCH = 'portals'
const NON_EXISTING_BRANCH = 'non-existing-branch'
const EXISTING_TAG = 'v18.2.0'

describe('github reference', () => {
  it('test non existing repo', async () => {
    await expect(() =>
      getGithubRepoDefaultBranch(NON_EXISTING_GITHUB_URL)
    ).rejects.toThrow()
  })
  it('test existing repo', async () => {
    expect(await getGithubRepoDefaultBranch(GITHUB_URL)).toEqual('main')
  })
  it('test if date is correct for commit', async () => {
    expect(
      await getGithubReferenceData({
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
      await getGithubReferenceData({
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
      await getGithubReferenceData({ gitHubUrl: GITHUB_URL, ref: EXISTING_TAG })
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
      getGithubReferenceData({
        gitHubUrl: GITHUB_URL,
        ref: NON_EXISTING_BRANCH,
      })
    ).rejects.toThrow()
  })
})

describe('parsing github url', () => {
  it('should parse the url', () => {
    expect(parseOwnerAndRepo(GITHUB_URL)).toMatchInlineSnapshot(`
      {
        "owner": "facebook",
        "repo": "react",
      }
    `)
  })
  it('should work with trailing slash', () => {
    expect(parseOwnerAndRepo(`${GITHUB_URL}/`)).toMatchInlineSnapshot(`
      {
        "owner": "facebook",
        "repo": "react",
      }
    `)
  })
  it('fail if the url is invalid', () => {
    expect(() => parseOwnerAndRepo(INVALID_URL)).toThrow()
  })
})
