import { InvalidRepoUrlError } from './errors'
import { isValidBranchName } from './scmSubmit'
import {
  CreateSubmitRequestParams,
  GetCommitDiffResult,
  GetGitBlameResponse,
  GetReferenceResult,
  GetSubmitRequestDiffResult,
  GetSubmitRequestInfo,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
} from './types'
import { buildAuthorizedRepoUrl } from './utils'

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

  abstract getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<GetGitBlameResponse>

  abstract getReferenceData(ref: string): Promise<GetReferenceResult>
  abstract getSubmitRequestUrl(submitRequestIdNumber: number): Promise<string>
  abstract getSubmitRequestId(submitRequestIdUrl: string): Promise<string>
  abstract getCommitUrl(commitId: string): Promise<string>
  abstract getBranchCommitsUrl(branchName: string): Promise<string>
  abstract getRepoDefaultBranch(): Promise<string>
  abstract getCommitDiff(commitSha: string): Promise<GetCommitDiffResult>
  abstract getSubmitRequestDiff(
    submitRequestId: string
  ): Promise<GetSubmitRequestDiffResult>

  abstract getSubmitRequests(repoUrl: string): Promise<GetSubmitRequestInfo[]>

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
