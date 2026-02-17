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
import pLimit from 'p-limit'
import {
  Agent,
  fetch as undiciFetch,
  ProxyAgent,
  Response as UndiciResponse,
} from 'undici'

import { contextLogger } from '../../../../utils/contextLogger'
import { MAX_BRANCHES_FETCH } from '../constants'
import { GIT_PROXY_HOST, GITLAB_API_TOKEN } from '../env'
import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  RefNotFoundError,
} from '../errors'
import { parseScmURL, scmCloudUrl, ScmType } from '../shared/src'
import { RateLimitStatus, ReferenceType } from '../types'
import { isBrokerUrl, safeBody, shouldValidateUrl } from '../utils'
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
    contextLogger.warn('[gitlabValidateParams] Error validating params', {
      url,
      error: e,
    })
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
    contextLogger.warn(
      '[getGitlabIsUserCollaborator] Error checking collaborator status',
      {
        error: e instanceof Error ? e.message : String(e),
        repoUrl,
      }
    )
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
}): Promise<unknown> {
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
    contextLogger.warn(
      '[getGitlabIsRemoteBranch] Error checking remote branch',
      {
        error: e instanceof Error ? e.message : String(e),
        repoUrl,
        branch,
      }
    )
    return false
  }
}

/**
 * Fetch paginated GitLab projects using gitbeaker with showExpanded for pagination info.
 * Uses `membership=true`, sorted by `last_activity_at desc` for most-recently-updated-first.
 */
export async function searchGitlabProjects({
  url,
  accessToken,
  perPage = 20,
  page = 1,
}: {
  url: string | undefined
  accessToken: string
  perPage?: number
  page?: number
}): Promise<{
  projects: {
    id: number
    path: string
    web_url: string
    namespace_name: string
    visibility: string
    last_activity_at: string
  }[]
  hasMore: boolean
}> {
  if (perPage > GITLAB_MAX_PER_PAGE) {
    throw new Error(
      `perPage ${perPage} exceeds GitLab maximum of ${GITLAB_MAX_PER_PAGE}`
    )
  }

  const api = getGitBeaker({ url, gitlabAuthToken: accessToken })

  // Try last_activity_at first (most relevant sort), fall back to created_at
  // if GitLab returns 500 (known issue on some accounts/instances)
  let response
  try {
    response = await api.Projects.all({
      membership: true,
      orderBy: 'last_activity_at',
      sort: 'desc',
      pagination: 'offset',
      perPage,
      page,
      showExpanded: true,
    })
  } catch (e) {
    debug(
      '[searchGitlabProjects] order_by=last_activity_at failed, falling back to created_at: %s',
      e instanceof Error ? e.message : String(e)
    )
    response = await api.Projects.all({
      membership: true,
      orderBy: 'created_at',
      sort: 'desc',
      pagination: 'offset',
      perPage,
      page,
      showExpanded: true,
    })
  }

  const projects = response.data.map((p) => ({
    id: p.id,
    path: p.path,
    web_url: p.web_url,
    namespace_name: (p.namespace as { name: string })?.name ?? '',
    visibility: p.visibility,
    last_activity_at: p.last_activity_at,
  }))

  return {
    projects,
    hasMore: response.paginationInfo.next !== null,
  }
}

/**
 * Fetch languages for a single GitLab project. Returns empty array on failure.
 */
export async function getGitlabProjectLanguages({
  url,
  accessToken,
  projectId,
}: {
  url: string | undefined
  accessToken: string
  projectId: number
}): Promise<string[]> {
  try {
    const api = getGitBeaker({ url, gitlabAuthToken: accessToken })
    const languages = await api.Projects.showLanguages(projectId)
    return Object.keys(languages)
  } catch (e) {
    debug(
      '[getGitlabProjectLanguages] Failed for project %d: %s',
      projectId,
      e instanceof Error ? e.message : String(e)
    )
    return []
  }
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
    contextLogger.warn('[getGitlabBranchList] Error fetching branch list', {
      error: e instanceof Error ? e.message : String(e),
      repoUrl,
    })
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

/**
 * Search merge requests with pagination, sorting, and filtering.
 * Used by the AI Blame flow for paginated MR listing.
 * Per-page defaults to GITLAB_PER_PAGE (100, the GitLab API maximum).
 */
export async function searchGitlabMergeRequests({
  repoUrl,
  accessToken,
  state,
  updatedAfter,
  orderBy = 'updated_at',
  sort = 'desc',
  perPage = GITLAB_PER_PAGE,
  page = 1,
}: {
  repoUrl: string
  accessToken: string
  state?: 'opened' | 'closed' | 'merged' | 'all'
  updatedAfter?: Date
  orderBy?: 'created_at' | 'updated_at'
  sort?: 'asc' | 'desc'
  perPage?: number
  page?: number
}): Promise<{
  items: {
    iid: number
    title: string
    state: string
    sourceBranch: string
    targetBranch: string
    authorUsername?: string
    createdAt: string
    updatedAt: string
    description: string | null
  }[]
  hasMore: boolean
}> {
  if (perPage > GITLAB_MAX_PER_PAGE) {
    throw new Error(
      `perPage ${perPage} exceeds GitLab maximum of ${GITLAB_MAX_PER_PAGE}`
    )
  }
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  debug(
    '[searchGitlabMergeRequests] Fetching MRs for %s (page=%d, perPage=%d)',
    projectPath,
    page,
    perPage
  )
  const api = getGitBeaker({
    url: repoUrl,
    gitlabAuthToken: accessToken,
  })

  const response = await api.MergeRequests.all({
    projectId: projectPath,
    state: state === 'all' ? undefined : state,
    updatedAfter: updatedAfter?.toISOString(),
    orderBy,
    sort,
    perPage,
    page,
    showExpanded: true,
  })

  const items = response.data.map((mr) => ({
    iid: mr.iid,
    title: mr.title,
    state: mr.state,
    sourceBranch: mr.source_branch,
    targetBranch: mr.target_branch,
    authorUsername: mr.author?.username,
    createdAt: mr.created_at,
    updatedAt: mr.updated_at,
    description: mr.description,
  }))

  debug(
    '[searchGitlabMergeRequests] Found %d MRs on page %d',
    items.length,
    page
  )

  return {
    items,
    hasMore: response.paginationInfo.next !== null,
  }
}

const GITLAB_API_CONCURRENCY = 5

/**
 * Fetch commit SHAs for multiple merge requests with concurrency limiting.
 * GitLab doesn't have a batch GraphQL API like GitHub, so we fetch
 * commits for each MR concurrently using the REST API.
 */
export async function getGitlabMrCommitsBatch({
  repoUrl,
  accessToken,
  mrNumbers,
}: {
  repoUrl: string
  accessToken: string
  mrNumbers: number[]
}): Promise<Map<number, string[]>> {
  if (mrNumbers.length === 0) {
    return new Map()
  }

  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({
    url: repoUrl,
    gitlabAuthToken: accessToken,
  })

  const limit = pLimit(GITLAB_API_CONCURRENCY)
  const results = await Promise.all(
    mrNumbers.map((mrNumber) =>
      limit(async () => {
        try {
          const commits = await api.MergeRequests.allCommits(
            projectPath,
            mrNumber
          )
          // GitLab returns commits newest-first; reverse to chronological
          // order (oldest-first) to match GitHub's convention. This ensures
          // commits[length-1] is the HEAD commit for S3 key lookups in
          // enrichZeroChangedLinesFromS3.
          return [mrNumber, commits.map((c) => c.id).reverse()] as const
        } catch (error) {
          contextLogger.warn(
            '[getGitlabMrCommitsBatch] Failed to fetch commits for MR',
            {
              error: error instanceof Error ? error.message : String(error),
              mrNumber,
              repoUrl,
            }
          )
          return [mrNumber, [] as string[]] as const
        }
      })
    )
  )

  return new Map(results)
}

/**
 * Fetch changed lines and comments for multiple merge requests in parallel.
 * For each MR, fetches diffs (to count additions/deletions) and notes (comments).
 */
export async function getGitlabMrDataBatch({
  repoUrl,
  accessToken,
  mrNumbers,
}: {
  repoUrl: string
  accessToken: string
  mrNumbers: number[]
}): Promise<
  Map<
    number,
    {
      changedLines: { additions: number; deletions: number }
      comments: {
        author: { login: string; type: string } | null
        body: string
      }[]
    }
  >
> {
  if (mrNumbers.length === 0) {
    return new Map()
  }

  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({
    url: repoUrl,
    gitlabAuthToken: accessToken,
  })

  const limit = pLimit(GITLAB_API_CONCURRENCY)
  const results = await Promise.all(
    mrNumbers.map((mrNumber) =>
      limit(async () => {
        try {
          // Only fetch notes (comments) — changedLines will be enriched from S3 later
          const notes = await api.MergeRequestNotes.all(projectPath, mrNumber)

          // Map notes to comment format expected by extractLinearTicketsFromComments
          // GitLab API doesn't expose a 'bot' property on author objects,
          // so detect bots via username patterns instead.
          const comments = notes.map((note) => ({
            author: note.author
              ? {
                  login: note.author.username,
                  type:
                    note.author.username.endsWith('[bot]') ||
                    note.author.username.toLowerCase() === 'linear'
                      ? 'Bot'
                      : 'User',
                }
              : null,
            body: note.body,
          }))

          // GitLab's batch MR endpoint doesn't expose line-level stats.
          // Downstream enrichment (enrichZeroChangedLinesFromS3) fills in
          // real values once AI blame analysis has run.
          // TODO: return null instead of 0 to distinguish "unknown" from
          // "actually zero" (requires type changes across consumers).
          return [
            mrNumber,
            { changedLines: { additions: 0, deletions: 0 }, comments },
          ] as const
        } catch (error) {
          contextLogger.warn(
            '[getGitlabMrDataBatch] Failed to fetch data for MR',
            {
              error: error instanceof Error ? error.message : String(error),
              mrNumber,
              repoUrl,
            }
          )
          return [
            mrNumber,
            {
              changedLines: { additions: 0, deletions: 0 },
              comments: [] as {
                author: { login: string; type: string } | null
                body: string
              }[],
            },
          ] as const
        }
      })
    )
  )

  return new Map(results)
}

/**
 * Fetch pull request metrics for a GitLab merge request.
 * Fetches MR details and notes in parallel.
 * Commit data (commitShas, commitsCount, firstCommitDate) is no longer fetched here —
 * callers enrich from S3 cached data instead.
 * linesAdded is returned as 0 — callers enrich it from S3 cached diffs.
 */
export async function getGitlabMergeRequestMetrics({
  url,
  prNumber,
  accessToken,
}: GetGitlabMergeRequestParams): Promise<{
  state: string
  isDraft: boolean
  createdAt: string
  mergedAt: string | null
  linesAdded: number
  commentIds: string[]
}> {
  const { projectPath } = parseGitlabOwnerAndRepo(url)
  const api = getGitBeaker({
    url,
    gitlabAuthToken: accessToken,
  })

  const [mr, notes] = await Promise.all([
    api.MergeRequests.show(projectPath, prNumber),
    api.MergeRequestNotes.all(projectPath, prNumber),
  ])

  // Filter to only user-visible notes (not system notes)
  const commentIds = notes
    .filter((note) => !note.system)
    .map((note) => String(note.id))

  return {
    state: mr.state,
    isDraft: mr.draft ?? false,
    createdAt: mr.created_at,
    mergedAt: mr.merged_at ?? null,
    linesAdded: 0,
    commentIds,
  }
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

// Constants for GitLab pagination limits
const GITLAB_MAX_RESULTS_LIMIT = 1024
const GITLAB_MAX_PER_PAGE = 100 // GitLab API hard limit for all REST endpoints
const GITLAB_PER_PAGE = GITLAB_MAX_PER_PAGE

/**
 * Fetches recent commits from a GitLab repository since a given date.
 * @param repoUrl - Repository URL
 * @param accessToken - GitLab access token
 * @param since - ISO 8601 date string to filter commits since
 * @returns Array of commits with sha, commit info, and parents (limited to 1024)
 */
export async function getGitlabRecentCommits({
  repoUrl,
  accessToken,
  since,
}: {
  repoUrl: string
  accessToken: string
  since: string
}) {
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })

  const allCommits: {
    sha: string
    commit: {
      committer: { date: string } | undefined
      author: { email: string; name: string }
      message: string
    }
    parents: { sha: string }[]
  }[] = []

  const perPage = GITLAB_PER_PAGE
  let page = 1
  let hasMore = true

  while (hasMore && allCommits.length < GITLAB_MAX_RESULTS_LIMIT) {
    const response = await api.Commits.all(projectPath, {
      since,
      perPage,
      page,
      showExpanded: true,
    })

    const commits = response.data

    if (commits.length === 0) {
      hasMore = false
      break
    }

    for (const commit of commits) {
      if (allCommits.length >= GITLAB_MAX_RESULTS_LIMIT) {
        break
      }
      allCommits.push({
        sha: commit.id,
        commit: {
          committer: commit.committed_date
            ? { date: commit.committed_date }
            : undefined,
          author: {
            email: commit.author_email,
            name: commit.author_name,
          },
          message: commit.message,
        },
        parents: commit.parent_ids?.map((sha: string) => ({ sha })) || [],
      })
    }

    hasMore = response.paginationInfo.next !== null
    page++
  }

  if (allCommits.length >= GITLAB_MAX_RESULTS_LIMIT) {
    contextLogger.warn('[getGitlabRecentCommits] Hit commit pagination limit', {
      limit: GITLAB_MAX_RESULTS_LIMIT,
      count: allCommits.length,
      repoUrl,
      since,
    })
  }

  return allCommits
}

export async function getGitlabRateLimitStatus({
  repoUrl,
  accessToken,
}: {
  repoUrl: string
  accessToken: string
}): Promise<RateLimitStatus | null> {
  try {
    const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
    // Make a lightweight API call with showExpanded to get response headers
    const response = await api.Users.showCurrentUser({ showExpanded: true })
    const headers = response.headers as Record<string, string> | undefined
    if (!headers) {
      return null
    }
    const remaining = headers['ratelimit-remaining']
    const reset = headers['ratelimit-reset']
    const limit = headers['ratelimit-limit']
    if (!remaining || !reset) {
      return null
    }
    const remainingNum = parseInt(remaining, 10)
    const resetNum = parseInt(reset, 10)
    if (isNaN(remainingNum) || isNaN(resetNum)) {
      contextLogger.warn(
        '[getGitlabRateLimitStatus] Malformed rate limit headers',
        { remaining, reset, repoUrl }
      )
      return null
    }
    return {
      remaining: remainingNum,
      reset: new Date(resetNum * 1000),
      limit: limit ? parseInt(limit, 10) : undefined,
    }
  } catch (error) {
    contextLogger.warn(
      '[getGitlabRateLimitStatus] Error fetching rate limit status',
      {
        error: error instanceof Error ? error.message : String(error),
        repoUrl,
      }
    )
    return null
  }
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
  const tokenUrl = `${effectiveUrl}/oauth/token`

  const dispatcher =
    isBrokerUrl(effectiveUrl) && GIT_PROXY_HOST
      ? new ProxyAgent({
          uri: GIT_PROXY_HOST,
          requestTls: {
            rejectUnauthorized: false,
          },
          bodyTimeout: 15000,
          headersTimeout: 15000,
          connectTimeout: 15000,
        })
      : new Agent({
          bodyTimeout: 15000,
          headersTimeout: 15000,
          connectTimeout: 15000,
        })

  try {
    contextLogger.info('Making token request to GitLab', {
      tokenUrl,
      tokenType,
      grantType:
        tokenType === GitlabTokenRequestTypeEnum.CODE
          ? 'authorization_code'
          : 'refresh_token',
    })

    const requestBody = querystring.stringify({
      client_id: gitlabClientId,
      client_secret: gitlabClientSecret,
      [tokenType]: token,
      grant_type:
        tokenType === GitlabTokenRequestTypeEnum.CODE
          ? 'authorization_code'
          : 'refresh_token',
      redirect_uri: callbackUrl,
    })

    const res = await undiciFetch(tokenUrl, {
      dispatcher,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    })

    contextLogger.info('Received response from GitLab for token request', {
      status: res.status,
      statusText: res.statusText,
      contentType: res?.headers?.get('content-type'),
    })

    const authResult = (await res.json()) as {
      access_token?: string
      refresh_token?: string
      token_type?: string
      expires_in?: number
    }
    contextLogger.info('Parsed response JSON', {
      hasAccessToken: !!authResult.access_token,
      hasRefreshToken: !!authResult.refresh_token,
      tokenType: authResult.token_type,
      expiresIn: authResult.expires_in,
    })

    const parsedAuthResult = GitlabAuthResultZ.safeParse(authResult)
    if (!parsedAuthResult.success) {
      contextLogger.error(
        'Failed to validate auth result schema for GitLab token response. This can happen because of a race condition of multiple requests from the same user. React query retries should solve this on the frontend side.',
        {
          tokenType,
          validationErrors: parsedAuthResult.error.issues,
          authResult,
        }
      )
      debug(`error using: ${tokenType} for gitlab`, authResult)
      return {
        success: false,
      }
    }

    contextLogger.info('Successfully obtained and validated GitLab token', {
      tokenType,
      hasAccessToken: !!parsedAuthResult.data.access_token,
      hasRefreshToken: !!parsedAuthResult.data.refresh_token,
    })

    return {
      success: true,
      authResult: parsedAuthResult.data,
    }
  } catch (e) {
    contextLogger.error(
      'Exception occurred during token request to GitLab for tokenType: ${tokenType}',
      {
        error: e instanceof Error ? e.message : String(e),
        tokenType,
        effectiveUrl,
        stack: e instanceof Error ? e.stack : undefined,
      }
    )
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
