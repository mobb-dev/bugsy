import { fetch as undiciFetch } from 'undici'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getGitlabToken, GitlabTokenRequestTypeEnum } from '../../gitlab'
import * as scmUtils from '../../utils'

// Mock the external dependencies

vi.mock('undici', () => ({
  ProxyAgent: vi.fn(),
  fetch: vi.fn(),
}))

describe('getGitlabToken', () => {
  beforeEach(() => {
    vi.stubGlobal('GIT_PROXY_HOST', 'http://proxy.example.com')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('should return a successful response with valid input', async () => {
    const mockResponse = {
      access_token: 'mock_access_token',
      token_type: 'bearer',
      expires_in: 7200,
      refresh_token: 'mock_refresh_token',
      created_at: 1234567890,
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    undiciFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getGitlabToken({
      token: 'mock_token',
      gitlabClientId: 'mock_client_id',
      gitlabClientSecret: 'mock_client_secret',
      callbackUrl: 'http://callback.example.com',
      tokenType: GitlabTokenRequestTypeEnum.CODE,
    })

    expect(result).toEqual({
      success: true,
      authResult: {
        access_token: mockResponse.access_token,
        token_type: mockResponse.token_type,
        refresh_token: mockResponse.refresh_token,
      },
    })

    expect(undiciFetch).toHaveBeenCalledWith(
      'https://gitlab.com/oauth/token',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: expect.stringContaining('grant_type=authorization_code'),
      })
    )
  })

  it('should use ProxyAgent when isBrokerUrl returns true', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    undiciFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    })
    const isBrokerUrlSpy = vi.spyOn(scmUtils, 'isBrokerUrl')
    const onPremDoamain = '46dc2338-3ec3-4b36-87ee-65c2c3ab4a75'
    await getGitlabToken({
      scmUrl: `https://${onPremDoamain}`,
      token: 'mock_token',
      gitlabClientId: 'mock_client_id',
      gitlabClientSecret: 'mock_client_secret',
      callbackUrl: 'http://callback.example.com',
      tokenType: GitlabTokenRequestTypeEnum.CODE,
      brokerHosts: [
        {
          virtualDomain: onPremDoamain,
          realDomain: 'my-gitlab-on-prem.com',
        },
      ],
    })
    expect(isBrokerUrlSpy).toHaveReturnedWith(true)

    expect(undiciFetch).toHaveBeenCalledWith(
      `https://${onPremDoamain}/oauth/token`,
      expect.objectContaining({
        dispatcher: expect.any(Object),
      })
    )
  })

  it('should return unsuccessful response when GitlabAuthResultZ parse fails', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    undiciFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ invalid: 'response' }),
    })
    const result = await getGitlabToken({
      token: 'mock_token',
      gitlabClientId: 'mock_client_id',
      gitlabClientSecret: 'mock_client_secret',
      callbackUrl: 'http://callback.example.com',
      tokenType: GitlabTokenRequestTypeEnum.CODE,
    })

    expect(result).toEqual({
      success: false,
    })
  })

  it('should use refresh_token grant type when tokenType is REFRESH_TOKEN', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    undiciFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    })

    await getGitlabToken({
      token: 'mock_refresh_token',
      gitlabClientId: 'mock_client_id',
      gitlabClientSecret: 'mock_client_secret',
      callbackUrl: 'http://callback.example.com',
      tokenType: GitlabTokenRequestTypeEnum.REFRESH_TOKEN,
    })

    expect(undiciFetch).toHaveBeenCalledWith(
      'https://gitlab.com/oauth/token',
      expect.objectContaining({
        body: expect.stringContaining('grant_type=refresh_token'),
      })
    )
  })
})
