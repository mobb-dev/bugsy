import { OctokitOptions } from '@octokit/core'
import { RequestError } from '@octokit/request-error'

import { MAX_BRANCHES_FETCH } from '../constants'
import { RefNotFoundError } from '../errors'
import { ReferenceType, ScmRepoInfo } from '../types'
import {
  CREATE_OR_UPDATE_A_REPOSITORY_SECRET,
  DELETE_COMMENT_PATH,
  DELETE_GENERAL_PR_COMMENT,
  GET_A_REPOSITORY_PUBLIC_KEY,
  GET_BLAME_DOCUMENT,
  GET_GENERAL_PR_COMMENTS,
  GET_PR,
  GET_PR_COMMENT_PATH,
  GET_PR_COMMENTS_PATH,
  GET_USER,
  GET_USER_REPOS,
  POST_COMMENT_PATH,
  POST_GENERAL_PR_COMMENT,
  REPLY_TO_CODE_REVIEW_COMMENT_PATH,
  UPDATE_COMMENT_PATH,
} from './consts'
import {
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
  GetPrParams,
  GetPrResponse,
  GetPrReviewCommentsParams,
  GetUserResponse,
  GithubBlameResponse,
  PostCommentParams,
  PostCommentReposnse,
  PostGeneralPrCommentParams,
  PostGeneralPrCommentResponse,
  ReplyToCodeReviewCommentPathParams,
  ReplyToCodeReviewCommentPathResponse,
  UpdateCommentParams,
  UpdateCommentResponse,
} from './types'
import { getOctoKit, parseGithubOwnerAndRepo } from './utils'

export function getGithubSdk(params: OctokitOptions = {}) {
  const octokit = getOctoKit(params)
  return {
    async postPrComment(
      params: PostCommentParams
    ): Promise<PostCommentReposnse> {
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
        const res = await octokit.rest.repos.checkCollaborator({
          owner,
          repo,
          username,
        })
        if (res.status === 204) {
          return true
        }
      } catch (e) {
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
      } catch (e) {
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
          return []
        }
        if (e instanceof RequestError && e.status === 404) {
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
    async getGithubBlameRanges(params: {
      ref: string
      gitHubUrl: string
      path: string
    }) {
      const { ref, gitHubUrl, path } = params
      const { owner, repo } = parseGithubOwnerAndRepo(gitHubUrl)
      const res = await octokit.graphql<GithubBlameResponse>(
        GET_BLAME_DOCUMENT,
        {
          owner,
          repo,
          path,
          ref,
        }
      )
      if (!res?.repository?.object?.blame?.ranges) {
        return []
      }
      return res.repository.object.blame.ranges.map((range) => ({
        startingLine: range.startingLine,
        endingLine: range.endingLine,
        email: range.commit.author.user?.email || '',
        name: range.commit.author.user?.name || '',
        login: range.commit.author.user?.login || '',
      }))
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
        path: '/' + sourceFilePath,
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sourceFileContentResponse.data.content,
        'base64'
      ).toString('utf-8')

      const tree = [
        {
          path: sourceFilePath,
          mode: '100644',
          type: 'blob',
          content: decodedContent,
        },
      ]

      if (secondFilePath) {
        const secondFileContentResponse = await octokit.rest.repos.getContent({
          owner: sourceOwner,
          repo: sourceRepo,
          path: '/' + secondFilePath,
        })
        const secondDecodedContent = Buffer.from(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          secondFileContentResponse.data.content,
          'base64'
        ).toString('utf-8')

        tree.push({
          path: secondFilePath,
          mode: '100644',
          type: 'blob',
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
        body,
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
        body: options.body,
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
  }
}
