import { z } from 'zod'

import { InvalidRepoUrlError } from '../errors'
import { Pr_Status_Enum } from '../generates/client_generates'
import { SCMLib } from '../scm'
import { parseScmURL, ScmType } from '../shared/src'
import {
  CreateSubmitRequestParams,
  GetCommitDiffResult,
  GetGitBlameResponse,
  GetReferenceResult,
  GetSubmitRequestDiffResult,
  GetSubmitRequestInfo,
  PostPRReviewCommentParams,
  PullRequestMetrics,
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
  BlameRangeData,
  CommitTimestampData,
  DeleteCommentParams,
  GetPrCommentResponse,
  GetPrCommentsParams,
  GetPrParams,
  PostCommentParams,
  PrCommentData,
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
    // note: for some reason octokit does not know to return response as string
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

  async getRecentCommits(since: string) {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url!)
    return await this.githubSdk.getRecentCommits({ owner, repo, since })
  }

  async getRateLimitStatus() {
    return await this.githubSdk.getRateLimitStatus()
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
  ): Promise<GetGitBlameResponse> {
    this._validateUrl()
    return await this.githubSdk.getGithubBlameRanges({
      ref,
      path,
      gitHubUrl: this.url,
    })
  }

  async getReferenceData(ref: string): Promise<GetReferenceResult> {
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

  async getCommitDiff(
    commitSha: string,
    options?: {
      repositoryCreatedAt?: Date
      parentCommitTimestamps?: Map<string, CommitTimestampData>
    }
  ): Promise<GetCommitDiffResult> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    const { commit, diff } = await this.githubSdk.getCommitWithDiff({
      owner,
      repo,
      commitSha,
    })

    // Parse the commit timestamp (always in UTC from GitHub API)
    const commitTimestamp = commit.commit.committer?.date
      ? new Date(commit.commit.committer.date)
      : new Date(commit.commit.author?.date || Date.now())

    // Use provided parent timestamps or fetch them individually (fallback)
    let parentCommits: { sha: string; timestamp: Date }[] | undefined
    if (commit.parents && commit.parents.length > 0) {
      if (options?.parentCommitTimestamps) {
        // Use pre-fetched parent timestamps
        parentCommits = commit.parents
          .map((p) => options.parentCommitTimestamps!.get(p.sha))
          .filter((p): p is { sha: string; timestamp: Date } => p !== undefined)
      } else {
        // Fallback: fetch parent commits individually
        try {
          parentCommits = await Promise.all(
            commit.parents.map(async (parent) => {
              const parentCommit = await this.githubSdk.getCommit({
                owner,
                repo,
                commitSha: parent.sha,
              })
              const parentTimestamp = parentCommit.data.committer?.date
                ? new Date(parentCommit.data.committer.date)
                : new Date(Date.now())
              return {
                sha: parent.sha,
                timestamp: parentTimestamp,
              }
            })
          )
        } catch (error) {
          // Log error but don't fail - we'll fall back to default lookback window
          console.error('Failed to fetch parent commit timestamps', {
            error,
            commitSha,
            owner,
            repo,
          })
          parentCommits = undefined
        }
      }
    }

    // Use provided repositoryCreatedAt or fetch it
    let repositoryCreatedAt = options?.repositoryCreatedAt
    if (repositoryCreatedAt === undefined) {
      try {
        const repoData = await this.githubSdk.getRepository({ owner, repo })
        repositoryCreatedAt = repoData.data.created_at
          ? new Date(repoData.data.created_at)
          : undefined
      } catch (error) {
        // Log error but don't fail - we'll fall back to default lookback window
        console.error('Failed to fetch repository creation date', {
          error,
          owner,
          repo,
        })
        repositoryCreatedAt = undefined
      }
    }

    return {
      diff,
      commitTimestamp,
      commitSha: commit.sha,
      authorName: commit.commit.author?.name,
      authorEmail: commit.commit.author?.email,
      message: commit.commit.message,
      parentCommits,
      repositoryCreatedAt,
    }
  }

  async getSubmitRequestDiff(
    submitRequestId: string
  ): Promise<GetSubmitRequestDiffResult> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const prNumber = Number(submitRequestId)

    // Fetch PR details, commits, changed files, and repo data in parallel for optimization
    const [prRes, commitsRes, filesRes, repoData] = await Promise.all([
      this.githubSdk.getPr({ owner, repo, pull_number: prNumber }),
      this.githubSdk.getPrCommits({ owner, repo, pull_number: prNumber }),
      this.githubSdk.listPRFiles({ owner, repo, pull_number: prNumber }),
      this.githubSdk.getRepository({ owner, repo }),
    ])

    const pr = prRes.data

    // Cache repositoryCreatedAt to avoid fetching it for each commit
    const repositoryCreatedAt = repoData.data.created_at
      ? new Date(repoData.data.created_at)
      : undefined

    // Collect all unique parent SHAs from all commits
    const allParentShas = new Set<string>()
    for (const commit of commitsRes.data) {
      if (commit.parents) {
        for (const parent of commit.parents) {
          allParentShas.add(parent.sha)
        }
      }
    }

    // Batch fetch parent commit timestamps and PR diff in parallel
    const [parentCommitTimestamps, prDiff] = await Promise.all([
      this.githubSdk.getCommitsBatch({
        owner,
        repo,
        commitShas: Array.from(allParentShas),
      }),
      this.getPrDiff({ pull_number: prNumber }),
    ])

    // Get detailed commit data with diffs for each commit in parallel
    // Pass cached repositoryCreatedAt and parentCommitTimestamps to avoid redundant API calls
    const commits: GetCommitDiffResult[] = await Promise.all(
      commitsRes.data.map((commit) =>
        this.getCommitDiff(commit.sha, {
          repositoryCreatedAt,
          parentCommitTimestamps,
        })
      )
    )

    // Use optimized blame-based attribution (skip if files couldn't be fetched)
    const diffLines = filesRes
      ? await this._attributeLinesViaBlame(pr.head.ref, filesRes.data, commits)
      : []

    return {
      diff: prDiff,
      createdAt: new Date(pr.created_at),
      updatedAt: new Date(pr.updated_at),
      submitRequestId: submitRequestId,
      submitRequestNumber: prNumber,
      sourceBranch: pr.head.ref,
      targetBranch: pr.base.ref,
      authorName: pr.user?.name || pr.user?.login,
      authorEmail: pr.user?.email || undefined,
      title: pr.title,
      description: pr.body || undefined,
      commits,
      diffLines,
    }
  }

  async getSubmitRequests(repoUrl: string): Promise<GetSubmitRequestInfo[]> {
    this._validateAccessToken()
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)

    const pullsRes = await this.githubSdk.getRepoPullRequests({ owner, repo })

    // Extract all PR numbers for batch fetching
    const prNumbers = pullsRes.data.map((pr) => pr.number)

    // Batch fetch additions/deletions and comments via GraphQL (2 API calls instead of 2N)
    const [additionsDeletionsMap, commentsMap] = await Promise.all([
      this.githubSdk.getPrAdditionsDeletionsBatch({ owner, repo, prNumbers }),
      this.githubSdk.getPrCommentsBatch({ owner, repo, prNumbers }),
    ])

    // Process each PR using the pre-fetched data (no additional API calls)
    const submitRequests = pullsRes.data.map((pr) => {
      let status: ScmSubmitRequestStatus = 'open'
      if (pr.state === 'closed') {
        status = pr.merged_at ? 'merged' : 'closed'
      } else if (pr.draft) {
        status = 'draft'
      }

      // Get changedLines from batch response
      const changedLinesData = additionsDeletionsMap.get(pr.number)
      const changedLines = changedLinesData
        ? {
            added: changedLinesData.additions,
            removed: changedLinesData.deletions,
          }
        : { added: 0, removed: 0 }

      // Extract tickets from pre-fetched comments
      const comments = commentsMap.get(pr.number) || []
      const tickets = this._extractLinearTicketsFromComments(comments)

      return {
        submitRequestId: String(pr.number),
        submitRequestNumber: pr.number,
        title: pr.title,
        status,
        sourceBranch: pr.head.ref,
        targetBranch: pr.base.ref,
        authorName: pr.user?.name || pr.user?.login,
        authorEmail: pr.user?.email || undefined,
        createdAt: new Date(pr.created_at),
        updatedAt: new Date(pr.updated_at),
        description: pr.body || undefined,
        tickets,
        changedLines,
      }
    })

    return submitRequests
  }

  /**
   * Fetches commits for multiple PRs in a single GraphQL request.
   * Much more efficient than calling getSubmitRequestDiff for each PR.
   *
   * @param repoUrl - Repository URL
   * @param prNumbers - Array of PR numbers to fetch commits for
   * @returns Map of PR number to array of commit SHAs
   */
  override async getPrCommitsBatch(
    repoUrl: string,
    prNumbers: number[]
  ): Promise<Map<number, string[]>> {
    this._validateAccessToken()
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
    return this.githubSdk.getPrCommitsBatch({ owner, repo, prNumbers })
  }
  async getPullRequestMetrics(prNumber: number): Promise<PullRequestMetrics> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    // Single GraphQL query replaces 4 REST calls
    const res = await this.githubSdk.getPRMetricsGraphQL({
      owner,
      repo,
      prNumber,
    })

    const pr = res.repository.pullRequest
    if (!pr) {
      throw new Error(`Pull request #${prNumber} not found`)
    }

    // Determine PR status
    let prStatus: Pr_Status_Enum = Pr_Status_Enum.Active
    if (pr.state === 'CLOSED') {
      prStatus = pr.mergedAt ? Pr_Status_Enum.Merged : Pr_Status_Enum.Closed
    } else if (pr.isDraft) {
      prStatus = Pr_Status_Enum.Draft
    }

    // Get first commit date
    const firstCommit = pr.commits.nodes[0]
    const firstCommitDate = firstCommit
      ? new Date(
          firstCommit.commit.author?.date ||
            firstCommit.commit.committedDate ||
            pr.createdAt
        )
      : null

    // Extract commit SHAs
    let commitShas = pr.commits.nodes.map((node) => node.commit.oid)

    // If commits exceed GraphQL limit, fall back to REST pagination
    if (pr.commits.totalCount > 100) {
      const commitsRes = await this.githubSdk.getPrCommits({
        owner,
        repo,
        pull_number: prNumber,
      })
      commitShas = commitsRes.data.map((c) => c.sha)
    }

    // Extract comment IDs
    let commentIds = pr.comments.nodes.map((node) => node.id)

    // If comments exceed GraphQL limit, fall back to REST pagination
    if (pr.comments.totalCount > 100) {
      const commentsRes = await this.githubSdk.getGeneralPrComments({
        owner,
        repo,
        issue_number: prNumber,
      })
      commentIds = commentsRes.data.map((c) => String(c.id))
    }

    return {
      prId: String(prNumber),
      repositoryUrl: this.url,
      prCreatedAt: new Date(pr.createdAt),
      prMergedAt: pr.mergedAt ? new Date(pr.mergedAt) : null,
      firstCommitDate,
      linesAdded: pr.additions,
      commitsCount: pr.commits.totalCount,
      commitShas,
      prStatus,
      commentIds,
    }
  }

  /**
   * Parse a Linear ticket from URL and name
   * Returns null if invalid or missing data
   */
  private _parseLinearTicket(
    url: string | undefined,
    name: string | undefined
  ): { name: string; title: string; url: string } | null {
    if (!name || !url) {
      return null
    }

    const urlParts = url.split('/')
    const titleSlug = urlParts[urlParts.length - 1] || ''
    const title = titleSlug.replace(/-/g, ' ')

    return { name, title, url }
  }

  /**
   * Extract Linear ticket links from pre-fetched comments (pure function, no API calls)
   */
  private _extractLinearTicketsFromComments(
    comments: PrCommentData[]
  ): { name: string; title: string; url: string }[] {
    const tickets: { name: string; title: string; url: string }[] = []
    const seen = new Set<string>() // Track seen tickets by "name|url"

    for (const comment of comments) {
      // Check if comment is from Linear bot
      if (
        comment.author?.login === 'linear[bot]' ||
        comment.author?.type === 'Bot'
      ) {
        const body = comment.body || ''

        // Extract from HTML format: <a href="...">PROJECT-123</a>
        const htmlPattern =
          /<a href="(https:\/\/linear\.app\/[^"]+)">([A-Z]+-\d+)<\/a>/g
        let match
        while ((match = htmlPattern.exec(body)) !== null) {
          const ticket = this._parseLinearTicket(match[1], match[2])
          if (ticket && !seen.has(`${ticket.name}|${ticket.url}`)) {
            seen.add(`${ticket.name}|${ticket.url}`)
            tickets.push(ticket)
          }
        }

        // Extract from Markdown format: [PROJECT-123](...)
        const markdownPattern =
          /\[([A-Z]+-\d+)\]\((https:\/\/linear\.app\/[^)]+)\)/g
        while ((match = markdownPattern.exec(body)) !== null) {
          const ticket = this._parseLinearTicket(match[2], match[1])
          if (ticket && !seen.has(`${ticket.name}|${ticket.url}`)) {
            seen.add(`${ticket.name}|${ticket.url}`)
            tickets.push(ticket)
          }
        }
      }
    }

    return tickets
  }

  /**
   * Optimized helper to parse added line numbers from a unified diff patch
   * Single-pass parsing for minimal CPU usage
   */
  private _parseAddedLinesFromPatch(patch: string): number[] {
    const addedLines: number[] = []
    const lines = patch.split('\n')
    let currentLineNumber = 0

    for (const line of lines) {
      // Parse hunk header to get starting line number for new file
      if (line.startsWith('@@')) {
        const match = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)/)
        if (match?.[1]) {
          currentLineNumber = parseInt(match[1], 10)
        }
        continue
      }

      // Track added lines (exclude file headers)
      if (line.startsWith('+') && !line.startsWith('+++')) {
        addedLines.push(currentLineNumber)
        currentLineNumber++
      } else if (!line.startsWith('-')) {
        // Context or unchanged line
        currentLineNumber++
      }
    }

    return addedLines
  }

  /**
   * Process blame data for a single file to attribute lines to commits
   * Uses pre-fetched blame data instead of making API calls
   */
  private _processFileBlameSafe(
    file: { filename: string; patch?: string },
    blameData: BlameRangeData[],
    prCommitShas: Set<string>
  ): { file: string; line: number; commitSha: string }[] {
    // Parse patch to find added line numbers
    const addedLines = this._parseAddedLinesFromPatch(file.patch!)

    // Convert to Set for O(1) lookup
    const addedLinesSet = new Set(addedLines)

    // Map added lines to blame ranges - optimized by inverting the loop
    const fileAttributions: {
      file: string
      line: number
      commitSha: string
    }[] = []

    // Iterate through blame ranges (typically fewer and larger than individual lines)
    for (const blameRange of blameData) {
      // Skip if commit not in this PR
      if (!prCommitShas.has(blameRange.commitSha)) {
        continue
      }

      // Check each line in the blame range against added lines
      for (
        let lineNum = blameRange.startingLine;
        lineNum <= blameRange.endingLine;
        lineNum++
      ) {
        if (addedLinesSet.has(lineNum)) {
          fileAttributions.push({
            file: file.filename,
            line: lineNum,
            commitSha: blameRange.commitSha,
          })
        }
      }
    }

    return fileAttributions
  }

  /**
   * Optimized helper to attribute PR lines to commits using blame API
   * Batch blame queries for minimal API call time (1 call instead of M calls)
   */
  private async _attributeLinesViaBlame(
    headRef: string,
    changedFiles: { filename: string; patch?: string }[],
    prCommits: GetCommitDiffResult[]
  ): Promise<{ file: string; line: number; commitSha: string }[]> {
    // Create set of PR commit SHAs for O(1) lookup
    const prCommitShas = new Set(prCommits.map((c) => c.commitSha))

    // Filter to only files with patches (additions)
    const filesWithAdditions = changedFiles.filter((file) =>
      file.patch?.includes('\n+')
    )

    if (filesWithAdditions.length === 0) {
      return []
    }

    // Batch fetch blame data for all files in single GraphQL call
    // this.url is guaranteed to be defined when called from getSubmitRequestDiff
    const { owner, repo } = parseGithubOwnerAndRepo(this.url!)
    const blameMap = await this.githubSdk.getBlameBatch({
      owner,
      repo,
      ref: headRef,
      filePaths: filesWithAdditions.map((f) => f.filename),
    })

    // Process blame data for each file (no API calls, just data processing)
    const allAttributions: { file: string; line: number; commitSha: string }[] =
      []

    for (const file of filesWithAdditions) {
      const blameData = blameMap.get(file.filename) || []
      const fileAttributions = this._processFileBlameSafe(
        file,
        blameData,
        prCommitShas
      )
      allAttributions.push(...fileAttributions)
    }

    return allAttributions
  }
}

// Mobb security fix applied: LOG_FORGING
