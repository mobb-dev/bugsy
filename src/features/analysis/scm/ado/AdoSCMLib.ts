import { setTimeout } from 'node:timers/promises'

import pLimit from 'p-limit'

import { InvalidAccessTokenError } from '../errors'
import { Pr_Status_Enum } from '../generates/client_generates'
import { SCMLib } from '../scm'
import {
  CreateSubmitRequestParams,
  GetReferenceResult,
  GetSubmitRequestInfo,
  GetSubmitRequestMetadataResult,
  PullRequestMetrics,
  RateLimitStatus,
  RecentCommitsResult,
  RepositoryContributor,
  ScmLibScmType,
  ScmRepoInfo,
  ScmSubmitRequestStatus,
  SearchReposParams,
  SearchReposResult,
  SearchSubmitRequestsParams,
  SearchSubmitRequestsResult,
} from '../types'
import { parseCursorSafe } from '../utils/cursorValidation'
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
          `error creating pull request for ADO. Try number ${String(i + 1).replace(/\n|\r/g, '')}`,
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
    return getAdoRepoList({
      orgName: scmOrg,
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
      url: this.url,
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

  async getReferenceData(ref: string): Promise<GetReferenceResult> {
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

  async getSubmitRequestMetadata(
    submitRequestId: string
  ): Promise<GetSubmitRequestMetadataResult> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoPullRequestMetadata({
      repoUrl: this.url,
      prNumber: Number(submitRequestId),
    })
  }

  async getPrFiles(prNumber: number): Promise<string[]> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    return adoSdk.getAdoPrFiles({
      repoUrl: this.url,
      prNumber,
    })
  }

  override async searchSubmitRequests(
    params: SearchSubmitRequestsParams
  ): Promise<SearchSubmitRequestsResult> {
    this._validateAccessToken()
    const adoSdk = await this.getAdoSdk()

    const skip = parseCursorSafe(params.cursor, 0)
    const top = params.limit || 10

    // Map state filter to ADO PullRequestStatus
    let status: AdoPullRequestStatus = AdoPullRequestStatus.All
    if (params.filters?.state === 'open') {
      status = AdoPullRequestStatus.Active
    } else if (params.filters?.state === 'closed') {
      // ADO doesn't have a single "closed" — fetch all and filter
      status = AdoPullRequestStatus.All
    }

    const prs = await adoSdk.searchAdoPullRequests({
      repoUrl: params.repoUrl,
      status,
      skip,
      top: top + 1, // Fetch one extra to determine hasMore
    })

    // hasMore based on API response, not filtered results
    const apiHasMore = prs.length > top
    const prsPage = prs.slice(0, top)

    // ADO PRs don't have a direct updatedAt field. Best approximation:
    // - For closed/merged PRs: closedDate
    // - For open PRs: lastMergeSourceCommit date (last push to source branch)
    // - Fallback: creationDate
    const getAdoPrUpdatedDate = (pr: (typeof prsPage)[0]): Date =>
      pr.closedDate ||
      pr.lastMergeSourceCommit?.committer?.date ||
      pr.creationDate ||
      new Date()

    // Filter by updatedAfter if specified
    let filtered = prsPage
    if (params.filters?.updatedAfter) {
      const afterDate = params.filters.updatedAfter
      filtered = prsPage.filter((pr) => getAdoPrUpdatedDate(pr) > afterDate)
    }

    // Filter closed state (abandoned + completed) if requested
    if (params.filters?.state === 'closed') {
      filtered = filtered.filter(
        (pr) =>
          pr.status === (AdoPullRequestStatus.Completed as number) ||
          pr.status === (AdoPullRequestStatus.Abandoned as number)
      )
    }

    // Note: ADO API doesn't support server-side sorting, and sorting a single
    // page in-memory doesn't produce globally sorted results across pages.
    // All current callers use state: 'all' so client-side filtering is rarely
    // triggered, and the API's default order (newest first) is acceptable.

    const results: GetSubmitRequestInfo[] = filtered.map((pr) => {
      let prStatus: ScmSubmitRequestStatus = 'open'
      if (pr.status === (AdoPullRequestStatus.Completed as number)) {
        prStatus = 'merged'
      } else if (pr.status === (AdoPullRequestStatus.Abandoned as number)) {
        prStatus = 'closed'
      }

      return {
        submitRequestId: String(pr.pullRequestId),
        submitRequestNumber: pr.pullRequestId || 0,
        title: pr.title || '',
        status: prStatus,
        sourceBranch: (pr.sourceRefName || '').replace('refs/heads/', ''),
        targetBranch: (pr.targetRefName || '').replace('refs/heads/', ''),
        authorName: pr.createdBy?.displayName,
        authorEmail: pr.createdBy?.uniqueName,
        createdAt: pr.creationDate || new Date(),
        updatedAt: getAdoPrUpdatedDate(pr),
        description: pr.description,
        tickets: [],
        changedLines: { added: 0, removed: 0 },
      }
    })

    return {
      results,
      nextCursor: apiHasMore ? String(skip + top) : undefined,
      hasMore: apiHasMore,
    }
  }

  // TODO: Performance — this fetches ALL repositories on every call, then paginates
  // in-memory. For orgs with thousands of repos this can be slow and wasteful,
  // especially when the UI pages through results (each page triggers a full re-fetch).
  // Consider caching the fetched list with a short TTL, or using ADO's
  // getRepositoriesPaged() API per-project for true server-side pagination.
  override async searchRepos(
    params: SearchReposParams
  ): Promise<SearchReposResult> {
    this._validateAccessToken()
    const allRepos = await getAdoRepoList({
      orgName: params.scmOrg,
      accessToken: this.accessToken,
      tokenOrg: this.scmOrg,
      url: this.url,
    })

    // Sort by repoUpdatedAt descending (most recently updated first)
    allRepos.sort((a, b) => {
      const dateA = a.repoUpdatedAt ? new Date(a.repoUpdatedAt).getTime() : 0
      const dateB = b.repoUpdatedAt ? new Date(b.repoUpdatedAt).getTime() : 0
      return dateB - dateA
    })

    const page = parseCursorSafe(params.cursor, 0)
    const limit = params.limit || 100
    const start = page
    const pageResults = allRepos.slice(start, start + limit)
    const hasMore = start + limit < allRepos.length

    return {
      results: pageResults,
      nextCursor: hasMore ? String(start + limit) : undefined,
      hasMore,
    }
  }

  override async getPrCommitsBatch(
    repoUrl: string,
    prNumbers: number[]
  ): Promise<Map<number, string[]>> {
    this._validateAccessToken()
    const adoSdk = await this.getAdoSdk()
    const result = new Map<number, string[]>()
    const limit = pLimit(5)
    await Promise.all(
      prNumbers.map((prNumber) =>
        limit(async () => {
          try {
            const commits = await adoSdk.getAdoPrCommits({
              repoUrl,
              prNumber,
            })
            result.set(prNumber, commits)
          } catch (error) {
            console.warn(
              `[AdoSCMLib.getPrCommitsBatch] Failed to fetch commits for PR #${prNumber}:`,
              error instanceof Error ? error.message : String(error)
            )
            result.set(prNumber, [])
          }
        })
      )
    )
    return result
  }

  async getPullRequestMetrics(prNumber: number): Promise<PullRequestMetrics> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    const { pr, commentIds, linesAdded } =
      await adoSdk.getAdoPullRequestMetrics({
        repoUrl: this.url,
        prNumber,
      })

    // Map ADO PR status to Pr_Status_Enum
    let prStatus: Pr_Status_Enum = Pr_Status_Enum.Active
    if (pr.status === 3) {
      // Completed
      prStatus = Pr_Status_Enum.Merged
    } else if (pr.status === 2) {
      // Abandoned
      prStatus = Pr_Status_Enum.Closed
    } else if (pr.isDraft) {
      prStatus = Pr_Status_Enum.Draft
    }

    return {
      prId: String(prNumber),
      repositoryUrl: this.url,
      prCreatedAt: pr.creationDate || new Date(),
      prMergedAt: pr.closedDate && pr.status === 3 ? pr.closedDate : null,
      linesAdded,
      prStatus,
      commentIds,
    }
  }

  async getRecentCommits(since: string): Promise<RecentCommitsResult> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    const commits = await adoSdk.getAdoRecentCommits({
      repoUrl: this.url,
      since,
    })

    return {
      data: commits.map((c) => ({
        sha: c.commitId || '',
        commit: {
          committer: c.committer?.date
            ? { date: c.committer.date.toISOString() }
            : undefined,
          author: c.author
            ? { email: c.author.email, name: c.author.name }
            : undefined,
          message: c.comment,
        },
        parents: c.parents?.map((sha) => ({ sha })),
      })),
    }
  }

  async getRateLimitStatus(): Promise<RateLimitStatus | null> {
    // ADO doesn't expose a rate limit API, so we can't track actual usage.
    // Unlike GitHub/GitLab which return real remaining counts from response
    // headers, this is a static value that never decreases — it only prevents
    // callers (like the maintenance service's checkRateLimit) from throwing
    // on null. Actual ADO rate limiting (~200 req/min for cloud) would
    // surface as 429 errors at the HTTP level.
    return {
      remaining: 10000,
      reset: new Date(Date.now() + 3600000),
    }
  }

  async getRepositoryContributors(): Promise<RepositoryContributor[]> {
    this._validateAccessTokenAndUrl()
    const adoSdk = await this.getAdoSdk()
    const members = await adoSdk.listProjectMembers({ repoUrl: this.url })
    const isLikelyEmail = (v: string | null | undefined) =>
      !!v && /^[^@\s\\]+@[^@\s\\]+\.[^@\s\\]+$/.test(v)
    return members.map((m) => ({
      externalId: m.id,
      username: m.uniqueName || null,
      displayName: m.displayName || null,
      email: isLikelyEmail(m.uniqueName) ? m.uniqueName! : null,
      accessLevel: null,
    }))
  }
}

// Mobb security fix applied: LOG_FORGING
