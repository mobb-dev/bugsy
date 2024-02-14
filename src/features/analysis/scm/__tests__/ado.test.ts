import path from 'node:path'

import * as dotenv from 'dotenv'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import {
  getAdoReferenceData,
  getAdoRepoDefaultBranch,
  parseAdoOwnerAndRepo,
} from '../ado'

dotenv.config({ path: path.join(__dirname, '../../../../../.env') })
const envVariables = z
  .object({ ADO_TEST_ACCESS_TOKEN: z.string().min(1) })
  .required()
  .parse(process.env)

describe.each([
  {
    ADO_ACCESS_TOKEN: envVariables.ADO_TEST_ACCESS_TOKEN,
    ADO_MOBB_ORG: 'mobbtest',
    ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo1',
    NON_EXISTING_ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo2',
    EXISTING_COMMIT: 'e619caab398d5b75621dc8aab9e480eaee5ce42d',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'test-tag',
    EXISTING_BRANCH: 'main',
  },
  {
    ADO_ACCESS_TOKEN: undefined,
    ADO_MOBB_ORG: undefined,
    ADO_URL: 'https://dev.azure.com/mobbtest/test-public/_git/repo-public',
    NON_EXISTING_ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo2',
    EXISTING_COMMIT: 'b67eb441420675e0f107e2c1a3ba04900fc110fb',
    EXISTING_BRANCH: 'pt',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'v2023.8',
  },
])(
  'ado reference',
  ({
    ADO_ACCESS_TOKEN,
    ADO_MOBB_ORG,
    ADO_URL,
    NON_EXISTING_ADO_URL,
    EXISTING_COMMIT,
    EXISTING_BRANCH,
    NON_EXISTING_BRANCH,
    EXISTING_TAG,
  }) => {
    it('test non existing repo', async () => {
      await expect(() =>
        getAdoRepoDefaultBranch({
          repoUrl: NON_EXISTING_ADO_URL,
          accessToken: ADO_ACCESS_TOKEN,
          tokenOrg: ADO_MOBB_ORG,
        })
      ).rejects.toThrow()
    })
    it('test existing repo', async () => {
      expect(
        await getAdoRepoDefaultBranch({
          repoUrl: ADO_URL,
          accessToken: ADO_ACCESS_TOKEN,
          tokenOrg: ADO_MOBB_ORG,
        })
      ).toEqual('main')
    })
    it('test if ref is correct for commit', async () => {
      const ref = await getAdoReferenceData({
        repoUrl: ADO_URL,
        ref: EXISTING_COMMIT,
        accessToken: ADO_ACCESS_TOKEN,
        tokenOrg: ADO_MOBB_ORG,
      })
      //date returns the current date for ADO for now as the ADO API doesn't return anything
      //so we can't test for it in the snapshot as it changes for each run
      ref.date = new Date(0)
      expect(ref).toMatchSnapshot()
    })
    it('test if ref is correct for branch', async () => {
      const ref = await getAdoReferenceData({
        repoUrl: ADO_URL,
        ref: EXISTING_BRANCH,
        accessToken: ADO_ACCESS_TOKEN,
        tokenOrg: ADO_MOBB_ORG,
      })
      //date returns the current date for ADO for now as the ADO API doesn't return anything
      //so we can't test for it in the snapshot as it changes for each run
      ref.date = new Date(0)
      expect(ref).toMatchSnapshot()
    })
    it('test if ref is correct for tag', async () => {
      const ref = await getAdoReferenceData({
        repoUrl: ADO_URL,
        ref: EXISTING_TAG,
        accessToken: ADO_ACCESS_TOKEN,
        tokenOrg: ADO_MOBB_ORG,
      })
      //date returns the current date for ADO for now as the ADO API doesn't return anything
      //so we can't test for it in the snapshot as it changes for each run
      ref.date = new Date(0)
      expect(ref).toMatchSnapshot()
    })
    it('test we get an error for incorrect tag', async () => {
      await expect(
        getAdoReferenceData({
          repoUrl: ADO_URL,
          ref: NON_EXISTING_BRANCH,
          accessToken: ADO_ACCESS_TOKEN,
          tokenOrg: ADO_MOBB_ORG,
        })
      ).rejects.toThrow()
    })
  }
)

describe.each([
  {
    ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo1',
    INVALID_URL: 'https://invalid.com/zj-gitlab',
  },
  {
    ADO_URL: 'https://dev.azure.com/mobbtest/test-public/_git/repo-public',
    INVALID_URL: 'https://invalid.com/zj-gitlab',
  },
])('parsing ado url', ({ ADO_URL, INVALID_URL }) => {
  it('should parse the url', () => {
    expect(parseAdoOwnerAndRepo(ADO_URL)).toMatchSnapshot()
  })
  it('should work with trailing slash', () => {
    expect(parseAdoOwnerAndRepo(`${ADO_URL}/`)).toMatchSnapshot()
  })
  it('fail if the url is invalid', () => {
    expect(() => parseAdoOwnerAndRepo(INVALID_URL)).toThrow()
  })
})
