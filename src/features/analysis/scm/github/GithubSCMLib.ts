import pLimit from 'p-limit'
import { z } from 'zod'

import { GITHUB_API_CONCURRENCY } from '../env'
import { InvalidRepoUrlError } from '../errors'
import { Pr_Status_Enum } from '../generates/client_generates'
import { SCMLib } from '../scm'
import { parseScmURL, ScmType } from '../shared/src'
import {
  CreateSubmitRequestParams,
  DiffLineAttribution,
  GetCommitDiffResult,
  GetReferenceResult,
  GetSubmitRequestDiffResult,
  GetSubmitRequestInfo,
  PostPRReviewCommentParams,
  PullRequestMetrics,
  RateLimitStatus,
  RecentCommitsResult,
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
import { extractLinearTicketsFromBody } from '../utils'
import { parseCursorSafe } from '../utils/cursorValidation'
import { parseAddedLinesByFile } from '../utils/diffUtils'
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
  PrCommentData,
  UpdateCommentParams,
  UpdateCommentResponse,
} from './types'
import { encryptSecret } from './utils/encrypt_secret'

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

export class GithubSCMLib extends SCMLib {
  public readonly githubSdk: ReturnType<typeof getGithubSdk>
  // we don't always need a url, what's important is that we have an access token
  constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined
  ) {
    super(url, accessToken, scmOrg)
    this.githubSdk = getGithubSdk({
      auth: accessToken,
      url,
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
      })),
    }
  }

  async getRateLimitStatus(): Promise<RateLimitStatus | null> {
    const result = await this.githubSdk.getRateLimitStatus()
    return {
      remaining: result.remaining,
      reset: result.reset,
      limit: result.limit,
    }
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

  async getCommitDiff(
    commitSha: string,
    options?: {
      repositoryCreatedAt?: Date
    }
  ): Promise<GetCommitDiffResult> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    const { commit, diff } = await this.githubSdk.getCommitWithDiff({
      owner,
      repo,
      commitSha,
    })

    // Parse the commit timestamp (always in UTC from GitHub API)
    const commitTimestamp = commit.commit.committer?.date
      ? new Date(commit.commit.committer.date)
      : new Date(commit.commit.author?.date || Date.now())

    // Use provided repositoryCreatedAt or fetch it
    let repositoryCreatedAt = options?.repositoryCreatedAt
    if (repositoryCreatedAt === undefined) {
      try {
        const repoData = await this.githubSdk.getRepository({ owner, repo })
        repositoryCreatedAt = repoData.data.created_at
          ? new Date(repoData.data.created_at)
          : undefined
      } catch (error) {
        // Log error but don't fail - we'll fall back to default lookback window
        console.error('Failed to fetch repository creation date', {
          error,
          owner,
          repo,
        })
        repositoryCreatedAt = undefined
      }
    }

    return {
      diff,
      commitTimestamp,
      commitSha: commit.sha,
      authorName: commit.commit.author?.name,
      authorEmail: commit.commit.author?.email,
      message: commit.commit.message,
      repositoryCreatedAt,
    }
  }

  async getSubmitRequestDiff(
    submitRequestId: string
  ): Promise<GetSubmitRequestDiffResult> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const prNumber = Number(submitRequestId)

    // Fetch PR details, commits, and repo data in parallel for optimization
    const [prRes, commitsRes, repoData, prDiff] = await Promise.all([
      this.githubSdk.getPr({ owner, repo, pull_number: prNumber }),
      this.githubSdk.getPrCommits({ owner, repo, pull_number: prNumber }),
      this.githubSdk.getRepository({ owner, repo }),
      this.getPrDiff({ pull_number: prNumber }),
    ])

    const pr = prRes.data

    // Cache repositoryCreatedAt to avoid fetching it for each commit
    const repositoryCreatedAt = repoData.data.created_at
      ? new Date(repoData.data.created_at)
      : undefined

    // Rate limit concurrent commit diff fetches to avoid GitHub API rate limits
    const limit = pLimit(GITHUB_API_CONCURRENCY)

    // Get detailed commit data with diffs for each commit with controlled concurrency
    const commits: GetCommitDiffResult[] = await Promise.all(
      commitsRes.data.map((commit) =>
        limit(() =>
          this.getCommitDiff(commit.sha, {
            repositoryCreatedAt,
          })
        )
      )
    )

    // Build diff lines from parsed diff (file + line number for each added line)
    const addedLinesByFile = parseAddedLinesByFile(prDiff)
    const diffLines: DiffLineAttribution[] = []
    for (const [file, lines] of addedLinesByFile) {
      for (const line of lines) {
        diffLines.push({ file, line })
      }
    }

    return {
      diff: prDiff,
      createdAt: new Date(pr.created_at),
      updatedAt: new Date(pr.updated_at),
      submitRequestId: submitRequestId,
      submitRequestNumber: prNumber,
      sourceBranch: pr.head.ref,
      targetBranch: pr.base.ref,
      authorName: pr.user?.name || pr.user?.login,
      authorEmail: pr.user?.email || undefined,
      title: pr.title,
      description: pr.body || undefined,
      commits,
      diffLines,
    }
  }

  /**
   * Override searchSubmitRequests to use GitHub's Search API for efficient pagination.
   * This is much faster than fetching all PRs and filtering in-memory.
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

    const searchResult = await this.githubSdk.searchPullRequests({
      owner,
      repo,
      updatedAfter: params.filters?.updatedAfter,
      state: params.filters?.state,
      sort,
      perPage,
      page,
    })

    // Convert GitHub's Issue format to GetSubmitRequestInfo
    const results: GetSubmitRequestInfo[] = searchResult.items.map((issue) => {
      let status: ScmSubmitRequestStatus = 'open'
      if (issue.state === 'closed') {
        // Check if merged (pull_request object has merged_at field)
        status = issue.pull_request?.merged_at ? 'merged' : 'closed'
      } else if (issue.draft) {
        status = 'draft'
      }

      return {
        submitRequestId: String(issue.number),
        submitRequestNumber: issue.number,
        title: issue.title,
        status,
        sourceBranch: '', // Not available in search API
        targetBranch: '', // Not available in search API
        authorName: issue.user?.login,
        authorEmail: undefined, // Not available in search API
        createdAt: new Date(issue.created_at),
        updatedAt: new Date(issue.updated_at),
        description: issue.body || undefined,
        tickets: [], // Would need separate parsing
        changedLines: { added: 0, removed: 0 }, // Not available in search API
      }
    })

    return {
      results,
      nextCursor: searchResult.hasMore ? String(page + 1) : undefined,
      hasMore: searchResult.hasMore,
    }
  }

  /**
   * Fetches commits for multiple PRs in a single GraphQL request.
   * Much more efficient than calling getSubmitRequestDiff for each PR.
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
   * Fetches additions and deletions counts for multiple PRs in a single GraphQL request.
   * Used to enrich search results with changed lines data.
   *
   * @param repoUrl - Repository URL
   * @param prNumbers - Array of PR numbers to fetch metrics for
   * @returns Map of PR number to additions/deletions count
   */
  override async getPrAdditionsDeletionsBatch(
    repoUrl: string,
    prNumbers: number[]
  ): Promise<Map<number, { additions: number; deletions: number }>> {
    this._validateAccessToken()
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
    return this.githubSdk.getPrAdditionsDeletionsBatch({
      owner,
      repo,
      prNumbers,
    })
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
   * Override searchRepos to use GitHub's Search API for efficient pagination.
   * This is much faster than fetching all repos and filtering in-memory.
   *
   * Note: GitHub Search API doesn't support sorting by name, so when name sorting
   * is requested, we fall back to fetching all repos and sorting in-memory.
   */
  override async searchRepos(
    params: SearchReposParams
  ): Promise<SearchReposResult> {
    this._validateAccessToken()

    const sort = params.sort || { field: 'updated', order: 'desc' }

    // GitHub Search API doesn't support name sorting, so use in-memory sorting
    // Also use in-memory sorting when no organization is provided
    if (!params.scmOrg || sort.field === 'name') {
      return this.searchReposInMemory(params)
    }

    // Use GitHub Search API for date-based sorting (more efficient)
    return this.searchReposWithApi(params)
  }

  /**
   * Search repos by fetching all and sorting/paginating in-memory.
   * Used when name sorting is requested or no organization is provided.
   */
  private async searchReposInMemory(
    params: SearchReposParams
  ): Promise<SearchReposResult> {
    const repos = await this.getRepoList(params.scmOrg)
    const sort = params.sort || { field: 'updated', order: 'desc' }
    const sortOrder = sort.order === 'asc' ? 1 : -1

    const sortedRepos = [...repos].sort((a, b) => {
      if (sort.field === 'name') {
        return a.repoName.localeCompare(b.repoName) * sortOrder
      }

      // Always sort by updated date, never by created date
      // This handles both 'updated' and 'created' field values
      const aDate = a.repoUpdatedAt ? Date.parse(a.repoUpdatedAt) : 0
      const bDate = b.repoUpdatedAt ? Date.parse(b.repoUpdatedAt) : 0
      return (aDate - bDate) * sortOrder
    })

    const limit = params.limit || 10
    const offset = parseCursorSafe(params.cursor, 0)
    const paged = sortedRepos.slice(offset, offset + limit)
    const nextOffset = offset + limit

    return {
      results: paged,
      nextCursor:
        nextOffset < sortedRepos.length ? String(nextOffset) : undefined,
      hasMore: nextOffset < sortedRepos.length,
    }
  }

  /**
   * Search repos using GitHub Search API for efficient server-side pagination.
   * Only supports date-based sorting (updated/created).
   */
  private async searchReposWithApi(
    params: SearchReposParams
  ): Promise<SearchReposResult> {
    const page = parseCursorSafe(params.cursor, 1)
    const perPage = params.limit || 10
    const sort = params.sort || { field: 'updated', order: 'desc' }

    const searchResult = await this.githubSdk.searchRepositories({
      org: params.scmOrg,
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
    }))

    return {
      results,
      nextCursor: searchResult.hasMore ? String(page + 1) : undefined,
      hasMore: searchResult.hasMore,
    }
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

    // Get first commit date
    const firstCommit = pr.commits.nodes[0]
    const firstCommitDate = firstCommit
      ? new Date(
          firstCommit.commit.author?.date ||
            firstCommit.commit.committedDate ||
            pr.createdAt
        )
      : null

    // Extract commit SHAs
    let commitShas = pr.commits.nodes.map((node) => node.commit.oid)

    // If commits exceed GraphQL limit, fall back to REST pagination
    if (pr.commits.totalCount > 100) {
      const commitsRes = await this.githubSdk.getPrCommits({
        owner,
        repo,
        pull_number: prNumber,
      })
      commitShas = commitsRes.data.map((c) => c.sha)
    }

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
      firstCommitDate,
      linesAdded: pr.additions,
      commitsCount: pr.commits.totalCount,
      commitShas,
      prStatus,
      commentIds,
    }
  }

  /**
   * Extract Linear ticket links from pre-fetched comments (pure function, no API calls)
   * Instance method that overrides base class - can also be called statically for backwards compatibility.
   */
  override extractLinearTicketsFromComments(
    comments: PrCommentData[]
  ): { name: string; title: string; url: string }[] {
    return GithubSCMLib._extractLinearTicketsFromCommentsImpl(comments)
  }

  /**
   * Static implementation for backwards compatibility and reuse.
   * Called by both the instance method and direct static calls.
   */
  private static _extractLinearTicketsFromCommentsImpl(
    comments: PrCommentData[]
  ): { name: string; title: string; url: string }[] {
    const tickets: { name: string; title: string; url: string }[] = []
    const seen = new Set<string>()

    for (const comment of comments) {
      if (
        comment.author?.login === 'linear[bot]' ||
        comment.author?.type === 'Bot'
      ) {
        tickets.push(...extractLinearTicketsFromBody(comment.body || '', seen))
      }
    }

    return tickets
  }
}

// Mobb security fix applied: LOG_FORGING
