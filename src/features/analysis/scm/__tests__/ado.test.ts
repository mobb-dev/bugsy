import path from 'node:path'

import chalk from 'chalk'
import * as dotenv from 'dotenv'
import { beforeAll, describe, expect, it } from 'vitest'
import { z } from 'zod'

import { getAdoClientParams, getAdoSdk, parseAdoOwnerAndRepo } from '../ado'
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
  ADO_PAT: string | undefined
  PAT_ORG: string | undefined
  ADO_URL: string
  NON_EXISTING_ADO_URL: string
  EXISTING_COMMIT: string
  EXISTING_BRANCH: string
  EXISTING_BRANCH_SHA: string
  NON_EXISTING_BRANCH: string
  EXISTING_TAG: string | undefined
  EXISTING_TAG_SHA: string
}
const testNames = {
  accessTokenTest: 'accessTokenTest',
  publicRepoTest: 'publicRepoTest',
  repoWithSpacesTest: 'repoWithSpacesTest',
  publicRepoWithPat: 'publicRepoWithPat',
} as const
type TestNames = (typeof testNames)[keyof typeof testNames]

const testInputs: Record<TestNames, TestInput> = {
  accessTokenTest: {
    ADO_PAT: envVariables.ADO_TEST_ACCESS_TOKEN,
    PAT_ORG: 'mobbtest',
    ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo1',
    NON_EXISTING_ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo2',
    EXISTING_COMMIT: 'e619caab398d5b75621dc8aab9e480eaee5ce42d',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'test-tag',
    EXISTING_BRANCH: 'main',
    EXISTING_BRANCH_SHA: 'b67eb441420675e0f107e2c1a3ba04900fc110fb',
    EXISTING_TAG_SHA: '9193050cf8c314dd52638d4bc2720b3ab48101a9',
  },
  publicRepoTest: {
    ADO_PAT: undefined,
    PAT_ORG: undefined,
    ADO_URL: 'https://dev.azure.com/mobbtest/test-public/_git/repo-public',
    NON_EXISTING_ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo2',
    EXISTING_COMMIT: 'b67eb441420675e0f107e2c1a3ba04900fc110fb',
    EXISTING_BRANCH: 'pt',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'v2023.8',
    EXISTING_BRANCH_SHA: 'b67eb441420675e0f107e2c1a3ba04900fc110fb',
    EXISTING_TAG_SHA: '5357a65e054976cd7d79b81ef3906ded050ed921',
  },
  publicRepoWithPat: {
    ADO_PAT: envVariables.ADO_TEST_ACCESS_TOKEN,
    PAT_ORG: 'mobbtest',
    ADO_URL: 'https://dev.azure.com/yhaggai/_git/hello_public',
    NON_EXISTING_ADO_URL:
      'https://dev.azure.com/mobbtest/test-public/_git/repo%20with%20spaces1',
    EXISTING_COMMIT: '51b861ec104fc5f7cf4bba564d7529d011fa5e7b',
    EXISTING_BRANCH: 'main',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: undefined,
    EXISTING_BRANCH_SHA: '208ca7e6189b8c90bf4a9d3179f27f19a6c98940',
    EXISTING_TAG_SHA: '208ca7e6189b8c90bf4a9d3179f27f19a6c98940',
  },
  repoWithSpacesTest: {
    ADO_PAT: envVariables.ADO_TEST_ACCESS_TOKEN,
    PAT_ORG: 'mobbtest',
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
  // todo: add when we set an environment for on-prem add this test params back
  // onPremTestParams: {
  //   ADO_PAT: '*****',
  //   PAT_ORG: 'DefaultCollection',
  //   ADO_URL: 'https://test1/DefaultCollection/_git/Antony%20Test%20Project',
  //   NON_EXISTING_ADO_URL:
  //     'https://test1/DefaultCollection/_git/Antony%20Test%20Project1',
  //   EXISTING_COMMIT: 'ccf9c908745139a819c53dc296f593ab2f987728',
  //   EXISTING_BRANCH: 'main',
  //   NON_EXISTING_BRANCH: 'non-existing-branch',
  //   EXISTING_TAG: 'test-tag',
  //   EXISTING_BRANCH_SHA: 'de2e157e4d3aa4467240436fe8be7535b2bbc8c7',
  //   EXISTING_TAG_SHA: 'ccf9c908745139a819c53dc296f593ab2f987728',
  // },
} as const

let adoSdkPromise: ReturnType<typeof getAdoSdk> | undefined
function getAdoSk(adoSdkPromise: ReturnType<typeof getAdoSdk> | undefined) {
  if (!adoSdkPromise) {
    throw new Error('adoSdk not initialized')
  }
  return adoSdkPromise
}

describe.each(Object.entries(testInputs))(
  'ado reference',
  (
    testName,
    {
      ADO_PAT,
      PAT_ORG: ADO_MOBB_ORG,
      ADO_URL,
      NON_EXISTING_ADO_URL,
      EXISTING_COMMIT,
      EXISTING_BRANCH,
      NON_EXISTING_BRANCH,
      EXISTING_TAG,
      EXISTING_BRANCH_SHA,
      EXISTING_TAG_SHA,
    }
  ) => {
    beforeAll(async () => {
      adoSdkPromise = getAdoSdk(
        await getAdoClientParams({
          tokenOrg: ADO_MOBB_ORG,
          accessToken: ADO_PAT,
          url: ADO_URL,
        })
      )
    })
    it(`${chalk.green.underline.bold(testName)}: test existing repo`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      expect(
        await adoSdk.getAdoRepoDefaultBranch({
          repoUrl: ADO_URL,
        })
      ).toEqual('main')
    })
    it(`${chalk.green.underline.bold(testName)}: test non existing repo`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      await expect(() =>
        adoSdk.getAdoRepoDefaultBranch({
          repoUrl: NON_EXISTING_ADO_URL,
        })
      ).rejects.toThrow()
    })
    it(`${chalk.green.underline.bold(testName)}: test if ref is correct for commit`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      const ref = await adoSdk.getAdoReferenceData({
        repoUrl: ADO_URL,
        ref: EXISTING_COMMIT,
      })
      //date returns the current date for ADO for now as the ADO API doesn't return anything
      //so we can't test for it in the snapshot as it changes for each run
      ref.date = new Date(0)
      expect(ref.sha).toBe(EXISTING_COMMIT)
      expect(ref.type).toBe(ReferenceType.COMMIT)
    })
    it(`${chalk.green.underline.bold(testName)}: test if ref is correct for branch`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      const ref = await adoSdk.getAdoReferenceData({
        repoUrl: ADO_URL,
        ref: EXISTING_BRANCH,
      })
      expect(ref.sha).toBe(EXISTING_BRANCH_SHA)
      expect(ref.type).toBe(ReferenceType.BRANCH)
    })
    it(`${chalk.green.underline.bold(testName)}: test if ref is correct for tag`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      // todo: for some reason the tag is not found when using PAT with public repo
      if (!EXISTING_TAG) {
        return
      }
      const ref = await adoSdk.getAdoReferenceData({
        repoUrl: ADO_URL,
        ref: EXISTING_TAG,
      })
      expect(ref.sha).toBe(EXISTING_TAG_SHA)
      expect(ref.type).toBe(ReferenceType.TAG)
    })
    it(`${chalk.green.underline.bold(testName)}:test we get an error for incorrect tag`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      await expect(
        adoSdk.getAdoReferenceData({
          repoUrl: ADO_URL,
          ref: NON_EXISTING_BRANCH,
        })
      ).rejects.toThrow()
    })
  }
)

const scmTestParams = {
  accessTokenConfig: {
    url: TEST_ADO_REPO,
    accessToken: env.TEST_MINIMAL_WEBGOAT_ADO_TOKEN,
    scmOrg: 'mobbtest',
  },
  // todo: add when we set an environment for on-prem add this test params back
  // onPremTestParams: {
  //   url: testInputs.onPremTestParams.ADO_URL,
  //   accessToken: testInputs.onPremTestParams.ADO_ACCESS_TOKEN,
  //   scmOrg: 'DefaultCollection',
  // },
}

describe.each(Object.entries(scmTestParams))(
  'Ado scm instance',
  (testName, { url, accessToken, scmOrg }) => {
    it(`${chalk.green.bold(testName)} should return the correct headers for basic auth type `, async () => {
      const scmLib = await SCMLib.init({
        url,
        scmType: ScmLibScmType.ADO,
        accessToken,
        scmOrg,
      })
      const authHeaders = scmLib.getAuthHeaders()
      const encodedAccessToken = Buffer.from(':' + accessToken).toString(
        'base64'
      )
      expect(authHeaders).toStrictEqual({
        authorization: `Basic ${encodedAccessToken}`,
      })
      const signedRepoUrl = await scmLib.getUrlWithCredentials()
      const { protocol, pathname, hostname } = new URL(signedRepoUrl)
      expect(signedRepoUrl).toBe(
        `${protocol}//${accessToken}@${hostname}${pathname}`
      )
      const prUrl = await scmLib.getPrUrl(1)
      expect(prUrl).toMatch(`${TEST_ADO_REPO}/pullrequest/1`)
    })
  }
)

describe('Ado check all assisoated repos', () => {
  it('should return the correct repo list', async () => {
    const scmLib = await SCMLib.init({
      url: undefined,
      scmType: ScmLibScmType.ADO,
      accessToken: env.TEST_MINIMAL_WEBGOAT_ADO_TOKEN,
      scmOrg: testInputs.accessTokenTest.PAT_ORG,
    })
    const repoList = await scmLib.getRepoList(
      testInputs.accessTokenTest.PAT_ORG
    )
    expect(repoList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          repoIsPublic: true,
          repoLanguages: [],
          repoName: 'repo with spaces',
          repoOwner: 'mobbtest',
          repoUrl:
            'https://dev.azure.com/mobbtest/test-public/_git/repo%20with%20spaces',
        }),
        expect.objectContaining({
          repoIsPublic: false,
          repoLanguages: [],
          repoName: 'repo1',
          repoOwner: 'mobbtest',
          repoUrl: 'https://dev.azure.com/mobbtest/test/_git/repo1',
        }),
        expect.objectContaining({
          repoIsPublic: true,
          repoLanguages: [],
          repoName: 'repo-public',
          repoOwner: 'mobbtest',
          repoUrl:
            'https://dev.azure.com/mobbtest/test-public/_git/repo-public',
        }),
      ])
    )
  })
})

describe.each([
  {
    ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo1',
    INVALID_URL: 'https://invalid.com/zj-gitlab',
    EXPECTED: {
      owner: 'mobbtest',
      repo: 'repo1',
      projectName: 'test',
      projectPath: 'mobbtest/test/_git/repo1',
      pathElements: ['mobbtest', 'test', '_git', 'repo1'],
      origin: 'https://dev.azure.com',
    },
  },
  {
    ADO_URL: 'https://dev.azure.com/mobbtest/test-public/_git/repo-public',
    INVALID_URL: 'https://invalid.com/zj-gitlab',
    EXPECTED: {
      owner: 'mobbtest',
      repo: 'repo-public',
      projectName: 'test-public',
      projectPath: 'mobbtest/test-public/_git/repo-public',
      pathElements: ['mobbtest', 'test-public', '_git', 'repo-public'],
      origin: 'https://dev.azure.com',
    },
  },
])('parsing ado url', ({ ADO_URL, INVALID_URL, EXPECTED }) => {
  it('should parse the url', () => {
    expect(parseAdoOwnerAndRepo(ADO_URL)).toStrictEqual({
      owner: EXPECTED.owner,
      repo: EXPECTED.repo,
      projectName: EXPECTED.projectName,
      projectPath: EXPECTED.projectPath,
      pathElements: EXPECTED.pathElements,
      origin: EXPECTED.origin,
    })
  })
  it('should work with trailing slash', () => {
    expect(parseAdoOwnerAndRepo(`${ADO_URL} / `)).toStrictEqual({
      owner: EXPECTED.owner,
      repo: EXPECTED.repo,
      projectName: EXPECTED.projectName,
      projectPath: EXPECTED.projectPath,
      pathElements: EXPECTED.pathElements,
      origin: EXPECTED.origin,
    })
  })
  it('fail if the url is invalid', () => {
    expect(() => parseAdoOwnerAndRepo(INVALID_URL)).toThrow()
  })
})
