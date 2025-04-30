import chalk from 'chalk'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  AdoOAuthTokenType,
  getAdoClientParams,
  getAdoSdk,
  getAdoToken,
  parseAdoOwnerAndRepo,
} from '../ado'
import { RepoNoTokenAccessError } from '../errors'
import { createScmLib } from '../scmFactory'
import { ReferenceType, ScmLibScmType } from '../types'
import { env } from './env'

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
  onPremTestParams: 'onPremTestParams',
  onPremTestParamsSingleProject: 'onPremTestParamsSingleProject',
} as const
type TestNames = (typeof testNames)[keyof typeof testNames]

const testInputs: Record<TestNames, TestInput> = {
  accessTokenTest: {
    ADO_PAT: env.PLAYWRIGHT_ADO_CLOUD_PAT,
    PAT_ORG: env.PLAYWRIGHT_ADO_CLOUD_SCM_ORG,
    ADO_URL: 'https://dev.azure.com/citestjob2/citestjob2/_git/webgoat',
    NON_EXISTING_ADO_URL:
      'https://dev.azure.com/citestjob2/_git/webgoat_non_existing',
    EXISTING_COMMIT: 'd59153d6d7f4c403042823a0343cd8211b60766a',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'test-tag',
    EXISTING_BRANCH: 'main',
    EXISTING_BRANCH_SHA: 'd59153d6d7f4c403042823a0343cd8211b60766a',
    EXISTING_TAG_SHA: 'd59153d6d7f4c403042823a0343cd8211b60766a',
  },
  publicRepoTest: {
    ADO_PAT: undefined,
    PAT_ORG: undefined,
    ADO_URL:
      'https://dev.azure.com/citestjob2/test-public/_git/webgoat.mobbci.testjob',
    NON_EXISTING_ADO_URL:
      'https://dev.azure.com/citestjob2/test-public/_git/test-public.non.existing',
    EXISTING_COMMIT: '4acf4a349fbc4c86603e7fff27aaf46ae869cdff',
    EXISTING_BRANCH: 'main',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'test-tag',
    EXISTING_BRANCH_SHA: '4acf4a349fbc4c86603e7fff27aaf46ae869cdff',
    EXISTING_TAG_SHA: '4acf4a349fbc4c86603e7fff27aaf46ae869cdff',
  },
  publicRepoWithPat: {
    ADO_PAT: env.PLAYWRIGHT_ADO_CLOUD_PAT,
    PAT_ORG: env.PLAYWRIGHT_ADO_CLOUD_SCM_ORG,
    ADO_URL:
      'https://dev.azure.com/aidainnovazione0090/DeviceManager/_git/app-functions-sdk-go',
    NON_EXISTING_ADO_URL:
      'https://dev.azure.com/mobbtest/test-public/_git/repo%20with%20spaces1',
    EXISTING_COMMIT: '7c9b2da4b58b151534a09fd7a0b2c10f18664204',
    EXISTING_BRANCH: 'main',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'v2.3.0',
    EXISTING_BRANCH_SHA: 'b28f7f7e4352f4c06fb2e306005bbf60a37afcd7',
    EXISTING_TAG_SHA: 'b28f7f7e4352f4c06fb2e306005bbf60a37afcd7',
  },
  repoWithSpacesTest: {
    ADO_PAT: env.PLAYWRIGHT_ADO_CLOUD_PAT,
    PAT_ORG: env.PLAYWRIGHT_ADO_CLOUD_SCM_ORG,
    ADO_URL:
      'https://dev.azure.com/citestjob2/test-public/_git/webgoat.mobbci.testjob.mobbci.testjob%20test%20with%20spaces',
    NON_EXISTING_ADO_URL:
      'https://dev.azure.com/citestjob2/test-public/_git/webgoat.mobbci.testjob.mobbci.testjob%20test%20with%20space.non.existing',
    EXISTING_COMMIT: '048b6ada04867d5f2dddc345bfa6ae3f4611b9a8',
    EXISTING_BRANCH: 'main',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'test-tag',
    EXISTING_BRANCH_SHA: '048b6ada04867d5f2dddc345bfa6ae3f4611b9a8',
    EXISTING_TAG_SHA: '048b6ada04867d5f2dddc345bfa6ae3f4611b9a8',
  },
  onPremTestParams: {
    ADO_PAT: env.PLAYWRIGHT_ADO_ON_PREM_PAT,
    PAT_ORG: 'DefaultCollection',
    ADO_URL: env.PLAYWRIGHT_ADO_ON_PREM_REPO_URL,
    NON_EXISTING_ADO_URL:
      'https://test1/DefaultCollection/_git/Antony%20Test%20Project1',
    EXISTING_COMMIT: '33aee0d1b11766ce68ce23eb34f14be683ab9770',
    EXISTING_BRANCH: 'main',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: '7.0.1',
    EXISTING_BRANCH_SHA: '33aee0d1b11766ce68ce23eb34f14be683ab9770',
    EXISTING_TAG_SHA: 'f825bead8b47cfc8f3ef95bf41275a724b2b8582',
  },
  onPremTestParamsSingleProject: {
    ADO_PAT: env.PLAYWRIGHT_ADO_ON_PREM_PAT,
    PAT_ORG: 'DefaultCollection',
    ADO_URL: `${env.PLAYWRIGHT_ADO_ON_PREM_URL}/software%20development/_git/Sample.Repo.ABC.Test`,
    NON_EXISTING_ADO_URL:
      'https://test1/DefaultCollection/_git/Antony%20Test%20Project1',
    EXISTING_COMMIT: 'ab2f1b0b20334c728a27d5d2833e02f8376a0bc9',
    EXISTING_BRANCH: 'Checkmarx',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'test-tag',
    EXISTING_BRANCH_SHA: 'ab2f1b0b20334c728a27d5d2833e02f8376a0bc9',
    EXISTING_TAG_SHA: 'e656ff682b1b029c38db1d6a930d2eaed3e7c1d2',
  },
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
      // Disable the certificate check when calling a resource and avoids the 'self-signed certificate' error.
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
      adoSdkPromise = getAdoSdk(
        await getAdoClientParams({
          tokenOrg: ADO_MOBB_ORG,
          accessToken: ADO_PAT,
          url: ADO_URL,
        })
      )
    })
    afterAll(async () => {
      // Enabling it again, just in case. The certificate check gets disabled on the `beforeAll` clause.
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
    })
    it(`${chalk.green.underline.bold(testName)}: test existing repo`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      expect(
        await adoSdk.getAdoRepoDefaultBranch({
          repoUrl: ADO_URL,
        })
      ).toEqual(EXISTING_BRANCH)
    })
    it(`${chalk.green.underline.bold(testName)}: test non existing repo`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      await expect(() =>
        adoSdk.getAdoRepoDefaultBranch({
          repoUrl: NON_EXISTING_ADO_URL,
        })
      ).rejects.toThrow()
    })
    it(`${chalk.green.underline.bold(testName)}: branch list on non existing repo`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      await expect(
        adoSdk.getAdoBranchList({
          repoUrl: NON_EXISTING_ADO_URL,
        })
      ).resolves.toEqual([])
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
    it(`${chalk.green.underline.bold(testName)}: commit URL`, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      const url = await adoSdk.getAdoCommitUrl({
        url: ADO_URL,
        commitId: EXISTING_COMMIT,
      })
      expect(url).toContain(`/commit/${EXISTING_COMMIT}`)
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
    it(`${chalk.green.underline.bold(testName)}:get the correct default branch `, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      const defaultBranch = await adoSdk.getAdoRepoDefaultBranch({
        repoUrl: ADO_URL,
      })
      expect(defaultBranch).toBe(EXISTING_BRANCH)
    })
    it(`${chalk.green.underline.bold(testName)}:get the correct branch list `, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      const brachList = await adoSdk.getAdoBranchList({
        repoUrl: ADO_URL,
      })
      expect(brachList.length).toBeLessThanOrEqual(1000)
    })

    it.each(downloadTestParams)(
      'test download url for $url',
      async ({ url, expectedDownloadUrl }) => {
        const adoSdk = await getAdoSk(adoSdkPromise)
        const downloadUrl = await adoSdk.getAdoDownloadUrl({
          repoUrl: url,
          branch: 'main',
        })
        expect(downloadUrl).toBe(expectedDownloadUrl)
      }
    )
  }
)

const scmTestParams = {
  accessTokenConfig: {
    url: env.PLAYWRIGHT_ADO_CLOUD_REPO_URL,
    accessToken: env.PLAYWRIGHT_ADO_CLOUD_PAT,
    scmOrg: env.PLAYWRIGHT_ADO_CLOUD_SCM_ORG,
  },
  // todo: add when we set an environment for on-prem add this test params back
}

const ADO_PATHS = {
  multiProjectPath: 'azure-org/webgoat/_git/webgoat.git',
  singleProjectPath: 'azure-org/_git/webgoat.git',
  tfsMultiPath: 'tfs/azure-org/webgoat/_git/webgoat.git',
  tfsSinglePath: 'tfs/azure-org/_git/webgoat.git',
} as const

const ADO_TEST_CLOUD_URLS = {
  multiProjectPath: `https://dev.azure.com/${ADO_PATHS.multiProjectPath}`,
  singleProjectPath: `https://dev.azure.com/${ADO_PATHS.singleProjectPath}`,
  tfsSinglePath: `https://dev.azure.com/${ADO_PATHS.tfsSinglePath}`,
  tfsMultiPath: `https://dev.azure.com/${ADO_PATHS.tfsMultiPath}`,
} as const

const CUSTOM_DOMAIN = 'https://custom-domain.com'
const ADO_TEST_ON_PREM_URLS = {
  multiProjectPath: `${CUSTOM_DOMAIN}/${ADO_PATHS.multiProjectPath}`,
  singleProjectPath: `${CUSTOM_DOMAIN}/${ADO_PATHS.singleProjectPath}`,
  tfsSinglePath: `${CUSTOM_DOMAIN}/${ADO_PATHS.tfsSinglePath}`,
  tfsMultiPath: `${CUSTOM_DOMAIN}/${ADO_PATHS.tfsMultiPath}`,
} as const

const downloadTestParams: { url: string; expectedDownloadUrl: string }[] = [
  {
    url: ADO_TEST_CLOUD_URLS.multiProjectPath,
    expectedDownloadUrl:
      'https://dev.azure.com/azure-org/webgoat/_apis/git/repositories/webgoat/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=main&resolveLfs=true&$format=zip&api-version=5.0&download=true',
  },
  {
    url: ADO_TEST_CLOUD_URLS.singleProjectPath,
    expectedDownloadUrl:
      'https://dev.azure.com/azure-org/webgoat/_apis/git/repositories/webgoat/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=main&resolveLfs=true&$format=zip&api-version=5.0&download=true',
  },
  {
    url: ADO_TEST_CLOUD_URLS.tfsSinglePath,
    expectedDownloadUrl:
      'https://dev.azure.com/tfs/azure-org/webgoat/_apis/git/repositories/webgoat/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=main&resolveLfs=true&$format=zip&api-version=5.0&download=true',
  },
  {
    url: ADO_TEST_CLOUD_URLS.tfsMultiPath,
    expectedDownloadUrl:
      'https://dev.azure.com/tfs/azure-org/webgoat/_apis/git/repositories/webgoat/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=main&resolveLfs=true&$format=zip&api-version=5.0&download=true',
  },
  {
    url: ADO_TEST_ON_PREM_URLS.multiProjectPath,
    expectedDownloadUrl: `${CUSTOM_DOMAIN}/azure-org/webgoat/_apis/git/repositories/webgoat/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=main&resolveLfs=true&$format=zip&api-version=5.0&download=true`,
  },
  {
    url: ADO_TEST_ON_PREM_URLS.singleProjectPath,
    expectedDownloadUrl: `${CUSTOM_DOMAIN}/azure-org/webgoat/_apis/git/repositories/webgoat/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=main&resolveLfs=true&$format=zip&api-version=5.0&download=true`,
  },
  {
    url: ADO_TEST_ON_PREM_URLS.tfsMultiPath,
    expectedDownloadUrl: `${CUSTOM_DOMAIN}/tfs/azure-org/webgoat/_apis/git/repositories/webgoat/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=main&resolveLfs=true&$format=zip&api-version=5.0&download=true`,
  },
  {
    url: ADO_TEST_ON_PREM_URLS.tfsSinglePath,
    expectedDownloadUrl: `${CUSTOM_DOMAIN}/tfs/azure-org/webgoat/_apis/git/repositories/webgoat/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=main&resolveLfs=true&$format=zip&api-version=5.0&download=true`,
  },
]

describe.each(Object.entries(scmTestParams))(
  'Ado scm instance',
  (testName, { url, accessToken, scmOrg }) => {
    it(`${chalk.green.bold(testName)} should return the correct headers for basic auth type `, async () => {
      const scmLib = await createScmLib(
        {
          url,
          scmType: ScmLibScmType.ADO,
          accessToken,
          scmOrg,
        },
        { propagateExceptions: true }
      )
      const authHeaders = scmLib.getAuthHeaders()
      const encodedAccessToken = Buffer.from(':' + accessToken).toString(
        'base64'
      )
      expect(authHeaders).toStrictEqual({
        authorization: `Basic ${encodedAccessToken}`,
      })
      const signedRepoUrl = await scmLib.getUrlWithCredentials()
      if (!signedRepoUrl) {
        throw new Error('signedRepoUrl is undefined')
      }
      const { protocol, pathname, hostname } = new URL(signedRepoUrl)
      expect(signedRepoUrl).toBe(
        `${protocol}//${accessToken}@${hostname}${pathname}`
      )
      const prUrl = await scmLib.getSubmitRequestUrl(1)
      expect(prUrl).toMatch(`${url}/pullrequest/1`)
    })
  }
)

describe('Ado scm general checks', () => {
  it('should return the correct repo list', async () => {
    const scmLib = await createScmLib({
      url: undefined,
      scmType: ScmLibScmType.ADO,
      accessToken: env.PLAYWRIGHT_ADO_CLOUD_PAT,
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
          repoName: 'test-public',
          repoOwner: env.PLAYWRIGHT_ADO_CLOUD_SCM_ORG,
          repoUpdatedAt: 'Mon Feb 24 2025',
          repoUrl:
            'https://dev.azure.com/citestjob2/test-public/_git/test-public',
        }),
        expect.objectContaining({
          repoIsPublic: false,
          repoLanguages: [],
          repoName: 'webgoat',
          repoOwner: env.PLAYWRIGHT_ADO_CLOUD_SCM_ORG,
          repoUpdatedAt: 'Tue Oct 29 2024',
          repoUrl: 'https://dev.azure.com/citestjob2/citestjob2/_git/webgoat',
        }),
        expect.objectContaining({
          repoIsPublic: true,
          repoLanguages: [],
          repoName: 'webgoat.mobbci.testjob',
          repoOwner: env.PLAYWRIGHT_ADO_CLOUD_SCM_ORG,
          repoUpdatedAt: 'Mon Feb 24 2025',
          repoUrl:
            'https://dev.azure.com/citestjob2/test-public/_git/webgoat.mobbci.testjob',
        }),
        expect.objectContaining({
          repoIsPublic: true,
          repoLanguages: [],
          repoName: 'webgoat.mobbci.testjob.mobbci.testjob test with spaces',
          repoOwner: env.PLAYWRIGHT_ADO_CLOUD_SCM_ORG,
          repoUpdatedAt: 'Mon Feb 24 2025',
          repoUrl:
            'https://dev.azure.com/citestjob2/test-public/_git/webgoat.mobbci.testjob.mobbci.testjob%20test%20with%20spaces',
        }),
      ])
    )
  })
  it('should throw RepoNoTokenAccessError when repo is not accessible', async () => {
    await expect(
      createScmLib({
        url: 'https://dev.azure.com/bogusssss/test/_git/bogus.non-existing',
        accessToken: env.PLAYWRIGHT_ADO_CLOUD_PAT,
        scmType: ScmLibScmType.ADO,
        scmOrg: testInputs.accessTokenTest.PAT_ORG,
      })
    ).rejects.toThrow(RepoNoTokenAccessError)
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
      prefixPath: '',
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
      prefixPath: '',
    })
  })
  it('fail if the url is invalid', () => {
    expect(() => parseAdoOwnerAndRepo(INVALID_URL)).toThrow()
  })
  it.each<{ tokenType: AdoOAuthTokenType }>([
    { tokenType: 'code' },
    { tokenType: 'refresh_token' },
  ])(
    'should return {success: false} for bad $tokenType',
    async ({ tokenType }) => {
      const getTokenRes = await getAdoToken({
        token: 'bad-token',
        adoClientSecret: 'secret',
        tokenType,
        redirectUri: 'https://example.com',
      })
      expect(getTokenRes.success).toBe(false)
    }
  )
})
