import { SCMLib } from '../scm'
import {
  CreateSubmitRequestParams,
  GetCommitDiffResult,
  GetGitBlameResponse,
  GetReferenceResult,
  GetSubmitRequestDiffResult,
  GetSubmitRequestInfo,
  PullRequestMetrics,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
  SearchReposParams,
  SearchReposResult,
  SearchSubmitRequestsParams,
  SearchSubmitRequestsResult,
} from '../types'
import {
  createMarkdownCommentOnPullRequest,
  createMergeRequest,
  getGitlabBlameRanges,
  getGitlabBranchList,
  getGitlabCommitUrl,
  getGitlabIsRemoteBranch,
  getGitlabIsUserCollaborator,
  getGitlabMergeRequest,
  getGitlabMergeRequestStatus,
  getGitlabReferenceData,
  getGitlabRepoDefaultBranch,
  getGitlabRepoList,
  getGitlabUsername,
  gitlabMergeRequestStatus,
  gitlabValidateParams,
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
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGitlabRepoList(this.url, this.accessToken)
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

  async getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<GetGitBlameResponse> {
    this._validateUrl()
    return await getGitlabBlameRanges(
      { ref, path, gitlabUrl: this.url },
      {
        url: this.url,
        gitlabAuthToken: this.accessToken,
      }
    )
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

  async getCommitDiff(_commitSha: string): Promise<GetCommitDiffResult> {
    throw new Error('getCommitDiff not implemented for GitLab')
  }

  async getSubmitRequestDiff(
    _submitRequestId: string
  ): Promise<GetSubmitRequestDiffResult> {
    throw new Error('getSubmitRequestDiff not implemented for GitLab')
  }

  async getSubmitRequests(_repoUrl: string): Promise<GetSubmitRequestInfo[]> {
    throw new Error('getSubmitRequests not implemented for GitLab')
  }

  override async searchSubmitRequests(
    _params: SearchSubmitRequestsParams
  ): Promise<SearchSubmitRequestsResult> {
    throw new Error('searchSubmitRequests not implemented for GitLab')
  }

  override async searchRepos(
    _params: SearchReposParams
  ): Promise<SearchReposResult> {
    throw new Error('searchRepos not implemented for GitLab')
  }

  // TODO: Add comprehensive tests for getPullRequestMetrics (GitLab)
  // See clients/cli/src/features/analysis/scm/__tests__/github.test.ts:589-648 for reference
  async getPullRequestMetrics(_prNumber: number): Promise<PullRequestMetrics> {
    throw new Error('getPullRequestMetrics not implemented for GitLab')
  }
}
