import querystring from 'node:querystring'

import {
  ExpandedMergeRequestSchema,
  Gitlab,
  GitlabAPIResponse,
} from '@gitbeaker/rest'
import { ProxyAgent } from 'undici'
import { z } from 'zod'

import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  ReferenceType,
  RefNotFoundError,
  ScmType,
} from '../scm'
import { parseScmURL } from '../urlParser'
import { GitlabAuthResultZ, GitlabTokenRequestTypeEnum } from './types'

const GITLAB_ACCESS_TOKEN_URL = 'https://gitlab.com/oauth/token'

const EnvVariablesZod = z.object({
  GITLAB_API_TOKEN: z.string().optional(),
  BROKERED_HOSTS: z
    .string()
    .toLowerCase()
    .transform((x) => x.split(',').map((url) => url.trim(), []))
    .default(''),
})

const { GITLAB_API_TOKEN, BROKERED_HOSTS } = EnvVariablesZod.parse(process.env)

function removeTrailingSlash(str: string) {
  return str.trim().replace(/\/+$/, '')
}

type ApiAuthOptions = {
  url: string | undefined
  gitlabAuthToken?: string | undefined
}

function getGitBeaker(options: ApiAuthOptions) {
  const token = options?.gitlabAuthToken ?? GITLAB_API_TOKEN ?? ''
  const url = options.url
  const host = url ? new URL(url).origin : 'https://gitlab.com'
  if (token?.startsWith('glpat-') || token === '') {
    return new Gitlab({ token, host })
  }
  return new Gitlab({ oauthToken: token, host })
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
    if (url) {
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
    throw e
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
  username,
  accessToken,
  repoUrl,
}: {
  username: string
  accessToken: string
  repoUrl: string
}) {
  try {
    const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
    const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })

    const res = await api.Projects.show(projectPath)
    const members = await api.ProjectMembers.all(res.id, {
      includeInherited: true,
    })
    return !!members.find((member) => member.username === username)
  } catch (e) {
    return false
  }
}

export enum GitlabMergeRequestStatusEnum {
  merged = 'merged',
  opened = 'opened',
  closed = 'closed',
}

export async function getGitlabMergeRequestStatus({
  accessToken,
  repoUrl,
  mrNumber,
}: {
  accessToken: string
  repoUrl: string
  mrNumber: number
}) {
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
  const res = await api.MergeRequests.show(projectPath, mrNumber)
  switch (res.state) {
    case GitlabMergeRequestStatusEnum.merged:
    case GitlabMergeRequestStatusEnum.opened:
    case GitlabMergeRequestStatusEnum.closed:
      return res.state
    default:
      throw new Error(`unknown merge request state ${res.state}`)
  }
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
    //TODO: JONATHANA need to play with the parameters here to get all branches as it is sometimes stuck
    //depending on the parameters and the number of branches. It sometimes just hangs...
    const res = await api.Branches.all(projectPath, {
      perPage: 100,
      pagination: 'keyset',
      orderBy: 'updated_at',
      sort: 'dec',
    })
    return res.map((branch) => branch.name)
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
      description: options.body,
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

export async function getGitlabToken({
  token,
  gitlabClientId,
  gitlabClientSecret,
  callbackUrl,
  tokenType,
}: {
  token: string
  gitlabClientId: string
  gitlabClientSecret: string
  callbackUrl: string
  tokenType: GitlabTokenRequestTypeEnum
}) {
  const res = await fetch(GITLAB_ACCESS_TOKEN_URL, {
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
  return GitlabAuthResultZ.parse(authResult)
}

function initGitlabFetchMock() {
  const globalFetch = global.fetch
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function myFetch(input: any, init?: any): any {
    let urlParsed = null
    // this block is used for unit tests only. URL starts from local directory
    try {
      urlParsed = input?.url ? new URL(input?.url) : null
    } catch (err) {
      console.log(
        `this block is used for unit tests only. URL ${input?.url} starts from local directory`
      )
    }

    if (
      urlParsed &&
      BROKERED_HOSTS.includes(
        `${urlParsed.protocol?.toLowerCase()}//${urlParsed.host?.toLowerCase()}`
      )
    ) {
      const dispatcher = new ProxyAgent({
        uri: process.env['GIT_PROXY_HOST'] || 'http://tinyproxy:8888',
        requestTls: {
          rejectUnauthorized: false,
        },
      })
      return globalFetch(input, { dispatcher } as RequestInit)
    }
    return globalFetch(input, init)
  }
  global.fetch = myFetch
}

initGitlabFetchMock()
