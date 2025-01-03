import { setTimeout } from 'node:timers/promises'

import { z } from 'zod'

import {
  AdoPullRequestStatus,
  adoValidateParams,
  getAdoClientParams,
  getAdoTokenInfo,
} from './ado'
import { getAdoRepoList, getAdoSdk } from './ado/ado'
import {
  getBitbucketSdk,
  parseBitbucketOrganizationAndRepo,
  validateBitbucketParams,
} from './bitbucket'
import {
  getGithubSdk,
  githubValidateParams,
  isGithubOnPrem,
  parseGithubOwnerAndRepo,
} from './github'
import {
  DeleteCommentParams,
  DeleteGeneralPrCommentResponse,
  GetGeneralPrCommentResponse,
  GetPrCommentResponse,
  GetPrCommentsParams,
  GetPrParams,
  PostCommentParams,
  PostGeneralPrCommentResponse,
  UpdateCommentParams,
  UpdateCommentResponse,
} from './github/types'
import { encryptSecret } from './github/utils/encrypt_secret'
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
} from './gitlab/gitlab'
import { isValidBranchName } from './scmSubmit'
import { parseScmURL, scmCloudUrl, ScmType } from './shared/src'
import {
  GetAdoSdkPromise,
  GetGitBlameReponse,
  ReferenceType,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
} from './types'

export function isBrokerUrl(url: string) {
  return z.string().uuid().safeParse(new URL(url).host).success
}

export type ScmConfig = {
  id: string
  orgId?: string | null
  refreshToken?: string | null
  scmOrg?: string | null | undefined
  scmType: string
  scmUrl: string
  scmUsername?: string | null
  token?: string | null
  tokenLastUpdate?: string | null
  userId?: string | null
  isTokenAvailable: boolean
}

export const GetRefererenceResultZ = z.object({
  date: z.date().optional(),
  sha: z.string(),
  type: z.nativeEnum(ReferenceType),
})

export type GetRefererenceResult = z.infer<typeof GetRefererenceResultZ>

export function getCloudScmLibTypeFromUrl(
  url: string | undefined
): ScmLibScmType | undefined {
  if (!url) {
    return undefined
  }
  const urlObject = new URL(url)
  const hostname = urlObject.hostname.toLowerCase()
  if (hostname === scmCloudHostname.GitLab) {
    return ScmLibScmType.GITLAB
  }
  if (hostname === scmCloudHostname.GitHub) {
    return ScmLibScmType.GITHUB
  }
  if (
    hostname === scmCloudHostname.Ado ||
    hostname.endsWith('.visualstudio.com')
  ) {
    return ScmLibScmType.ADO
  }
  if (hostname === scmCloudHostname.Bitbucket) {
    return ScmLibScmType.BITBUCKET
  }

  return undefined
}

export const scmCloudHostname: Record<ScmType, string> = {
  [ScmType.GitLab]: new URL(scmCloudUrl.GitLab).hostname,
  [ScmType.GitHub]: new URL(scmCloudUrl.GitHub).hostname,
  [ScmType.Ado]: new URL(scmCloudUrl.Ado).hostname,
  [ScmType.Bitbucket]: new URL(scmCloudUrl.Bitbucket).hostname,
} as const

export const scmLibScmTypeToScmType: Record<ScmLibScmType, ScmType> = {
  [ScmLibScmType.GITLAB]: ScmType.GitLab,
  [ScmLibScmType.GITHUB]: ScmType.GitHub,
  [ScmLibScmType.ADO]: ScmType.Ado,
  [ScmLibScmType.BITBUCKET]: ScmType.Bitbucket,
} as const

export const scmTypeToScmLibScmType: Record<ScmType, ScmLibScmType> = {
  [ScmType.GitLab]: ScmLibScmType.GITLAB,
  [ScmType.GitHub]: ScmLibScmType.GITHUB,
  [ScmType.Ado]: ScmLibScmType.ADO,
  [ScmType.Bitbucket]: ScmLibScmType.BITBUCKET,
} as const

export function getScmTypeFromScmLibType(
  scmLibType: string | null | undefined
) {
  const parsedScmLibType = z.nativeEnum(ScmLibScmType).parse(scmLibType)
  return scmLibScmTypeToScmType[parsedScmLibType]
}

export function getScmLibTypeFromScmType(scmType: string | null | undefined) {
  const parsedScmType = z.nativeEnum(ScmType).parse(scmType)
  return scmTypeToScmLibScmType[parsedScmType]
}

export function getScmConfig({
  url,
  scmConfigs,
  brokerHosts,
  includeOrgTokens = true,
}: {
  url: string
  scmConfigs: ScmConfig[]
  brokerHosts: {
    virtualDomain: string
    realDomain: string
  }[]
  includeOrgTokens?: boolean
}) {
  const urlObject = new URL(url)
  const filteredScmConfigs = scmConfigs.filter((scm) => {
    const configUrl = new URL(scm.scmUrl)
    return (
      //if we the user does an ADO oauth flow then the token is saved for dev.azure.com but
      //sometimes the user uses the url dev.azure.com and sometimes the url visualstudio.com
      //so we need to check both
      (urlObject.hostname.toLowerCase() === configUrl.hostname.toLowerCase() ||
        (urlObject.hostname.toLowerCase().endsWith('.visualstudio.com') &&
          configUrl.hostname.toLowerCase() === 'dev.azure.com')) &&
      urlObject.protocol === configUrl.protocol &&
      urlObject.port === configUrl.port
    )
  })
  const filteredBrokerHosts = brokerHosts.filter((broker) => {
    const urlObject = new URL(url)
    return urlObject.hostname.toLowerCase() === broker.realDomain.toLowerCase()
  })
  //TODO: This is a hack for now. We go over the broker hosts configurations for all the organizations the user is part of.
  //It doesn't match the organization context of the current user action with the broker host configuration as we don't have organization context
  //in most API calls. We have to fix it and provide organization context to the API calls.
  //It is even more critical if the unlikely situation happens that the user is part of multiple organizations with different broker configurations for the same target host.
  //In this case, we will return the first broker host configuration that matches the target host regardless of the organization context.
  const virtualDomain = filteredBrokerHosts[0]?.virtualDomain
  const virtualUrl = virtualDomain
    ? `https://${virtualDomain}${urlObject.pathname}${urlObject.search}`
    : undefined
  const scmOrgConfig = filteredScmConfigs.find((scm) => scm.orgId && scm.token)
  if (scmOrgConfig && includeOrgTokens) {
    return {
      id: scmOrgConfig.id,
      accessToken: scmOrgConfig.token || undefined,
      scmLibType: getScmLibTypeFromScmType(scmOrgConfig.scmType),
      scmOrg: scmOrgConfig.scmOrg || undefined,
      virtualUrl,
    }
  }
  const scmUserConfig = filteredScmConfigs.find(
    (scm) => scm.userId && scm.token
  )
  if (scmUserConfig) {
    return {
      id: scmUserConfig.id,
      accessToken: scmUserConfig.token || undefined,
      scmLibType: getScmLibTypeFromScmType(scmUserConfig.scmType),
      scmOrg: scmUserConfig.scmOrg || undefined,
      virtualUrl,
    }
  }
  const type = getCloudScmLibTypeFromUrl(url)
  if (type) {
    return {
      id: undefined,
      accessToken: undefined,
      scmLibType: type,
      scmOrg: undefined,
      virtualUrl,
    }
  }
  return {
    id: undefined,
    accessToken: undefined,
    scmLibType: undefined,
    scmOrg: undefined,
    virtualUrl,
  }
}

type PostPRReviewCommentParams = {
  prNumber: number
  body: string
}
type SCMGetPrReviewCommentsParams = {
  prNumber: number
}
type SCMGetPrReviewCommentsResponse = Promise<GetGeneralPrCommentResponse>
type SCMPostGeneralPrCommentsResponse = Promise<PostGeneralPrCommentResponse>
type SCMDeleteGeneralPrCommentParams = {
  commentId: number
}

type SCMDeleteGeneralPrReviewResponse = Promise<DeleteGeneralPrCommentResponse>

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
export class ScmBadCredentialsError extends Error {
  constructor(m: string) {
    super(m)
  }
}

export class RepoNoTokenAccessError extends Error {
  constructor(
    m: string,
    public scmType: ScmType
  ) {
    super(m)
  }
}

type CreateSubmitRequestParams = {
  targetBranchName: string
  sourceBranchName: string
  title: string
  body: string
}

// todo: scmOrg is only relevant for ADO
// we should covert this to union type

export type ScmInitParams = {
  url: string | undefined
  accessToken: string | undefined
  scmType: ScmLibScmType | undefined

  scmOrg?: string
}

function buildAuthorizedRepoUrl(args: {
  url: string
  username: string
  password: string
}) {
  const { url, username, password } = args
  const is_http = url.toLowerCase().startsWith('http://')
  const is_https = url.toLowerCase().startsWith('https://')
  // note: check the url when using the scm agent with personal access token

  if (is_http) {
    return `http://${username}:${password}@${url
      .toLowerCase()
      .replace('http://', '')}`
  } else if (is_https) {
    return `https://${username}:${password}@${url
      .toLowerCase()
      .replace('https://', '')}`
  } else {
    console.error(`invalid scm url ${url}`)
    throw new Error(`invalid scm url ${url}`)
  }
}

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
    const accessToken = this.getAccessToken()
    if (!accessToken) {
      return trimmedUrl
    }

    const scmLibType = this.getScmLibType()
    if (scmLibType === ScmLibScmType.ADO) {
      const { host, protocol, pathname } = new URL(trimmedUrl)

      return `${protocol}//${accessToken}@${host}${pathname}`
    }
    if (this instanceof BitbucketSCMLib) {
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

    //In Gitlab, when using a repo URL without the .git suffix, the server will return a redirect to the URL with the .git suffix.
    //In case we are using a broker, then we use virtual domain/host but the redirect is still to the real domain/host.
    //Therefore, we need to add the .git suffix to the URL in order to avoid this redirect in the first place.
    const finalUrl =
      scmLibType === ScmLibScmType.GITLAB ? `${trimmedUrl}.git` : trimmedUrl

    const username = await this._getUsernameForAuthUrl()
    return buildAuthorizedRepoUrl({
      url: finalUrl,
      username,
      password: accessToken,
    })
  }

  abstract getScmLibType(): ScmLibScmType

  abstract getAuthHeaders(): Record<string, string>

  abstract getDownloadUrl(sha: string): Promise<string>

  abstract getIsRemoteBranch(_branch: string): Promise<boolean>

  abstract validateParams(): Promise<void>

  abstract getRepoList(scmOrg: string | undefined): Promise<ScmRepoInfo[]>

  abstract getBranchList(): Promise<string[]>

  abstract getUserHasAccessToRepo(): Promise<boolean>

  abstract _getUsernameForAuthUrl(): Promise<string>

  abstract getSubmitRequestStatus(
    _scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus>

  abstract createSubmitRequest(args: CreateSubmitRequestParams): Promise<string>

  abstract getRepoBlameRanges(
    ref: string,
    path: string
  ): Promise<GetGitBlameReponse>

  abstract getReferenceData(ref: string): Promise<GetRefererenceResult>
  abstract getPrUrl(prNumber: number): Promise<string>
  abstract getCommitUrl(commitId: string): Promise<string>

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

  public static async init(
    { url, accessToken, scmType, scmOrg }: ScmInitParams,
    { propagateExceptions = false } = {}
  ): Promise<SCMLib> {
    const trimmedUrl = url
      ? url.trim().replace(/\/$/, '').replace(/.git$/i, '')
      : undefined
    try {
      switch (scmType) {
        case ScmLibScmType.GITHUB: {
          const scm = new GithubSCMLib(trimmedUrl, accessToken, scmOrg)
          await scm.validateParams()
          return scm
        }
        case ScmLibScmType.GITLAB: {
          const scm = new GitlabSCMLib(trimmedUrl, accessToken, scmOrg)
          await scm.validateParams()
          return scm
        }
        case ScmLibScmType.ADO: {
          const scm = new AdoSCMLib(trimmedUrl, accessToken, scmOrg)
          // we make async contrator here, which can cause uncaught promise rejection
          // we consume the promise here to make sure we catch the error
          // todo: we should move this async logic out of the contructor
          await scm.getAdoSdk()
          await scm.validateParams()
          return scm
        }
        case ScmLibScmType.BITBUCKET: {
          const scm = new BitbucketSCMLib(trimmedUrl, accessToken, scmOrg)
          await scm.validateParams()
          return scm
        }
      }
    } catch (e) {
      if (e instanceof InvalidRepoUrlError && url) {
        throw new RepoNoTokenAccessError(
          'no access to repo',
          scmLibScmTypeToScmType[z.nativeEnum(ScmLibScmType).parse(scmType)]
        )
      }
      console.error(`error validating scm: ${scmType} `, e)
      if (propagateExceptions) {
        throw e
      }
    }

    return new StubSCMLib(trimmedUrl, undefined, undefined)
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

  getScmLibType(): ScmLibScmType {
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
  async getPrUrl(prNumber: number): Promise<string> {
    this._validateUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoPrUrl({
      url: this.url,
      prNumber,
    })
  }
  async getCommitUrl(commitId: string): Promise<string> {
    this._validateUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoCommitUrl({
      url: this.url,
      commitId,
    })
  }
}

export class GitlabSCMLib extends SCMLib {
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

  getScmLibType(): ScmLibScmType {
    return ScmLibScmType.GITLAB
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

  getDownloadUrl(sha: string): Promise<string> {
    const urlSplit: string[] = this.url?.split('/') || []
    const repoName = urlSplit[urlSplit?.length - 1]
    return Promise.resolve(
      `${this.url}/-/archive/${sha}/${repoName}-${sha}.zip`
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
    return this.githubSdk.forkRepo({
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
    return this.githubSdk.createOrUpdateRepositorySecret({
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
    return githubValidateParams(this.url, this.accessToken)
  }
  async postPrComment(
    params: Pick<
      PostCommentParams,
      'body' | 'commit_id' | 'pull_number' | 'path' | 'line'
    >
  ) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return this.githubSdk.postPrComment({
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
    return this.githubSdk.updatePrComment({
      ...params,
      owner,
      repo,
    })
  }
  async deleteComment(params: Pick<DeleteCommentParams, 'comment_id'>) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return this.githubSdk.deleteComment({
      ...params,
      owner,
      repo,
    })
  }
  async getPrComments(params: Omit<GetPrCommentsParams, 'owner' | 'repo'>) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    return this.githubSdk.getPrComments({
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
    return this.githubSdk.getGithubRepoList()
  }

  async getBranchList(): Promise<string[]> {
    this._validateAccessTokenAndUrl()
    const branches = await this.githubSdk.getGithubBranchList(this.url)
    return branches.data.map((branch) => branch.name)
  }

  getScmLibType(): ScmLibScmType {
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
    return this.getUsername()
  }

  async getIsRemoteBranch(branch: string): Promise<boolean> {
    this._validateUrl()
    return this.githubSdk.getGithubIsRemoteBranch({ branch, repoUrl: this.url })
  }

  async getUserHasAccessToRepo(): Promise<boolean> {
    this._validateAccessTokenAndUrl()
    const username = await this.getUsername()
    return this.githubSdk.getGithubIsUserCollaborator({
      repoUrl: this.url,
      username,
    })
  }

  async getUsername(): Promise<string> {
    this._validateAccessToken()
    return this.githubSdk.getGithubUsername()
  }

  async getSubmitRequestStatus(
    scmSubmitRequestId: string
  ): Promise<ScmSubmitRequestStatus> {
    this._validateAccessTokenAndUrl()
    return this.githubSdk.getGithubPullRequestStatus({
      repoUrl: this.url,
      prNumber: Number(scmSubmitRequestId),
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
    return this.githubSdk.getGithubReferenceData({ ref, gitHubUrl: this.url })
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
  async getPrUrl(prNumber: number): Promise<string> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const getPrRes = await this.githubSdk.getPr({
      owner,
      repo,
      pull_number: prNumber,
    })
    return getPrRes.data.html_url
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
    return this.githubSdk.deleteGeneralPrComment({
      owner,
      repo,
      comment_id: commentId,
    })
  }
}

export class StubSCMLib extends SCMLib {
  async createSubmitRequest(
    _params: CreateSubmitRequestParams
  ): Promise<string> {
    console.error('createSubmitRequest() not implemented')
    throw new Error('createSubmitRequest() not implemented')
  }

  getScmLibType(): ScmLibScmType {
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
  async getCommitUrl(_commitId: string): Promise<string> {
    console.error('getCommitUrl() not implemented')
    throw new Error('getCommitUrl() not implemented')
  }
  _getUsernameForAuthUrl(): Promise<string> {
    throw new Error('Method not implemented.')
  }
}

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

  getScmLibType(): ScmLibScmType {
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
  getPrUrl(prNumber: number): Promise<string> {
    this._validateUrl()
    const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(this.url)
    return Promise.resolve(
      `https://bitbucket.org/${workspace}/${repoSlug}/pull-requests/${prNumber}`
    )
  }
  getCommitUrl(commitId: string): Promise<string> {
    this._validateUrl()
    const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(this.url)
    return Promise.resolve(
      `https://bitbucket.org/${workspace}/${repoSlug}/commits/${commitId}`
    )
  }
}
