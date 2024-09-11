import { OctokitOptions } from '@octokit/core'
import { Octokit } from 'octokit'
import { fetch, ProxyAgent, RequestInfo, RequestInit } from 'undici'

import {
  GIT_PROXY_HOST,
  GITHUB_API_TOKEN,
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  isBrokerUrl,
  normalizeUrl,
  shouldValidateUrl,
} from '../..'
import { parseScmURL, scmCloudUrl, ScmType } from '../../shared/src'
import { GET_REPO_BRANCHES } from '../consts'

export function parseGithubOwnerAndRepo(gitHubUrl: string): {
  owner: string
  repo: string
} {
  gitHubUrl = normalizeUrl(gitHubUrl)

  const parsingResult = parseScmURL(gitHubUrl, ScmType.GitHub)
  if (!parsingResult) {
    throw new InvalidUrlPatternError(`invalid github repo Url ${gitHubUrl}`)
  }
  const { organization, repoName } = parsingResult

  if (!organization || !repoName) {
    throw new InvalidUrlPatternError(`invalid github repo Url ${gitHubUrl}`)
  }

  return { owner: organization, repo: repoName }
}
export function isGithubOnPrem(url: string | null | undefined): boolean {
  if (!url) {
    return false
  }
  return !url.includes(scmCloudUrl.GitHub)
}

function getFetch(url?: string) {
  if (url && isBrokerUrl(url)) {
    const dispatcher = new ProxyAgent({
      uri: GIT_PROXY_HOST,
      requestTls: {
        rejectUnauthorized: false,
      },
    })
    return (input: RequestInfo, init?: RequestInit) => {
      return fetch(input, {
        ...init,
        dispatcher,
      })
    }
  }
  return fetch
}
export function getOktoKit(
  options?: OctokitOptions & { url?: string }
): Octokit {
  // note: wer're using GITHUB_API_TOKEN in order to increase
  //  the rate limit instead of annonimous requests
  // this is only relevant for github.com
  const token =
    !options?.auth && !isGithubOnPrem(options?.url)
      ? GITHUB_API_TOKEN
      : options?.auth

  const baseUrl =
    options?.url && isGithubOnPrem(options.url)
      ? `${new URL(options.url).origin}/api/v3`
      : undefined

  return new Octokit({
    ...options,
    auth: token,
    baseUrl,
    request: {
      fetch: getFetch(baseUrl),
    },
  })
}

function isGithubActionActionToken(token: string) {
  return token.startsWith('ghs_')
}

export async function githubValidateParams(
  url: string | undefined,
  accessToken: string | undefined
) {
  try {
    const oktoKit = getOktoKit({ auth: accessToken, url })
    // if token is github action token we can't get user info
    if (accessToken && !isGithubActionActionToken(accessToken)) {
      await oktoKit.rest.users.getAuthenticated()
    }
    if (url && shouldValidateUrl(url)) {
      const { owner, repo } = parseGithubOwnerAndRepo(url)
      // NOTE: we used to fetch general repo information here,
      // but for some reason github action token didn't have access to it
      await oktoKit.request(GET_REPO_BRANCHES, {
        owner,
        repo,
        per_page: 1,
      })
    }
  } catch (e) {
    console.log('could not init github scm', e)
    const error = e as {
      code?: string
      status?: number
      statusCode?: number
      response?: { status?: number; statusCode?: number; code?: string }
    }
    const code =
      error.status ||
      error.statusCode ||
      error.response?.status ||
      error.response?.statusCode ||
      error.response?.code
    if (code === 401 || code === 403) {
      throw new InvalidAccessTokenError(`invalid github access token`)
    }
    if (code === 404) {
      throw new InvalidRepoUrlError(`invalid github repo Url ${url}`)
    }
    throw e
  }
}
