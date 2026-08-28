import pLimit from 'p-limit'
import { z } from 'zod'

import { contextLogger } from '../../../../utils/contextLogger'
import { InvalidRepoUrlError } from '../errors'
import { Pr_Status_Enum } from '../generates/client_generates'
import { SCMLib } from '../scm'
import { parseScmURL, ScmType } from '../shared/src'
import {
  CreateSubmitRequestParams,
  GetReferenceResult,
  GetSubmitRequestInfo,
  GetSubmitRequestMetadataResult,
  MergedPrSurvivalMetadata,
  PostPRReviewCommentParams,
  PullRequestMetrics,
  RateLimitStatus,
  RecentCommitAuthor,
  RecentCommitsResult,
  RepositoryContributor,
  SCMDeleteGeneralPrCommentParams,
  SCMDeleteGeneralPrReviewResponse,
  SCMGetPrReviewCommentsParams,
  SCMGetPrReviewCommentsResponse,
  ScmLibScmType,
  SCMPostGeneralPrCommentsResponse,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
  SearchReposParams,
  SearchReposResult,
  SearchSubmitRequestsParams,
  SearchSubmitRequestsResult,
} from '../types'
import { parseCursorSafe } from '../utils/cursorValidation'
import { getCachedRepoList, repoListCacheKey } from '../utils/repoListCache'
import {
  buildGithubRepoSearchQuery,
  githubOwnerQualifier,
  repoMatchesSearch,
  sortByUpdatedDesc,
} from '../utils/repoSearch'
import {
  getGithubSdk,
  githubValidateParams,
  isGithubOnPrem,
  parseGithubOwnerAndRepo,
} from './'
import {
  DeleteCommentParams,
  GetPrCommentResponse,
  GetPrCommentsParams,
  GetPRMetricsResponse,
  GetPrParams,
  PostCommentParams,
  UpdateCommentParams,
  UpdateCommentResponse,
} from './types'
import { encryptSecret } from './utils/encrypt_secret'
import { commitShasBetweenBaseAndMerge } from './utils/mergeCommitShas'

function isGithubSearchUnavailable(error: unknown): boolean {
  const status = (error as { status?: number })?.status
  const message = error instanceof Error ? error.message : String(error)
  if (/rate limit|secondary rate|abuse detection/i.test(message)) {
    return false
  }
  return (
    status === 404 ||
    status === 410 ||
    /search is disabled|enterprise search|unavailable/i.test(message)
  )
}

type PrState = NonNullable<
  GetPRMetricsResponse['repository']['pullRequest']
>['state']

/**
 * Determine PR status from state and draft flag
 */
function determinePrStatus(state: PrState, isDraft: boolean): Pr_Status_Enum {
  switch (state) {
    case 'CLOSED':
      return Pr_Status_Enum.Closed
    case 'MERGED':
      return Pr_Status_Enum.Merged
    case 'OPEN':
      return isDraft ? Pr_Status_Enum.Draft : Pr_Status_Enum.Active
  }
}

/**
 * User-vs-Organization per origin. Module-level (SCMLib instances are
 * per-request); the answer effectively never changes, and resolving it fresh
 * cost a round trip per search. ponytail: unbounded Map, LRU if it ever matters.
 */
const ownerKindCache = new Map<string, 'User' | 'Organization'>()

/**
 * Cursor domains: native Search pages 1-based ('page:2'), the in-memory path
 * offsets 0-based ('offset:20'). A foreign or malformed cursor restarts the
 * path from its beginning instead of silently skipping/duplicating rows.
 */
function parseDomainCursor(
  cursor: string | undefined,
  domain: 'page' | 'offset',
  fallback: number
): number {
  if (!cursor) {
    return fallback
  }
  const [d, raw] = cursor.split(':')
  if (d !== domain || raw === undefined) {
    return fallback
  }
  // Delegate the numeric policy (bounds cap included) to the shared validator
  // every other provider's cursors go through, so one overflow rule applies.
  return parseCursorSafe(raw, fallback)
}

export class GithubSCMLib extends SCMLib {
  public readonly githubSdk: ReturnType<typeof getGithubSdk>
  // we don't always need a url, what's important is that we have an access token
  constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined,
    options?: {
      enableThrottling?: boolean
      userProfileCache?: Map<string, unknown>
    }
  ) {
    super(url, accessToken, scmOrg)
    this.githubSdk = getGithubSdk({
      auth: accessToken,
      url,
      // Honor GitHub's rate-limit/Retry-After backoff for bulk callers
      // (e.g. the contributor sync) instead of failing fast.
      isEnableRetries: options?.enableThrottling,
      userProfileCache: options?.userProfileCache,
    })
  }
  async createSubmitRequest(
    params: CreateSubmitRequestParams
  ): Promise<string> {
    this._validateAccessTokenAndUrl()
    const { targetBranchName, sourceBranchName, title, body } = params
    const pullRequestResult = await this.githubSdk.createPullRequest({
      title,
      body,
      targetBranchName,
      sourceBranchName,
      repoUrl: this.url,
    })
    return String(pullRequestResult.data.number)
  }

  async forkRepo(repoUrl: string): Promise<{ url: string | null }> {
    this._validateAccessToken()
    return await this.githubSdk.forkRepo({
      repoUrl: repoUrl,
    })
  }

  async createOrUpdateRepositorySecret(params: {
    value: string
    name: string
  }) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const { data: repositoryPublicKeyResponse } =
      await this.githubSdk.getRepositoryPublicKey({ owner, repo })
    const { key_id, key } = repositoryPublicKeyResponse

    const encryptedValue = await encryptSecret(params.value, key)
    return await this.githubSdk.createOrUpdateRepositorySecret({
      encrypted_value: encryptedValue,
      secret_name: params.name,
      key_id,
      owner,
      repo,
    })
  }

  async createPullRequestWithNewFile(
    sourceRepoUrl: string,
    filesPaths: string[],
    userRepoUrl: string,
    title: string,
    body: string
  ) {
    const { pull_request_url } = await this.githubSdk.createPr({
      sourceRepoUrl,
      filesPaths,
      userRepoUrl,
      title,
      body,
    })
    return { pull_request_url: pull_request_url }
  }

  // T-500 — sibling of `createPullRequestWithNewFile` that takes inline
  // content rather than reading from a source repo. Used by
  // openSecuritySkillPR to deliver `.claude/skills/<slug>/SKILL.md`.
  async createPullRequestWithInlineFile(params: {
    userRepoUrl: string
    filePath: string
    content: string
    branch: string
    title: string
    body: string
  }) {
    const { pull_request_url } =
      await this.githubSdk.createPrWithContent(params)
    return { pull_request_url }
  }

  // T-500 — used by the openSecuritySkillPR resolver to clean up a
  // branch left behind by a prior failed PR-creation attempt before
  // retrying. Swallows missing-branch responses; only real network
  // errors propagate.
  async deleteBranchIfExists(params: { userRepoUrl: string; branch: string }) {
    return this.githubSdk.deleteBranchIfExists(params)
  }

  async validateParams() {
    return await githubValidateParams(this.url, this.accessToken)
  }
  async postPrComment(
    params: Pick<
      PostCommentParams,
      'body' | 'commit_id' | 'pull_number' | 'path' | 'line'
    >
  ) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await this.githubSdk.postPrComment({
      ...params,
      owner,
      repo,
    })
  }
  async updatePrComment(
    params: Pick<UpdateCommentParams, 'body' | 'comment_id'>
  ): Promise<UpdateCommentResponse> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await this.githubSdk.updatePrComment({
      ...params,
      owner,
      repo,
    })
  }
  async deleteComment(params: Pick<DeleteCommentParams, 'comment_id'>) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await this.githubSdk.deleteComment({
      ...params,
      owner,
      repo,
    })
  }
  async getPrComments(params: Omit<GetPrCommentsParams, 'owner' | 'repo'>) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await this.githubSdk.getPrComments({
      per_page: 100,
      ...params,
      owner,
      repo,
    })
  }
  async getPrDiff(params: Omit<GetPrParams, 'owner' | 'repo'>) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const prRes = await this.githubSdk.getPrDiff({
      ...params,
      owner,
      repo,
    })
    // note: for some reason octokit does not know to return response as string
    // look at  'getPrDiff' implementation
    return z.string().parse(prRes.data)
  }

  async getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]> {
    this._validateAccessToken()
    return await this.githubSdk.getGithubRepoList()
  }

  async getBranchList(): Promise<string[]> {
    this._validateAccessTokenAndUrl()
    const branches = await this.githubSdk.getGithubBranchList(this.url)
    return branches.data.map((branch) => branch.name)
  }

  async getRecentCommits(since: string): Promise<RecentCommitsResult> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url!)
    const result = await this.githubSdk.getRecentCommits({ owner, repo, since })
    // Map to the common CommitLite format
    return {
      data: result.data.map((c) => ({
        sha: c.sha,
        commit: {
          committer: c.commit.committer
            ? { date: c.commit.committer.date }
            : undefined,
          author: c.commit.author
            ? { email: c.commit.author.email, name: c.commit.author.name }
            : undefined,
          message: c.commit.message,
        },
        parents: c.parents?.map((p) => ({ sha: p.sha })),
        // Top-level `author` is GitHub's resolution of the commit to an account
        // (null when GitHub can't tie the commit email to a user). Its numeric
        // id matches repo_contributor.external_id (stored as String(id)), and
        // its type marks GitHub App / bot accounts authoritatively.
        authorExternalId: c.author?.id != null ? String(c.author.id) : null,
        authorIsBot: c.author?.type === 'Bot',
      })),
    }
  }

  async getRecentCommitAuthors(since: string): Promise<RecentCommitAuthor[]> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url!)
    return this.githubSdk.streamRecentCommitAuthors({ owner, repo, since })
  }

  async getRateLimitStatus(): Promise<RateLimitStatus | null> {
    const result = await this.githubSdk.getRateLimitStatus()
    return {
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    }
  }

  async getRepositoryContributors(): Promise<RepositoryContributor[]> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    const [collaboratorsRaw, authUser, authEmails] = await Promise.all([
      this.githubSdk.listRepositoryCollaborators({ owner, repo }),
      this.githubSdk.getAuthenticatedUser(),
      this.githubSdk.getAuthenticatedUserEmails(),
    ])

    // listCollaborators needs push access; a read-only token gets [] back. Fall
    // back to the read-only /contributors endpoint (commit authors) so we still
    // count contributors without requiring push. Return these rows UNENRICHED:
    // the enrichment below spends up to ~4 API calls per contributor (profile +
    // latest-commit + public-events + commit-search, the last on the 30/min
    // search bucket), so enriching a large repo's full author list would
    // guarantee a rate-limit burn / per-repo timeout every run. GitLab/Bitbucket
    // return their read-only fallback rows unenriched too — match them.
    if (collaboratorsRaw.length === 0) {
      const fallback = await this.githubSdk.listRepositoryContributors({
        owner,
        repo,
      })
      return fallback.map((c) => ({
        externalId: String(c.id),
        username: c.login ?? null,
        displayName: c.login ?? null,
        email: null,
        accessLevel: null,
      }))
    }
    const collaborators = collaboratorsRaw

    let authUserPrimaryEmail: string | null = null
    if (authEmails.length > 0) {
      const primary = authEmails.find((e) => e.primary && e.verified)
      const verified = authEmails.find((e) => e.verified)
      authUserPrimaryEmail =
        primary?.email ?? verified?.email ?? authEmails[0]?.email ?? null
    }

    // Enrich each collaborator with a SINGLE profile lookup (displayName, and
    // email when the user exposes it). The former per-collaborator fallback chain
    // — getLatestRepoCommitByAuthor + getEmailFromPublicEvents +
    // getEmailFromCommitSearch (the last on GitHub's 30-req/min search bucket) —
    // spent up to ~4 calls per collaborator and was the dominant cause of per-repo
    // timeouts on large orgs. It is removed: anyone who committed in the window
    // already gets an EXACT email from the 90-day commit stream
    // (streamRecentCommitAuthors), which is what drives the billed count, so
    // trimming this only affects the display email of NON-committing members.
    const enrichLimit = pLimit(5)
    const enriched = await Promise.all(
      collaborators.map((c) =>
        enrichLimit(async () => {
          let email: string | null = c.email ?? null
          let displayName: string | null = c.login ?? null

          if (
            !email &&
            authUser &&
            authUserPrimaryEmail &&
            c.id === authUser.id
          ) {
            email = authUserPrimaryEmail
          }

          if (c.login) {
            try {
              const profile = await this.githubSdk.getUserProfile({
                username: c.login,
              })
              if (profile.email) {
                email = profile.email
              }
              displayName = profile.name ?? displayName
            } catch (err) {
              contextLogger.warn('[GitHub] getUserProfile failed', {
                username: c.login,
                error: err instanceof Error ? err.message : String(err),
              })
            }
          }

          return {
            externalId: String(c.id),
            username: c.login ?? null,
            displayName,
            email,
            accessLevel: c.role_name ?? null,
          }
        })
      )
    )

    const withEmail = enriched.filter((c) => c.email)
    contextLogger.info('[GitHub] Contributor enrichment summary', {
      total: enriched.length,
      withEmail: withEmail.length,
      withoutEmail: enriched.length - withEmail.length,
    })

    return enriched
  }

  get scmLibType(): ScmLibScmType {
    return ScmLibScmType.GITHUB
  }

  getAuthHeaders(): Record<string, string> {
    if (this.accessToken) {
      return { authorization: `Bearer ${this.accessToken}` }
    }
    return {}
  }
  getDownloadUrl(sha: string): Promise<string> {
    this._validateUrl()

    const res = parseScmURL(this.url, ScmType.GitHub)
    if (!res) {
      throw new InvalidRepoUrlError('invalid repo url')
    }
    const { protocol, hostname, organization, repoName } = res
    const downloadUrl = isGithubOnPrem(this.url)
      ? `${protocol}//${hostname}/api/v3/repos/${organization}/${repoName}/zipball/${sha}`
      : `https://api.${hostname}/repos/${organization}/${repoName}/zipball/${sha}`
    return Promise.resolve(downloadUrl)
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    return await this.getUsername()
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    this._validateUrl()
    return await this.githubSdk.getGithubIsRemoteBranch({
      branch,
      repoUrl: this.url,
    })
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    this._validateAccessTokenAndUrl()
    const username = await this.getUsername()
    return await this.githubSdk.getGithubIsUserCollaborator({
      repoUrl: this.url,
      username,
    })
  }

  async getUsername(): Promise<string> {
    this._validateAccessToken()
    return await this.githubSdk.getGithubUsername()
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    this._validateAccessTokenAndUrl()
    return await this.githubSdk.getGithubPullRequestStatus({
      repoUrl: this.url,
      prNumber: Number(scmSubmitRequestId),
    })
  }

  async addCommentToSubmitRequest(
    submitRequestId: string,
    comment: string
  ): Promise<void> {
    this._validateAccessTokenAndUrl()
    await this.githubSdk.createMarkdownCommentOnPullRequest({
      repoUrl: this.url,
      prNumber: Number(submitRequestId),
      markdownComment: comment,
    })
  }

  async getReferenceData(ref: string): Promise<GetReferenceResult> {
    this._validateUrl()
    return await this.githubSdk.getGithubReferenceData({
      ref,
      gitHubUrl: this.url,
    })
  }

  async getPrComment(commentId: number): Promise<GetPrCommentResponse> {
    this._validateUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await this.githubSdk.getPrComment({
      repo,
      owner,
      comment_id: commentId,
    })
  }
  async getRepoDefaultBranch(): Promise<string> {
    this._validateUrl()
    return await this.githubSdk.getGithubRepoDefaultBranch(this.url)
  }
  async getSubmitRequestUrl(submitRequestUrl: number): Promise<string> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const getPrRes = await this.githubSdk.getPr({
      owner,
      repo,
      pull_number: submitRequestUrl,
    })
    return getPrRes.data.html_url
  }
  async getSubmitRequestId(submitRequestUrl: string): Promise<string> {
    const match = submitRequestUrl.match(/\/pull\/(\d+)/)
    return match?.[1] || ''
  }
  async getCommitUrl(commitId: string): Promise<string> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const getCommitRes = await this.githubSdk.getCommit({
      owner,
      repo,
      commitSha: commitId,
    })
    return getCommitRes.data.html_url
  }

  async getBranchCommitsUrl(branchName: string): Promise<string> {
    this._validateAccessTokenAndUrl()
    return `${this.url}/commits/${branchName}`
  }

  async postGeneralPrComment(
    params: PostPRReviewCommentParams
  ): SCMPostGeneralPrCommentsResponse {
    const { prNumber, body } = params
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await this.githubSdk.postGeneralPrComment({
      issue_number: prNumber,
      owner,
      repo,
      body,
    })
  }

  async getGeneralPrComments(
    params: SCMGetPrReviewCommentsParams
  ): SCMGetPrReviewCommentsResponse {
    const { prNumber } = params
    this._validateAccessTokenAndUrl()

    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await this.githubSdk.getGeneralPrComments({
      issue_number: prNumber,
      owner,
      repo,
    })
  }
  async deleteGeneralPrComment({
    commentId,
  }: SCMDeleteGeneralPrCommentParams): SCMDeleteGeneralPrReviewResponse {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await this.githubSdk.deleteGeneralPrComment({
      owner,
      repo,
      comment_id: commentId,
    })
  }

  async getSubmitRequestMetadata(
    submitRequestId: string
  ): Promise<GetSubmitRequestMetadataResult> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const prNumber = Number(submitRequestId)

    // Single API call - only fetches PR metadata
    const prRes = await this.githubSdk.getPr({
      owner,
      repo,
      pull_number: prNumber,
    })

    const pr = prRes.data
    return {
      title: pr.title,
      targetBranch: pr.base.ref,
      sourceBranch: pr.head.ref,
      headCommitSha: pr.head.sha,
    }
  }

  async getPrFiles(prNumber: number): Promise<string[]> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    // Fetch files changed in the PR using GitHub API
    const filesRes = await this.githubSdk.listPRFiles({
      owner,
      repo,
      pull_number: prNumber,
    })

    // Filter to only include files that were modified, added, or changed
    // Exclude files that were only removed or renamed without content changes
    return filesRes.data
      .filter((file) => {
        const status = file.status
        // Include added, modified files, and renamed files that have changes
        return (
          status === 'added' ||
          status === 'modified' ||
          (status === 'renamed' && file.changes > 0) ||
          (status === 'copied' && file.changes > 0)
        )
      })
      .map((file) => file.filename)
  }

  /**
   * Override searchSubmitRequests to use GitHub's REST `/pulls` endpoint.
   *
   * The Search API we used previously has a separate 30/min secondary rate
   * limit and an async index that lags on just-created PRs. `/pulls` hits
   * GitHub's primary datastore, uses the 5000/hr core bucket, and returns
   * `head.ref` / `base.ref` so we can populate sourceBranch / targetBranch.
   */
  override async searchSubmitRequests(
    params: SearchSubmitRequestsParams
  ): Promise<SearchSubmitRequestsResult> {
    this._validateAccessToken()
    const { owner, repo } = parseGithubOwnerAndRepo(params.repoUrl)

    // Use page-based pagination for GitHub (cursor is page number)
    const page = parseCursorSafe(params.cursor, 1)
    const perPage = params.limit || 10
    const sort = params.sort || { field: 'updated', order: 'desc' }

    const listResult = await this.githubSdk.listPullRequests({
      owner,
      repo,
      updatedAfter: params.filters?.updatedAfter,
      state: params.filters?.state,
      sort,
      perPage,
      page,
    })

    const results: GetSubmitRequestInfo[] = listResult.items.map((pr) => {
      let status: ScmSubmitRequestStatus = 'open'
      if (pr.state === 'closed') {
        status = pr.merged_at ? 'merged' : 'closed'
      } else if (pr.draft) {
        status = 'draft'
      }

      return {
        submitRequestId: String(pr.number),
        submitRequestNumber: pr.number,
        title: pr.title,
        status,
        sourceBranch: pr.head?.ref ?? '',
        targetBranch: pr.base?.ref ?? '',
        authorName: pr.user?.login,
        authorEmail: undefined,
        createdAt: new Date(pr.created_at),
        updatedAt: new Date(pr.updated_at),
        description: pr.body || undefined,
        tickets: [],
        changedLines: { added: 0, removed: 0 },
      }
    })

    return {
      results,
      nextCursor: listResult.hasMore ? String(page + 1) : undefined,
      hasMore: listResult.hasMore,
    }
  }

  /**
   * Fetches commits for multiple PRs in a single GraphQL request.
   * Much more efficient than fetching commits for each PR individually.
   *
   * @param repoUrl - Repository URL
   * @param prNumbers - Array of PR numbers to fetch commits for
   * @returns Map of PR number to array of commit SHAs
   */
  override async getPrCommitsBatch(
    repoUrl: string,
    prNumbers: number[]
  ): Promise<Map<number, string[]>> {
    this._validateAccessToken()
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
    return this.githubSdk.getPrCommitsBatch({ owner, repo, prNumbers })
  }

  /**
   * Batch fetch PR data (additions/deletions + comments) for multiple PRs.
   * Combines both metrics into a single GraphQL call for efficiency.
   *
   * @param repoUrl - Repository URL
   * @param prNumbers - Array of PR numbers to fetch data for
   * @returns Map of PR number to { changedLines, comments }
   */
  override async getPrDataBatch(
    repoUrl: string,
    prNumbers: number[]
  ): Promise<
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
    this._validateAccessToken()
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
    return this.githubSdk.getPrDataBatch({
      owner,
      repo,
      prNumbers,
    })
  }

  /**
   * Server-side pagination with the Search API where it is both fast and
   * complete (owner-scoped requests), and the cached /user/repos drain where
   * it is not: name sort, `offset:` cursors (a session already served by the
   * drain must stay there or pagination dead-ends), and no-owner queries —
   * Search cannot see collaborator-only repos or match mid-name substrings.
   * An owner-scoped Search that finds nothing on page 1 re-checks the drain
   * for the substring case before claiming "no matches".
   */
  override async searchRepos(
    params: SearchReposParams
  ): Promise<SearchReposResult> {
    this._validateAccessToken()

    const sort = params.sort || { field: 'updated', order: 'desc' }
    const hasQuery = Boolean(params.query?.trim())

    if (sort.field === 'name' || params.cursor?.startsWith('offset:')) {
      return this.searchReposInMemory(params)
    }
    if (!params.scmOrg) {
      // Drained by design (Search can't see collaborator repos or substrings),
      // but the user still feels the drain — report it so the UI can say so.
      if (hasQuery) {
        return this.searchReposInMemory(params, { degraded: true })
      }
      return this.searchReposWithUserReposApi(params)
    }

    try {
      const result = await this.searchReposWithApi(params)
      if (hasQuery && result.results.length === 0 && !params.cursor) {
        return this.searchReposInMemory(params)
      }
      return result
    } catch (error) {
      // GHES can disable Search (and an owner-kind 404 lands here too) —
      // degrade to the owner-filtered drain. Rate limits still propagate.
      if (isGithubSearchUnavailable(error)) {
        return this.searchReposInMemory(params, { degraded: true })
      }
      throw error
    }
  }

  /**
   * Drain-and-filter path (cached 90s, owner-filtered here since the drain is
   * token-scoped). `opts.degraded` drives the UI's slow-search hint: set where
   * the user feels a systematic drain (GHES with Search disabled; no-owner
   * queries), not for name-sort ordering or the one-off empty-page rescue.
   */
  private async searchReposInMemory(
    params: SearchReposParams,
    opts?: { degraded?: boolean }
  ): Promise<SearchReposResult> {
    const allRepos = await getCachedRepoList(
      repoListCacheKey({
        accessToken: this.accessToken ?? '',
        origin: this._originForCache(),
      }),
      () => this.getRepoList(undefined)
    )
    // GitHub logins are case-insensitive.
    const repos = params.scmOrg
      ? allRepos.filter(
          (repo) =>
            repo.repoOwner.toLowerCase() === params.scmOrg!.toLowerCase()
        )
      : allRepos
    const sort = params.sort || { field: 'updated', order: 'desc' }
    const sortedRepos =
      sort.field === 'name'
        ? [...repos].sort(
            (a, b) =>
              a.repoName.localeCompare(b.repoName) *
              (sort.order === 'asc' ? 1 : -1)
          )
        : sortByUpdatedDesc(repos)

    const query = params.query?.trim()
    const matching = query
      ? sortedRepos.filter((repo) => repoMatchesSearch(repo, query))
      : sortedRepos

    const limit = params.limit || 10
    const offset = parseDomainCursor(params.cursor, 'offset', 0)
    const paged = matching.slice(offset, offset + limit)
    const nextOffset = offset + limit

    return {
      results: paged,
      nextCursor:
        nextOffset < matching.length ? `offset:${nextOffset}` : undefined,
      hasMore: nextOffset < matching.length,
      // This path already holds every repository, so the total is exact.
      totalCount: matching.length,
      searchMode: opts?.degraded ? 'fallback' : 'native',
    }
  }

  private _originForCache(): string {
    try {
      return new URL(this.url ?? '').origin
    } catch {
      return 'github.com'
    }
  }

  /**
   * Paginated repo list for authenticated user when no GitHub org is configured.
   */
  private async searchReposWithUserReposApi(
    params: SearchReposParams
  ): Promise<SearchReposResult> {
    const page = parseDomainCursor(params.cursor, 'page', 1)
    const perPage = params.limit || 10
    const sort = params.sort || { field: 'updated', order: 'desc' }

    const pageResult = await this.githubSdk.listAuthenticatedUserReposPage({
      sort,
      perPage,
      page,
    })

    return {
      results: pageResult.items,
      nextCursor: pageResult.hasMore ? `page:${page + 1}` : undefined,
      hasMore: pageResult.hasMore,
      searchMode: 'native',
    }
  }

  /**
   * Search repos using GitHub Search API for efficient server-side pagination.
   * Only supports date-based sorting (updated/created).
   */
  private async searchReposWithApi(
    params: SearchReposParams
  ): Promise<SearchReposResult> {
    const page = parseDomainCursor(params.cursor, 'page', 1)
    const perPage = params.limit || 10
    const sort = params.sort || { field: 'updated', order: 'desc' }
    const q = await this.buildSearchQuery(params)

    const searchResult = await this.githubSdk.searchRepositories({
      q,
      sort,
      perPage,
      page,
    })

    // Convert GitHub's Repository format to ScmRepoInfo
    const results: ScmRepoInfo[] = searchResult.items.map((repo) => ({
      repoName: repo.name,
      repoUrl: repo.html_url || repo.url,
      repoOwner: repo.owner?.login || '',
      repoLanguages: repo.language ? [repo.language] : [],
      repoIsPublic: !repo.private,
      repoUpdatedAt: repo.updated_at || null,
      repoDefaultBranch: repo.default_branch ?? null,
      repoIsArchived: repo.archived === true,
    }))

    return {
      results,
      nextCursor: searchResult.hasMore ? `page:${page + 1}` : undefined,
      hasMore: searchResult.hasMore,
      // Already on the response we just paid for.
      totalCount: searchResult.totalCount,
      searchMode: 'native',
    }
  }

  /**
   * `org:` on a personal account is a 422, so resolve User vs Organization
   * first (cached — see ownerKindCache).
   */
  private async buildSearchQuery(params: SearchReposParams): Promise<string> {
    // The dispatch routes every no-owner call to the drained list, so the
    // Search API is only ever queried owner-scoped.
    if (!params.scmOrg) {
      throw new Error('GitHub Search queries must be owner-scoped')
    }
    const kind = await this._resolveOwnerKind(params.scmOrg)
    return buildGithubRepoSearchQuery({
      nameQuery: params.query,
      ownerQualifiers: [githubOwnerQualifier(params.scmOrg, kind)],
    })
  }

  private async _resolveOwnerKind(
    owner: string
  ): Promise<'User' | 'Organization'> {
    // Keyed by origin so a GHES login cannot collide with the same login on
    // github.com. Logins are case-insensitive on GitHub.
    const cacheKey = `${this._originForCache()}/${owner.toLowerCase()}`
    const cached = ownerKindCache.get(cacheKey)
    if (cached) {
      return cached
    }
    const profile = await this.githubSdk.getUserProfile({ username: owner })
    const kind = profile.type === 'Organization' ? 'Organization' : 'User'
    ownerKindCache.set(cacheKey, kind)
    return kind
  }

  async getPullRequestMetrics(prNumber: number): Promise<PullRequestMetrics> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    // Single GraphQL query replaces 4 REST calls
    const res = await this.githubSdk.getPRMetricsGraphQL({
      owner,
      repo,
      prNumber,
    })

    const pr = res.repository.pullRequest
    if (!pr) {
      throw new Error(`Pull request #${prNumber} not found`)
    }

    // Determine PR status
    const prStatus = determinePrStatus(pr.state, pr.isDraft)

    // Extract comment IDs
    let commentIds = pr.comments.nodes.map((node) => node.id)

    // If comments exceed GraphQL limit, fall back to REST pagination
    if (pr.comments.totalCount > 100) {
      const commentsRes = await this.githubSdk.getGeneralPrComments({
        owner,
        repo,
        issue_number: prNumber,
      })
      commentIds = commentsRes.data.map((c) => String(c.id))
    }

    return {
      prId: String(prNumber),
      repositoryUrl: this.url,
      prCreatedAt: new Date(pr.createdAt),
      prMergedAt: pr.mergedAt ? new Date(pr.mergedAt) : null,
      linesAdded: pr.additions,
      prStatus,
      commentIds,
    }
  }

  /**
   * Detect merge strategy and SHAs on the target branch for main-branch survival (GitHub only).
   */
  override async getMergedPrSurvivalMetadata(
    prNumber: number
  ): Promise<MergedPrSurvivalMetadata | null> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    const pr = await this.githubSdk.getPr({
      owner,
      repo,
      pull_number: prNumber,
    })

    if (pr.data.merged !== true || !pr.data.merge_commit_sha) {
      return null
    }

    const mergeCommitSha = pr.data.merge_commit_sha
    const targetBranch = pr.data.base.ref
    const baseSha = pr.data.base.sha

    const mergeCommitShas = await commitShasBetweenBaseAndMerge(
      this.githubSdk,
      {
        owner,
        repo,
        baseSha,
        mergeCommitSha,
      }
    )

    return { mergeCommitShas, targetBranch }
  }
}

// Mobb security fix applied: LOG_FORGING
