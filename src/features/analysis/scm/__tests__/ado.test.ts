import path from 'node:path'

import * as dotenv from 'dotenv'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import {
  getAdoReferenceData,
  getAdoRepoDefaultBranch,
  parseAdoOwnerAndRepo,
} from '../ado'
import { SCMLib } from '../scm'
import { ReferenceType, ScmLibScmType } from '../types'
import { env } from './env'

const TEST_ADO_REPO = 'https://dev.azure.com/mobbtest/test/_git/repo1'

dotenv.config({ path: path.join(__dirname, '../../../../../.env') })
const envVariables = z
  .object({ ADO_TEST_ACCESS_TOKEN: z.string().min(1) })
  .required()
  .parse(process.env)

type TestInput = {
  ADO_ACCESS_TOKEN: string | undefined
  ADO_MOBB_ORG: string | undefined
  ADO_URL: string
  NON_EXISTING_ADO_URL: string
  EXISTING_COMMIT: string
  EXISTING_BRANCH: string
  EXISTING_BRANCH_SHA: string
  NON_EXISTING_BRANCH: string
  EXISTING_TAG: string
  EXISTING_TAG_SHA: string
}
const testInputs: TestInput[] = [
  {
    ADO_ACCESS_TOKEN: envVariables.ADO_TEST_ACCESS_TOKEN,
    ADO_MOBB_ORG: 'mobbtest',
    ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo1',
    NON_EXISTING_ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo2',
    EXISTING_COMMIT: 'e619caab398d5b75621dc8aab9e480eaee5ce42d',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'test-tag',
    EXISTING_BRANCH: 'main',
    EXISTING_BRANCH_SHA: 'b67eb441420675e0f107e2c1a3ba04900fc110fb',
    EXISTING_TAG_SHA: '9193050cf8c314dd52638d4bc2720b3ab48101a9',
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
    EXISTING_BRANCH_SHA: 'b67eb441420675e0f107e2c1a3ba04900fc110fb',
    EXISTING_TAG_SHA: '5357a65e054976cd7d79b81ef3906ded050ed921',
  },
  {
    ADO_ACCESS_TOKEN: envVariables.ADO_TEST_ACCESS_TOKEN,
    ADO_MOBB_ORG: undefined,
    ADO_URL:
      'https://dev.azure.com/mobbtest/test-public/_git/repo%20with%20spaces',
    NON_EXISTING_ADO_URL:
      'https://dev.azure.com/mobbtest/test-public/_git/repo%20with%20spaces1',
    EXISTING_COMMIT: 'd14918a74b1dd2c26726f71cb85059e63e033988',
    EXISTING_BRANCH: 'main',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'test-tag',
    EXISTING_BRANCH_SHA: 'd14918a74b1dd2c26726f71cb85059e63e033988',
    EXISTING_TAG_SHA: 'd14918a74b1dd2c26726f71cb85059e63e033988',
  },
]
describe.each(testInputs)(
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
    EXISTING_BRANCH_SHA,
    EXISTING_TAG_SHA,
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
      expect(ref.sha).toBe(EXISTING_COMMIT)
      expect(ref.type).toBe(ReferenceType.COMMIT)
    })
    it('test if ref is correct for branch', async () => {
      const ref = await getAdoReferenceData({
        repoUrl: ADO_URL,
        ref: EXISTING_BRANCH,
        accessToken: ADO_ACCESS_TOKEN,
        tokenOrg: ADO_MOBB_ORG,
      })
      expect(ref.sha).toBe(EXISTING_BRANCH_SHA)
      expect(ref.type).toBe(ReferenceType.BRANCH)
    })
    it('test if ref is correct for tag', async () => {
      const ref = await getAdoReferenceData({
        repoUrl: ADO_URL,
        ref: EXISTING_TAG,
        accessToken: ADO_ACCESS_TOKEN,
        tokenOrg: ADO_MOBB_ORG,
      })
      expect(ref.sha).toBe(EXISTING_TAG_SHA)
      expect(ref.type).toBe(ReferenceType.TAG)
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

describe('Ado scm instance', () => {
  it('should return the correct headers for basic auth type ', async () => {
    const scmLib = await SCMLib.init({
      url: TEST_ADO_REPO,
      scmType: ScmLibScmType.ADO,
      accessToken: env.TEST_MINIMAL_WEBGOAT_ADO_TOKEN,
      scmOrg: undefined,
    })
    const authHeaders = scmLib.getAuthHeaders()
    const encodedAccessToken = Buffer.from(
      ':' + env.TEST_MINIMAL_WEBGOAT_ADO_TOKEN
    ).toString('base64')
    expect(authHeaders).toStrictEqual({
      authorization: `Basic ${encodedAccessToken}`,
    })
  })
})

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
