import querystring from 'node:querystring'

import { Gitlab } from '@gitbeaker/rest'
import { z } from 'zod'

import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  ReferenceType,
  RefNotFoundError,
} from './scm'

function removeTrailingSlash(str: string) {
  return str.trim().replace(/\/+$/, '')
}

const EnvVariablesZod = z.object({
  GITLAB_API_TOKEN: z.string().optional(),
})

const { GITLAB_API_TOKEN } = EnvVariablesZod.parse(process.env)

type ApiAuthOptions = {
  gitlabAuthToken?: string | undefined
}

const gitlabUrlRegex =
  /^http[s]?:\/\/[^/\s]+\/(([^/.\s]+[/])+)([^/.\s]+)(\.git)?(\/)?$/i

function getGitBeaker(options?: ApiAuthOptions) {
  const token = options?.gitlabAuthToken ?? GITLAB_API_TOKEN ?? ''
  if (token?.startsWith('glpat-') || token === '') {
    return new Gitlab({ token })
  }
  return new Gitlab({ oauthToken: token })
}

export async function gitlabValidateParams({
  url,
  accessToken,
}: {
  url: string | undefined
  accessToken: string | undefined
}) {
  try {
    const api = getGitBeaker({ gitlabAuthToken: accessToken })
    if (accessToken) {
      await api.Users.showCurrentUser()
    }
    if (url) {
      const { projectPath } = parseOwnerAndRepo(url)
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
      throw new InvalidRepoUrlError(`invalid gitlab repo Url ${url}`)
    }
    throw e
  }
}

export async function getGitlabUsername(accessToken: string) {
  const api = getGitBeaker({ gitlabAuthToken: accessToken })
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
    const { projectPath } = parseOwnerAndRepo(repoUrl)
    const api = getGitBeaker({ gitlabAuthToken: accessToken })

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
  const { projectPath } = parseOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ gitlabAuthToken: accessToken })
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
  const { projectPath } = parseOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ gitlabAuthToken: accessToken })
  try {
    const res = await api.Branches.show(projectPath, branch)
    return res.name === branch
  } catch (e) {
    return false
  }
}

export async function getGitlabRepoList(accessToken: string) {
  const api = getGitBeaker({ gitlabAuthToken: accessToken })
  const res = await api.Projects.all({
    membership: true,
    //TODO: a bug in the sorting mechanism of this api call
    //disallows us to sort by updated_at in descending order
    //so we have to sort by updated_at in ascending order.
    //We can wait for the bug to be fixed or call the api
    //directly with fetch()
    sort: 'asc',
    orderBy: 'updated_at',
    pagination: 'keyset',
    perPage: 100,
  })
  return Promise.all(
    res.map(async (project) => {
      const proj = await api.Projects.show(project.id)
      const owner = proj.owner.name
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
  const { projectPath } = parseOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ gitlabAuthToken: accessToken })
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
  const { projectPath } = parseOwnerAndRepo(options.repoUrl)
  const api = getGitBeaker({ gitlabAuthToken: options.accessToken })
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

export async function getGitlabRepoDefaultBranch(
  repoUrl: string,
  options?: ApiAuthOptions
): Promise<string> {
  const api = getGitBeaker({ gitlabAuthToken: options?.gitlabAuthToken })
  const { projectPath } = parseOwnerAndRepo(repoUrl)
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
  const { projectPath } = parseOwnerAndRepo(gitlabUrl)
  const api = getGitBeaker({ gitlabAuthToken: options?.gitlabAuthToken })
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

export function parseOwnerAndRepo(gitlabUrl: string) {
  gitlabUrl = removeTrailingSlash(gitlabUrl)
  if (!gitlabUrlRegex.test(gitlabUrl)) {
    throw new InvalidUrlPatternError(`invalid gitlab repo Url ${gitlabUrl}`)
  }
  const groups = gitlabUrl.split(gitlabUrlRegex).filter((res) => res)
  const owner = groups[0]?.split('/')[0]
  const repo = groups[2]
  const projectPath = `${groups[0]}${repo}`
  return { owner, repo, projectPath }
}

export async function getGitlabBlameRanges(
  { ref, gitlabUrl, path }: { ref: string; gitlabUrl: string; path: string },
  options?: ApiAuthOptions
) {
  const { projectPath } = parseOwnerAndRepo(gitlabUrl)
  const api = getGitBeaker({ gitlabAuthToken: options?.gitlabAuthToken })
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

const GITLAB_ACCESS_TOKEN_URL = 'https://gitlab.com/oauth/token'

const GitlabAuthResultZ = z.object({
  access_token: z.string(),
  token_type: z.string(),
  refresh_token: z.string(),
})

export enum GitlabTokenRequestTypeEnum {
  CODE = 'code',
  REFRESH_TOKEN = 'refresh_token',
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
