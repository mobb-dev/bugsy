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

describe('getScmConfig host matching', () => {
  const onPremAdo: ScmConfig = {
    id: 'onprem-ado',
    scmType: 'Ado',
    scmUrl: 'https://ado.internal.corp',
    token: 'ado-token',
    userId: 'user-1',
    orgId: null,
    isTokenAvailable: true,
  }

  const brokerHosts = [
    { virtualDomain: 'virt-123', realDomain: 'ado.internal.corp' },
  ]

  it('reuses a broker-backed connection when the caller opts in and only the protocol differs', () => {
    // Broker path is a TLS inner tunnel AND the backend opts in → safe to reuse.
    const result = getScmConfig({
      url: 'http://ado.internal.corp/DefaultCollection/Webgoat',
      scmConfigs: [onPremAdo],
      brokerHosts,
      allowRelaxedProtocolMatch: true,
    })
    expect(result.id).toBe('onprem-ado')
    expect(result.accessToken).toBe('ado-token')
    expect(result.virtualUrl).toContain('virt-123')
  })

  it('reuses a broker-backed connection (opted in) when only the port differs', () => {
    const result = getScmConfig({
      url: 'https://ado.internal.corp:8443/DefaultCollection/Webgoat',
      scmConfigs: [onPremAdo],
      brokerHosts,
      allowRelaxedProtocolMatch: true,
    })
    expect(result.id).toBe('onprem-ado')
  })

  it('does NOT reuse for a direct caller (CLI default) even when broker-backed — cleartext risk', () => {
    // allowRelaxedProtocolMatch defaults false: the CLI connects to the raw url,
    // so an https token must never attach to a plain-http request.
    const result = getScmConfig({
      url: 'http://ado.internal.corp/DefaultCollection/Webgoat',
      scmConfigs: [onPremAdo],
      brokerHosts,
    })
    expect(result.id).toBeUndefined()
    expect(result.accessToken).toBeUndefined()
  })

  it('does NOT reuse an https token for a direct http url with no broker', () => {
    const result = getScmConfig({
      url: 'http://ado.internal.corp/DefaultCollection/Webgoat',
      scmConfigs: [onPremAdo],
      brokerHosts: [],
      allowRelaxedProtocolMatch: true,
    })
    expect(result.id).toBeUndefined()
    expect(result.accessToken).toBeUndefined()
  })

  it('prefers the exact protocol match when both http and https configs exist', () => {
    const httpAdo: ScmConfig = {
      ...onPremAdo,
      id: 'onprem-ado-http',
      scmUrl: 'http://ado.internal.corp',
      token: 'ado-http-token',
    }
    const result = getScmConfig({
      url: 'http://ado.internal.corp/DefaultCollection/Webgoat',
      scmConfigs: [onPremAdo, httpAdo],
      brokerHosts: [],
    })
    expect(result.id).toBe('onprem-ado-http')
  })

  it('does not match a different host', () => {
    const result = getScmConfig({
      url: 'https://other.internal.corp/repo',
      scmConfigs: [onPremAdo],
      brokerHosts: [],
    })
    expect(result.id).toBeUndefined()
    expect(result.accessToken).toBeUndefined()
  })
})
