import { RequestError } from '@octokit/request-error'
import type { Endpoints } from '@octokit/types'
import { Octokit } from 'octokit'
import { z } from 'zod'

import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  ReferenceType,
  RefNotFoundError,
} from '../scm'
import { parseScmURL } from '../urlParser'

function removeTrailingSlash(str: string) {
  return str.trim().replace(/\/+$/, '')
}

const EnvVariablesZod = z.object({
  GITHUB_API_TOKEN: z.string().optional(),
})

const { GITHUB_API_TOKEN } = EnvVariablesZod.parse(process.env)

type ApiAuthOptions = {
  githubAuthToken?: string | null
}
const GetBlameDocument = `
      query GetBlame(
        $owner: String!
        $repo: String!
        $ref: String!
        $path: String!
      ) {
        repository(name: $repo, owner: $owner) {
          # branch name
          object(expression: $ref) {
            # cast Target to a Commit
            ... on Commit {
              # full repo-relative path to blame file
              blame(path: $path) {
                ranges {
                  commit {
                    author {
                      user {
                        name
                        login
                      }
                    }
                    authoredDate
                  }
                  startingLine
                  endingLine
                  age
                }
              }
            }
            
          }
        }
      }
    `

export type GithubBlameResponse = {
  repository: {
    object: {
      blame: {
        ranges: Array<{
          age: number
          endingLine: number
          startingLine: number
          commit: {
            author: {
              user: {
                email: string
                name: string
                login: string
              }
            }
          }
        }>
      }
    }
  }
}

function getOktoKit(options?: ApiAuthOptions) {
  const token = options?.githubAuthToken ?? GITHUB_API_TOKEN ?? ''
  return new Octokit({ auth: token })
}

export function getUserInfo({
  accessToken,
}: {
  accessToken: string
}): Promise<Endpoints['GET /user']['response']> {
  const oktoKit = getOktoKit({ githubAuthToken: accessToken })
  return oktoKit.request('GET /user')
}

export async function githubValidateParams(
  url: string | undefined,
  accessToken: string | undefined
) {
  try {
    const oktoKit = getOktoKit({ githubAuthToken: accessToken })
    if (accessToken) {
      await oktoKit.rest.users.getAuthenticated()
    }
    if (url) {
      const { owner, repo } = parseGithubOwnerAndRepo(url)
      await oktoKit.rest.repos.get({ repo, owner })
    }
  } catch (e) {
    const error = e as {
      code?: string
      status?: number
      statusCode?: number
      response?: { status?: number; statusCode?: number; code?: string }
    }
    const code =
      error.status ||
      error.statusCode ||
      error.response?.status ||
      error.response?.statusCode ||
      error.response?.code
    if (code === 401 || code === 403) {
      throw new InvalidAccessTokenError(`invalid github access token`)
    }
    if (code === 404) {
      throw new InvalidRepoUrlError(`invalid github repo Url ${url}`)
    }
    throw e
  }
}

export async function getGithubUsername(accessToken: string) {
  const oktoKit = getOktoKit({ githubAuthToken: accessToken })
  const res = await oktoKit.rest.users.getAuthenticated()
  return res.data.login
}

export async function getGithubIsUserCollaborator(
  username: string,
  accessToken: string,
  repoUrl: string
) {
  try {
    const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
    const oktoKit = getOktoKit({ githubAuthToken: accessToken })
    const res = await oktoKit.rest.repos.checkCollaborator({
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
}

export async function getGithubPullRequestStatus(
  accessToken: string,
  repoUrl: string,
  prNumber: number
) {
  const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
  const oktoKit = getOktoKit({ githubAuthToken: accessToken })
  const res = await oktoKit.rest.pulls.get({
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
}

export async function getGithubIsRemoteBranch(
  accessToken: string,
  repoUrl: string,
  branch: string
) {
  const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
  const oktoKit = getOktoKit({ githubAuthToken: accessToken })
  try {
    const res = await oktoKit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    })
    return branch === res.data.name
  } catch (e) {
    return false
  }
}

export async function getGithubRepoList(accessToken: string) {
  const oktoKit = getOktoKit({ githubAuthToken: accessToken })
  try {
    const githubRepos = await getRepos(oktoKit)
    return githubRepos.map(
      (repo: {
        language: string
        name: string
        html_url: string
        owner: { login: string }
        private: boolean
        updated_at: string
      }) => {
        const repoLanguages = []
        if (repo.language) {
          repoLanguages.push(repo.language)
        }
        return {
          repoName: repo.name,
          repoUrl: repo.html_url,
          repoOwner: repo.owner.login,
          repoLanguages,
          repoIsPublic: !repo.private,
          repoUpdatedAt: repo.updated_at,
        }
      }
    )
  } catch (e) {
    if (e instanceof RequestError && e.status === 401) {
      return []
    }
    if (e instanceof RequestError && e.status === 404) {
      return []
    }
    throw e
  }
}

export async function getGithubBranchList(
  accessToken: string,
  repoUrl: string
) {
  const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
  const oktoKit = getOktoKit({ githubAuthToken: accessToken })
  const res = await oktoKit.rest.repos.listBranches({
    owner,
    repo,
    per_page: 1000,
    page: 1,
  })
  return res.data.map((branch) => branch.name)
}

export async function createPullRequest(options: {
  accessToken: string
  targetBranchName: string
  sourceBranchName: string
  title: string
  body: string
  repoUrl: string
}) {
  const { owner, repo } = parseGithubOwnerAndRepo(options.repoUrl)
  const oktoKit = getOktoKit({ githubAuthToken: options.accessToken })
  const res = await oktoKit.rest.pulls.create({
    owner,
    repo,
    title: options.title,
    body: options.body,
    head: options.sourceBranchName,
    base: options.targetBranchName,
    draft: false,
    maintainer_can_modify: true,
  })
  return res.data.number
}

export async function forkRepo(options: {
  accessToken: string
  repoUrl: string
}): Promise<{ url: string | null }> {
  const { owner, repo } = parseGithubOwnerAndRepo(options.repoUrl)
  const oktoKit = getOktoKit({ githubAuthToken: options.accessToken })
  const res = await oktoKit.rest.repos.createFork({
    owner,
    repo,
    default_branch_only: false,
  })
  return { url: res.data.html_url ? String(res.data.html_url) : null }
}

async function getRepos(oktoKit: Octokit) {
  // For now limit is 100(maximum supported by github) if we will need more we need to implement pagination + search
  const res = await oktoKit.request('GET /user/repos?sort=updated', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      per_page: 100,
    },
  })
  return res.data
}

export async function getGithubRepoDefaultBranch(
  repoUrl: string,
  options?: ApiAuthOptions
): Promise<string> {
  const oktoKit = getOktoKit(options)
  const { owner, repo } = parseGithubOwnerAndRepo(repoUrl)
  return (await oktoKit.rest.repos.get({ repo, owner })).data.default_branch
}

export async function getGithubReferenceData(
  { ref, gitHubUrl }: { ref: string; gitHubUrl: string },
  options?: ApiAuthOptions
) {
  const { owner, repo } = parseGithubOwnerAndRepo(gitHubUrl)
  let res
  try {
    const oktoKit = getOktoKit(options)
    res = await Promise.any([
      getBranch({ owner, repo, branch: ref }, oktoKit).then((result) => ({
        date: result.data.commit.commit.committer?.date
          ? new Date(result.data.commit.commit.committer?.date)
          : undefined,
        type: ReferenceType.BRANCH,
        sha: result.data.commit.sha,
      })),
      getCommit({ commitSha: ref, repo, owner }, oktoKit).then((commit) => ({
        date: new Date(commit.data.committer.date),
        type: ReferenceType.COMMIT,
        sha: commit.data.sha,
      })),
      getTagDate({ owner, repo, tag: ref }, oktoKit).then((data) => ({
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
}

async function getBranch(
  { branch, owner, repo }: { branch: string; owner: string; repo: string },
  oktoKit: Octokit
) {
  return oktoKit.rest.repos.getBranch({
    branch: branch,
    owner,
    repo,
  })
}

async function getTagDate(
  { tag, owner, repo }: { tag: string; owner: string; repo: string },
  oktoKit: Octokit
) {
  const refResponse = await oktoKit.rest.git.getRef({
    ref: `tags/${tag}`,
    owner,
    repo,
  })
  const tagSha = refResponse.data.object.sha
  if (refResponse.data.object.type === 'commit') {
    const res = await oktoKit.rest.git.getCommit({
      commit_sha: tagSha,
      owner,
      repo,
    })
    return {
      date: res.data.committer.date,
      sha: res.data.sha,
    }
  }
  const res = await oktoKit.rest.git.getTag({
    tag_sha: tagSha,
    owner,
    repo,
  })
  return {
    date: res.data.tagger.date,
    sha: res.data.sha,
  }
}
async function getCommit(
  {
    commitSha,
    owner,
    repo,
  }: { commitSha: string; owner: string; repo: string },
  oktoKit: Octokit
) {
  return oktoKit.rest.git.getCommit({
    repo,
    owner,
    commit_sha: commitSha,
  })
}

export function parseGithubOwnerAndRepo(gitHubUrl: string): {
  owner: string
  repo: string
} {
  gitHubUrl = removeTrailingSlash(gitHubUrl)
  const parsingResult = parseScmURL(gitHubUrl)
  if (!parsingResult || parsingResult.hostname !== 'github.com') {
    throw new InvalidUrlPatternError(`invalid github repo Url ${gitHubUrl}`)
  }
  const { organization, repoName } = parsingResult

  if (!organization || !repoName) {
    throw new InvalidUrlPatternError(`invalid github repo Url ${gitHubUrl}`)
  }

  return { owner: organization, repo: repoName }
}

export async function queryGithubGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: ApiAuthOptions
) {
  const token = options?.githubAuthToken ?? GITHUB_API_TOKEN ?? ''
  const parameters = variables ?? {}
  const authorizationHeader = {
    headers: {
      authorization: `bearer ${token}`,
    },
  }
  try {
    const oktoKit = getOktoKit(options)
    const res = await oktoKit.graphql<T>(query, {
      ...parameters,
      ...authorizationHeader,
    })
    return res
  } catch (e) {
    if (e instanceof RequestError) {
      return null
    }
    throw e
  }
}

export async function getGithubBlameRanges(
  { ref, gitHubUrl, path }: { ref: string; gitHubUrl: string; path: string },
  options?: ApiAuthOptions
) {
  const { owner, repo } = parseGithubOwnerAndRepo(gitHubUrl)

  const variables = {
    owner,
    repo,
    path,
    ref,
  }
  const res = await queryGithubGraphql<GithubBlameResponse>(
    GetBlameDocument,
    variables,
    options
  )

  if (!res?.repository?.object?.blame?.ranges) {
    return []
  }

  return res.repository.object.blame.ranges.map((range) => ({
    startingLine: range.startingLine,
    endingLine: range.endingLine,
    email: range.commit.author.user.email,
    name: range.commit.author.user.name,
    login: range.commit.author.user.login,
  }))
}
export async function createPr(
  {
    sourceRepoUrl,
    filesPaths,
    userRepoUrl,
    title,
    body,
  }: {
    sourceRepoUrl: string
    filesPaths: string[]
    userRepoUrl: string
    title: string
    body: string
  },
  options?: ApiAuthOptions
) {
  const oktoKit = getOktoKit(options)

  const { owner: sourceOwner, repo: sourceRepo } =
    parseGithubOwnerAndRepo(sourceRepoUrl)
  const { owner, repo } = parseGithubOwnerAndRepo(userRepoUrl)

  const [sourceFilePath, secondFilePath] = filesPaths

  const sourceFileContentResponse = await oktoKit.rest.repos.getContent({
    owner: sourceOwner,
    repo: sourceRepo,
    path: '/' + sourceFilePath,
  })

  const { data: repository } = await oktoKit.rest.repos.get({ owner, repo })
  const defaultBranch = repository.default_branch

  // Create a new branch
  const newBranchName = `mobb/workflow-${Date.now()}`
  await oktoKit.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${newBranchName}`,
    sha: await oktoKit.rest.git
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
    const secondFileContentResponse = await oktoKit.rest.repos.getContent({
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
  const createTreeResponse = await oktoKit.rest.git.createTree({
    owner,
    repo,
    base_tree: await oktoKit.rest.git
      .getRef({ owner, repo, ref: `heads/${defaultBranch}` })
      .then((response) => response.data.object.sha),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tree,
  })

  const createCommitResponse = await oktoKit.rest.git.createCommit({
    owner,
    repo,
    message: 'Add new yaml file',
    tree: createTreeResponse.data.sha,
    parents: [
      await oktoKit.rest.git
        .getRef({ owner, repo, ref: `heads/${defaultBranch}` })
        .then((response) => response.data.object.sha),
    ],
  })

  // Update the branch reference to point to the new commit
  await oktoKit.rest.git.updateRef({
    owner,
    repo,
    ref: `heads/${newBranchName}`,
    sha: createCommitResponse.data.sha,
  })

  // Create the Pull Request
  const createPRResponse = await oktoKit.rest.pulls.create({
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
}
