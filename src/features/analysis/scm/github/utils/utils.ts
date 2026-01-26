import { OctokitOptions } from '@octokit/core'
import type { EndpointDefaults } from '@octokit/types'
import { Octokit } from 'octokit'
import { fetch, ProxyAgent, RequestInfo, RequestInit } from 'undici'

import {
  GIT_PROXY_HOST,
  GITHUB_API_TOKEN,
  normalizeUrl,
  shouldValidateUrl,
} from '../..'
import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  NetworkError,
  RateLimitError,
  ScmBadCredentialsError,
} from '../../errors'
import { parseScmURL, scmCloudUrl, ScmType } from '../../shared/src'
import { isBrokerUrl } from '../../utils'
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

//we choose a random token to increase the rate limit for anonymous requests to github.com API so that we can exhaust the rate limit
//of several different pre-generated tokens instead of just one.
function getRandomGithubCloudAnonToken() {
  if (!GITHUB_API_TOKEN || typeof GITHUB_API_TOKEN !== 'string') {
    return undefined
  }
  const tokens = GITHUB_API_TOKEN.split(',')
  return tokens[Math.floor(Math.random() * tokens.length)]
}

export function getOctoKit(
  options?: OctokitOptions & { url?: string; isEnableRetries?: boolean }
): Octokit {
  // Note: We're using GITHUB_API_TOKEN to increase
  // the rate limit instead of anonymous requests
  // this is only relevant for github.com
  const token =
    !options?.auth && !isGithubOnPrem(options?.url)
      ? getRandomGithubCloudAnonToken()
      : options?.auth

  const baseUrl =
    options?.url && isGithubOnPrem(options.url)
      ? `${new URL(options.url).origin}/api/v3`
      : undefined

  return new Octokit({
    ...options,
    auth: token,
    baseUrl,
    //GITHUB_API_TOKEN is only defined in the backend and not when running Bugsy as CLI. We want to enable these debug logs in the backend
    //to debug the performance of these API calls.
    log: GITHUB_API_TOKEN ? console : undefined,
    request: {
      fetch: getFetch(baseUrl),
      timeout: 10000, // 10 second timeout
    },
    retry: options?.isEnableRetries
      ? {
          doNotRetry: [400, 401, 403, 404, 422], // Don't retry on these status codes
          retries: 3, // Retry up to 3 times
        }
      : { enabled: false },
    throttle: options?.isEnableRetries
      ? {
          onRateLimit: (
            retryAfter: number,
            options: Required<EndpointDefaults>,
            octokit: Octokit,
            retryCount: number
          ) => {
            octokit.log.warn(
              `Request quota exhausted for request ${options.method} ${options.url}`
            )

            // Retry once after hitting rate limit
            if (retryCount === 0) {
              octokit.log.info(`Retrying after ${retryAfter} seconds!`)
              return true
            }
            return false
          },
          onSecondaryRateLimit: (
            retryAfter: number,
            options: Required<EndpointDefaults>,
            octokit: Octokit,
            retryCount: number
          ) => {
            octokit.log.warn(
              `SecondaryRateLimit detected for request ${options.method} ${options.url}`
            )

            // Retry once after hitting secondary rate limit
            if (retryCount === 0) {
              octokit.log.info(`Retrying after ${retryAfter} seconds!`)
              return true
            }
            return false
          },
        }
      : { enabled: false },
  })
}

function isGithubActionActionToken(token: string) {
  return token.startsWith('ghs_')
}

/**
 * Centralized GitHub API error handler.
 * Detects error types and throws appropriate typed errors.
 *
 * @param error - The error from GitHub API
 * @param scmType - The SCM type (GitHub or GitHub Enterprise)
 * @throws Typed error classes for structured error handling
 */
export function handleGitHubError(
  error: unknown,
  scmType: ScmType = ScmType.GitHub
): never {
  const errorObj = error as {
    status?: number
    statusCode?: number
    code?: string
    message?: string
    response?: {
      status?: number
      statusCode?: number
      code?: string
      headers?: Record<string, string>
    }
    headers?: Record<string, string>
  }

  const status =
    errorObj.status ||
    errorObj.statusCode ||
    errorObj.response?.status ||
    errorObj.response?.statusCode

  // Check for rate limit headers
  const headers = errorObj.headers || errorObj.response?.headers
  const retryAfter = headers?.['retry-after']
    ? Number.parseInt(headers['retry-after'], 10)
    : headers?.['x-ratelimit-reset']
      ? Math.max(
          0,
          Math.floor(
            (Number.parseInt(headers['x-ratelimit-reset'], 10) * 1000 -
              Date.now()) /
              1000
          )
        )
      : undefined

  const errorMessage =
    errorObj.message || (error instanceof Error ? error.message : String(error))

  // Rate limit errors (403 with rate limit headers or explicit rate limit message)
  if (
    (status === 403 && retryAfter !== undefined) ||
    errorMessage.toLowerCase().includes('rate limit') ||
    errorMessage.toLowerCase().includes('api rate limit exceeded')
  ) {
    throw new RateLimitError(
      'GitHub API rate limit exceeded',
      scmType,
      retryAfter
    )
  }

  // Authentication errors (401)
  if (status === 401) {
    throw new InvalidAccessTokenError(
      'GitHub authentication failed - token may be expired or invalid',
      scmType
    )
  }

  // Permission/credential errors (403 without rate limit)
  if (status === 403) {
    throw new ScmBadCredentialsError(
      'GitHub access forbidden - insufficient permissions or invalid credentials',
      scmType
    )
  }

  // Not found errors (404)
  if (status === 404) {
    throw new InvalidRepoUrlError(
      'GitHub repository or resource not found',
      scmType
    )
  }

  // Network errors (connection issues)
  const errorCode = errorObj.code || errorObj.response?.code
  if (
    errorCode === 'ECONNREFUSED' ||
    errorCode === 'ETIMEDOUT' ||
    errorCode === 'ENOTFOUND' ||
    errorCode === 'EAI_AGAIN'
  ) {
    throw new NetworkError(
      `GitHub network error: ${errorMessage}`,
      scmType,
      errorCode
    )
  }

  // Re-throw if it's already one of our custom errors
  if (
    error instanceof RateLimitError ||
    error instanceof InvalidAccessTokenError ||
    error instanceof ScmBadCredentialsError ||
    error instanceof InvalidRepoUrlError ||
    error instanceof NetworkError ||
    error instanceof InvalidUrlPatternError
  ) {
    throw error
  }

  // Generic fallback
  throw new Error(`GitHub API error: ${errorMessage}`)
}

export async function githubValidateParams(
  url: string | undefined,
  accessToken: string | undefined
) {
  try {
    const oktoKit = getOctoKit({ auth: accessToken, url })
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
    handleGitHubError(e, ScmType.GitHub)
  }
}
