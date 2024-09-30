import querystring from 'node:querystring'

import * as api from 'azure-devops-node-api'
import { z } from 'zod'

import { GIT_PROXY_HOST } from '../env'
import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  isBrokerUrl,
} from '../scm'
import { parseScmURL, ScmType } from '../shared/src'
import {
  ADO_ACCESS_TOKEN_URL,
  AdoTokenTypeEnum,
  DEFUALT_ADO_ORIGIN,
} from './constants'
import {
  AdoOAuthTokenType,
  AdoTokenInfo,
  AdoValidateParamsArgs,
  GetAdoApiClientParams,
} from './types'
import { accountsZ, AdoAuthResultZ, profileZ } from './validation'

function _getPublicAdoClient({
  orgName,
  origin,
}: {
  orgName: string
  origin: string
}) {
  const orgUrl = `${origin}/${orgName}`
  const authHandler = api.getPersonalAccessTokenHandler('')
  authHandler.canHandleAuthentication = () => false
  authHandler.prepareRequest = (_options) => {
    return
  }
  const connection = new api.WebApi(orgUrl, authHandler)
  return connection
}

function removeTrailingSlash(str: string) {
  return str.trim().replace(/\/+$/, '')
}

export function parseAdoOwnerAndRepo(adoUrl: string) {
  adoUrl = removeTrailingSlash(adoUrl)
  const parsingResult = parseScmURL(adoUrl, ScmType.Ado)
  if (!parsingResult || parsingResult.scmType !== ScmType.Ado) {
    throw new InvalidUrlPatternError(`
      : ${adoUrl}`)
  }
  const {
    organization,
    repoName,
    projectName,
    projectPath,
    pathElements,
    hostname,
    protocol,
  } = parsingResult
  // note: the reason we decode the values is because 'azure-devops-node-api' decode the values on his side.
  // if we decode the values twice we might result the wrong output. see MOBB-2084
  return {
    owner: decodeURI(organization),
    repo: decodeURI(repoName),
    projectName: projectName ? decodeURI(projectName) : undefined,
    projectPath,
    pathElements,
    prefixPath: parsingResult.prefixPath,
    origin: `${protocol}//${hostname}`,
  }
}

export async function getAdoConnectData({
  url,
  tokenOrg,
  adoTokenInfo,
}: {
  tokenOrg: string | undefined
  url: string | undefined
  adoTokenInfo: AdoTokenInfo
}): Promise<{ org: string; origin: string }> {
  if (url) {
    const urlObject = new URL(url)
    if (
      tokenOrg &&
      (urlObject.origin === url || `${urlObject.origin}/tfs` === url)
    ) {
      return {
        origin: url,
        org: tokenOrg,
      }
    }
    const { owner, origin, prefixPath } = parseAdoOwnerAndRepo(url)

    return {
      org: owner,
      origin: prefixPath ? `${origin}/${prefixPath}` : origin,
    }
  }
  if (!tokenOrg) {
    if (adoTokenInfo.type === AdoTokenTypeEnum.OAUTH) {
      const [org] = await _getOrgsForOauthToken({
        oauthToken: adoTokenInfo.accessToken,
      })

      return {
        org: z.string().parse(org),
        origin: DEFUALT_ADO_ORIGIN,
      }
    }
    throw new InvalidRepoUrlError('ADO URL is null')
  }

  return {
    org: tokenOrg,
    origin: DEFUALT_ADO_ORIGIN,
  }
}

function isAdoOnCloud(url: string) {
  const urlObj = new URL(url)
  return (
    urlObj.origin.toLowerCase() === DEFUALT_ADO_ORIGIN ||
    urlObj.hostname.toLowerCase().endsWith('.visualstudio.com')
  )
}

export async function getAdoApiClient(params: GetAdoApiClientParams) {
  const { origin = DEFUALT_ADO_ORIGIN, orgName } = params
  if (
    params.tokenType === AdoTokenTypeEnum.NONE ||
    // note: move to public client if the token is not associated with the PAT org
    // we're only doing it the ado on the cloud
    (params.tokenType === AdoTokenTypeEnum.PAT &&
      params.patTokenOrg !== orgName &&
      isAdoOnCloud(origin))
  ) {
    return _getPublicAdoClient({ orgName, origin })
  }
  const orgUrl = `${origin}/${orgName}`
  if (params.tokenType === AdoTokenTypeEnum.OAUTH) {
    if (!isAdoOnCloud(origin)) {
      throw new Error(
        `Oauth token is not supported for ADO on prem - ${origin} `
      )
    }
    const connection = new api.WebApi(
      orgUrl,
      api.getBearerHandler(params.accessToken),
      {}
    )
    return connection
  }
  // PAT handling

  const authHandler = api.getPersonalAccessTokenHandler(params.accessToken)
  const isBroker = isBrokerUrl(orgUrl)
  const connection = new api.WebApi(
    orgUrl,
    authHandler,
    isBroker
      ? {
          proxy: {
            proxyUrl: GIT_PROXY_HOST,
          },
          ignoreSslError: true,
        }
      : undefined
  )
  return connection
}

export function getAdoTokenInfo(token?: string): AdoTokenInfo {
  if (!token) {
    return { type: AdoTokenTypeEnum.NONE }
  }
  if (token.includes('.')) {
    return { type: AdoTokenTypeEnum.OAUTH, accessToken: token }
  }
  return { type: AdoTokenTypeEnum.PAT, accessToken: token }
}

export async function getAdoClientParams(
  params: AdoValidateParamsArgs
): Promise<GetAdoApiClientParams> {
  const { url, accessToken, tokenOrg } = params
  const adoTokenInfo = getAdoTokenInfo(accessToken)
  const { org, origin } = await getAdoConnectData({
    url,
    tokenOrg,
    adoTokenInfo,
  })
  switch (adoTokenInfo.type) {
    case AdoTokenTypeEnum.NONE:
      return {
        tokenType: AdoTokenTypeEnum.NONE,
        origin,
        orgName: org.toLowerCase(),
      }
    case AdoTokenTypeEnum.OAUTH: {
      return {
        tokenType: AdoTokenTypeEnum.OAUTH,
        accessToken: adoTokenInfo.accessToken,
        origin,
        orgName: org.toLowerCase(),
      }
    }
    case AdoTokenTypeEnum.PAT: {
      return {
        tokenType: AdoTokenTypeEnum.PAT,
        accessToken: adoTokenInfo.accessToken,
        patTokenOrg: z.string().parse(tokenOrg).toLowerCase(),
        origin,
        orgName: org.toLowerCase(),
      }
    }
  }
}

export async function adoValidateParams({
  url,
  accessToken,
  tokenOrg,
}: AdoValidateParamsArgs) {
  try {
    const api = await getAdoApiClient(
      await getAdoClientParams({ url, accessToken, tokenOrg })
    )
    await api.connect()
  } catch (e) {
    console.log('adoValidateParams error', e)
    const error = e as {
      code?: string
      status?: number
      statusCode?: number
      response?: { status?: number; statusCode?: number; code?: string }
      description?: string
    }
    const code =
      error.code ||
      error.status ||
      error.statusCode ||
      error.response?.status ||
      error.response?.statusCode ||
      error.response?.code

    const description = error.description || `${e}`
    if (
      code === 401 ||
      code === 403 ||
      description.includes('401') ||
      description.includes('403')
    ) {
      throw new InvalidAccessTokenError(`invalid ADO access token`)
    }
    if (
      code === 404 ||
      description.includes('404') ||
      description.includes('Not Found')
    ) {
      throw new InvalidRepoUrlError(`invalid ADO repo URL ${url}`)
    }
    throw e
  }
}

export async function _getOrgsForOauthToken({
  oauthToken,
}: {
  oauthToken: string
}) {
  const profileRes = await fetch(
    'https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=6.0',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${oauthToken}`,
      },
    }
  )
  const profileJson = await profileRes.json()
  const profile = profileZ.parse(profileJson)
  const accountsRes = await fetch(
    `https://app.vssps.visualstudio.com/_apis/accounts?memberId=${profile.publicAlias}&api-version=6.0`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${oauthToken}`,
      },
    }
  )
  const accountsJson = await accountsRes.json()
  const accounts = accountsZ.parse(accountsJson)
  const orgs = accounts.value
    .map((account) => account.accountName)
    .filter((value, index, array) => array.indexOf(value) === index)
  return orgs
}

export async function getAdoToken({
  token,
  adoClientSecret,
  tokenType,
  redirectUri,
}: {
  token: string
  adoClientSecret: string
  tokenType: AdoOAuthTokenType
  redirectUri: string
}) {
  console.debug('getAdoToken', {
    tokenType,
    redirectUri,
  })
  const res = await fetch(ADO_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      client_assertion_type:
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: adoClientSecret,
      redirect_uri: redirectUri,
      assertion: token,
      grant_type:
        tokenType === 'code'
          ? 'urn:ietf:params:oauth:grant-type:jwt-bearer'
          : 'refresh_token',
    }),
  })
  const authResult = await res.json()
  console.debug('authResult', authResult)
  return AdoAuthResultZ.parse(authResult)
}
