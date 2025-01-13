import { z } from 'zod'

import { getFixUrl } from '../shared/src'
import { ScmType } from '../shared/src'
import { ScmConfig } from '../types'
import {
  scmCloudHostname,
  ScmLibScmType,
  scmLibScmTypeToScmType,
  scmTypeToScmLibScmType,
} from '../types'

export * from './broker'

type GetFixUrlParam = {
  appBaseUrl: string
  fixId: string
  projectId: string
  organizationId: string
  analysisId: string
}

export function getFixUrlWithRedirect(params: GetCommitUrlParam) {
  const {
    fixId,
    projectId,
    organizationId,
    analysisId,
    redirectUrl,
    appBaseUrl,
    commentId,
  } = params
  const searchParams = new URLSearchParams()
  searchParams.append('commit_redirect_url', redirectUrl)
  searchParams.append('comment_id', commentId.toString())
  return `${getFixUrl({
    appBaseUrl,
    fixId,
    projectId,
    organizationId,
    analysisId,
  })}?${searchParams.toString()}`
}

type GetCommitUrlParam = GetFixUrlParam & {
  redirectUrl: string
  commentId: number
}
export function getCommitUrl(params: GetCommitUrlParam) {
  const {
    fixId,
    projectId,
    organizationId,
    analysisId,
    redirectUrl,
    appBaseUrl,
    commentId,
  } = params
  const searchParams = new URLSearchParams()
  searchParams.append('redirect_url', redirectUrl)
  searchParams.append('comment_id', commentId.toString())
  return `${getFixUrl({
    appBaseUrl,
    fixId,
    projectId,
    organizationId,
    analysisId,
  })}/commit?${searchParams.toString()}`
}

// username patteren such as 'https://haggai-mobb@bitbucket.org/workspace/repo_slug.git'
const userNamePattern = /^(https?:\/\/)([^@]+@)?([^/]+\/.+)$/

// ssh path pattern such as 'git@bitbucket.org:workspace/repo_slug.git'
const sshPattern = /^git@([\w.-]+):([\w./-]+)$/

export function normalizeUrl(repoUrl: string) {
  let trimmedUrl = repoUrl.trim().replace(/\/+$/, '')
  if (repoUrl.endsWith('.git')) {
    trimmedUrl = trimmedUrl.slice(0, -'.git'.length)
  }

  const usernameMatch = trimmedUrl.match(userNamePattern)
  if (usernameMatch) {
    const [_all, protocol, _username, repoPath] = usernameMatch
    trimmedUrl = `${protocol}${repoPath}`
  }
  const sshMatch = trimmedUrl.match(sshPattern)
  if (sshMatch) {
    const [_all, hostname, reporPath] = sshMatch
    trimmedUrl = `https://${hostname}/${reporPath}`
  }
  return trimmedUrl
}

const isUrlHasPath = (url: string) => {
  return new URL(url).origin !== url
}

// note: in some cases we want to use non repo related calls for on prem urls,
// e.g. we want to fetch the user info.
// so we don't need to validate the url, otherwise it will fail
// in case the url does contain extends beyond the origin, we do want to validate it
export function shouldValidateUrl(repoUrl?: string | null) {
  return repoUrl && isUrlHasPath(repoUrl)
}

export function isBrokerUrl(url: string) {
  return z.string().uuid().safeParse(new URL(url).host).success
}

export function buildAuthorizedRepoUrl(args: {
  url: string
  username: string
  password: string
}) {
  const { url, username, password } = args
  const is_http = url.toLowerCase().startsWith('http://')
  const is_https = url.toLowerCase().startsWith('https://')
  // note: check the url when using the scm agent with personal access token

  if (is_http) {
    return `http://${username}:${password}@${url
      .toLowerCase()
      .replace('http://', '')}`
  } else if (is_https) {
    return `https://${username}:${password}@${url
      .toLowerCase()
      .replace('https://', '')}`
  } else {
    console.error(`invalid scm url ${url}`)
    throw new Error(`invalid scm url ${url}`)
  }
}

export function getCloudScmLibTypeFromUrl(
  url: string | undefined
): ScmLibScmType | undefined {
  if (!url) {
    return undefined
  }
  const urlObject = new URL(url)
  const hostname = urlObject.hostname.toLowerCase()
  if (hostname === scmCloudHostname.GitLab) {
    return ScmLibScmType.GITLAB
  }
  if (hostname === scmCloudHostname.GitHub) {
    return ScmLibScmType.GITHUB
  }
  if (
    hostname === scmCloudHostname.Ado ||
    hostname.endsWith('.visualstudio.com')
  ) {
    return ScmLibScmType.ADO
  }
  if (hostname === scmCloudHostname.Bitbucket) {
    return ScmLibScmType.BITBUCKET
  }

  return undefined
}

export function getScmTypeFromScmLibType(
  scmLibType: string | null | undefined
) {
  const parsedScmLibType = z.nativeEnum(ScmLibScmType).parse(scmLibType)
  return scmLibScmTypeToScmType[parsedScmLibType]
}

export function getScmLibTypeFromScmType(scmType: string | null | undefined) {
  const parsedScmType = z.nativeEnum(ScmType).parse(scmType)
  return scmTypeToScmLibScmType[parsedScmType]
}

export function getScmConfig({
  url,
  scmConfigs,
  brokerHosts,
  includeOrgTokens = true,
}: {
  url: string
  scmConfigs: ScmConfig[]
  brokerHosts: {
    virtualDomain: string
    realDomain: string
  }[]
  includeOrgTokens?: boolean
}) {
  const urlObject = new URL(url)
  const filteredScmConfigs = scmConfigs.filter((scm) => {
    const configUrl = new URL(scm.scmUrl)
    return (
      //if we the user does an ADO oauth flow then the token is saved for dev.azure.com but
      //sometimes the user uses the url dev.azure.com and sometimes the url visualstudio.com
      //so we need to check both
      (urlObject.hostname.toLowerCase() === configUrl.hostname.toLowerCase() ||
        (urlObject.hostname.toLowerCase().endsWith('.visualstudio.com') &&
          configUrl.hostname.toLowerCase() === 'dev.azure.com')) &&
      urlObject.protocol === configUrl.protocol &&
      urlObject.port === configUrl.port
    )
  })
  const filteredBrokerHosts = brokerHosts.filter((broker) => {
    const urlObject = new URL(url)
    return urlObject.hostname.toLowerCase() === broker.realDomain.toLowerCase()
  })
  //TODO: This is a hack for now. We go over the broker hosts configurations for all the organizations the user is part of.
  //It doesn't match the organization context of the current user action with the broker host configuration as we don't have organization context
  //in most API calls. We have to fix it and provide organization context to the API calls.
  //It is even more critical if the unlikely situation happens that the user is part of multiple organizations with different broker configurations for the same target host.
  //In this case, we will return the first broker host configuration that matches the target host regardless of the organization context.
  const virtualDomain = filteredBrokerHosts[0]?.virtualDomain
  const virtualUrl = virtualDomain
    ? `https://${virtualDomain}${urlObject.pathname}${urlObject.search}`
    : undefined
  const scmOrgConfig = filteredScmConfigs.find((scm) => scm.orgId && scm.token)
  if (scmOrgConfig && includeOrgTokens) {
    return {
      id: scmOrgConfig.id,
      accessToken: scmOrgConfig.token || undefined,
      scmLibType: getScmLibTypeFromScmType(scmOrgConfig.scmType),
      scmOrg: scmOrgConfig.scmOrg || undefined,
      virtualUrl,
    }
  }
  const scmUserConfig = filteredScmConfigs.find(
    (scm) => scm.userId && scm.token
  )
  if (scmUserConfig) {
    return {
      id: scmUserConfig.id,
      accessToken: scmUserConfig.token || undefined,
      scmLibType: getScmLibTypeFromScmType(scmUserConfig.scmType),
      scmOrg: scmUserConfig.scmOrg || undefined,
      virtualUrl,
    }
  }
  const type = getCloudScmLibTypeFromUrl(url)
  if (type) {
    return {
      id: undefined,
      accessToken: undefined,
      scmLibType: type,
      scmOrg: undefined,
      virtualUrl,
    }
  }
  return {
    id: undefined,
    accessToken: undefined,
    scmLibType: undefined,
    scmOrg: undefined,
    virtualUrl,
  }
}
