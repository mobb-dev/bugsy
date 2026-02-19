import { InvalidRepoUrlError } from './errors'
import { isValidBranchName } from './scmSubmit'
import {
  CreateSubmitRequestParams,
  GetReferenceResult,
  GetSubmitRequestMetadataResult,
  PrCommentData,
  PullRequestMetrics,
  RateLimitStatus,
  RecentCommitsResult,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
  SearchReposParams,
  SearchReposResult,
  SearchSubmitRequestsParams,
  SearchSubmitRequestsResult,
} from './types'
import {
  buildAuthorizedRepoUrl,
  extractLinearTicketsFromComments,
} from './utils'

// todo: scmOrg is only relevant for ADO
// we should covert this to union type

export abstract class SCMLib {
  protected readonly url?: string
  public readonly accessToken?: string
  public readonly scmOrg?: string

  protected constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined
  ) {
    this.accessToken = accessToken
    this.url = url
    this.scmOrg = scmOrg
  }

  public async getUrlWithCredentials(): Promise<string> {
    if (!this.url) {
      console.error('no url for getUrlWithCredentials()')
      throw new Error('no url')
    }
    const trimmedUrl = this.url.trim().replace(/\/$/, '')
    const accessToken = this.getAccessToken()
    if (!accessToken) {
      return trimmedUrl
    }

    if (this.scmLibType === ScmLibScmType.ADO) {
      const { host, protocol, pathname } = new URL(trimmedUrl)

      return `${protocol}//${accessToken}@${host}${pathname}`
    }

    //In Gitlab, when using a repo URL without the .git suffix, the server will return a redirect to the URL with the .git suffix.
    //In case we are using a broker, then we use virtual domain/host but the redirect is still to the real domain/host.
    //Therefore, we need to add the .git suffix to the URL in order to avoid this redirect in the first place.
    const finalUrl =
      this.scmLibType === ScmLibScmType.GITLAB
        ? `${trimmedUrl}.git`
        : trimmedUrl

    const username = await this._getUsernameForAuthUrl()
    return buildAuthorizedRepoUrl({
      url: finalUrl,
      username,
      password: accessToken,
    })
  }

  abstract get scmLibType(): ScmLibScmType

  abstract getAuthHeaders(): Record<string, string>

  abstract getDownloadUrl(sha: string): Promise<string>

  abstract getIsRemoteBranch(_branch: string): Promise<boolean>

  abstract validateParams(): Promise<void>

  abstract getRepoList(scmOrg: string | undefined): Promise<ScmRepoInfo[]>

  abstract getBranchList(): Promise<string[]>

  abstract getUserHasAccessToRepo(): Promise<boolean>

  abstract _getUsernameForAuthUrl(): Promise<string>

  abstract getSubmitRequestStatus(
    submitRequestId: string
  ): Promise<ScmSubmitRequestStatus>

  abstract addCommentToSubmitRequest(
    submitRequestId: string,
    comment: string
  ): Promise<void>

  abstract createSubmitRequest(args: CreateSubmitRequestParams): Promise<string>

  abstract getReferenceData(ref: string): Promise<GetReferenceResult>
  abstract getSubmitRequestUrl(submitRequestIdNumber: number): Promise<string>
  abstract getSubmitRequestId(submitRequestIdUrl: string): Promise<string>
  abstract getCommitUrl(commitId: string): Promise<string>
  abstract getBranchCommitsUrl(branchName: string): Promise<string>
  abstract getRepoDefaultBranch(): Promise<string>

  /**
   * Fetches lightweight PR/MR metadata with a single API call.
   * Returns only the title, branch names, and head commit SHA.
   * Used by the optimized blame analysis flow to avoid fetching full diffs via SCM API.
   */
  abstract getSubmitRequestMetadata(
    submitRequestId: string
  ): Promise<GetSubmitRequestMetadataResult>

  /**
   * Search for PRs with optional filters and sorting.
   * IMPORTANT: Sort order must remain consistent across paginated requests
   * for cursor-based pagination to work correctly.
   *
   * Override in subclasses for provider-specific optimizations (e.g., GitHub Search API).
   *
   * @param params - Search parameters including filters, sort, and pagination
   * @returns Paginated search results with cursor
   */
  async searchSubmitRequests(
    _params: SearchSubmitRequestsParams
  ): Promise<SearchSubmitRequestsResult> {
    throw new Error(
      'searchSubmitRequests is not implemented for this SCM provider'
    )
  }

  /**
   * Search repositories with pagination support.
   * IMPORTANT: Sort order must remain consistent across paginated requests
   * for cursor-based pagination to work correctly.
   *
   * Must be overridden in subclasses with provider-specific implementations.
   *
   * @param params - Search parameters including sort and pagination
   * @returns Paginated search results with cursor
   */
  async searchRepos(_params: SearchReposParams): Promise<SearchReposResult> {
    throw new Error('searchRepos is not implemented for this SCM provider')
  }

  /**
   * Fetches commits for multiple PRs in a single batch request.
   * This is an optimization that not all SCM providers may support efficiently.
   * Default implementation throws - override in subclasses that support batching.
   *
   * @param repoUrl - Repository URL
   * @param prNumbers - Array of PR numbers to fetch commits for
   * @returns Map of PR number to array of commit SHAs in chronological order
   *          (oldest first, HEAD commit last)
   */
  async getPrCommitsBatch(
    _repoUrl: string,
    _prNumbers: number[]
  ): Promise<Map<number, string[]>> {
    throw new Error('getPrCommitsBatch not implemented for this SCM provider')
  }

  /**
   * Batch fetch PR data (additions/deletions + comments) for multiple PRs.
   * Only implemented for GitHub (via GraphQL). Other providers should override if supported.
   * This is more efficient than calling separate batch methods.
   *
   * @param _repoUrl - Repository URL
   * @param _prNumbers - Array of PR numbers to fetch data for
   * @returns Map of PR number to { changedLines, comments }
   */
  async getPrDataBatch(
    _repoUrl: string,
    _prNumbers: number[]
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
    throw new Error('getPrDataBatch not implemented for this SCM provider')
  }

  abstract getPullRequestMetrics(prNumber: number): Promise<PullRequestMetrics>

  /**
   * Fetches recent commits since the given date.
   * Used by AI Blame periodic analysis to find new commits to process.
   *
   * @param since - ISO 8601 date string to filter commits
   * @returns Promise with array of commits
   */
  abstract getRecentCommits(since: string): Promise<RecentCommitsResult>

  /**
   * Gets rate limit status for the SCM API.
   * Returns null for providers that don't expose a dedicated rate limit API
   * (like GitLab which uses response headers instead).
   *
   * @returns Promise with rate limit info or null if not available
   */
  abstract getRateLimitStatus(): Promise<RateLimitStatus | null>

  public getAccessToken(): string {
    return this.accessToken || ''
  }

  public getUrl(): string | undefined {
    return this.url
  }

  public getName(): string {
    if (!this.url) {
      return ''
    }
    return this.url.split('/').at(-1) || ''
  }
  protected _validateAccessToken(): asserts this is this & {
    accessToken: string
  } {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
  }

  public static async getIsValidBranchName(
    branchName: string
  ): Promise<boolean> {
    return isValidBranchName(branchName)
  }

  /**
   * Extract Linear ticket links from PR/MR comments.
   * Uses shared isLinearBotComment() for unified bot detection across all providers.
   * Public so it can be reused by backend services.
   */
  public extractLinearTicketsFromComments(
    comments: PrCommentData[]
  ): { name: string; title: string; url: string }[] {
    return extractLinearTicketsFromComments(comments)
  }

  protected _validateAccessTokenAndUrl(): asserts this is this & {
    accessToken: string
    url: string
  } {
    this._validateAccessToken()
    this._validateUrl()
  }
  protected _validateUrl(): asserts this is this & {
    url: string
  } {
    if (!this.url) {
      console.error('no url')
      throw new InvalidRepoUrlError('no url')
    }
  }
}
