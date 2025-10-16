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

    // Get PR details
    const prRes = await this.githubSdk.getPr({
      owner,
      repo,
      pull_number: prNumber,
    })

    // Get PR diff
    const prDiff = await this.getPrDiff({ pull_number: prNumber })

    // Get all commits in the PR
    const commitsRes = await this.githubSdk.getPrCommits({
      owner,
      repo,
      pull_number: prNumber,
    })

    // Get detailed commit data with diffs for each commit
    const commits: GetCommitDiffResult[] = []
    for (const commit of commitsRes.data) {
      const commitDiff = await this.getCommitDiff(commit.sha)
      commits.push(commitDiff)
    }

    const pr = prRes.data

    // Calculate diff line attributions
    const diffLines = this._calculateDiffLineAttributions(prDiff, commits)

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

  private _calculateDiffLineAttributions(
    prDiff: string,
    commits: GetCommitDiffResult[]
  ): { file: string; line: number; commitSha: string }[] {
    const attributions: { file: string; line: number; commitSha: string }[] = []

    // Parse PR diff to extract added lines with their locations
    const prDiffLines = prDiff.split('\n')
    let currentFile = ''
    let currentLineNumber = 0

    for (const line of prDiffLines) {
      // Track which file we're in
      if (line.startsWith('+++')) {
        const match = line.match(/^\+\+\+ b\/(.+)$/)
        currentFile = match?.[1] || ''
        currentLineNumber = 0
        continue
      }

      // Parse hunk header to get starting line number
      if (line.startsWith('@@')) {
        const match = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)/)
        if (match?.[1]) {
          currentLineNumber = parseInt(match[1], 10)
        }
        continue
      }

      // Track line numbers for added/unchanged lines
      if (line.startsWith('+') && !line.startsWith('+++')) {
        // This is an added line in the PR diff
        // Find which commit introduced it by checking commits in order
        const commitSha = this._findCommitForLine(
          currentFile,
          currentLineNumber,
          line.substring(1), // Remove the '+' prefix
          commits
        )

        if (commitSha && currentFile) {
          attributions.push({
            file: currentFile,
            line: currentLineNumber,
            commitSha,
          })
        }

        currentLineNumber++
      } else if (!line.startsWith('-')) {
        // Unchanged line or context line
        currentLineNumber++
      }
    }

    return attributions
  }

  private _findCommitForLine(
    file: string,
    lineNumber: number,
    lineContent: string,
    commits: GetCommitDiffResult[]
  ): string | null {
    const normalizedContent = lineContent.trim()

    // Go through commits in reverse order (most recent first)
    // The most recent commit that added this line content is the one we want
    for (let i = commits.length - 1; i >= 0; i--) {
      const commit = commits[i]
      if (!commit) {
        continue
      }

      const commitLines = commit.diff.split('\n')
      let commitCurrentFile = ''

      for (const commitLine of commitLines) {
        // Track which file we're in
        if (commitLine.startsWith('+++')) {
          const match = commitLine.match(/^\+\+\+ b\/(.+)$/)
          commitCurrentFile = match?.[1] || ''
          continue
        }

        // Skip hunk headers
        if (commitLine.startsWith('@@')) {
          continue
        }

        // Check if this commit added the line by matching content
        if (
          commitCurrentFile === file &&
          commitLine.startsWith('+') &&
          !commitLine.startsWith('+++')
        ) {
          const commitLineContent = commitLine.substring(1).trim()

          // Match based on content only - line numbers can shift between commits
          if (commitLineContent === normalizedContent) {
            return commit.commitSha
          }
        }
      }
    }

    // If no exact content match found, try a fallback approach:
    // Look for the commit that added a line in the same file near the target line number
    // This helps when whitespace or formatting differs slightly
    for (let i = commits.length - 1; i >= 0; i--) {
      const commit = commits[i]
      if (!commit) {
        continue
      }

      const addedLinesInFile = this._getAddedLinesFromCommit(commit, file)

      // Check if this commit added any line near the target line number
      // and with similar content (allowing for minor whitespace differences)
      for (const { lineNum, content } of addedLinesInFile) {
        // Check if line numbers are close (within 10 lines)
        // and content similarity is high
        if (
          Math.abs(lineNum - lineNumber) <= 10 &&
          this._contentSimilarity(content, normalizedContent) > 0.9
        ) {
          return commit.commitSha
        }
      }
    }

    // If still no commit found, attribute to the last commit
    const lastCommit = commits[commits.length - 1]
    return lastCommit ? lastCommit.commitSha : null
  }

  private _getAddedLinesFromCommit(
    commit: GetCommitDiffResult,
    targetFile: string
  ): { lineNum: number; content: string }[] {
    const addedLines: { lineNum: number; content: string }[] = []
    const commitLines = commit.diff.split('\n')
    let currentFile = ''
    let currentLineNumber = 0

    for (const line of commitLines) {
      // Track which file we're in
      if (line.startsWith('+++')) {
        const match = line.match(/^\+\+\+ b\/(.+)$/)
        currentFile = match?.[1] || ''
        currentLineNumber = 0
        continue
      }

      // Parse hunk header to get starting line number
      if (line.startsWith('@@')) {
        const match = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)/)
        if (match?.[1]) {
          currentLineNumber = parseInt(match[1], 10)
        }
        continue
      }

      // Track added lines in the target file
      if (
        currentFile === targetFile &&
        line.startsWith('+') &&
        !line.startsWith('+++')
      ) {
        addedLines.push({
          lineNum: currentLineNumber,
          content: line.substring(1).trim(),
        })
        currentLineNumber++
      } else if (!line.startsWith('-')) {
        // Unchanged line or context line
        if (currentFile === targetFile) {
          currentLineNumber++
        }
      }
    }

    return addedLines
  }

  private _contentSimilarity(content1: string, content2: string): number {
    // Simple similarity metric based on character overlap
    // Returns a value between 0 and 1
    if (content1 === content2) {
      return 1.0
    }

    // Normalize whitespace
    const normalized1 = content1.replace(/\s+/g, ' ')
    const normalized2 = content2.replace(/\s+/g, ' ')

    if (normalized1 === normalized2) {
      return 0.95
    }

    // Calculate Levenshtein-like similarity
    const longer =
      normalized1.length > normalized2.length ? normalized1 : normalized2
    const shorter =
      normalized1.length > normalized2.length ? normalized2 : normalized1

    if (longer.length === 0) {
      return 1.0
    }

    // Simple substring matching
    if (longer.includes(shorter)) {
      return shorter.length / longer.length
    }

    // Calculate common characters
    const set1 = new Set(normalized1.split(''))
    const set2 = new Set(normalized2.split(''))
    const intersection = new Set([...set1].filter((x) => set2.has(x)))

    return intersection.size / Math.max(set1.size, set2.size)
  }
}

// Mobb security fix applied: LOG_FORGING
