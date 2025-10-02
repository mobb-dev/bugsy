import { setTimeout } from 'node:timers/promises'

import { InvalidAccessTokenError } from '../errors'
import { SCMLib } from '../scm'
import { scmCloudUrl } from '../shared/src'
import { CreateSubmitRequestParams, GetRefererenceResult } from '../types'
import {
  GetCommitDiffResult,
  GetGitBlameReponse,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
} from '../types'
import {
  AdoPullRequestStatus,
  adoValidateParams,
  getAdoClientParams,
  getAdoTokenInfo,
} from './'
import { getAdoRepoList, getAdoSdk } from './ado'

export type GetAdoSdkPromise = ReturnType<typeof getAdoSdk>

async function initAdoSdk(params: {
  url: string | undefined
  accessToken: string | undefined
  scmOrg: string | undefined
}) {
  const { url, accessToken, scmOrg } = params
  const adoClientParams = await getAdoClientParams({
    tokenOrg: scmOrg,
    accessToken,
    url,
  })
  return getAdoSdk(adoClientParams)
}

export class AdoSCMLib extends SCMLib {
  public readonly _adoSdkPromise?: GetAdoSdkPromise

  constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined
  ) {
    super(url, accessToken, scmOrg)
    this._adoSdkPromise = initAdoSdk({ accessToken, url, scmOrg })
  }
  async getAdoSdk(): GetAdoSdkPromise {
    if (!this._adoSdkPromise) {
      console.error('ado sdk was not initialized')
      throw new InvalidAccessTokenError('ado sdk was not initialized')
    }
    return this._adoSdkPromise
  }
  async createSubmitRequest(
    params: CreateSubmitRequestParams
  ): Promise<string> {
    this._validateAccessTokenAndUrl()
    //do 5 retries before giving up - we noticed that the ADO API sometimes is not responsive
    for (let i = 0; i < 5; i++) {
      try {
        const { targetBranchName, sourceBranchName, title, body } = params
        const adoSdk = await this.getAdoSdk()
        const pullRequestId = await adoSdk.createAdoPullRequest({
          title,
          body,
          targetBranchName,
          sourceBranchName,
          repoUrl: this.url,
        })
        return String(pullRequestId)
      } catch (e) {
        console.warn(
          `error creating pull request for ADO. Try number ${i + 1}`,
          e
        )
        await setTimeout(1000)
        if (4 === i) {
          console.error('error creating pull request for ADO', e)
          throw e
        }
      }
    }
    throw new Error(
      'error creating pull request for ADO, should not reach here'
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
    this._validateAccessToken()
    if (this.url && new URL(this.url).origin !== scmCloudUrl.Ado) {
      throw new Error(
        `Oauth token is not supported for ADO on prem - ${origin} `
      )
    }
    return getAdoRepoList({
      orgName: scmOrg,
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
    })
  }

  async getBranchList(): Promise<string[]> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoBranchList({
      repoUrl: this.url,
    })
  }

  get scmLibType(): ScmLibScmType {
    return ScmLibScmType.ADO
  }

  getAuthHeaders(): Record<string, string> {
    if (this.accessToken) {
      if (getAdoTokenInfo(this.accessToken).type === 'OAUTH') {
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

  async getDownloadUrl(sha: string): Promise<string> {
    this._validateUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoDownloadUrl({ repoUrl: this.url, branch: sha })
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    throw new Error('_getUsernameForAuthUrl() is not relevant for ADO')
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoIsRemoteBranch({
      repoUrl: this.url,
      branch,
    })
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoIsUserCollaborator({
      repoUrl: this.url,
    })
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    const state = await adoSdk.getAdoPullRequestStatus({
      repoUrl: this.url,
      prNumber: Number(scmSubmitRequestId),
    })
    switch (state) {
      case AdoPullRequestStatus.Completed:
        return 'merged'
      case AdoPullRequestStatus.Active:
        return 'open'
      case AdoPullRequestStatus.Abandoned:
        return 'closed'
      default:
        throw new Error(`unknown state ${state}`)
    }
  }

  async getRepoBlameRanges(
    _ref: string,
    _path: string
  ): Promise<GetGitBlameReponse> {
    const adoSdk = await this.getAdoSdk()
    return await adoSdk.getAdoBlameRanges()
  }

  async getReferenceData(ref: string): Promise<GetRefererenceResult> {
    this._validateUrl()
    const adoSdk = await this.getAdoSdk()
    return await adoSdk.getAdoReferenceData({
      ref,
      repoUrl: this.url,
    })
  }

  async getRepoDefaultBranch(): Promise<string> {
    this._validateUrl()
    const adoSdk = await this.getAdoSdk()
    return await adoSdk.getAdoRepoDefaultBranch({
      repoUrl: this.url,
    })
  }
  async getSubmitRequestUrl(submitRequestIdNumber: number): Promise<string> {
    this._validateUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoPrUrl({
      url: this.url,
      prNumber: submitRequestIdNumber,
    })
  }
  async getSubmitRequestId(submitRequestUrl: string): Promise<string> {
    const match = submitRequestUrl.match(/\/pullrequest\/(\d+)/)
    return match?.[1] || ''
  }
  async getCommitUrl(commitId: string): Promise<string> {
    this._validateUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoCommitUrl({
      url: this.url,
      commitId,
    })
  }
  async getBranchCommitsUrl(branchName: string): Promise<string> {
    this._validateUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoBranchCommitsUrl({
      repoUrl: this.url,
      branch: branchName,
    })
  }

  async addCommentToSubmitRequest(
    scmSubmitRequestId: string,
    comment: string
  ): Promise<void> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    await adoSdk.addCommentToAdoPullRequest({
      repoUrl: this.url,
      prNumber: Number(scmSubmitRequestId),
      markdownComment: comment,
    })
  }

  async getCommitDiff(_commitSha: string): Promise<GetCommitDiffResult> {
    throw new Error('getCommitDiff not implemented for ADO')
  }
}
