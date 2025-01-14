import { SCMLib } from '../scm'
import {
  CreateSubmitRequestParams,
  GetGitBlameReponse,
  GetRefererenceResult,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
} from '../types'
import {
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
    const username = await this.getUsername()
    return getGitlabIsUserCollaborator({
      username,
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

  async getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<GetGitBlameReponse> {
    this._validateUrl()
    return await getGitlabBlameRanges(
      { ref, path, gitlabUrl: this.url },
      {
        url: this.url,
        gitlabAuthToken: this.accessToken,
      }
    )
  }

  async getReferenceData(ref: string): Promise<GetRefererenceResult> {
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

  async getPrUrl(prNumber: number): Promise<string> {
    this._validateAccessTokenAndUrl()
    const res = await getGitlabMergeRequest({
      url: this.url,
      prNumber: prNumber,
      accessToken: this.accessToken,
    })
    return res.web_url
  }

  async getPrId(prUrl: string): Promise<string> {
    const match = prUrl.match(/\/merge_requests\/(\d+)/)
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
}
