import chalk from 'chalk'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  AdoOAuthTokenType,
  getAdoClientParams,
  getAdoSdk,
  getAdoToken,
  parseAdoOwnerAndRepo,
} from '../ado'
import { RepoNoTokenAccessError, SCMLib } from '../scm'
import { ReferenceType, ScmLibScmType } from '../types'
import { env } from './env'

const TEST_ADO_REPO = 'https://dev.azure.com/mobbtest/test/_git/repo1'

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
    ADO_PAT: env.ADO_TEST_ACCESS_TOKEN,
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
    NON_EXISTING_ADO_URL: 'https://dev.azure.com/mobbtest/test/_git/repo1',
    EXISTING_COMMIT: 'b67eb441420675e0f107e2c1a3ba04900fc110fb',
    EXISTING_BRANCH: 'main',
    NON_EXISTING_BRANCH: 'non-existing-branch',
    EXISTING_TAG: 'v2023.8',
    EXISTING_BRANCH_SHA: 'f7534d521f1abc7a5a5ace657b63763d1a7fce4c',
    EXISTING_TAG_SHA: '5357a65e054976cd7d79b81ef3906ded050ed921',
  },
  publicRepoWithPat: {
    ADO_PAT: env.ADO_TEST_ACCESS_TOKEN,
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
    ADO_PAT: env.ADO_TEST_ACCESS_TOKEN,
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
    it(`${chalk.green.underline.bold(testName)}:get the correct default branch `, async () => {
      const adoSdk = await getAdoSk(adoSdkPromise)
      const defaultBranch = await adoSdk.getAdoRepoDefaultBranch({
        repoUrl: ADO_URL,
      })
      expect(defaultBranch).toBe(EXISTING_BRANCH)
    })

    it.each(downloadTestParams)(
      'test donwload url for $url',
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
    url: TEST_ADO_REPO,
    accessToken: env.TEST_MINIMAL_WEBGOAT_ADO_TOKEN,
    scmOrg: 'mobbtest',
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
      const scmLib = await SCMLib.init(
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
      const { protocol, pathname, hostname } = new URL(signedRepoUrl)
      expect(signedRepoUrl).toBe(
        `${protocol}//${accessToken}@${hostname}${pathname}`
      )
      const prUrl = await scmLib.getPrUrl(1)
      expect(prUrl).toMatch(`${TEST_ADO_REPO}/pullrequest/1`)
    })
  }
)

describe('Ado scm general checks', () => {
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
  it('should throw RepoNoTokenAccessError when repo is not accessible', async () => {
    await expect(
      SCMLib.init({
        url: 'https://dev.azure.com/mobbtest/test/_git/repo11',
        accessToken: env.TEST_MINIMAL_WEBGOAT_ADO_TOKEN,
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
