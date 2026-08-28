import querystring from 'node:querystring'
import { setTimeout as delay } from 'node:timers/promises'

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
import { RateLimitStatus, RecentCommitAuthor, ReferenceType } from '../types'
import { isBrokerUrl, safeBody, shouldValidateUrl } from '../utils'
import { getBrokerEffectiveUrl } from '../utils/broker'
import { repoListCacheKey } from '../utils/repoListCache'
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

type GitlabNamespace = {
  /** Group endpoints take the numeric namespace id. */
  id: number
  /**
   * User endpoints do NOT: `GET /users/:user_id/projects` wants a user id or
   * username, and a user's namespace id is a different sequence entirely.
   * https://docs.gitlab.com/api/projects/#list-a-users-projects
   */
  path: string
  kind: 'group' | 'user'
}

/**
 * ponytail: resolved per call, not memoised. One extra `GET /namespaces` per
 * page is noise next to the project page itself, and a shared cache would hand
 * one user's resolved group id to a user who cannot see that group. Thread the
 * namespace through the caller if the bulk `getRepoList` walk ever shows up in
 * a profile.
 */
async function resolveGitlabNamespace(
  api: Gitlab,
  scmOrg: string
): Promise<GitlabNamespace | undefined> {
  try {
    const namespaces = await api.Namespaces.all({ search: scmOrg })
    const list = Array.isArray(namespaces) ? namespaces : []
    const match = list.find((ns) => namespaceMatchesScmOrg(ns, scmOrg))
    if (!match?.id) {
      return undefined
    }
    return {
      id: match.id,
      path: String(match.full_path ?? match.path ?? scmOrg),
      kind: match.kind === 'user' ? 'user' : 'group',
    }
  } catch {
    return undefined
  }
}

/**
 * Fetch paginated GitLab projects using gitbeaker with showExpanded for pagination info.
 * Uses `membership=true` with configurable sort order.
 *
 * @param orderBy - Sort field. Defaults to `'created_at'` which is the most reliable
 *   across all GitLab instances. When `'last_activity_at'` is requested (e.g. for the
 *   UI repo picker), the call falls back to `'created_at'` on failure since some
 *   GitLab instances/accounts return 500 for that sort field.
 */
/**
 * Accounts/instances where `order_by=last_activity_at` deterministically 500s
 * (a long-standing GitLab quirk). Keyed by token-hash + origin — process
 * lifetime, no TTL: the wrong-order fallback is cheap, re-probing is not.
 */
const brokenLastActivitySortAccounts = new Set<string>()

/** Cap on membership pages one degraded-namespace request may scan — enough
 * to fill a page without letting one request turn into a full drain. */
const DEGRADED_NAMESPACE_SCAN_MAX_PAGES = 10

/** The one namespace-identity predicate — resolution and the degraded filter
 * must never drift, or the branch taken changes which repos an org "has". */
function namespaceMatchesScmOrg(
  ns: { name?: string; path?: string; full_path?: string } | undefined,
  scmOrg: string
): boolean {
  return ns?.name === scmOrg || ns?.path === scmOrg || ns?.full_path === scmOrg
}

export async function searchGitlabProjects({
  url,
  accessToken,
  perPage = 20,
  page = 1,
  orderBy = 'created_at',
  sort = 'desc',
  search,
  scmOrg,
}: {
  url: string | undefined
  accessToken: string
  perPage?: number
  page?: number
  orderBy?: 'created_at' | 'last_activity_at'
  sort?: 'asc' | 'desc'
  /**
   * Official `search` on GET /projects — case-insensitive substring on
   * path, name, and description.
   * https://docs.gitlab.com/api/projects/#list-projects
   */
  search?: string
  /** Group path/name or user namespace from the org picker. */
  scmOrg?: string
}): Promise<{
  projects: {
    id: number
    path: string
    web_url: string
    namespace_name: string
    visibility: string
    last_activity_at: string
    default_branch: string | null
    archived: boolean
  }[]
  hasMore: boolean
  /**
   * From `X-Total`, which GitLab omits once a result set gets large (its
   * counting threshold) — undefined then, never a guess.
   */
  totalCount?: number
  /**
   * True when scmOrg was requested but the namespace could not be resolved, so
   * pages were filtered client-side over the unfiltered membership listing
   * (with a bounded forward scan to fill the page): no total is reported.
   */
  namespaceFilterDegraded: boolean
  /** The page pagination should resume from — the degraded scan may consume
   * several underlying pages per request. */
  nextPage: number
}> {
  if (perPage > GITLAB_MAX_PER_PAGE) {
    throw new Error(
      `perPage ${perPage} exceeds GitLab maximum of ${GITLAB_MAX_PER_PAGE}`
    )
  }

  const api = getGitBeaker({ url, gitlabAuthToken: accessToken })
  const namespace = scmOrg
    ? await resolveGitlabNamespace(api, scmOrg)
    : undefined

  const fetchProjects = (
    effectiveOrderBy: 'created_at' | 'last_activity_at',
    pageToFetch: number = page
  ) => {
    const shared = {
      orderBy: effectiveOrderBy,
      sort,
      pagination: 'offset' as const,
      perPage,
      page: pageToFetch,
      showExpanded: true as const,
      ...(search ? { search } : {}),
    }
    if (namespace?.kind === 'group') {
      // Subgroups included: a group large enough to need server-side search is
      // almost always subgrouped, and excluding them returned an empty search.
      return api.Groups.allProjects(namespace.id, {
        ...shared,
        includeSubgroups: true,
      })
    }
    if (namespace?.kind === 'user') {
      // Path, not `namespace.id` — see GitlabNamespace above.
      return api.Users.allProjects(namespace.path, shared)
    }
    return api.Projects.all({
      membership: true,
      ...shared,
    })
  }

  let response
  let effectiveOrderBy: 'created_at' | 'last_activity_at' =
    orderBy === 'last_activity_at' ? 'last_activity_at' : orderBy
  // last_activity_at deterministically 500s on some accounts, and the probe
  // sits behind a 5-attempt retry (~20-40s) — so the verdict is memoized per
  // account per process; the better sort returns on restart.
  const sortQuirkKey = repoListCacheKey({
    accessToken,
    origin: url ?? 'gitlab.com',
  })
  if (
    effectiveOrderBy === 'last_activity_at' &&
    brokenLastActivitySortAccounts.has(sortQuirkKey)
  ) {
    effectiveOrderBy = 'created_at'
  }
  if (effectiveOrderBy === 'last_activity_at') {
    try {
      response = await fetchProjects('last_activity_at')
    } catch (e) {
      debug(
        '[searchGitlabProjects] order_by=last_activity_at failed, falling back to created_at: %s',
        e instanceof Error ? e.message : String(e)
      )
      effectiveOrderBy = 'created_at'
      response = await fetchProjects('created_at')
      // Memoize only after the fallback SUCCEEDED — proves the failure was
      // sort-specific, so a transient outage can't poison the ordering.
      brokenLastActivitySortAccounts.add(sortQuirkKey)
    }
  } else {
    response = await fetchProjects(effectiveOrderBy)
  }

  const namespaceFilterDegraded = Boolean(scmOrg && !namespace)
  let rawProjects = namespaceFilterDegraded
    ? response.data.filter((p) => namespaceMatchesScmOrg(p.namespace, scmOrg!))
    : response.data
  let lastPage = page
  let hasNext = response.paginationInfo.next !== null

  // Degraded mode filters an unfiltered membership listing, so single pages
  // can be empty — which the frontend's empty-batch stop misread as "no
  // repositories". Scan forward (bounded) until the page is worth returning.
  // Overshoot accepted: the scan returns every match it collected, so one
  // response can exceed perPage (bounded < 2x). Trimming would need an
  // offset-within-page cursor for no caller benefit — the picker just caches
  // the extra rows.
  if (namespaceFilterDegraded) {
    let scanned = 1
    while (
      rawProjects.length < perPage &&
      hasNext &&
      scanned < DEGRADED_NAMESPACE_SCAN_MAX_PAGES
    ) {
      lastPage += 1
      scanned += 1
      const nextResponse = await fetchProjects(effectiveOrderBy, lastPage)
      rawProjects = rawProjects.concat(
        nextResponse.data.filter((p) =>
          namespaceMatchesScmOrg(p.namespace, scmOrg!)
        )
      )
      hasNext = nextResponse.paginationInfo.next !== null
    }
  }

  const projects = rawProjects.map((p) => ({
    id: p.id,
    path: p.path,
    web_url: p.web_url,
    namespace_name: (p.namespace as { name: string })?.name ?? '',
    visibility: p.visibility,
    last_activity_at: p.last_activity_at,
    // Both already on the project listing — no extra request.
    default_branch: (p as { default_branch?: string }).default_branch ?? null,
    archived: (p as { archived?: boolean }).archived === true,
  }))

  // `Number.isFinite`, not `typeof`: GitBeaker derives this with
  // `parseInt(X-Total, 10)`, and GitLab omits that header past its counting
  // threshold — so the value is NaN, which *is* a `number`. It would then reach
  // the GraphQL Int (`?? null` does not catch NaN either) and fail the whole
  // repository listing at serialization time.
  const total = (response.paginationInfo as { total?: number }).total
  // Degraded mode: X-Total counts ALL membership projects, not the owner's —
  // report no total, and flag the degradation so callers stop claiming native.
  return {
    projects,
    hasMore: hasNext,
    totalCount:
      !namespaceFilterDegraded && Number.isFinite(total) ? total : undefined,
    namespaceFilterDegraded,
    // The degraded scan may consume several pages; pagination must resume from
    // the last one consumed, not the one requested.
    nextPage: lastPage + 1,
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
  try {
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
  } catch (e) {
    // Creation is a POST, and brokerRequestHandler now retries it on 408/5xx.
    // Those statuses don't tell us whether GitLab applied the request before
    // timing out, so a retry can hit a branch that already has an open MR and
    // come back with GitLab's "another open merge request already exists"
    // conflict. That is a SUCCESS for our purposes — adopt the existing MR
    // instead of reporting a failure the caller can never recover from.
    if (!isGitlabDuplicateMergeRequest(e)) {
      throw e
    }
    const existingIid = await findOpenGitlabMergeRequestIid({
      api,
      projectPath,
      sourceBranchName: options.sourceBranchName,
      targetBranchName: options.targetBranchName,
    })
    if (existingIid === undefined) {
      throw e
    }
    contextLogger.warn(
      '[createMergeRequest] adopted existing MR after duplicate conflict',
      {
        projectPath,
        sourceBranch: options.sourceBranchName,
        targetBranch: options.targetBranchName,
        iid: existingIid,
      }
    )
    return existingIid
  }
}

// gitbeaker surfaces the conflict either as a 409 or as a 4xx whose body carries
// GitLab's validation message, so match on both.
export function isGitlabDuplicateMergeRequest(e: unknown): boolean {
  const status = (e as { status?: number; response?: { status?: number } })
    ?.status
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase()
  return (
    status === 409 ||
    /another open merge request already exists|merge request already exists/.test(
      msg
    )
  )
}

async function findOpenGitlabMergeRequestIid({
  api,
  projectPath,
  sourceBranchName,
  targetBranchName,
}: {
  api: ReturnType<typeof getGitBeaker>
  projectPath: string
  sourceBranchName: string
  targetBranchName: string
}): Promise<number | undefined> {
  const open = await api.MergeRequests.all({
    projectId: projectPath,
    sourceBranch: sourceBranchName,
    targetBranch: targetBranchName,
    state: 'opened',
    perPage: 1,
  })
  return open[0]?.iid
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
                  type: note.author.username.endsWith('[bot]') ? 'Bot' : 'User',
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

// Distinct commit authors in the window, streamed and UNCAPPED (unlike
// getGitlabRecentCommits, which caps at 1024 for its full-commit consumers).
// Accumulates one row per author as pages arrive, so memory is bounded by the
// author count — the contributor sync's exact 90-day count. GitLab commits carry
// no user id, so authors are keyed by email; bot detection is left to the
// caller's heuristics (isBot flag is always false here).
// `all: true` counts commits across ALL branches (GitLab then ignores ref_name),
// not just the default branch — a contributor whose only recent commits are on a
// feature/release branch must still be counted (each such committer is revenue).
export async function getGitlabRecentCommitAuthors({
  repoUrl,
  accessToken,
  since,
}: {
  repoUrl: string
  accessToken: string
  since: string
}): Promise<RecentCommitAuthor[]> {
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
  const byEmail = new Map<string, RecentCommitAuthor>()
  const perPage = GITLAB_PER_PAGE
  let page = 1
  let hasMore = true
  while (hasMore) {
    const response = await api.Commits.all(projectPath, {
      since,
      all: true,
      perPage,
      page,
      showExpanded: true,
    })
    const commits = response.data
    if (commits.length === 0) {
      break
    }
    for (const commit of commits) {
      const email = commit.author_email
      if (!email) continue
      const date = commit.committed_date ?? since
      const key = email.toLowerCase()
      const prev = byEmail.get(key)
      if (!prev || new Date(date).getTime() > new Date(prev.date).getTime()) {
        byEmail.set(key, {
          email: key,
          name: commit.author_name ?? null,
          date,
          externalId: null,
          isBot: false,
        })
      }
    }
    hasMore = response.paginationInfo.next !== null
    page++
  }
  return [...byEmail.values()]
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
// GitLab intermittently returns 429 (Too Many Requests) and 5xx under load — CI
// runs share a rate limit. Without retry a single 429 fails the whole operation;
// e.g. a failed `list branches` leaves the app's Apply-Fix branch list empty and
// its submit button permanently disabled. Retry transient responses (and request
// timeouts) with backoff, honouring Retry-After for 429s. A non-transient status
// (e.g. 4xx) is thrown immediately, unchanged. See MOBB-3644.
//
// 408 belongs in this set even though it is a 4xx: it means GitLab gave up
// waiting on its own upstream, not that our request was malformed, so the same
// call can succeed on retry. Leaving it out cost us two CI failures where
// `MergeRequests.create` threw `gitbeaker: Request Timeout` on the FIRST attempt
// — the branch had already been pushed, so the fix was applied but no MR ever
// appeared. 520/522/524 are Cloudflare's origin-timeout codes (gitlab.com sits
// behind Cloudflare) and mean the same thing one hop earlier.
const GITLAB_RETRYABLE_STATUSES = new Set([
  408, 429, 500, 502, 503, 504, 520, 522, 524,
])
const GITLAB_REQUEST_MAX_ATTEMPTS = 5
const GITLAB_REQUEST_BASE_BACKOFF_MS = 1_000
// Cap the exponential growth so attempt 5 doesn't wait 16s, and cap a
// server-supplied Retry-After so a large value can't stall the caller past the
// timeouts the app/Playwright are waiting on.
const GITLAB_REQUEST_MAX_BACKOFF_MS = 8_000
const GITLAB_RETRY_AFTER_CAP_MS = 30_000
// Parallel CI jobs share GitLab's rate limit, so a fixed backoff makes them all
// retry in lockstep and collide again. Spread each retry over a random window.
const GITLAB_REQUEST_JITTER_MS = 1_000
// Bound each ATTEMPT rather than the whole operation. undici's default
// headersTimeout is 300s: a hung socket used to block far longer than any caller
// waits (the app polls for ~2min) and burned the entire retry budget on one
// stalled attempt. A tighter per-attempt ceiling plus retries tolerates a slow
// GitLab better than one long wait does.
const GITLAB_HEADERS_TIMEOUT_MS = 30_000
const GITLAB_BODY_TIMEOUT_MS = 60_000

// Reused across requests so the direct (non-broker) path keeps undici's
// connection pooling — a fresh Agent per call would drop keep-alive and leak
// sockets.
const gitlabDirectAgent = new Agent({
  headersTimeout: GITLAB_HEADERS_TIMEOUT_MS,
  bodyTimeout: GITLAB_BODY_TIMEOUT_MS,
})

export function isRetryableGitlabStatus(status: number): boolean {
  return GITLAB_RETRYABLE_STATUSES.has(status)
}

// undici's fetch wraps network errors in TypeError with the real error as cause.
// Classify timeouts and connection failures as transient so the retry loop
// catches them instead of rethrowing immediately.
const TRANSIENT_UNDICI_CODES = new Set([
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_BODY_TIMEOUT',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_SOCKET',
])

export function isTransientNetworkError(e: unknown): boolean {
  if (!(e instanceof Error)) return false
  if (e.name === 'TimeoutError' || e.name === 'AbortError') return true
  const cause = (e as { cause?: { code?: string; name?: string } }).cause
  if (cause && typeof cause.code === 'string') {
    return TRANSIENT_UNDICI_CODES.has(cause.code)
  }
  return false
}

/**
 * How long to wait before the next attempt.
 *
 * Prefers the server's Retry-After (seconds, as GitLab sends it for 429s) and
 * otherwise backs off exponentially with jitter. Both branches are capped. An
 * HTTP-date Retry-After parses to NaN and falls through to the backoff, which is
 * the safe default.
 */
export function getGitlabRetryDelayMs({
  attempt,
  retryAfterHeader,
}: {
  attempt: number
  retryAfterHeader?: string | null
}): number {
  const retryAfterSec = Number(retryAfterHeader)
  if (Number.isFinite(retryAfterSec) && retryAfterSec > 0) {
    return Math.min(retryAfterSec * 1_000, GITLAB_RETRY_AFTER_CAP_MS)
  }

  const backoffMs = Math.min(
    GITLAB_REQUEST_BASE_BACKOFF_MS * 2 ** (attempt - 1),
    GITLAB_REQUEST_MAX_BACKOFF_MS
  )
  return backoffMs + Math.floor(Math.random() * GITLAB_REQUEST_JITTER_MS)
}

/**
 * Error for a non-OK GitLab response, carrying the numeric status.
 *
 * Callers classify failures (permission denied, duplicate MR) and previously the
 * only thing they could inspect was the status TEXT — `isGitlabPermissionDenied`
 * checks `status === 403` and never matched, falling through to a regex on
 * "Forbidden". Keeping the status on the error makes that classification real.
 */
function gitlabResponseError(
  response: UndiciResponse
): Error & { status: number } {
  const error = new Error(`gitbeaker: ${response.statusText}`) as Error & {
    status: number
  }
  error.status = response.status
  return error
}

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
          headersTimeout: GITLAB_HEADERS_TIMEOUT_MS,
          bodyTimeout: GITLAB_BODY_TIMEOUT_MS,
        })
      : gitlabDirectAgent

  let lastError: Error | undefined
  for (let attempt = 1; attempt <= GITLAB_REQUEST_MAX_ATTEMPTS; attempt++) {
    let response: UndiciResponse | undefined

    try {
      response = await undiciFetch(url, {
        headers: options?.headers,
        method: options?.method,
        body: options?.body ? String(options?.body) : undefined,
        dispatcher,
      })
    } catch (e) {
      if (isTransientNetworkError(e)) {
        lastError = new Error('Query timeout was reached')
      } else {
        throw e
      }
    }

    if (response) {
      if (response.ok) {
        return {
          body: await processBody(response),
          headers: Object.fromEntries(response.headers.entries()),
          status: response.status,
        }
      }
      if (!isRetryableGitlabStatus(response.status)) {
        throw gitlabResponseError(response)
      }
      lastError = gitlabResponseError(response)
    }

    if (attempt === GITLAB_REQUEST_MAX_ATTEMPTS) break

    const waitMs = getGitlabRetryDelayMs({
      attempt,
      retryAfterHeader: response?.headers.get('retry-after'),
    })
    // Without this the retries are invisible: the CI logs that sent us hunting
    // showed only the final error, with nothing to say whether we had retried at
    // all. Log the attempt so the next incident is one grep away.
    contextLogger.warn('[brokerRequestHandler] retrying GitLab request', {
      method: options?.method ?? 'GET',
      pathname: url.pathname,
      status: response?.status,
      attempt,
      maxAttempts: GITLAB_REQUEST_MAX_ATTEMPTS,
      waitMs,
      error: lastError?.message,
    })
    await delay(waitMs)
  }

  throw lastError ?? new Error('gitbeaker: request failed')
}

// Permission-denied only (needs elevated scope) — safe to swallow and fall back
// to commit authors. Everything else (401 unauthorized, 429 too many requests,
// network/broker failures) must surface so the sync can classify the repo.
// gitbeaker surfaces errors as `Error("gitbeaker: <statusText>")` (see the
// broker request handler), so match on both a numeric status and the text.
function isGitlabPermissionDenied(e: unknown): boolean {
  const status = (e as { status?: number; response?: { status?: number } })
    ?.status
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase()
  return status === 403 || /forbidden|insufficient/.test(msg)
}

export async function listGitlabProjectMembers({
  repoUrl,
  accessToken,
}: {
  repoUrl: string
  accessToken: string
}) {
  const { owner, projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })

  // Best-effort: listing members can require more than read_repository. A
  // read-only token that can still read commits/contributors shouldn't fail the
  // whole repo — return no members and let the caller use commit authors.
  // But ONLY swallow permission-denied: auth (401), rate-limit (429) and
  // connection errors MUST propagate so the contributor sync classifies the
  // repo (failed/token_invalid/rate_limited) instead of recording it as
  // accessible-with-zero-contributors (see getRepositoryContributors).
  let projectMembers: Awaited<ReturnType<typeof api.ProjectMembers.all>>
  try {
    projectMembers = await api.ProjectMembers.all(projectPath, {
      includeInherited: true,
    })
  } catch (e) {
    if (isGitlabPermissionDenied(e)) {
      return []
    }
    throw e
  }

  if (projectMembers.length > 1 || !owner) return projectMembers

  try {
    const groupMembers = await api.GroupMembers.all(owner, {
      includeInherited: true,
    })
    if (groupMembers.length > projectMembers.length) {
      return groupMembers
    }
  } catch {
    // Group members API may fail for personal namespaces — fall through
  }

  return projectMembers
}

type GitlabRepoContributor = {
  name: string
  email: string
  commits: number
}

export async function listGitlabRepoContributors({
  repoUrl,
  accessToken,
}: {
  repoUrl: string
  accessToken: string
}): Promise<GitlabRepoContributor[]> {
  // The read-only contributor endpoint needs only read_repository. Do NOT
  // swallow here: this is the fallback population source, so a failure means the
  // repo genuinely can't be read on this token (401/403/404/429/network) and
  // must propagate to the sync for classification and token failover. A repo
  // with no commits simply returns an empty list (not an error).
  const { projectPath } = parseGitlabOwnerAndRepo(repoUrl)
  const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
  const contributors = await api.Repositories.allContributors(projectPath)
  return contributors.map((c) => ({
    name: c.name,
    email: c.email,
    commits: c.commits,
  }))
}

export async function getGitlabAuthenticatedUser({
  repoUrl,
  accessToken,
}: {
  repoUrl: string
  accessToken: string
}): Promise<{ id: number; email: string | null } | null> {
  try {
    const api = getGitBeaker({ url: repoUrl, gitlabAuthToken: accessToken })
    const user = await api.Users.showCurrentUser()
    const record = user as Record<string, unknown>
    return {
      id: record['id'] as number,
      email:
        (record['email'] as string | null) ??
        (record['public_email'] as string | null) ??
        null,
    }
  } catch {
    return null
  }
}
