import { describe, expect, it } from 'vitest'

import { ADO_PREFIX_PATH, parseScmURL, ScmType } from '../shared/src'

const ALLOWED_URLS = {
  [ScmType.GitLab]: [
    'https://gitlab.com/gitlab-org/security-products/tests/webgoat',
    'https://gitlab.com/gitlab-org/security-products/tests/web.goat',
    'https://gitlab.com/gitlab-org/security-products/tests/webgoat.git',
    'https://gitlab.com/gitlab-org/security-products/tests/web.goat.git',
  ],
  [ScmType.GitHub]: [
    'https://github.com/gitlab-org/webgoat',
    'https://github.com/gitlab-org/web.goat',
    'https://github.com/gitlab-org/webgoat.git',
    'https://github.com/gitlab-org/web.goat.git',
  ],
  [ScmType.Ado]: [
    'https://dev.azure.com/azure-org/proj/_git/webgoat',
    'https://dev.azure.com/azure-org/proj/_git/web.goat',
    'https://dev.azure.com/azure-org/proj/_git/webgoat.git',
    'https://dev.azure.com/azure-org/proj/_git/web.goat.git',
    'https://dev.azure.com/tfs/azure-org/proj/_git/webgoat',
  ],
  [ScmType.Bitbucket]: [
    'https://bitbucket.org/workspace/repo_slug',
    'https://bitbucket.org/workspace/repo.slug',
    'https://bitbucket.org/workspace/repo_slug.git',
    'https://bitbucket.org/workspace/repo.slug.git',
    'https://haggai-mobb@bitbucket.org/workspace/repo.slug.git',
  ],
} as const
const NEGATIVE_URLS = [
  'https://github.com/gitlab-org/security-products/tests/webgoat',
  'https://github.com/gitlab-org/security-products/tests/web.goat',
  'https://github.com/gitlab-org/security-products/tests/webgoat.git',
  'https://github.com/gitlab-org/security-products/tests/web.goat.git',
]

const GITHUB_TEST_URL = 'https://github.com/jerryhoff/WebGoat.NET.git'
const GITLAB_TEST_URL =
  'https://gitlab.com/gitlab-org/security-products/tests/webgoat.git'

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

const BITBUCKET_TEST_URL =
  'https://username@bitbucket.org/workspace/repo_slug.git'
const INVALID_TEST_URL = 'https://repomanager.org/riyafukui/webgoat.git'

describe('parseScmURL', () => {
  it('Parses bitbucket', async () => {
    expect(parseScmURL(BITBUCKET_TEST_URL)).not.toBe(null)
  })
  it('Parses allowed urls', async () => {
    Object.values(ALLOWED_URLS).forEach((urls) =>
      urls.forEach((url) => expect(parseScmURL(url)).not.toBe(null))
    )
  })
  it('should detect the corrrect scmType', async () => {
    Object.entries(ALLOWED_URLS).forEach(([scmType, urls]) =>
      urls.forEach((url) => {
        const result = parseScmURL(url)
        expect(result?.scmType).toBe(scmType)
      })
    )
  })

  it('Not parses negative urls', async () => {
    NEGATIVE_URLS.forEach((url) => expect(parseScmURL(url)).toBe(null))
  })
  it('Should get valid hostname', async () => {
    expect(parseScmURL(GITHUB_TEST_URL)?.hostname).toBe('github.com')
    expect(parseScmURL(GITLAB_TEST_URL)?.hostname).toBe('gitlab.com')
    Object.values(ADO_TEST_CLOUD_URLS).map((adoUrl) =>
      expect(parseScmURL(adoUrl)?.hostname).toBe('dev.azure.com')
    )
    Object.values(ADO_TEST_ON_PREM_URLS).map((adoUrl) =>
      expect(parseScmURL(adoUrl, ScmType.Ado)?.hostname).toBe(
        'custom-domain.com'
      )
    )
    expect(parseScmURL(BITBUCKET_TEST_URL)?.hostname).toBe('bitbucket.org')
    expect(parseScmURL(INVALID_TEST_URL)).toBe(null)
  })
  it('Should get valid repoName', async () => {
    expect(parseScmURL(GITHUB_TEST_URL)?.repoName).toBe('WebGoat.NET')
    expect(parseScmURL(GITLAB_TEST_URL)?.repoName).toBe('webgoat')
    Object.values(ADO_TEST_CLOUD_URLS).map((adoUrl) =>
      expect(parseScmURL(adoUrl)?.repoName).toBe('webgoat')
    )
    expect(parseScmURL(BITBUCKET_TEST_URL)?.repoName).toBe('repo_slug')
    expect(parseScmURL(INVALID_TEST_URL)).toBe(null)
  })
  it('Should get valid org name', async () => {
    expect(parseScmURL(GITHUB_TEST_URL)?.organization).toBe('jerryhoff')
    expect(parseScmURL(GITLAB_TEST_URL)?.organization).toBe('gitlab-org')
    Object.values(ADO_TEST_CLOUD_URLS).map((adoUrl) =>
      expect(parseScmURL(adoUrl)?.organization).toBe('azure-org')
    )
    Object.values(ADO_TEST_ON_PREM_URLS).map((adoUrl) =>
      expect(parseScmURL(adoUrl, ScmType.Ado)?.organization).toBe('azure-org')
    )

    expect(parseScmURL(BITBUCKET_TEST_URL)?.organization).toBe('workspace')
    expect(parseScmURL(INVALID_TEST_URL)).toBe(null)
  })
  it('Should get valid org project path', async () => {
    expect(parseScmURL(GITHUB_TEST_URL)?.projectPath).toBe(
      'jerryhoff/WebGoat.NET'
    )
    expect(parseScmURL(GITLAB_TEST_URL)?.projectPath).toBe(
      'gitlab-org/security-products/tests/webgoat'
    )

    expect(parseScmURL(BITBUCKET_TEST_URL)?.projectPath).toBe(
      'workspace/repo_slug'
    )

    expect(parseScmURL(INVALID_TEST_URL)).toBe(null)
  })
  it("should contain the correct prefix ADO urls starting with 'tfs'  ", async () => {
    ;[ADO_TEST_CLOUD_URLS.tfsMultiPath, ADO_TEST_CLOUD_URLS.tfsSinglePath].map(
      (url) => {
        const result = parseScmURL(url)
        expect(result?.scmType).toBe(ScmType.Ado)
        expect(
          result?.scmType === ScmType.Ado &&
            result.prefixPath === ADO_PREFIX_PATH
        ).toBe(true)
      }
    )
    ;[
      ADO_TEST_ON_PREM_URLS.tfsMultiPath,
      ADO_TEST_ON_PREM_URLS.tfsSinglePath,
    ].map((url) => {
      const result = parseScmURL(url, ScmType.Ado)
      expect(result?.scmType).toBe(ScmType.Ado)
      expect(
        result?.scmType === ScmType.Ado && result.prefixPath === ADO_PREFIX_PATH
      ).toBe(true)
    })
  })
  it('should contain empty prefix for non tfs ADO urls', async () => {
    ;[
      ADO_TEST_CLOUD_URLS.multiProjectPath,
      ADO_TEST_CLOUD_URLS.singleProjectPath,
    ].map((url) => {
      const result = parseScmURL(url)
      expect(result?.scmType === ScmType.Ado && result.prefixPath === '').toBe(
        true
      )
    })
    ;[
      ADO_TEST_ON_PREM_URLS.multiProjectPath,
      ADO_TEST_ON_PREM_URLS.singleProjectPath,
    ].map((url) => {
      const result = parseScmURL(url, ScmType.Ado)
      expect(result?.scmType === ScmType.Ado && result.prefixPath === '').toBe(
        true
      )
    })
  })
  it('should get the correct project name for ADO urls', async () => {
    Object.values(ADO_TEST_CLOUD_URLS).map((url) => {
      const result = parseScmURL(url)
      expect(
        result?.scmType === ScmType.Ado && result.projectName === 'webgoat'
      ).toBe(true)
    })
    Object.values(ADO_TEST_ON_PREM_URLS).map((url) => {
      const result = parseScmURL(url, ScmType.Ado)
      expect(
        result?.scmType === ScmType.Ado && result.projectName === 'webgoat'
      ).toBe(true)
    })
  })
})
