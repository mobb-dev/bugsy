import { z } from 'zod'

import { InvalidRepoUrlError } from '../errors'
import { SCMLib } from '../scm'
import { parseScmURL, ScmType } from '../shared/src'
import {
  CreateSubmitRequestParams,
  GetGitBlameReponse,
  GetRefererenceResult,
  PostPRReviewCommentParams,
  SCMDeleteGeneralPrCommentParams,
  SCMDeleteGeneralPrReviewResponse,
  SCMGetPrReviewCommentsParams,
  SCMGetPrReviewCommentsResponse,
  ScmLibScmType,
  SCMPostGeneralPrCommentsResponse,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
} from '../types'
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
  GetPrParams,
  PostCommentParams,
  UpdateCommentParams,
  UpdateCommentResponse,
} from './types'
import { encryptSecret } from './utils/encrypt_secret'

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
    // note: for some reason ocktokit does not know to return response as string
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

  async getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<GetGitBlameReponse> {
    this._validateUrl()
    return await this.githubSdk.getGithubBlameRanges({
      ref,
      path,
      gitHubUrl: this.url,
    })
  }

  async getReferenceData(ref: string): Promise<GetRefererenceResult> {
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
}
