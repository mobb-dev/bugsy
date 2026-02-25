import { contextLogger } from '../../../../utils/contextLogger'
import { Pr_Status_Enum } from '../generates/client_generates'
import { SCMLib } from '../scm'
import {
  CreateSubmitRequestParams,
  GetReferenceResult,
  GetSubmitRequestInfo,
  GetSubmitRequestMetadataResult,
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
} from '../types'
import { parseCursorSafe } from '../utils/cursorValidation'
import {
  createMarkdownCommentOnPullRequest,
  createMergeRequest,
  getGitlabBranchList,
  getGitlabCommitUrl,
  getGitlabIsRemoteBranch,
  getGitlabIsUserCollaborator,
  getGitlabMergeRequest,
  getGitlabMergeRequestMetrics,
  getGitlabMergeRequestStatus,
  getGitlabMrCommitsBatch,
  getGitlabMrDataBatch,
  getGitlabProjectLanguages,
  getGitlabRateLimitStatus,
  getGitlabRecentCommits,
  getGitlabReferenceData,
  getGitlabRepoDefaultBranch,
  getGitlabUsername,
  gitlabMergeRequestStatus,
  gitlabValidateParams,
  searchGitlabMergeRequests,
  searchGitlabProjects,
} from './gitlab'

export class GitlabSCMLib extends SCMLib {
  constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined
  ) {
    super(url, accessToken, scmOrg)
  }

  async createSubmitRequest(
    params: CreateSubmitRequestParams
  ): Promise<string> {
    this._validateAccessTokenAndUrl()
    const { targetBranchName, sourceBranchName, title, body } = params
    return String(
      await createMergeRequest({
        title,
        body,
        targetBranchName,
        sourceBranchName,
        repoUrl: this.url,
        accessToken: this.accessToken,
      })
    )
  }

  async validateParams() {
    return gitlabValidateParams({
      url: this.url,
      accessToken: this.accessToken,
    })
  }

  async getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]> {
    if (!this.accessToken) {
      contextLogger.warn('[GitlabSCMLib.getRepoList] No access token provided')
      throw new Error('no access token')
    }
    // Delegate to searchRepos, fetching all pages
    const allRepos: ScmRepoInfo[] = []
    let cursor: string | undefined
    let hasMore = true

    while (hasMore) {
      const page = await this.searchRepos({
        scmOrg: _scmOrg,
        limit: 100,
        cursor,
      })
      allRepos.push(...page.results)
      hasMore = page.hasMore
      cursor = page.nextCursor
    }

    return allRepos
  }

  async getBranchList(): Promise<string[]> {
    this._validateAccessTokenAndUrl()
    return getGitlabBranchList({
      accessToken: this.accessToken,
      repoUrl: this.url,
    })
  }

  get scmLibType(): ScmLibScmType {
    return ScmLibScmType.GITLAB
  }

  getAuthHeaders(): Record<string, string> {
    //when accessing public projects without committing, we don't need an access token
    if (!this.accessToken) {
      return {}
    }

    //for on-prem Gitlab, sometimes the prefix is not there
    //but we see that these private API tokens are also accepted by GL
    //when used as a bearer token in an authentication header
    if (this.accessToken.startsWith('glpat-')) {
      return {
        'Private-Token': this.accessToken,
      }
    } else {
      return { authorization: `Bearer ${this.accessToken}` }
    }
  }

  getDownloadUrl(sha: string): Promise<string> {
    const urlObj = new URL(this.url || '')
    const ProjectId = encodeURIComponent(
      urlObj.pathname.replace(/^\//, '').replace(/\/$/, '')
    )
    return Promise.resolve(
      //We are moving away from this form as it doesn't work when using a non-human token (group/project token)
      //Where as the API zip endpoint works with any token
      //`${this.url}/-/archive/${sha}/${repoName}-${sha}.zip`
      `${urlObj.origin}/api/v4/projects/${ProjectId}/repository/archive.zip?sha=${sha}`
    )
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    if (this?.accessToken?.startsWith('glpat-')) {
      return this.getUsername()
    } else {
      return 'oauth2'
    }
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    this._validateAccessTokenAndUrl()
    return getGitlabIsRemoteBranch({
      accessToken: this.accessToken,
      repoUrl: this.url,
      branch,
    })
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    this._validateAccessTokenAndUrl()
    return getGitlabIsUserCollaborator({
      accessToken: this.accessToken,
      repoUrl: this.url,
    })
  }

  async getUsername(): Promise<string> {
    this._validateAccessTokenAndUrl()
    return getGitlabUsername(this.url, this.accessToken)
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<Partial<ScmSubmitRequestStatus>> {
    this._validateAccessTokenAndUrl()
    const state = await getGitlabMergeRequestStatus({
      accessToken: this.accessToken,
      repoUrl: this.url,
      mrNumber: Number(scmSubmitRequestId),
    })
    switch (state) {
      case gitlabMergeRequestStatus.merged:
        return 'merged'
      case gitlabMergeRequestStatus.opened:
        return 'open'
      case gitlabMergeRequestStatus.closed:
        return 'closed'

      default:
        throw new Error(`unknown state ${state}`)
    }
  }

  async addCommentToSubmitRequest(
    submitRequestId: string,
    comment: string
  ): Promise<void> {
    this._validateAccessTokenAndUrl()
    await createMarkdownCommentOnPullRequest({
      accessToken: this.accessToken,
      repoUrl: this.url,
      mrNumber: Number(submitRequestId),
      markdownComment: comment,
    })
  }

  async getReferenceData(ref: string): Promise<GetReferenceResult> {
    this._validateUrl()
    return await getGitlabReferenceData(
      { ref, gitlabUrl: this.url },
      {
        url: this.url,
        gitlabAuthToken: this.accessToken,
      }
    )
  }

  async getRepoDefaultBranch(): Promise<string> {
    this._validateUrl()
    return await getGitlabRepoDefaultBranch(this.url, {
      url: this.url,
      gitlabAuthToken: this.accessToken,
    })
  }

  async getSubmitRequestUrl(submitRequestUrl: number): Promise<string> {
    this._validateAccessTokenAndUrl()
    const res = await getGitlabMergeRequest({
      url: this.url,
      prNumber: submitRequestUrl,
      accessToken: this.accessToken,
    })
    return res.web_url
  }

  async getSubmitRequestId(submitRequestUrl: string): Promise<string> {
    const match = submitRequestUrl.match(/\/merge_requests\/(\d+)/)
    return match?.[1] || ''
  }

  async getCommitUrl(commitId: string): Promise<string> {
    this._validateAccessTokenAndUrl()
    const res = await getGitlabCommitUrl({
      url: this.url,
      commitSha: commitId,
      accessToken: this.accessToken,
    })
    return res.web_url
  }

  async getBranchCommitsUrl(branchName: string): Promise<string> {
    this._validateAccessTokenAndUrl()
    return `${this.url}/-/commits/${branchName}`
  }

  async getSubmitRequestMetadata(
    submitRequestId: string
  ): Promise<GetSubmitRequestMetadataResult> {
    this._validateAccessTokenAndUrl()
    const mrNumber = parseInt(submitRequestId, 10)
    if (isNaN(mrNumber) || mrNumber <= 0) {
      throw new Error(`Invalid merge request ID: ${submitRequestId}`)
    }

    // Single API call - only fetches MR metadata
    const mr = await getGitlabMergeRequest({
      url: this.url,
      prNumber: mrNumber,
      accessToken: this.accessToken,
    })

    return {
      title: mr.title,
      targetBranch: mr.target_branch,
      sourceBranch: mr.source_branch,
      headCommitSha: mr.sha,
    }
  }

  async getPrFiles(_prNumber: number): Promise<string[]> {
    throw new Error('getPrFiles not implemented for GitLab')
  }

  override async searchSubmitRequests(
    params: SearchSubmitRequestsParams
  ): Promise<SearchSubmitRequestsResult> {
    this._validateAccessTokenAndUrl()

    const page = parseCursorSafe(params.cursor, 1)
    const perPage = params.limit || 10
    const sort = params.sort || { field: 'updated', order: 'desc' }

    // Map our sort field to GitLab's orderBy
    const orderBy: 'updated_at' | 'created_at' =
      sort.field === 'created' ? 'created_at' : 'updated_at'

    // Map our state filter to GitLab's state
    let gitlabState: 'opened' | 'closed' | 'merged' | 'all' | undefined
    if (params.filters?.state === 'open') {
      gitlabState = 'opened'
    } else if (params.filters?.state === 'closed') {
      gitlabState = 'closed'
    } else {
      gitlabState = 'all'
    }

    const searchResult = await searchGitlabMergeRequests({
      repoUrl: this.url!,
      accessToken: this.accessToken!,
      state: gitlabState,
      updatedAfter: params.filters?.updatedAfter,
      orderBy,
      sort: sort.order,
      perPage,
      page,
    })

    const results: GetSubmitRequestInfo[] = searchResult.items.map((mr) => {
      let status: ScmSubmitRequestStatus = 'open'
      if (mr.state === 'merged') {
        status = 'merged'
      } else if (mr.state === 'closed') {
        status = 'closed'
      }

      return {
        submitRequestId: String(mr.iid),
        submitRequestNumber: mr.iid,
        title: mr.title,
        status,
        sourceBranch: mr.sourceBranch,
        targetBranch: mr.targetBranch,
        authorName: mr.authorUsername,
        authorEmail: undefined,
        createdAt: new Date(mr.createdAt),
        updatedAt: new Date(mr.updatedAt),
        description: mr.description || undefined,
        tickets: [],
        changedLines: { added: 0, removed: 0 },
      }
    })

    // Cap at 1024 total results to prevent excessive API calls
    const MAX_TOTAL_RESULTS = 1024
    const totalFetchedSoFar = page * perPage
    const reachedLimit = totalFetchedSoFar >= MAX_TOTAL_RESULTS
    if (reachedLimit && searchResult.hasMore) {
      contextLogger.warn(
        '[searchSubmitRequests] Hit limit of merge requests for GitLab repo',
        {
          limit: MAX_TOTAL_RESULTS,
        }
      )
    }

    return {
      results,
      nextCursor:
        searchResult.hasMore && !reachedLimit ? String(page + 1) : undefined,
      hasMore: searchResult.hasMore && !reachedLimit,
    }
  }

  override async getPrCommitsBatch(
    _repoUrl: string,
    prNumbers: number[]
  ): Promise<Map<number, string[]>> {
    this._validateAccessTokenAndUrl()
    return getGitlabMrCommitsBatch({
      repoUrl: this.url!,
      accessToken: this.accessToken!,
      mrNumbers: prNumbers,
    })
  }

  override async getPrDataBatch(
    _repoUrl: string,
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
    this._validateAccessTokenAndUrl()
    return getGitlabMrDataBatch({
      repoUrl: this.url!,
      accessToken: this.accessToken!,
      mrNumbers: prNumbers,
    })
  }

  override async searchRepos(
    params: SearchReposParams
  ): Promise<SearchReposResult> {
    if (!this.accessToken) {
      throw new Error('no access token')
    }

    const page = parseCursorSafe(params.cursor, 1)
    const perPage = params.limit || 10

    const { projects, hasMore } = await searchGitlabProjects({
      url: this.url,
      accessToken: this.accessToken,
      perPage,
      page,
    })

    // Fetch languages for the current page only (unless opted out)
    const includeLanguages = params.includeLanguages !== false
    const languageMap = new Map<number, string[]>()

    if (includeLanguages && projects.length > 0) {
      const languageResults = await Promise.all(
        projects.map((p) =>
          getGitlabProjectLanguages({
            url: this.url,
            accessToken: this.accessToken!,
            projectId: p.id,
          }).then((langs) => [p.id, langs] as const)
        )
      )
      for (const [id, langs] of languageResults) {
        languageMap.set(id, langs)
      }
    }

    const results: ScmRepoInfo[] = projects.map((p) => ({
      repoName: p.path,
      repoUrl: p.web_url,
      repoOwner: p.namespace_name,
      repoLanguages: languageMap.get(p.id) || [],
      repoIsPublic: p.visibility === 'public',
      repoUpdatedAt: p.last_activity_at,
    }))

    return {
      results,
      nextCursor: hasMore ? String(page + 1) : undefined,
      hasMore,
    }
  }

  async getPullRequestMetrics(prNumber: number): Promise<PullRequestMetrics> {
    this._validateAccessTokenAndUrl()

    const metrics = await getGitlabMergeRequestMetrics({
      url: this.url,
      prNumber,
      accessToken: this.accessToken,
    })

    // Map GitLab MR state to Pr_Status_Enum
    let prStatus: Pr_Status_Enum
    switch (metrics.state) {
      case 'merged':
        prStatus = Pr_Status_Enum.Merged
        break
      case 'closed':
        prStatus = Pr_Status_Enum.Closed
        break
      default:
        prStatus = metrics.isDraft
          ? Pr_Status_Enum.Draft
          : Pr_Status_Enum.Active
    }

    return {
      prId: String(prNumber),
      repositoryUrl: this.url!,
      prCreatedAt: new Date(metrics.createdAt),
      prMergedAt: metrics.mergedAt ? new Date(metrics.mergedAt) : null,
      linesAdded: metrics.linesAdded,
      prStatus,
      commentIds: metrics.commentIds,
    }
  }

  async getRecentCommits(since: string): Promise<RecentCommitsResult> {
    this._validateAccessTokenAndUrl()
    const commits = await getGitlabRecentCommits({
      repoUrl: this.url,
      accessToken: this.accessToken,
      since,
    })
    return { data: commits }
  }

  async getRateLimitStatus(): Promise<RateLimitStatus | null> {
    this._validateAccessTokenAndUrl()
    return getGitlabRateLimitStatus({
      repoUrl: this.url,
      accessToken: this.accessToken,
    })
  }
}
