import { z } from 'zod'

import { InvalidRepoUrlError } from '../errors'
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

  async getCommitDiff(commitSha: string): Promise<GetCommitDiffResult> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)

    const { commit, diff } = await this.githubSdk.getCommitWithDiff({
      owner,
      repo,
      commitSha,
    })

    // Parse the commit timestamp
    const commitTimestamp = commit.commit.committer?.date
      ? new Date(commit.commit.committer.date)
      : new Date(commit.commit.author?.date || Date.now())

    return {
      diff,
      commitTimestamp,
      commitSha: commit.sha,
      authorName: commit.commit.author?.name,
      authorEmail: commit.commit.author?.email,
      message: commit.commit.message,
    }
  }

  async getSubmitRequestDiff(
    submitRequestId: string
  ): Promise<GetSubmitRequestDiffResult> {
    this._validateAccessTokenAndUrl()
    const { owner, repo } = parseGithubOwnerAndRepo(this.url)
    const prNumber = Number(submitRequestId)

    // Fetch PR details, commits, and changed files in parallel for optimization
    const [prRes, commitsRes, filesRes] = await Promise.all([
      this.githubSdk.getPr({ owner, repo, pull_number: prNumber }),
      this.githubSdk.getPrCommits({ owner, repo, pull_number: prNumber }),
      this.githubSdk.listPRFiles({ owner, repo, pull_number: prNumber }),
    ])

    const pr = prRes.data

    // Get PR diff (needed for backward compatibility)
    const prDiff = await this.getPrDiff({ pull_number: prNumber })

    // Get detailed commit data with diffs for each commit in parallel
    const commits: GetCommitDiffResult[] = await Promise.all(
      commitsRes.data.map((commit) => this.getCommitDiff(commit.sha))
    )

    // Use optimized blame-based attribution
    const diffLines = await this._attributeLinesViaBlame(
      pr.head.ref,
      filesRes.data,
      commits
    )

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

    // Process each PR in parallel to fetch comments and diffs
    const submitRequests = await Promise.all(
      pullsRes.data.map(async (pr) => {
        let status: ScmSubmitRequestStatus = 'open'
        if (pr.state === 'closed') {
          status = pr.merged_at ? 'merged' : 'closed'
        } else if (pr.draft) {
          status = 'draft'
        }

        // Fetch tickets and changed lines in parallel
        const [tickets, changedLines] = await Promise.all([
          this._extractLinearTicketsFromPR(owner, repo, pr.number),
          this._calculateChangedLinesFromPR(owner, repo, pr.number),
        ])

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
    )

    return submitRequests
  }

  private async _extractLinearTicketsFromPR(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<{ name: string; title: string; url: string }[]> {
    try {
      const commentsRes = await this.githubSdk.getGeneralPrComments({
        owner,
        repo,
        issue_number: prNumber,
      })

      const tickets: { name: string; title: string; url: string }[] = []

      // Look for Linear bot comments
      for (const comment of commentsRes.data) {
        // Check if comment is from Linear bot
        if (
          comment.user?.login === 'linear[bot]' ||
          comment.user?.type === 'Bot'
        ) {
          // Extract Linear ticket links from comment body
          // Support both HTML and Markdown formats:
          // HTML: <a href="https://linear.app/team/issue/PROJECT-123">PROJECT-123</a>
          // Markdown: [PROJECT-123](https://linear.app/team/issue/PROJECT-123/title)

          // Try HTML pattern first
          const htmlLinkPattern =
            /<a href="(https:\/\/linear\.app\/[^"]+)">([A-Z]+-\d+)<\/a>/g
          let match

          while ((match = htmlLinkPattern.exec(comment.body || '')) !== null) {
            const url = match[1]
            const name = match[2]

            // Skip if name or url are missing
            if (!name || !url) {
              continue
            }

            // Extract title from URL (after the last slash)
            const urlParts = url.split('/')
            const titleSlug = urlParts[urlParts.length - 1] || ''
            const title = titleSlug.replace(/-/g, ' ')

            tickets.push({ name, title, url })
          }

          // Also try Markdown pattern for compatibility
          const markdownLinkPattern =
            /\[([A-Z]+-\d+)\]\((https:\/\/linear\.app\/[^)]+)\)/g
          while (
            (match = markdownLinkPattern.exec(comment.body || '')) !== null
          ) {
            const name = match[1]
            const url = match[2]

            // Skip if already added via HTML pattern
            if (tickets.some((t) => t.name === name && t.url === url)) {
              continue
            }

            if (!name || !url) {
              continue
            }

            const urlParts = url.split('/')
            const titleSlug = urlParts[urlParts.length - 1] || ''
            const title = titleSlug.replace(/-/g, ' ')

            tickets.push({ name, title, url })
          }
        }
      }

      return tickets
    } catch (error) {
      // Return empty array if fetching comments fails
      return []
    }
  }

  private async _calculateChangedLinesFromPR(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<{ added: number; removed: number }> {
    try {
      const diffRes = await this.githubSdk.getPrDiff({
        owner,
        repo,
        pull_number: prNumber,
      })

      const diff = z.string().parse(diffRes.data)

      // Count added and removed lines
      let added = 0
      let removed = 0

      const lines = diff.split('\n')
      for (const line of lines) {
        // Count lines starting with '+' (excluding +++ file headers)
        if (line.startsWith('+') && !line.startsWith('+++')) {
          added++
        }
        // Count lines starting with '-' (excluding --- file headers)
        else if (line.startsWith('-') && !line.startsWith('---')) {
          removed++
        }
      }

      return { added, removed }
    } catch (error) {
      // Return zero counts if fetching diff fails
      return { added: 0, removed: 0 }
    }
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
   * Attribute lines in a single file to their commits using blame
   */
  private async _attributeFileLines(
    file: { filename: string; patch?: string },
    headRef: string,
    prCommitShas: Set<string>
  ): Promise<{ file: string; line: number; commitSha: string }[]> {
    try {
      // Get blame for this file at PR head
      const blame = await this.getRepoBlameRanges(headRef, file.filename)

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
      for (const blameRange of blame) {
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
    } catch (error) {
      // If blame fails for a file, skip it (file might be deleted or binary)
      return []
    }
  }

  /**
   * Optimized helper to attribute PR lines to commits using blame API
   * Parallel blame queries for minimal API call time
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

    // Query blame for all files in parallel
    const attributions = await Promise.all(
      filesWithAdditions.map((file) =>
        this._attributeFileLines(file, headRef, prCommitShas)
      )
    )

    return attributions.flat()
  }
}

// Mobb security fix applied: LOG_FORGING
