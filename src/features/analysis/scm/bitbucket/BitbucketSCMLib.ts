import { setTimeout } from 'node:timers/promises'

import { z } from 'zod'

import { buildAuthorizedRepoUrl } from '../'
import { InvalidRepoUrlError } from '../errors'
import { SCMLib } from '../scm'
import { parseScmURL, ScmType } from '../shared/src'
import { CreateSubmitRequestParams, GetRefererenceResult } from '../types'
import {
  GetGitBlameReponse,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
} from '../types'
import {
  getBitbucketSdk,
  parseBitbucketOrganizationAndRepo,
  validateBitbucketParams,
} from './bitbucket'

function getUserAndPassword(token: string) {
  const [username, password] = token.split(':')
  const safePasswordAndUsername = z
    .object({ username: z.string(), password: z.string() })
    .parse({ username, password })
  return {
    username: safePasswordAndUsername.username,
    password: safePasswordAndUsername.password,
  }
}

function createBitbucketSdk(token?: string) {
  if (!token) {
    return getBitbucketSdk({ authType: 'public' })
  }
  if (token.includes(':')) {
    const { password, username } = getUserAndPassword(token)
    return getBitbucketSdk({
      authType: 'basic',
      username,
      password,
    })
  }
  return getBitbucketSdk({ authType: 'token', token })
}

export class BitbucketSCMLib extends SCMLib {
  private bitbucketSdk: ReturnType<typeof getBitbucketSdk>
  constructor(
    url: string | undefined,
    accessToken: string | undefined,
    scmOrg: string | undefined
  ) {
    super(url, accessToken, scmOrg)

    const bitbucketSdk = createBitbucketSdk(accessToken)
    this.bitbucketSdk = bitbucketSdk
  }

  public override async getUrlWithCredentials() {
    if (!this.url) {
      console.error('no url for getUrlWithCredentials()')
      throw new Error('no url')
    }
    const trimmedUrl = this.url.trim().replace(/\/$/, '')
    const accessToken = this.getAccessToken()
    if (!accessToken) {
      return trimmedUrl
    }

    const authData = this.getAuthData()
    const parseScmURLRes = parseScmURL(trimmedUrl, ScmType.Bitbucket)
    if (!parseScmURLRes) {
      throw new InvalidRepoUrlError('invalid repo url')
    }
    const { protocol, hostname, organization, repoName } = parseScmURLRes
    const url = `${protocol}//${hostname}/${organization}/${repoName}`
    switch (authData.authType) {
      case 'public': {
        return trimmedUrl
      }
      case 'token': {
        const { token } = authData
        const username = await this._getUsernameForAuthUrl()

        return buildAuthorizedRepoUrl({
          url,
          username,
          password: token,
        })
      }
      case 'basic': {
        const { username, password } = authData
        return buildAuthorizedRepoUrl({ url, username, password })
      }
    }
  }

  getAuthData() {
    const authType = this.bitbucketSdk.getAuthType()
    switch (authType) {
      case 'basic': {
        this._validateAccessToken()
        const { username, password } = getUserAndPassword(this.accessToken)
        return { username, password, authType }
      }
      case 'token': {
        return { authType, token: z.string().parse(this.accessToken) }
      }
      case 'public':
        return { authType }
    }
  }

  async createSubmitRequest(
    params: CreateSubmitRequestParams
  ): Promise<string> {
    this._validateAccessTokenAndUrl()
    //do 5 retries before giving up - we noticed that the bitbucket API sometimes is not responsive
    for (let i = 0; i < 5; i++) {
      try {
        const pullRequestRes = await this.bitbucketSdk.createPullRequest({
          ...params,
          repoUrl: this.url,
        })
        return String(z.number().parse(pullRequestRes.id))
      } catch (e) {
        console.warn(
          `error creating pull request for BB. Try number ${i + 1}`,
          e
        )
        await setTimeout(1000)
        if (4 === i) {
          console.error('error creating pull request for BB', e)
          throw e
        }
      }
    }
    throw new Error('error creating pull request for BB, should not reach here')
  }

  async validateParams() {
    return validateBitbucketParams({
      bitbucketClient: this.bitbucketSdk,
      url: this.url,
    })
  }

  async getRepoList(scmOrg: string | undefined): Promise<ScmRepoInfo[]> {
    this._validateAccessToken()
    return this.bitbucketSdk.getRepos({
      workspaceSlug: scmOrg,
    })
  }

  async getBranchList(): Promise<string[]> {
    this._validateAccessTokenAndUrl()
    return this.bitbucketSdk.getBranchList({
      repoUrl: this.url,
    })
  }

  get scmLibType(): ScmLibScmType {
    return ScmLibScmType.BITBUCKET
  }

  getAuthHeaders(): Record<string, string> {
    const authType = this.bitbucketSdk.getAuthType()
    switch (authType) {
      case 'public':
        return {}
      case 'token':
        return { authorization: `Bearer ${this.accessToken}` }
      case 'basic': {
        this._validateAccessToken()
        const { username, password } = getUserAndPassword(this.accessToken)

        return {
          authorization: `Basic ${Buffer.from(
            username + ':' + password
          ).toString('base64')}`,
        }
      }
    }
  }

  async getDownloadUrl(sha: string): Promise<string> {
    this._validateUrl()
    return this.bitbucketSdk.getDownloadUrl({ url: this.url, sha })
  }

  async _getUsernameForAuthUrl(): Promise<string> {
    this._validateAccessTokenAndUrl()
    const user = await this.bitbucketSdk.getUser()
    if (!user.username) {
      throw new Error('no username found')
    }
    return user.username
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    this._validateAccessTokenAndUrl()
    try {
      const res = await this.bitbucketSdk.getBranch({
        branchName: branch,
        repoUrl: this.url,
      })
      return res.name === branch
    } catch (e) {
      return false
    }
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    this._validateAccessTokenAndUrl()
    return this.bitbucketSdk.getIsUserCollaborator({ repoUrl: this.url })
  }

  async getUsername(): Promise<string> {
    this._validateAccessToken()
    const res = await this.bitbucketSdk.getUser()
    return z.string().parse(res.username)
  }

  async getSubmitRequestStatus(
    _scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    this._validateAccessTokenAndUrl()
    const pullRequestRes = await this.bitbucketSdk.getPullRequest({
      prNumber: Number(_scmSubmitRequestId),
      url: this.url,
    })
    switch (pullRequestRes.state) {
      case 'OPEN':
        return 'open'
      case 'MERGED':
        return 'merged'
      case 'DECLINED':
        return 'closed'
      default:
        throw new Error(`unknown state ${pullRequestRes.state} `)
    }
  }

  async getRepoBlameRanges(
    _ref: string,
    _path: string
  ): Promise<GetGitBlameReponse> {
    // note: bitbucket does not have blame ranges support
    return []
  }

  async getReferenceData(ref: string): Promise<GetRefererenceResult> {
    this._validateUrl()
    return this.bitbucketSdk.getReferenceData({ url: this.url, ref })
  }

  async getRepoDefaultBranch(): Promise<string> {
    this._validateUrl()
    const repoRes = await this.bitbucketSdk.getRepo({ repoUrl: this.url })
    return z.string().parse(repoRes.mainbranch?.name)
  }
  getSubmitRequestUrl(submitRequestId: number): Promise<string> {
    this._validateUrl()
    const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(this.url)
    return Promise.resolve(
      `https://bitbucket.org/${workspace}/${repo_slug}/pull-requests/${submitRequestId}`
    )
  }
  async getSubmitRequestId(submitRequestUrl: string): Promise<string> {
    const match = submitRequestUrl.match(/\/pull-requests\/(\d+)/)
    return match?.[1] || ''
  }
  getCommitUrl(commitId: string): Promise<string> {
    this._validateUrl()
    const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(this.url)
    return Promise.resolve(
      `https://bitbucket.org/${workspace}/${repo_slug}/commits/${commitId}`
    )
  }

  getBranchCommitsUrl(branchName: string): Promise<string> {
    this._validateUrl()
    const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(this.url)
    return Promise.resolve(
      `https://bitbucket.org/${workspace}/${repo_slug}/branch/${branchName}`
    )
  }

  async addCommentToSubmitRequest(
    submitRequestId: string,
    comment: string
  ): Promise<void> {
    this._validateUrl()
    await this.bitbucketSdk.addCommentToPullRequest({
      prNumber: Number(submitRequestId),
      url: this.url,
      markdownComment: comment,
    })
  }
}
