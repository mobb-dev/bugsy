import { Octokit } from '@octokit/core'
import { z } from 'zod'

import {
  AdoPullRequestStatusEnum,
  AdoTokenTypeEnum,
  adoValidateParams,
  createAdoPullRequest,
  getAdoBlameRanges,
  getAdoBranchList,
  getAdoDownloadUrl,
  getAdoIsRemoteBranch,
  getAdoIsUserCollaborator,
  getAdoPullRequestStatus,
  getAdoReferenceData,
  getAdoRepoDefaultBranch,
  getAdoRepoList,
  getAdoTokenType,
} from './ado'
import { encryptSecret } from './github/encryptSecret'
import {
  createPr,
  createPullRequest,
  forkRepo,
  getGithubBlameRanges,
  getGithubBranchList,
  getGithubIsRemoteBranch,
  getGithubIsUserCollaborator,
  getGithubPullRequestStatus,
  getGithubReferenceData,
  getGithubRepoDefaultBranch,
  getGithubRepoList,
  getGithubUsername,
  getUserInfo,
  githubValidateParams,
  parseGithubOwnerAndRepo,
} from './github/github'
import {
  createOrUpdateRepositorySecret,
  deleteComment,
  getARepositoryPublicKey,
  getPrComment,
  getPrComments,
  getPrDiff,
  postPrComment,
  updatePrComment,
} from './github/github-v2'
import {
  DeleteCommentParams,
  GetPrCommentResponse,
  GetPrCommentsParams,
  GetPrParams,
  PostCommentParams,
  UpdateCommentParams,
  UpdateCommentResponse,
} from './github/types'
import {
  createMergeRequest,
  getGitlabBlameRanges,
  getGitlabBranchList,
  getGitlabIsRemoteBranch,
  getGitlabIsUserCollaborator,
  getGitlabMergeRequestStatus,
  getGitlabReferenceData,
  getGitlabRepoDefaultBranch,
  getGitlabRepoList,
  getGitlabUsername,
  GitlabMergeRequestStatusEnum,
  gitlabValidateParams,
} from './gitlab'
import { isValidBranchName } from './scmSubmit'

export const ghGetUserInfo = getUserInfo
export function getScmLibTypeFromUrl(url: string | undefined) {
  if (!url) {
    return undefined
  }
  const urlObject = new URL(url)
  const hostname = urlObject.hostname
  if (hostname === 'gitlab.com') {
    return ScmLibScmType.GITLAB
  }
  if (hostname === 'github.com') {
    return ScmLibScmType.GITHUB
  }
  if (hostname === 'dev.azure.com' || hostname.endsWith('.visualstudio.com')) {
    return ScmLibScmType.ADO
  }
  return undefined
}

export async function scmCanReachRepo({
  repoUrl,
  githubToken,
  gitlabToken,
  adoToken,
  scmOrg,
}: {
  repoUrl: string
  githubToken: string | undefined
  gitlabToken: string | undefined
  adoToken: string | undefined
  scmOrg: string | undefined
}) {
  try {
    const scmLibType = getScmLibTypeFromUrl(repoUrl)
    await SCMLib.init({
      url: repoUrl,
      accessToken:
        scmLibType === ScmLibScmType.GITHUB
          ? githubToken
          : scmLibType === ScmLibScmType.GITLAB
          ? gitlabToken
          : scmLibType === ScmLibScmType.ADO
          ? adoToken
          : '',
      scmType: scmLibType,
      scmOrg,
    })
    return true
  } catch (e) {
    return false
  }
}

export enum ReferenceType {
  BRANCH = 'BRANCH',
  COMMIT = 'COMMIT',
  TAG = 'TAG',
}

export enum ScmSubmitRequestStatus {
  MERGED = 'MERGED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
}

export enum ScmLibScmType {
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
  ADO = 'ADO',
}

export type ScmRepoInfo = {
  repoName: string
  repoUrl: string
  repoOwner: string
  repoLanguages: string[]
  repoIsPublic: boolean
  repoUpdatedAt: string
}

export class InvalidRepoUrlError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class InvalidAccessTokenError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class InvalidUrlPatternError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class BadShaError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class RefNotFoundError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class RepoNoTokenAccessError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class RebaseFailedError extends Error {}

export abstract class SCMLib {
  protected readonly url?: string
  protected readonly accessToken?: string
  protected readonly scmOrg?: string

  protected constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined
  ) {
    this.accessToken = accessToken
    this.url = url
    this.scmOrg = scmOrg
  }

  public async getUrlWithCredentials() {
    if (!this.url) {
      console.error('no url for getUrlWithCredentials()')
      throw new Error('no url')
    }
    const trimmedUrl = this.url.trim().replace(/\/$/, '')
    if (!this.accessToken) {
      return trimmedUrl
    }

    const scmLibType = getScmLibTypeFromUrl(trimmedUrl)
    if (scmLibType === ScmLibScmType.ADO) {
      return `https://${this.accessToken}@${trimmedUrl
        .toLowerCase()
        .replace('https://', '')}`
    }

    const is_http = trimmedUrl.toLowerCase().startsWith('http://')
    const is_https = trimmedUrl.toLowerCase().startsWith('https://')
    const username = await this._getUsernameForAuthUrl()
    if (is_http) {
      return `http://${username}:${this.accessToken}@${trimmedUrl
        .toLowerCase()
        .replace('http://', '')}`
    } else if (is_https) {
      return `https://${username}:${this.accessToken}@${trimmedUrl
        .toLowerCase()
        .replace('https://', '')}`
    } else {
      console.error(`invalid scm url ${trimmedUrl}`)
      throw new Error(`invalid scm url ${trimmedUrl}`)
    }
  }

  abstract getAuthHeaders(): Record<string, string>

  abstract getDownloadUrl(sha: string): string

  abstract _getUsernameForAuthUrl(): Promise<string>

  abstract getIsRemoteBranch(_branch: string): Promise<boolean>

  abstract validateParams(): Promise<void>

  abstract getRepoList(scmOrg: string | undefined): Promise<ScmRepoInfo[]>

  abstract getBranchList(): Promise<string[]>

  abstract getUserHasAccessToRepo(): Promise<boolean>

  abstract getUsername(): Promise<string>

  abstract forkRepo(repoUrl: string): Promise<{ url: string | null }>

  abstract createOrUpdateRepositorySecret(
    params: { value: string; name: string },
    _oktokit?: Octokit
  ): Promise<{ url: string | null }>

  abstract createPullRequestWithNewFile(
    sourceRepoUrl: string,
    filesPaths: string[],
    userRepoUrl: string,
    title: string,
    body: string
  ): Promise<{ pull_request_url: string }>

  abstract getSubmitRequestStatus(
    _scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus>

  abstract createSubmitRequest(
    targetBranchName: string,
    sourceBranchName: string,
    title: string,
    body: string
  ): Promise<string>

  abstract getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<
    {
      startingLine: number
      endingLine: number
      name: string
      login: string
      email: string
    }[]
  >

  abstract getReferenceData(ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }>
  abstract getPrComment(commentId: number): Promise<GetPrCommentResponse>

  abstract updatePrComment(
    params: Pick<UpdateCommentParams, 'body' | 'comment_id'>,
    _oktokit?: Octokit
  ): Promise<UpdateCommentResponse>

  abstract getRepoDefaultBranch(): Promise<string>

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

  public static async getIsValidBranchName(
    branchName: string
  ): Promise<boolean> {
    return isValidBranchName(branchName)
  }

  public static async init({
    url,
    accessToken,
    scmType,
    scmOrg,
  }: {
    url: string | undefined
    accessToken: string | undefined
    scmType: ScmLibScmType | undefined
    scmOrg: string | undefined
  }): Promise<SCMLib> {
    let trimmedUrl = undefined
    if (url) {
      trimmedUrl = url.trim().replace(/\/$/, '')
    }
    try {
      if (ScmLibScmType.GITHUB === scmType) {
        const scm = new GithubSCMLib(trimmedUrl, accessToken, scmOrg)
        await scm.validateParams()
        return scm
      }
      if (ScmLibScmType.GITLAB === scmType) {
        const scm = new GitlabSCMLib(trimmedUrl, accessToken, scmOrg)
        await scm.validateParams()
        return scm
      }
      if (ScmLibScmType.ADO === scmType) {
        const scm = new AdoSCMLib(trimmedUrl, accessToken, scmOrg)
        await scm.validateParams()
        return scm
      }
    } catch (e) {
      if (e instanceof InvalidRepoUrlError && url) {
        throw new RepoNoTokenAccessError('no access to repo')
      }
    }

    return new StubSCMLib(trimmedUrl, undefined, undefined)
  }
}

export class AdoSCMLib extends SCMLib {
  updatePrComment(
    _params: Pick<UpdateCommentParams, 'body' | 'comment_id'>,
    _oktokit?: Octokit
  ): Promise<UpdateCommentResponse> {
    throw new Error('updatePrComment not implemented.')
  }
  getPrComment(_commentId: number): Promise<GetPrCommentResponse> {
    throw new Error('getPrComment not implemented.')
  }
  async forkRepo(): Promise<{ url: string | null }> {
    throw new Error('forkRepo not supported yet')
  }

  async createOrUpdateRepositorySecret(): Promise<{ url: string | null }> {
    throw new Error('createOrUpdateRepositorySecret not supported yet')
  }

  async createPullRequestWithNewFile(
    _sourceRepoUrl: string,
    _filesPaths: string[],
    _userRepoUrl: string,
    _title: string,
    _body: string
  ): Promise<{ pull_request_url: string }> {
    throw new Error('createPullRequestWithNewFile not supported yet')
  }
  async createSubmitRequest(
    targetBranchName: string,
    sourceBranchName: string,
    title: string,
    body: string
  ): Promise<string> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return String(
      await createAdoPullRequest({
        title,
        body,
        targetBranchName,
        sourceBranchName,
        repoUrl: this.url,
        accessToken: this.accessToken,
        tokenOrg: this.scmOrg,
      })
    )
  }

  async validateParams() {
    return adoValidateParams({
      url: this.url,
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
    })
  }

  async getRepoList(scmOrg: string | undefined): Promise<ScmRepoInfo[]> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getAdoRepoList({
      orgName: scmOrg,
      tokenOrg: this.scmOrg,
      accessToken: this.accessToken,
    })
  }

  async getBranchList(): Promise<string[]> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getAdoBranchList({
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
      repoUrl: this.url,
    })
  }

  getAuthHeaders(): Record<string, string> {
    if (this.accessToken) {
      if (getAdoTokenType(this.accessToken) === AdoTokenTypeEnum.OAUTH) {
        return {
          authorization: `Bearer ${this.accessToken}`,
        }
      } else {
        return {
          authorization: `Basic ${Buffer.from(':' + this.accessToken).toString(
            'base64'
          )}`,
        }
      }
    }
    return {}
  }

  getDownloadUrl(sha: string): string {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return getAdoDownloadUrl({ repoUrl: this.url, branch: sha })
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    throw new Error('_getUsernameForAuthUrl() is not relevant for ADO')
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getAdoIsRemoteBranch({
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
      repoUrl: this.url,
      branch,
    })
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getAdoIsUserCollaborator({
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
      repoUrl: this.url,
    })
  }

  async getUsername(): Promise<string> {
    throw new Error('getUsername() is not relevant for ADO')
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const state = await getAdoPullRequestStatus({
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
      repoUrl: this.url,
      prNumber: Number(scmSubmitRequestId),
    })
    switch (state) {
      case AdoPullRequestStatusEnum.completed:
        return ScmSubmitRequestStatus.MERGED
      case AdoPullRequestStatusEnum.active:
        return ScmSubmitRequestStatus.OPEN
      case AdoPullRequestStatusEnum.abandoned:
        return ScmSubmitRequestStatus.CLOSED
      default:
        throw new Error(`unknown state ${state}`)
    }
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
    return await getAdoBlameRanges()
  }

  async getReferenceData(ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getAdoReferenceData({
      ref,
      repoUrl: this.url,
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
    })
  }

  async getRepoDefaultBranch(): Promise<string> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getAdoRepoDefaultBranch({
      repoUrl: this.url,
      tokenOrg: this.scmOrg,
      accessToken: this.accessToken,
    })
  }
}

export class GitlabSCMLib extends SCMLib {
  async createSubmitRequest(
    targetBranchName: string,
    sourceBranchName: string,
    title: string,
    body: string
  ): Promise<string> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
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
  async forkRepo(): Promise<{ url: string | null }> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    throw new Error('not supported yet')
  }

  async createOrUpdateRepositorySecret(): Promise<{ url: string | null }> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    throw new Error('not supported yet')
  }

  async createPullRequestWithNewFile(
    _sourceRepoUrl: string,
    _filesPaths: string[],
    _userRepoUrl: string,
    _title: string,
    _body: string
  ): Promise<{ pull_request_url: string }> {
    throw new Error('not implemented')
  }

  async getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGitlabRepoList(this.accessToken)
  }

  async getBranchList(): Promise<string[]> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getGitlabBranchList({
      accessToken: this.accessToken,
      repoUrl: this.url,
    })
  }

  getAuthHeaders(): Record<string, string> {
    if (this?.accessToken?.startsWith('glpat-')) {
      return {
        'Private-Token': this.accessToken,
      }
    } else {
      return { authorization: `Bearer ${this.accessToken}` }
    }
  }

  getDownloadUrl(sha: string): string {
    const repoName = this.url?.split('/')[-1]
    return `${this.url}/-/archive/${sha}/${repoName}-${sha}.zip`
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    if (this?.accessToken?.startsWith('glpat-')) {
      return this.getUsername()
    } else {
      return 'oauth2'
    }
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getGitlabIsRemoteBranch({
      accessToken: this.accessToken,
      repoUrl: this.url,
      branch,
    })
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const username = await this.getUsername()
    return getGitlabIsUserCollaborator({
      username,
      accessToken: this.accessToken,
      repoUrl: this.url,
    })
  }

  async getUsername(): Promise<string> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGitlabUsername(this.accessToken)
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const state = await getGitlabMergeRequestStatus({
      accessToken: this.accessToken,
      repoUrl: this.url,
      mrNumber: Number(scmSubmitRequestId),
    })
    switch (state) {
      case GitlabMergeRequestStatusEnum.merged:
        return ScmSubmitRequestStatus.MERGED
      case GitlabMergeRequestStatusEnum.opened:
        return ScmSubmitRequestStatus.OPEN
      case GitlabMergeRequestStatusEnum.closed:
        return ScmSubmitRequestStatus.CLOSED
      default:
        throw new Error(`unknown state ${state}`)
    }
  }

  async getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<
    {
      startingLine: number
      endingLine: number
      name: string
      login: string
      email: string
    }[]
  > {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGitlabBlameRanges(
      { ref, path, gitlabUrl: this.url },
      {
        gitlabAuthToken: this.accessToken,
      }
    )
  }

  async getReferenceData(ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGitlabReferenceData(
      { ref, gitlabUrl: this.url },
      {
        gitlabAuthToken: this.accessToken,
      }
    )
  }

  async getRepoDefaultBranch(): Promise<string> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGitlabRepoDefaultBranch(this.url, {
      gitlabAuthToken: this.accessToken,
    })
  }
  getPrComment(_commentId: number): Promise<GetPrCommentResponse> {
    throw new Error('getPrComment not implemented.')
  }
  updatePrComment(
    _params: Pick<UpdateCommentParams, 'body' | 'comment_id'>,
    _oktokit?: Octokit
  ): Promise<UpdateCommentResponse> {
    throw new Error('updatePrComment not implemented.')
  }
}

export class GithubSCMLib extends SCMLib {
  public readonly oktokit: Octokit
  // we don't always need a url, what's important is that we have an access token
  constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined
  ) {
    super(url, accessToken, scmOrg)
    this.oktokit = new Octokit({ auth: accessToken })
  }
  async createSubmitRequest(
    targetBranchName: string,
    sourceBranchName: string,
    title: string,
    body: string
  ): Promise<string> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return String(
      await createPullRequest({
        title,
        body,
        targetBranchName,
        sourceBranchName,
        repoUrl: this.url,
        accessToken: this.accessToken,
      })
    )
  }

  async forkRepo(repoUrl: string): Promise<{ url: string | null }> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }

    return forkRepo({
      repoUrl: repoUrl,
      accessToken: this.accessToken,
    })
  }

  async createOrUpdateRepositorySecret(
    params: { value: string; name: string },
    _oktokit?: Octokit
  ) {
    if ((!_oktokit && !this.accessToken) || !this.url) {
      throw new Error('cannot delete comment without access token or url')
    }
    const oktokit = _oktokit || this.oktokit
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const { data: repositoryPublicKeyResponse } = await getARepositoryPublicKey(
      oktokit,
      {
        owner,
        repo,
      }
    )
    const { key_id, key } = repositoryPublicKeyResponse

    const encryptedValue = await encryptSecret(params.value, key)

    return createOrUpdateRepositorySecret(oktokit, {
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
    const { pull_request_url } = await createPr(
      {
        sourceRepoUrl,
        filesPaths,
        userRepoUrl,
        title,
        body,
      },
      {
        githubAuthToken: this.accessToken,
      }
    )
    return { pull_request_url: pull_request_url }
  }

  async validateParams() {
    return githubValidateParams(this.url, this.accessToken)
  }
  async postPrComment(
    params: Pick<
      PostCommentParams,
      'body' | 'commit_id' | 'pull_number' | 'path' | 'line'
    >,
    _oktokit?: Octokit
  ) {
    if ((!_oktokit && !this.accessToken) || !this.url) {
      throw new Error('cannot post on PR without access token or url')
    }
    const oktokit = _oktokit || this.oktokit
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    return postPrComment(oktokit, {
      ...params,
      owner,
      repo,
    })
  }
  async updatePrComment(
    params: Pick<UpdateCommentParams, 'body' | 'comment_id'>,
    _oktokit?: Octokit
  ): Promise<UpdateCommentResponse> {
    if ((!_oktokit && !this.accessToken) || !this.url) {
      throw new Error('cannot update on PR without access token or url')
    }
    const oktokit = _oktokit || this.oktokit
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    return updatePrComment(oktokit, {
      ...params,
      owner,
      repo,
    })
  }
  async deleteComment(
    params: Pick<DeleteCommentParams, 'comment_id'>,
    _oktokit?: Octokit
  ) {
    if ((!_oktokit && !this.accessToken) || !this.url) {
      throw new Error('cannot delete comment without access token or url')
    }
    const oktokit = _oktokit || this.oktokit
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return deleteComment(oktokit, {
      ...params,
      owner,
      repo,
    })
  }
  async getPrComments(
    params: Omit<GetPrCommentsParams, 'owner' | 'repo'>,
    _oktokit?: Octokit
  ) {
    if ((!_oktokit && !this.accessToken) || !this.url) {
      throw new Error('cannot get Pr Comments without access token or url')
    }
    const oktokit = _oktokit || this.oktokit
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return getPrComments(oktokit, {
      per_page: 100,
      ...params,
      owner,
      repo,
    })
  }
  async getPrDiff(params: Omit<GetPrParams, 'owner' | 'repo'>) {
    if (!this.accessToken || !this.url) {
      throw new Error('cannot get Pr Comments without access token or url')
    }
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const prRes = await getPrDiff(this.oktokit, {
      ...params,
      owner,
      repo,
    })
    // note: for some reason ocktokit does not know to return response as string
    // look at  'getPrDiff' implementation
    return z.string().parse(prRes.data)
  }

  async getRepoList(_scmOrg: string | undefined): Promise<ScmRepoInfo[]> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGithubRepoList(this.accessToken)
  }

  async getBranchList(): Promise<string[]> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getGithubBranchList(this.accessToken, this.url)
  }

  getAuthHeaders(): Record<string, string> {
    if (this.accessToken) {
      return { authorization: `Bearer ${this.accessToken}` }
    }
    return {}
  }

  getDownloadUrl(sha: string): string {
    return `${this.url}/zipball/${sha}`
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    return this.getUsername()
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    return getGithubIsRemoteBranch(this.accessToken, this.url, branch)
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const username = await this.getUsername()
    return getGithubIsUserCollaborator(username, this.accessToken, this.url)
  }

  async getUsername(): Promise<string> {
    if (!this.accessToken) {
      console.error('no access token')
      throw new Error('no access token')
    }
    return getGithubUsername(this.accessToken)
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    if (!this.accessToken || !this.url) {
      console.error('no access token or no url')
      throw new Error('no access token or no url')
    }
    const state = await getGithubPullRequestStatus(
      this.accessToken,
      this.url,
      Number(scmSubmitRequestId)
    )
    if (state === 'merged') {
      return ScmSubmitRequestStatus.MERGED
    }
    if (state === 'open') {
      return ScmSubmitRequestStatus.OPEN
    }
    if (state === 'draft') {
      return ScmSubmitRequestStatus.DRAFT
    }
    if (state === 'closed') {
      return ScmSubmitRequestStatus.CLOSED
    }
    throw new Error(`unknown state ${state}`)
  }

  async getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<
    {
      startingLine: number
      endingLine: number
      name: string
      login: string
      email: string
    }[]
  > {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGithubBlameRanges(
      { ref, path, gitHubUrl: this.url },
      {
        githubAuthToken: this.accessToken,
      }
    )
  }

  async getReferenceData(ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGithubReferenceData(
      { ref, gitHubUrl: this.url },
      {
        githubAuthToken: this.accessToken,
      }
    )
  }
  async getPrComment(commentId: number): Promise<GetPrCommentResponse> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }

    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return await getPrComment(this.oktokit, {
      repo,
      owner,
      comment_id: commentId,
    })
  }

  async getRepoDefaultBranch(): Promise<string> {
    if (!this.url) {
      console.error('no url')
      throw new Error('no url')
    }
    return await getGithubRepoDefaultBranch(this.url, {
      githubAuthToken: this.accessToken,
    })
  }
}

export class StubSCMLib extends SCMLib {
  async createSubmitRequest(
    _targetBranchName: string,
    _sourceBranchName: string,
    _title: string,
    _body: string
  ): Promise<string> {
    console.error('createSubmitRequest() not implemented')
    throw new Error('createSubmitRequest() not implemented')
  }

  getAuthHeaders(): Record<string, string> {
    console.error('getAuthHeaders() not implemented')
    throw new Error('getAuthHeaders() not implemented')
  }

  getDownloadUrl(_sha: string): string {
    console.error('getDownloadUrl() not implemented')
    throw new Error('getDownloadUrl() not implemented')
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    console.error('_getUsernameForAuthUrl() not implemented')
    throw new Error('_getUsernameForAuthUrl() not implemented')
  }

  async getIsRemoteBranch(_branch: string): Promise<boolean> {
    console.error('getIsRemoteBranch() not implemented')
    throw new Error('getIsRemoteBranch() not implemented')
  }

  async validateParams() {
    console.error('validateParams() not implemented')
    throw new Error('validateParams() not implemented')
  }

  async forkRepo(): Promise<{ url: string | null }> {
    console.error('forkRepo() not implemented')
    throw new Error('forkRepo() not implemented')
  }
  async createOrUpdateRepositorySecret(): Promise<{ url: string | null }> {
    console.error('forkRepo() not implemented')
    throw new Error('forkRepo() not implemented')
  }

  async createPullRequestWithNewFile(
    _sourceRepoUrl: string,
    _filesPaths: string[],
    _userRepoUrl: string,
    _title: string,
    _body: string
  ): Promise<{ pull_request_url: string }> {
    console.error('createPullRequestWithNewFile() not implemented')
    throw new Error('createPullRequestWithNewFile() not implemented')
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

  async getReferenceData(_ref: string): Promise<{
    type: ReferenceType
    sha: string
    date: Date | undefined
  }> {
    console.error('getReferenceData() not implemented')
    throw new Error('getReferenceData() not implemented')
  }

  async getRepoDefaultBranch(): Promise<string> {
    console.error('getRepoDefaultBranch() not implemented')
    throw new Error('getRepoDefaultBranch() not implemented')
  }
  async getPrComment(_commentId: number): Promise<GetPrCommentResponse> {
    console.error('getPrComment() not implemented')
    throw new Error('getPrComment() not implemented')
  }
  async updatePrComment(): Promise<UpdateCommentResponse> {
    console.error('updatePrComment() not implemented')
    throw new Error('updatePrComment() not implemented')
  }
}
