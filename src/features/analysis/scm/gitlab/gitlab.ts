import querystring from 'node:querystring'

import {
  createRequesterFn,
  type RequestOptions,
  ResourceOptions,
} from '@gitbeaker/requester-utils'
import {
  AccessLevel,
  ExpandedCommitSchema,
  ExpandedMergeRequestSchema,
  Gitlab,
  GitlabAPIResponse,
} from '@gitbeaker/rest'
import Debug from 'debug'
import {
  fetch as undiciFetch,
  ProxyAgent,
  Response as UndiciResponse,
} from 'undici'

import { MAX_BRANCHES_FETCH } from '../constants'
import { GIT_PROXY_HOST, GITLAB_API_TOKEN } from '../env'
import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  RefNotFoundError,
} from '../errors'
import { parseScmURL, scmCloudUrl, ScmType } from '../shared/src'
import { ReferenceType } from '../types'
import { isBrokerUrl, shouldValidateUrl } from '../utils'
import { safeBody } from '../utils'
import { getBrokerEffectiveUrl } from '../utils/broker'
import {
  GetGitlabTokenParams,
  GitlabAuthResult,
  GitlabAuthResultZ,
  GitlabTokenRequestTypeEnum,
} from './types'

const debug = Debug('scm:gitlab')

function removeTrailingSlash(str: string) {
  return str.trim().replace(/\/+$/, '')
}

type ApiAuthOptions = {
  url: string | undefined
  gitlabAuthToken?: string | undefined
}

const MAX_GITLAB_PR_BODY_LENGTH = 1048576

//we choose a random token to increase the rate limit for anonymous requests to gitlab.com API so that we can exhaust the rate limit
//of several different pre-generated tokens instead of just one.
function getRandomGitlabCloudAnonToken() {
  if (!GITLAB_API_TOKEN || typeof GITLAB_API_TOKEN !== 'string') {
    return undefined
  }
  const tokens = GITLAB_API_TOKEN.split(',')
  return tokens[Math.floor(Math.random() * tokens.length)]
}

function getGitBeaker(options: ApiAuthOptions) {
  const token =
    options?.gitlabAuthToken ?? getRandomGitlabCloudAnonToken() ?? ''
  const url = options.url
  const host = url ? new URL(url).origin : 'https://gitlab.com'
  if (token?.startsWith('glpat-') || token === '') {
    return new Gitlab({
      token,
      host,
      requesterFn: createRequesterFn(
        (_: ResourceOptions, reqo: RequestOptions) => Promise.resolve(reqo),
        brokerRequestHandler
      ),
    })
  }
  return new Gitlab({
    oauthToken: token,
    host,
    requesterFn: createRequesterFn(
      (_: ResourceOptions, reqo: RequestOptions) => Promise.resolve(reqo),
      brokerRequestHandler
    ),
  })
}

export async function gitlabValidateParams({
  url,
  accessToken,
}: {
  url: string | undefined
  accessToken: string | undefined
}) {
  try {
    const api = getGitBeaker({ url, gitlabAuthToken: accessToken })
    if (accessToken) {
      await api.Users.showCurrentUser()
    }
    if (url && shouldValidateUrl(url)) {
      const { projectPath } = parseGitlabOwnerAndRepo(url)
      await api.Projects.show(projectPath)
    }
  } catch (e) {
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
      throw new InvalidAccessTokenError(`invalid gitlab access token`)
    }
    if (
      code === 404 ||
      description.includes('404') ||
      description.includes('Not Found')
    ) {
      throw new InvalidRepoUrlError(`invalid gitlab repo URL: ${url}`)
    }
    console.log('gitlabValidateParams error', e)
    throw new InvalidRepoUrlError(
      `cannot access gitlab repo URL: ${url} with the provided access token`
    )
  }
}

export async function getGitlabUsername(
  url: string | undefined,
  accessToken: string
) {
  const api = getGitBeaker({ url, gitlabAuthToken: accessToken })
  const res = await api.Users.showCurrentUser()
  return res.username
}

export async function getGitlabIsUserCollaborator({
  accessToken,
  repoUrl,
}: {
  accessToken: string
  repoUrl: string
}) {
  try {
    const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
    const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })

    const proj = await api.Projects.show(projectPath)

    const groupAccess = proj.permissions?.group_access?.access_level || 0
    const projectAccess = proj.permissions?.project_access?.access_level || 0
    const accessLevelWithWriteAccess = [
      AccessLevel.DEVELOPER,
      AccessLevel.MAINTAINER,
      AccessLevel.OWNER,
      AccessLevel.ADMIN,
    ]
    //If the user has developer access (or more) to the project or group, we consider it a collaborator.
    return (
      accessLevelWithWriteAccess.includes(groupAccess) ||
      accessLevelWithWriteAccess.includes(projectAccess)
    )
  } catch (e) {
    return false
  }
}

export const gitlabMergeRequestStatus = {
  merged: 'merged',
  opened: 'opened',
  closed: 'closed',
} as const

export type GitlabMergeRequestStatus =
  (typeof gitlabMergeRequestStatus)[keyof typeof gitlabMergeRequestStatus]

export async function getGitlabMergeRequestStatus({
  accessToken,
  repoUrl,
  mrNumber,
}: {
  accessToken: string
  repoUrl: string
  mrNumber: number
}): Promise<GitlabMergeRequestStatus> {
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
  const res = await api.MergeRequests.show(projectPath, mrNumber)
  switch (res.state) {
    case gitlabMergeRequestStatus.merged:
    case gitlabMergeRequestStatus.opened:
    case gitlabMergeRequestStatus.closed:
      return res.state
    default:
      throw new Error(`unknown merge request state ${res.state}`)
  }
}

export async function createMarkdownCommentOnPullRequest({
  markdownComment,
  accessToken,
  repoUrl,
  mrNumber,
}: {
  markdownComment: string
  accessToken: string
  repoUrl: string
  mrNumber: number
}) {
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
  return api.MergeRequestNotes.create(projectPath, mrNumber, markdownComment)
}

export async function getGitlabIsRemoteBranch({
  accessToken,
  repoUrl,
  branch,
}: {
  accessToken: string
  repoUrl: string
  branch: string
}) {
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
  try {
    const res = await api.Branches.show(projectPath, branch)
    return res.name === branch
  } catch (e) {
    return false
  }
}

export async function getGitlabRepoList(
  url: string | undefined,
  accessToken: string
) {
  const api = getGitBeaker({ url, gitlabAuthToken: accessToken })
  const res = await api.Projects.all({
    membership: true,
    //TODO: a bug in the sorting mechanism of this api call
    //disallows us to sort by updated_at in descending order
    //so we have to sort by updated_at in ascending order.
    //We can wait for the bug to be fixed or call the api
    //directly with fetch()
    sort: 'asc',
    orderBy: 'updated_at',
    perPage: 100,
  })
  return Promise.all(
    res.map(async (project) => {
      const proj = await api.Projects.show(project.id)
      const owner = proj.namespace.name
      const repoLanguages = await api.Projects.showLanguages(project.id)
      return {
        repoName: project.path,
        repoUrl: project.web_url,
        repoOwner: owner,
        repoLanguages: Object.keys(repoLanguages),
        repoIsPublic: project.visibility === 'public',
        repoUpdatedAt: project.last_activity_at,
      }
    })
  )
}

export async function getGitlabBranchList({
  accessToken,
  repoUrl,
}: {
  accessToken: string
  repoUrl: string
}) {
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
  try {
    const res = await api.Branches.all(projectPath, {
      //keyset API pagination is not supported by GL for the branch list (at least not the on-prem version)
      //so for now we stick with the default pagination and just return the first page and limit the results to 1000 entries.
      //This is a temporary solution until we implement list branches with name search.
      perPage: MAX_BRANCHES_FETCH,
      page: 1,
    })
    res.sort((a, b) => {
      if (!a.commit?.committed_date || !b.commit?.committed_date) {
        return 0
      }
      return (
        new Date(b.commit?.committed_date).getTime() -
        new Date(a.commit?.committed_date).getTime()
      )
    })
    return res.map((branch) => branch.name).slice(0, MAX_BRANCHES_FETCH)
  } catch (e) {
    return []
  }
}

export async function createMergeRequest(options: {
  accessToken: string
  targetBranchName: string
  sourceBranchName: string
  title: string
  body: string
  repoUrl: string
}) {
  const { projectPath } = parseGitlabOwnerAndRepo(options.repoUrl)
  const api = getGitBeaker({
    url: options.repoUrl,
    gitlabAuthToken: options.accessToken,
  })
  const res = await api.MergeRequests.create(
    projectPath,
    options.sourceBranchName,
    options.targetBranchName,
    options.title,
    {
      description: safeBody(options.body, MAX_GITLAB_PR_BODY_LENGTH),
    }
  )
  return res.iid
}
type GetGitlabMergeRequestParams = {
  url: string
  prNumber: number
  accessToken?: string
}

export async function getGitlabMergeRequest({
  url,
  prNumber,
  accessToken,
}: GetGitlabMergeRequestParams): Promise<
  GitlabAPIResponse<ExpandedMergeRequestSchema, false, false, void>
> {
  const { projectPath } = parseGitlabOwnerAndRepo(url)
  const api = getGitBeaker({
    url,
    gitlabAuthToken: accessToken,
  })
  return await api.MergeRequests.show(projectPath, prNumber)
}

type GetGitlabCommitUrlParams = {
  url: string
  commitSha: string
  accessToken?: string
}

export async function getGitlabCommitUrl({
  url,
  commitSha,
  accessToken,
}: GetGitlabCommitUrlParams): Promise<
  GitlabAPIResponse<ExpandedCommitSchema, false, false, void>
> {
  const { projectPath } = parseGitlabOwnerAndRepo(url)
  const api = getGitBeaker({
    url,
    gitlabAuthToken: accessToken,
  })

  return await api.Commits.show(projectPath, commitSha)
}

export async function getGitlabRepoDefaultBranch(
  repoUrl: string,
  options?: ApiAuthOptions
): Promise<string> {
  const api = getGitBeaker({
    url: repoUrl,
    gitlabAuthToken: options?.gitlabAuthToken,
  })
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const project = await api.Projects.show(projectPath)
  if (!project.default_branch) {
    throw new Error('no default branch')
  }
  return project.default_branch
}

export async function getGitlabReferenceData(
  { ref, gitlabUrl }: { ref: string; gitlabUrl: string },
  options?: ApiAuthOptions
) {
  const { projectPath } = parseGitlabOwnerAndRepo(gitlabUrl)
  const api = getGitBeaker({
    url: gitlabUrl,
    gitlabAuthToken: options?.gitlabAuthToken,
  })
  const results = await Promise.allSettled([
    (async () => {
      const res = await api.Branches.show(projectPath, ref)
      return {
        sha: res.commit.id as string,
        type: ReferenceType.BRANCH,
        date: res.commit.committed_date
          ? new Date(res.commit.committed_date)
          : undefined,
      }
    })(),
    (async () => {
      const res = await api.Commits.show(projectPath, ref)
      return {
        sha: res.id,
        type: ReferenceType.COMMIT,
        date: res.committed_date ? new Date(res.committed_date) : undefined,
      }
    })(),
    (async () => {
      const res = await api.Tags.show(projectPath, ref)
      return {
        sha: res.commit.id,
        type: ReferenceType.TAG,
        date: res.commit.committed_date
          ? new Date(res.commit.committed_date)
          : undefined,
      }
    })(),
  ])
  const [branchRes, commitRes, tagRes] = results
  if (tagRes.status === 'fulfilled') {
    return tagRes.value
  }
  if (branchRes.status === 'fulfilled') {
    return branchRes.value
  }
  if (commitRes.status === 'fulfilled') {
    return commitRes.value
  }
  throw new RefNotFoundError(`ref: ${ref} does not exist`)
}

export function parseGitlabOwnerAndRepo(gitlabUrl: string) {
  gitlabUrl = removeTrailingSlash(gitlabUrl)
  const parsingResult = parseScmURL(gitlabUrl, ScmType.GitLab)

  if (!parsingResult || !parsingResult.repoName) {
    throw new InvalidUrlPatternError(`invalid gitlab repo Url ${gitlabUrl}`)
  }

  const { organization, repoName, projectPath } = parsingResult
  return { owner: organization, repo: repoName, projectPath }
}

export async function getGitlabBlameRanges(
  { ref, gitlabUrl, path }: { ref: string; gitlabUrl: string; path: string },
  options?: ApiAuthOptions
) {
  const { projectPath } = parseGitlabOwnerAndRepo(gitlabUrl)
  const api = getGitBeaker({
    url: gitlabUrl,
    gitlabAuthToken: options?.gitlabAuthToken,
  })
  const resp = await api.RepositoryFiles.allFileBlames(projectPath, path, ref)
  let lineNumber = 1
  return resp
    .filter((range) => range.lines)
    .map((range) => {
      const oldLineNumber = lineNumber
      if (!range.lines) {
        throw new Error('range.lines should not be undefined')
      }
      lineNumber += range.lines.length
      return {
        startingLine: oldLineNumber,
        endingLine: lineNumber - 1,
        login: range.commit.author_email,
        email: range.commit.author_email,
        name: range.commit.author_name,
      }
    })
}
type GetGitlabTokenRes =
  | {
      success: true
      authResult: GitlabAuthResult
    }
  | {
      success: false
    }

export async function getGitlabToken({
  token,
  gitlabClientId,
  gitlabClientSecret,
  callbackUrl,
  tokenType,
  scmUrl,
  brokerHosts,
}: GetGitlabTokenParams): Promise<GetGitlabTokenRes> {
  const scmFinalUrl = scmUrl ? scmUrl : scmCloudUrl.GitLab
  const effectiveUrl = getBrokerEffectiveUrl({
    url: scmFinalUrl,
    brokerHosts,
  })

  let dispatcher = undefined
  if (isBrokerUrl(effectiveUrl)) {
    dispatcher = new ProxyAgent({
      uri: GIT_PROXY_HOST,
      requestTls: {
        rejectUnauthorized: false,
      },
    })
  }

  try {
    const tokenUrl = `${effectiveUrl}/oauth/token`
    const res = await undiciFetch(tokenUrl, {
      dispatcher,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify({
        client_id: gitlabClientId,
        client_secret: gitlabClientSecret,
        [tokenType]: token,
        grant_type:
          tokenType === GitlabTokenRequestTypeEnum.CODE
            ? 'authorization_code'
            : 'refresh_token',
        redirect_uri: callbackUrl,
      }),
    })
    const authResult = await res.json()
    const parsedAuthResult = GitlabAuthResultZ.safeParse(authResult)
    if (!parsedAuthResult.success) {
      debug(`error using: ${tokenType} for gitlab`, authResult)
      return {
        success: false,
      }
    }
    return {
      success: true,
      authResult: parsedAuthResult.data,
    }
  } catch (e) {
    debug(`failed to get gitlab token:`, e)
    return {
      success: false,
    }
  }
}

async function processBody(response: UndiciResponse) {
  // Split to remove potential charset info from the content type
  const headers = response.headers
  const type = headers.get('content-type')?.split(';')[0]?.trim()

  if (type === 'application/json') {
    return (await response.json()) as Record<string, unknown>
  }

  return await response.text()
}

//as we need to change the gitlab client to support using an HTTP proxy (to support the broker),
//we added this function which is mostly copied from the gitbeaker library (the original default request handler).
//The main change is the addition of the dispatcher parameter to the undiciFetch call instead of just calling the original fetch function
//without the dispatcher (HTTP proxy) parameter.
async function brokerRequestHandler(
  endpoint: string,
  options?: RequestOptions
) {
  const { prefixUrl, searchParams } = options || {}
  let baseUrl: string | undefined

  if (prefixUrl) baseUrl = prefixUrl.endsWith('/') ? prefixUrl : `${prefixUrl}/`

  const url = new URL(endpoint, baseUrl)

  url.search = searchParams || ''

  const dispatcher =
    url && isBrokerUrl(url.href)
      ? new ProxyAgent({
          uri: GIT_PROXY_HOST,
          requestTls: {
            rejectUnauthorized: false,
          },
        })
      : undefined

  const response = await undiciFetch(url, {
    headers: options?.headers,
    method: options?.method,
    body: options?.body ? String(options?.body) : undefined,
    dispatcher,
  }).catch((e) => {
    if (e.name === 'TimeoutError' || e.name === 'AbortError') {
      throw new Error('Query timeout was reached')
    }

    throw e
  })

  if (response.ok)
    return {
      body: await processBody(response),
      headers: Object.fromEntries(response.headers.entries()),
      status: response.status,
    }

  throw new Error(`gitbeaker: ${response.statusText}`)
}
