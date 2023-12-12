import { describe, expect, it } from 'vitest'

import { parseScmURL } from '../urlParser'

const ALLOWED_URLS = [
  'https://gitlab.com/gitlab-org/security-products/tests/webgoat',
  'https://gitlab.com/gitlab-org/security-products/tests/web.goat',
  'https://gitlab.com/gitlab-org/security-products/tests/webgoat.git',
  'https://gitlab.com/gitlab-org/security-products/tests/web.goat.git',

  'https://github.com/gitlab-org/webgoat',
  'https://github.com/gitlab-org/web.goat',
  'https://github.com/gitlab-org/webgoat.git',
  'https://github.com/gitlab-org/web.goat.git',
]
const NEGATIVE_URLS = [
  'https://github.com/gitlab-org/security-products/tests/webgoat',
  'https://github.com/gitlab-org/security-products/tests/web.goat',
  'https://github.com/gitlab-org/security-products/tests/webgoat.git',
  'https://github.com/gitlab-org/security-products/tests/web.goat.git',
]

const GITHUB_TEST_URL = 'https://github.com/jerryhoff/WebGoat.NET.git'
const GITLAB_TEST_URL =
  'https://gitlab.com/gitlab-org/security-products/tests/webgoat.git'
const INVALID_TEST_URL = 'https://bitbucket.org/riyafukui/webgoat.git'

describe('parseScmURL', () => {
  it('Parses allowed urls', async () => {
    ALLOWED_URLS.forEach((url) => expect(parseScmURL(url)).not.toBe(null))
  })

  it('Not parses negative urls', async () => {
    NEGATIVE_URLS.forEach((url) => expect(parseScmURL(url)).toBe(null))
  })
  it('Should get valid hostname', async () => {
    expect(parseScmURL(GITHUB_TEST_URL)?.hostname).toBe('github.com')
    expect(parseScmURL(GITLAB_TEST_URL)?.hostname).toBe('gitlab.com')
    expect(parseScmURL(INVALID_TEST_URL)).toBe(null)
  })
  it('Should get valid repoName', async () => {
    expect(parseScmURL(GITHUB_TEST_URL)?.repoName).toBe('WebGoat.NET')
    expect(parseScmURL(GITLAB_TEST_URL)?.repoName).toBe('webgoat')
    expect(parseScmURL(INVALID_TEST_URL)).toBe(null)
  })
  it('Should get valid org name', async () => {
    expect(parseScmURL(GITHUB_TEST_URL)?.organization).toBe('jerryhoff')
    expect(parseScmURL(GITLAB_TEST_URL)?.organization).toBe('gitlab-org')
    expect(parseScmURL(INVALID_TEST_URL)).toBe(null)
  })
  it('Should get valid org project path', async () => {
    expect(parseScmURL(GITHUB_TEST_URL)?.projectPath).toBe(
      'jerryhoff/WebGoat.NET'
    )
    expect(parseScmURL(GITLAB_TEST_URL)?.projectPath).toBe(
      'gitlab-org/security-products/tests/webgoat'
    )
    expect(parseScmURL(INVALID_TEST_URL)).toBe(null)
  })
})
