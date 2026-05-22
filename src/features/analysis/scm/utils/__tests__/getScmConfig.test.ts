import { describe, expect, it } from 'vitest'

import { ScmConfig } from '../../types'
import { getScmConfig } from '../'

const githubUrl = 'https://github.com/acme/repo'

const baseUserGithub: ScmConfig = {
  id: 'user-github',
  scmType: 'GitHub',
  scmUrl: 'https://github.com',
  token: 'user-token',
  userId: 'user-1',
  orgId: null,
  isTokenAvailable: true,
}

const baseOrgGithub: ScmConfig = {
  id: 'org-github',
  scmType: 'GitHub',
  scmUrl: 'https://github.com',
  token: 'org-token',
  userId: null,
  orgId: 'org-1',
  isTokenAvailable: true,
}

describe('getScmConfig precedence', () => {
  it('prefers the user-personal credential when caller orders user first (default getUserInfo order)', () => {
    const result = getScmConfig({
      url: githubUrl,
      scmConfigs: [baseUserGithub, baseOrgGithub],
      brokerHosts: [],
    })
    expect(result.id).toBe('user-github')
    expect(result.accessToken).toBe('user-token')
  })

  it('prefers the org credential when caller orders org first (prioritizeOrgScmConfigs=true)', () => {
    const result = getScmConfig({
      url: githubUrl,
      scmConfigs: [baseOrgGithub, baseUserGithub],
      brokerHosts: [],
    })
    expect(result.id).toBe('org-github')
    expect(result.accessToken).toBe('org-token')
  })

  it('falls back to org credential when user has no token for the host', () => {
    const result = getScmConfig({
      url: githubUrl,
      scmConfigs: [baseOrgGithub],
      brokerHosts: [],
    })
    expect(result.id).toBe('org-github')
  })

  it('skips org credentials when includeOrgTokens=false and falls back to the user PAT', () => {
    const result = getScmConfig({
      url: githubUrl,
      scmConfigs: [baseOrgGithub, baseUserGithub],
      brokerHosts: [],
      includeOrgTokens: false,
    })
    expect(result.id).toBe('user-github')
  })

  it('returns no accessToken when includeOrgTokens=false and only an org credential is available', () => {
    const result = getScmConfig({
      url: githubUrl,
      scmConfigs: [baseOrgGithub],
      brokerHosts: [],
      includeOrgTokens: false,
    })
    expect(result.id).toBeUndefined()
    expect(result.accessToken).toBeUndefined()
  })

  it('skips configs without a token', () => {
    const tokenless: ScmConfig = { ...baseOrgGithub, token: null }
    const result = getScmConfig({
      url: githubUrl,
      scmConfigs: [tokenless, baseUserGithub],
      brokerHosts: [],
    })
    expect(result.id).toBe('user-github')
  })
})
