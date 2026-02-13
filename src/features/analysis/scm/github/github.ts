import { OctokitOptions } from '@octokit/core'
import { RequestError } from '@octokit/request-error'

import { MAX_BRANCHES_FETCH } from '../constants'
import { RefNotFoundError } from '../errors'
import { ReferenceType, ScmRepoInfo } from '../types'
import { safeBody } from '../utils'
import {
  CREATE_OR_UPDATE_A_REPOSITORY_SECRET,
  DELETE_COMMENT_PATH,
  DELETE_GENERAL_PR_COMMENT,
  GET_A_REPOSITORY_PUBLIC_KEY,
  GET_GENERAL_PR_COMMENTS,
  GET_PR,
  GET_PR_COMMENT_PATH,
  GET_PR_COMMENTS_PATH,
  GET_PR_METRICS_QUERY,
  GET_USER,
  GET_USER_REPOS,
  GITHUB_GRAPHQL_FRAGMENTS,
  POST_COMMENT_PATH,
  POST_GENERAL_PR_COMMENT,
  REPLY_TO_CODE_REVIEW_COMMENT_PATH,
  UPDATE_COMMENT_PATH,
} from './consts'
import {
  ChangedLinesData,
  CreateOrUpdateRepositorySecretParams,
  CreateOrUpdateRepositorySecretResponse,
  DeleteCommentParams,
  DeleteCommentResponse,
  DeleteGeneralPrCommentParams,
  DeleteGeneralPrCommentResponse,
  GetARepositoryPublicKeyParams,
  GetARepositoryPublicKeyResponse,
  GetGeneralPrCommentResponse,
  GetPrCommentParams,
  GetPrCommentResponse,
  GetPrCommentsParams,
  GetPrCommentsResponse,
  GetPRMetricsResponse,
  GetPrParams,
  GetPrResponse,
  GetPrReviewCommentsParams,
  GetUserResponse,
  PostCommentParams,
  PostCommentReposes,
  PostGeneralPrCommentParams,
  PostGeneralPrCommentResponse,
  PrChangesGraphQLResponse,
  PrCommentData,
  PrCommentsGraphQLResponse,
  ReplyToCodeReviewCommentPathParams,
  ReplyToCodeReviewCommentPathResponse,
  UpdateCommentParams,
  UpdateCommentResponse,
} from './types'
import { getOctoKit, parseGithubOwnerAndRepo } from './utils'

const MAX_GH_PR_BODY_LENGTH = 65536

/**
 * Configuration for a batch GraphQL query
 */
type BatchQueryConfig<TKey, TResult> = {
  items: TKey[]
  aliasPrefix: string
  buildFragment: (item: TKey, index: number) => string
  extractResult: (
    data: Record<string, unknown>,
    item: TKey,
    index: number
  ) => TResult | undefined
}

/**
 * Generic helper to execute batch GraphQL queries
 * Reduces code duplication across all batch operations
 * Handles partial GraphQL responses when some items don't exist
 */
async function executeBatchGraphQL<TKey, TResult>(
  octokit: ReturnType<typeof getOctoKit>,
  owner: string,
  repo: string,
  config: BatchQueryConfig<TKey, TResult>
): Promise<Map<TKey, TResult>> {
  const { items, aliasPrefix, buildFragment, extractResult } = config

  if (items.length === 0) {
    return new Map()
  }

  // Build query with indexed aliases
  const fragments = items
    .map((item, index) => buildFragment(item, index))
    .join('\n')

  const query = `
    query Batch${aliasPrefix}($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        ${fragments}
      }
    }
  `

  // GitHub GraphQL returns partial data even when some items don't exist,
  // but throws an error. We catch it and extract the partial data.
  let response: { repository: Record<string, unknown> }
  try {
    response = await octokit.graphql<{
      repository: Record<string, unknown>
    }>(query, { owner, repo })
  } catch (error) {
    // Check if error contains partial data (GraphQL partial response)
    const graphqlError = error as {
      data?: { repository: Record<string, unknown> }
      errors?: { message: string }[]
    }
    if (graphqlError.data?.repository) {
      // Use partial data even if some items failed
      response = graphqlError.data
    } else {
      throw error
    }
  }

  // Map response back to items
  const result = new Map<TKey, TResult>()
  items.forEach((item, index) => {
    const data = response.repository[`${aliasPrefix}${index}`]
    // Always call extractResult, even if data is null/undefined
    // This allows extractResult to return a default value for missing items
    const extracted = extractResult(
      (data as Record<string, unknown>) || {},
      item,
      index
    )
    if (extracted !== undefined) {
      result.set(item, extracted)
    }
  })

  return result
}

export function getGithubSdk(
  params: OctokitOptions & { isEnableRetries?: boolean } = {}
) {
  const octokit = getOctoKit(params)
  return {
    async postPrComment(
      params: PostCommentParams
    ): Promise<PostCommentReposes> {
      return octokit.request(POST_COMMENT_PATH, params)
    },
    async updatePrComment(
      params: UpdateCommentParams
    ): Promise<UpdateCommentResponse> {
      return octokit.request(UPDATE_COMMENT_PATH, params)
    },
    async getPrComments(
      params: GetPrCommentsParams
    ): Promise<GetPrCommentsResponse> {
      return octokit.request(GET_PR_COMMENTS_PATH, params)
    },
    async getPrComment(
      params: GetPrCommentParams
    ): Promise<GetPrCommentResponse> {
      return octokit.request(GET_PR_COMMENT_PATH, params)
    },
    async deleteComment(
      params: DeleteCommentParams
    ): Promise<DeleteCommentResponse> {
      return octokit.request(DELETE_COMMENT_PATH, params)
    },
    async replyToCodeReviewComment(
      params: ReplyToCodeReviewCommentPathParams
    ): Promise<ReplyToCodeReviewCommentPathResponse> {
      return octokit.request(REPLY_TO_CODE_REVIEW_COMMENT_PATH, params)
    },
    async getPrDiff(params: GetPrParams) {
      // we're using the media type to get the diff
      //https://docs.github.com/en/rest/using-the-rest-api/media-types?apiVersion=2022-11-28#commits-commit-comparison-and-pull-requests
      return octokit.request(GET_PR, {
        ...params,
        mediaType: { format: 'diff' },
      })
    },
    async getPr(params: GetPrParams): Promise<GetPrResponse> {
      return octokit.request(GET_PR, { ...params })
    },
    async createOrUpdateRepositorySecret(
      params: CreateOrUpdateRepositorySecretParams
    ): Promise<CreateOrUpdateRepositorySecretResponse> {
      return octokit.request(CREATE_OR_UPDATE_A_REPOSITORY_SECRET, params)
    },
    async getRepositoryPublicKey(
      params: GetARepositoryPublicKeyParams
    ): Promise<GetARepositoryPublicKeyResponse> {
      return octokit.request(GET_A_REPOSITORY_PUBLIC_KEY, params)
    },
    async postGeneralPrComment(
      params: PostGeneralPrCommentParams
    ): Promise<PostGeneralPrCommentResponse> {
      return octokit.request(POST_GENERAL_PR_COMMENT, params)
    },
    async getGeneralPrComments(
      params: GetPrReviewCommentsParams
    ): Promise<GetGeneralPrCommentResponse> {
      return octokit.request(GET_GENERAL_PR_COMMENTS, params)
    },
    async deleteGeneralPrComment(
      params: DeleteGeneralPrCommentParams
    ): Promise<DeleteGeneralPrCommentResponse> {
      return octokit.request(DELETE_GENERAL_PR_COMMENT, params)
    },
    async getGithubUsername() {
      const res = await octokit.rest.users.getAuthenticated()
      return res.data.login
    },
    async getGithubIsUserCollaborator(params: {
      username: string
      repoUrl: string
    }) {
      const { username, repoUrl } = params
      try {
        const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)

        // First try to check if user is a direct collaborator
        try {
          const res = await octokit.rest.repos.checkCollaborator({
            owner,
            repo,
            username,
          })
          if (res.status === 204) {
            return true
          }
        } catch (_collaboratorError) {
          // If not a direct collaborator, check if user has any permission level
          try {
            const permissionRes =
              await octokit.rest.repos.getCollaboratorPermissionLevel({
                owner,
                repo,
                username,
              })
            // If we can get permission level, user has some access
            // Permission can be: admin, write, read, none
            if (permissionRes.data.permission !== 'none') {
              return true
            }
          } catch (_permissionError) {
            // If permission check fails, try to get repository to verify token has access
            try {
              await octokit.rest.repos.get({ owner, repo })
              // If we can read the repository, assume the user has access
              return true
            } catch (_repoError) {
              // Cannot access repository at all
              return false
            }
          }
        }
      } catch (_e) {
        return false
      }
      return false
    },
    async getGithubPullRequestStatus(params: {
      repoUrl: string
      prNumber: number
    }) {
      const { repoUrl, prNumber } = params
      const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
      const res = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      })
      if (res.data.merged) {
        return 'merged'
      }
      if (res.data.draft) {
        return 'draft'
      }
      return res.data.state
    },
    async createMarkdownCommentOnPullRequest(params: {
      repoUrl: string
      prNumber: number
      markdownComment: string
    }) {
      const { repoUrl, prNumber, markdownComment } = params
      const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
      return octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: markdownComment,
      })
    },
    async getGithubIsRemoteBranch(params: { repoUrl: string; branch: string }) {
      const { repoUrl, branch } = params
      const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
      try {
        const res = await octokit.rest.repos.getBranch({
          owner,
          repo,
          branch,
        })
        return branch === res.data.name
      } catch (_e) {
        return false
      }
    },
    async getGithubRepoList(): Promise<ScmRepoInfo[]> {
      try {
        const githubRepos = await octokit.request(GET_USER_REPOS, {
          sort: 'updated',
        })
        return githubRepos.data.map((repo) => ({
          repoName: repo.name,
          repoUrl: repo.html_url,
          repoOwner: repo.owner.login,
          repoLanguages: repo.language ? [repo.language] : [],
          repoIsPublic: !repo.private,
          repoUpdatedAt: repo.updated_at,
        }))
      } catch (e) {
        if (e instanceof RequestError && e.status === 401) {
          console.warn(
            'GitHub API returned 401 Unauthorized when listing repos - token may be expired or lack repo scope'
          )
          return []
        }
        if (e instanceof RequestError && e.status === 404) {
          console.warn(
            'GitHub API returned 404 Not Found when listing repos - user may not exist'
          )
          return []
        }
        throw e
      }
    },
    async getGithubRepoDefaultBranch(repoUrl: string) {
      const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
      const repos = await octokit.rest.repos.get({ repo, owner })
      return repos.data.default_branch
    },
    async getRepository({ owner, repo }: { owner: string; repo: string }) {
      return octokit.rest.repos.get({ repo, owner })
    },
    async getGithubReferenceData({
      ref,
      gitHubUrl,
    }: {
      ref: string
      gitHubUrl: string
    }) {
      const { owner, repo } = parseGithubOwnerAndRepo(gitHubUrl)
      let res
      try {
        res = await Promise.any([
          this.getBranch({ owner, repo, branch: ref }).then((result) => ({
            date: result.data.commit.commit.committer?.date
              ? new Date(result.data.commit.commit.committer?.date)
              : undefined,
            type: ReferenceType.BRANCH,
            sha: result.data.commit.sha,
          })),
          this.getCommit({ commitSha: ref, repo, owner }).then((commit) => ({
            date: new Date(commit.data.committer.date),
            type: ReferenceType.COMMIT,
            sha: commit.data.sha,
          })),
          this.getTagDate({ owner, repo, tag: ref }).then((data) => ({
            date: new Date(data.date),
            type: ReferenceType.TAG,
            sha: data.sha,
          })),
        ])
        return res
      } catch (e) {
        // did not find any branch/tag/commit
        if (e instanceof AggregateError) {
          throw new RefNotFoundError(`ref: ${ref} does not exist`)
        }
        throw e
      }
    },
    async getBranch({
      branch,
      owner,
      repo,
    }: {
      branch: string
      owner: string
      repo: string
    }) {
      return octokit.rest.repos.getBranch({
        branch: branch,
        owner,
        repo,
      })
    },
    async getCommit({
      commitSha,
      owner,
      repo,
    }: {
      commitSha: string
      owner: string
      repo: string
    }) {
      return octokit.rest.git.getCommit({
        repo,
        owner,
        commit_sha: commitSha,
      })
    },
    async getCommitWithDiff({
      commitSha,
      owner,
      repo,
    }: {
      commitSha: string
      owner: string
      repo: string
    }) {
      // Get commit details including diff
      const [commitData, diffData] = await Promise.all([
        // Get commit metadata
        octokit.rest.repos.getCommit({
          repo,
          owner,
          ref: commitSha,
        }),
        // Get commit diff
        octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
          owner,
          repo,
          ref: commitSha,
          headers: {
            Accept: 'application/vnd.github.v3.diff',
          },
        }),
      ])

      return {
        commit: commitData.data,
        diff: diffData.data as unknown as string,
      }
    },
    async getTagDate({
      tag,
      owner,
      repo,
    }: {
      tag: string
      owner: string
      repo: string
    }) {
      const refResponse = await octokit.rest.git.getRef({
        ref: `tags/${tag}`,
        owner,
        repo,
      })
      const tagSha = refResponse.data.object.sha
      if (refResponse.data.object.type === 'commit') {
        const res = await octokit.rest.git.getCommit({
          commit_sha: tagSha,
          owner,
          repo,
        })
        return {
          date: res.data.committer.date,
          sha: res.data.sha,
        }
      }
      const res = await octokit.rest.git.getTag({
        tag_sha: tagSha,
        owner,
        repo,
      })
      return {
        date: res.data.tagger.date,
        sha: res.data.sha,
      }
    },
    /**
     * Fetches commits for multiple PRs in a single GraphQL request.
     * This is much more efficient than making N separate REST API calls.
     *
     * @param params.owner - Repository owner
     * @param params.repo - Repository name
     * @param params.prNumbers - Array of PR numbers to fetch commits for
     * @returns Map of PR number to array of commit SHAs
     */
    async getPrCommitsBatch(params: {
      owner: string
      repo: string
      prNumbers: number[]
    }): Promise<Map<number, string[]>> {
      return executeBatchGraphQL(octokit, params.owner, params.repo, {
        items: params.prNumbers,
        aliasPrefix: 'prCommits',
        buildFragment: (prNumber, index) => `
          prCommits${index}: pullRequest(number: ${prNumber}) {
            commits(first: 100) {
              nodes {
                commit {
                  oid
                }
              }
            }
          }`,
        extractResult: (data) => {
          const prData = data as {
            commits?: { nodes: { commit: { oid: string } }[] }
          }
          if (prData?.commits?.nodes) {
            return prData.commits.nodes.map((node) => node.commit.oid)
          }
          return []
        },
      })
    },
    // todo: refactor the name for this function
    async createPr(params: {
      sourceRepoUrl: string
      filesPaths: string[]
      userRepoUrl: string
      title: string
      body: string
    }) {
      const { sourceRepoUrl, filesPaths, userRepoUrl, title, body } = params

      const { owner: sourceOwner, repo: sourceRepo } =
        parseGithubOwnerAndRepo(sourceRepoUrl)
      const { owner, repo } = parseGithubOwnerAndRepo(userRepoUrl)

      const [sourceFilePath, secondFilePath] = filesPaths

      const sourceFileContentResponse = await octokit.rest.repos.getContent({
        owner: sourceOwner,
        repo: sourceRepo,
        path: `/${sourceFilePath}`,
      })

      const { data: repository } = await octokit.rest.repos.get({ owner, repo })
      const defaultBranch = repository.default_branch

      // Create a new branch
      const newBranchName = `mobb/workflow-${Date.now()}`
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranchName}`,
        sha: await octokit.rest.git
          .getRef({ owner, repo, ref: `heads/${defaultBranch}` })
          .then((response) => response.data.object.sha),
      })
      const decodedContent = Buffer.from(
        // Check if file content exists and handle different response types
        typeof sourceFileContentResponse.data === 'object' &&
          !Array.isArray(sourceFileContentResponse.data) &&
          'content' in sourceFileContentResponse.data &&
          typeof sourceFileContentResponse.data.content === 'string'
          ? sourceFileContentResponse.data.content
          : '',
        'base64'
      ).toString('utf-8')

      const tree = [
        {
          path: sourceFilePath,
          mode: '100644' as const,
          type: 'blob' as const,
          content: decodedContent,
        },
      ]

      if (secondFilePath) {
        const secondFileContentResponse = await octokit.rest.repos.getContent({
          owner: sourceOwner,
          repo: sourceRepo,
          path: `/${secondFilePath}`,
        })
        const secondDecodedContent = Buffer.from(
          // Check if file content exists and handle different response types
          typeof secondFileContentResponse.data === 'object' &&
            !Array.isArray(secondFileContentResponse.data) &&
            'content' in secondFileContentResponse.data &&
            typeof secondFileContentResponse.data.content === 'string'
            ? secondFileContentResponse.data.content
            : '',
          'base64'
        ).toString('utf-8')

        tree.push({
          path: secondFilePath,
          mode: '100644' as const,
          type: 'blob' as const,
          content: secondDecodedContent,
        })
      }

      // Create a new commit with the file from the source repository
      const createTreeResponse = await octokit.rest.git.createTree({
        owner,
        repo,
        base_tree: await octokit.rest.git
          .getRef({ owner, repo, ref: `heads/${defaultBranch}` })
          .then((response) => response.data.object.sha),
        tree,
      })

      const createCommitResponse = await octokit.rest.git.createCommit({
        owner,
        repo,
        message: 'Add new yaml file',
        tree: createTreeResponse.data.sha,
        parents: [
          await octokit.rest.git
            .getRef({ owner, repo, ref: `heads/${defaultBranch}` })
            .then((response) => response.data.object.sha),
        ],
      })

      // Update the branch reference to point to the new commit
      await octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${newBranchName}`,
        sha: createCommitResponse.data.sha,
      })

      // Create the Pull Request
      const createPRResponse = await octokit.rest.pulls.create({
        owner,
        repo,
        title,
        head: newBranchName,
        head_repo: sourceRepo,
        body: safeBody(body, MAX_GH_PR_BODY_LENGTH),
        base: defaultBranch,
      })

      return {
        pull_request_url: createPRResponse.data.html_url,
      }
    },
    async getGithubBranchList(repoUrl: string) {
      const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
      return octokit.rest.repos.listBranches({
        owner,
        repo,
        per_page: MAX_BRANCHES_FETCH,
        page: 1,
      })
    },
    async createPullRequest(options: {
      targetBranchName: string
      sourceBranchName: string
      title: string
      body: string
      repoUrl: string
    }) {
      const { owner, repo } = parseGithubOwnerAndRepo(options.repoUrl)
      return octokit.rest.pulls.create({
        owner,
        repo,
        title: options.title,
        body: safeBody(options.body, MAX_GH_PR_BODY_LENGTH),
        head: options.sourceBranchName,
        base: options.targetBranchName,
        draft: false,
        maintainer_can_modify: true,
      })
    },
    async forkRepo(options: {
      repoUrl: string
    }): Promise<{ url: string | null }> {
      const { owner, repo } = parseGithubOwnerAndRepo(options.repoUrl)
      const createForkRes = await octokit.rest.repos.createFork({
        owner,
        repo,
        default_branch_only: false,
      })
      return { url: createForkRes.data.html_url }
    },
    async getUserInfo(): Promise<GetUserResponse> {
      return octokit.request(GET_USER)
    },
    async getPrCommits(params: {
      owner: string
      repo: string
      pull_number: number
    }) {
      // Use paginate to fetch all commits (default per_page is 30)
      const data = await octokit.paginate(octokit.rest.pulls.listCommits, {
        owner: params.owner,
        repo: params.repo,
        pull_number: params.pull_number,
      })
      return { data }
    },
    async getUserRepos() {
      return octokit.rest.repos.listForAuthenticatedUser({
        visibility: 'all',
        affiliation: 'owner,collaborator,organization_member',
        sort: 'updated',
        per_page: 100,
      })
    },
    async getRecentCommits(params: {
      owner: string
      repo: string
      since: string
    }) {
      const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
        owner: params.owner,
        repo: params.repo,
        since: params.since,
        per_page: 100,
      })
      return { data: commits }
    },
    async getRateLimitStatus() {
      const response = await octokit.rest.rateLimit.get()
      return {
        remaining: response.data.rate.remaining,
        reset: new Date(response.data.rate.reset * 1000),
        limit: response.data.rate.limit,
      }
    },
    async getRepoPullRequests(params: { owner: string; repo: string }) {
      return octokit.rest.pulls.list({
        owner: params.owner,
        repo: params.repo,
        state: 'all',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
      })
    },
    async listPRFiles(params: {
      owner: string
      repo: string
      pull_number: number
    }) {
      // Use paginate to fetch all files (handles PRs with >100 files)
      const data = await octokit.paginate(octokit.rest.pulls.listFiles, {
        owner: params.owner,
        repo: params.repo,
        pull_number: params.pull_number,
      })
      return { data }
    },

    /**
     * Batch fetch additions/deletions for multiple PRs via GraphQL.
     * Uses GITHUB_GRAPHQL_FRAGMENTS.PR_CHANGES for the field selection.
     */
    async getPrAdditionsDeletionsBatch(params: {
      owner: string
      repo: string
      prNumbers: number[]
    }): Promise<Map<number, ChangedLinesData>> {
      return executeBatchGraphQL(octokit, params.owner, params.repo, {
        items: params.prNumbers,
        aliasPrefix: 'pr',
        buildFragment: (prNumber, index) => `
          pr${index}: pullRequest(number: ${prNumber}) {
            ${GITHUB_GRAPHQL_FRAGMENTS.PR_CHANGES}
          }`,
        extractResult: (data) => {
          const prData = data as PrChangesGraphQLResponse
          if (
            prData.additions !== undefined &&
            prData.deletions !== undefined
          ) {
            return {
              additions: prData.additions,
              deletions: prData.deletions,
            }
          }
          return undefined
        },
      })
    },

    /**
     * Batch fetch comments for multiple PRs via GraphQL.
     * Uses GITHUB_GRAPHQL_FRAGMENTS.PR_COMMENTS for the field selection.
     */
    async getPrCommentsBatch(params: {
      owner: string
      repo: string
      prNumbers: number[]
    }): Promise<Map<number, PrCommentData[]>> {
      return executeBatchGraphQL(octokit, params.owner, params.repo, {
        items: params.prNumbers,
        aliasPrefix: 'pr',
        buildFragment: (prNumber, index) => `
          pr${index}: pullRequest(number: ${prNumber}) {
            ${GITHUB_GRAPHQL_FRAGMENTS.PR_COMMENTS}
          }`,
        extractResult: (data) => {
          const prData = data as PrCommentsGraphQLResponse
          if (prData.comments?.nodes) {
            return prData.comments.nodes.map((node) => ({
              author: node.author
                ? { login: node.author.login, type: node.author.__typename }
                : null,
              body: node.body,
            }))
          }
          return undefined
        },
      })
    },

    /**
     * Batch fetch PR data (additions/deletions + comments) for multiple PRs via GraphQL.
     * Combines PR_CHANGES and PR_COMMENTS fragments into a single API call for efficiency.
     * This is more efficient than calling getPrAdditionsDeletionsBatch and getPrCommentsBatch separately.
     */
    async getPrDataBatch(params: {
      owner: string
      repo: string
      prNumbers: number[]
    }): Promise<
      Map<number, { changedLines: ChangedLinesData; comments: PrCommentData[] }>
    > {
      return executeBatchGraphQL(octokit, params.owner, params.repo, {
        items: params.prNumbers,
        aliasPrefix: 'pr',
        buildFragment: (prNumber, index) => `
          pr${index}: pullRequest(number: ${prNumber}) {
            ${GITHUB_GRAPHQL_FRAGMENTS.PR_CHANGES}
            ${GITHUB_GRAPHQL_FRAGMENTS.PR_COMMENTS}
          }`,
        extractResult: (data) => {
          const prData = data as PrChangesGraphQLResponse &
            PrCommentsGraphQLResponse
          // Must have both additions/deletions and comments to be valid
          if (
            prData.additions !== undefined &&
            prData.deletions !== undefined
          ) {
            const comments = prData.comments?.nodes
              ? prData.comments.nodes.map((node) => ({
                  author: node.author
                    ? { login: node.author.login, type: node.author.__typename }
                    : null,
                  body: node.body,
                }))
              : []

            return {
              changedLines: {
                additions: prData.additions,
                deletions: prData.deletions,
              },
              comments,
            }
          }
          return undefined
        },
      })
    },

    async getPRMetricsGraphQL(params: {
      owner: string
      repo: string
      prNumber: number
    }): Promise<GetPRMetricsResponse> {
      const res = await octokit.graphql<GetPRMetricsResponse>(
        GET_PR_METRICS_QUERY,
        {
          owner: params.owner,
          repo: params.repo,
          prNumber: params.prNumber,
        }
      )
      return res
    },
    /**
     * Search PRs using GitHub's Search API with sorting
     * https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-issues-and-pull-requests
     */
    async searchPullRequests(params: {
      owner: string
      repo: string
      updatedAfter?: Date
      state?: 'open' | 'closed' | 'all'
      sort?: {
        field: 'updated' | 'created' | 'comments'
        order: 'asc' | 'desc'
      }
      perPage?: number
      page?: number
    }) {
      const {
        owner,
        repo,
        updatedAfter,
        state = 'all',
        sort = { field: 'updated', order: 'desc' },
        perPage = 10,
        page = 1,
      } = params

      // Build search query
      let query = `repo:${owner}/${repo} is:pr`

      if (updatedAfter) {
        const dateStr = updatedAfter.toISOString().split('T')[0]
        query += ` updated:>=${dateStr}`
      }

      if (state !== 'all') {
        query += ` is:${state}`
      }

      // Map sort field to GitHub's sort parameter
      // GitHub supports: comments, reactions, interactions, created, updated
      const githubSortField =
        sort.field === 'updated' || sort.field === 'created'
          ? sort.field
          : 'comments'

      const response = await octokit.rest.search.issuesAndPullRequests({
        q: query,
        sort: githubSortField,
        order: sort.order,
        per_page: perPage,
        page,
      })

      return {
        items: response.data.items,
        totalCount: response.data.total_count,
        hasMore: page * perPage < response.data.total_count,
      }
    },

    /**
     * Search repositories using GitHub's Search API.
     * Docs: https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories
     */
    async searchRepositories(params: {
      org: string | undefined
      sort?: { field: 'updated' | 'name' | 'created'; order: 'asc' | 'desc' }
      perPage?: number
      page?: number
    }) {
      const {
        org,
        sort = { field: 'updated', order: 'desc' },
        perPage = 10,
        page = 1,
      } = params

      if (!org) {
        throw new Error('Organization is required for repository search')
      }

      // Build search query
      const query = `org:${org}`

      // Map sort field to GitHub's sort parameter
      // GitHub supports: stars, forks, help-wanted-issues, updated
      // Note: 'name' is not directly supported by GitHub's repo search API
      // We always use 'updated' for date-based sorting, never 'created'
      const githubSortField = sort.field === 'name' ? undefined : 'updated'

      const response = await octokit.rest.search.repos({
        q: query,
        sort: githubSortField,
        order: sort.order,
        per_page: perPage,
        page,
      })

      return {
        items: response.data.items,
        totalCount: response.data.total_count,
        hasMore: page * perPage < response.data.total_count,
      }
    },
  }
}
