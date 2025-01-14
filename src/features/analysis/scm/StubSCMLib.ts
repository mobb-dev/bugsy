import { SCMLib } from './scm'
import {
  CreateSubmitRequestParams,
  GetRefererenceResult,
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

  public override getUrlWithCredentials(): Promise<string> {
    console.error('getUrlWithCredentials() not implemented')
    throw new Error('getUrlWithCredentials() not implemented')
  }

  async createSubmitRequest(
    _params: CreateSubmitRequestParams
  ): Promise<string> {
    console.error('createSubmitRequest() not implemented')
    throw new Error('createSubmitRequest() not implemented')
  }

  get scmLibType(): ScmLibScmType {
    console.error('getScmLibType() not implemented')
    throw new Error('getScmLibType() not implemented')
  }

  getAuthHeaders(): Record<string, string> {
    console.error('getAuthHeaders() not implemented')
    throw new Error('getAuthHeaders() not implemented')
  }

  getDownloadUrl(_sha: string): Promise<string> {
    console.error('getDownloadUrl() not implemented')
    throw new Error('getDownloadUrl() not implemented')
  }

  async getIsRemoteBranch(_branch: string): Promise<boolean> {
    console.error('getIsRemoteBranch() not implemented')
    throw new Error('getIsRemoteBranch() not implemented')
  }

  async validateParams() {
    console.error('validateParams() not implemented')
    throw new Error('validateParams() not implemented')
  }

  async getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]> {
    console.error('getRepoList() not implemented')
    throw new Error('getRepoList() not implemented')
  }

  async getBranchList(): Promise<string[]> {
    console.error('getBranchList() not implemented')
    throw new Error('getBranchList() not implemented')
  }

  async getUsername(): Promise<string> {
    console.error('getUsername() not implemented')
    throw new Error('getUsername() not implemented')
  }

  async getSubmitRequestStatus(
    _scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    console.error('getSubmitRequestStatus() not implemented')
    throw new Error('getSubmitRequestStatus() not implemented')
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    console.error('getUserHasAccessToRepo() not implemented')
    throw new Error('getUserHasAccessToRepo() not implemented')
  }

  async getRepoBlameRanges(
    _ref: string,
    _path: string
  ): Promise<
    {
      startingLine: number
      endingLine: number
      name: string
      login: string
      email: string
    }[]
  > {
    console.error('getRepoBlameRanges() not implemented')
    throw new Error('getRepoBlameRanges() not implemented')
  }

  async getReferenceData(_ref: string): Promise<GetRefererenceResult> {
    console.error('getReferenceData() not implemented')
    throw new Error('getReferenceData() not implemented')
  }

  async getRepoDefaultBranch(): Promise<string> {
    console.error('getRepoDefaultBranch() not implemented')
    throw new Error('getRepoDefaultBranch() not implemented')
  }
  async getPrUrl(_prNumber: number): Promise<string> {
    console.error('getPr() not implemented')
    throw new Error('getPr() not implemented')
  }
  async getPrId(_prUrl: string): Promise<string> {
    console.error('getPrId() not implemented')
    throw new Error('getPrId() not implemented')
  }
  async getCommitUrl(_commitId: string): Promise<string> {
    console.error('getCommitUrl() not implemented')
    throw new Error('getCommitUrl() not implemented')
  }
  _getUsernameForAuthUrl(): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
