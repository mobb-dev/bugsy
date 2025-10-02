import { SCMLib } from './scm'
import {
  CreateSubmitRequestParams,
  GetCommitDiffResult,
  GetGitBlameReponse,
  GetRefererenceResult,
  ReferenceType,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
} from './types'

export class StubSCMLib extends SCMLib {
  constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined
  ) {
    super(url, accessToken, scmOrg)
  }

  public override async getUrlWithCredentials(): Promise<string> {
    console.warn('getUrlWithCredentials() returning empty string')
    return ''
  }

  async createSubmitRequest(
    _params: CreateSubmitRequestParams
  ): Promise<string> {
    console.warn('createSubmitRequest() returning empty string')
    return ''
  }

  get scmLibType(): ScmLibScmType {
    console.warn('scmLibType returning GITHUB as default')
    return ScmLibScmType.GITHUB
  }

  getAuthHeaders(): Record<string, string> {
    console.warn('getAuthHeaders() returning empty object')
    return {}
  }

  async getDownloadUrl(_sha: string): Promise<string> {
    console.warn('getDownloadUrl() returning empty string')
    return ''
  }

  async getIsRemoteBranch(_branch: string): Promise<boolean> {
    console.warn('getIsRemoteBranch() returning false')
    return false
  }

  async validateParams(): Promise<void> {
    console.warn('validateParams() no-op')
  }

  async getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]> {
    console.warn('getRepoList() returning empty array')
    return []
  }

  async getBranchList(): Promise<string[]> {
    console.warn('getBranchList() returning empty array')
    return []
  }

  async getUsername(): Promise<string> {
    console.warn('getUsername() returning empty string')
    return ''
  }

  async getSubmitRequestStatus(
    _scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    console.warn('getSubmitRequestStatus() returning ERROR')
    return 'error'
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    console.warn('getUserHasAccessToRepo() returning false')
    return false
  }

  async getRepoBlameRanges(
    _ref: string,
    _path: string
  ): Promise<GetGitBlameReponse> {
    console.warn('getRepoBlameRanges() returning empty array')
    return []
  }

  async getReferenceData(_ref: string): Promise<GetRefererenceResult> {
    console.warn('getReferenceData() returning null/empty defaults')
    return {
      type: ReferenceType.BRANCH,
      sha: '',
      date: undefined,
    }
  }

  async getRepoDefaultBranch(): Promise<string> {
    console.warn('getRepoDefaultBranch() returning empty string')
    return ''
  }

  async getSubmitRequestUrl(_submitRequestIdNumber: number): Promise<string> {
    console.warn('getSubmitRequestUrl() returning empty string')
    return ''
  }

  async getSubmitRequestId(_submitRequestUrl: string): Promise<string> {
    console.warn('getSubmitRequestId() returning empty string')
    return ''
  }

  async getCommitUrl(_commitId: string): Promise<string> {
    console.warn('getCommitUrl() returning empty string')
    return ''
  }

  async getBranchCommitsUrl(_branchName: string): Promise<string> {
    console.warn('getBranchCommitsUrl() returning empty string')
    return ''
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    console.warn('_getUsernameForAuthUrl() returning empty string')
    return ''
  }

  async addCommentToSubmitRequest(
    _submitRequestId: string,
    _comment: string
  ): Promise<void> {
    console.warn('addCommentToSubmitRequest() no-op')
  }

  async getCommitDiff(_commitSha: string): Promise<GetCommitDiffResult> {
    console.warn('getCommitDiff() returning stub diff')
    return {
      diff: '',
      commitTimestamp: new Date(),
      commitSha: _commitSha,
      authorName: undefined,
      authorEmail: undefined,
      message: undefined,
    }
  }
}
