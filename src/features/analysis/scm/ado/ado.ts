import pLimit from 'p-limit'

import { MAX_BRANCHES_FETCH, ReferenceType, ScmRepoInfo } from '..'
import {
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  RefNotFoundError,
} from '../errors'
import { safeBody } from '../utils'
import { AdoTokenTypeEnum, DEFUALT_ADO_ORIGIN } from './constants'
import {
  AdoPullRequestStatus,
  GetAdoApiClientParams,
  ProjectVisibility,
  ValidAdoPullRequestStatus,
} from './types'
import {
  getAdoApiClient,
  getAdoClientParams,
  getAdoTokenInfo,
  getOrgsForOauthToken,
  parseAdoOwnerAndRepo,
  validateAdoRepo,
} from './utils'
import { ValidPullRequestStatusZ } from './validation'

const MAX_ADO_PR_BODY_LENGTH = 150000

export async function getAdoSdk(params: GetAdoApiClientParams) {
  const api = await getAdoApiClient(params)
  return {
    async getAdoIsUserCollaborator({ repoUrl }: { repoUrl: string }) {
      try {
        const git = await api.getGitApi()
        await validateAdoRepo({ git, repoUrl })
        return true
      } catch (e) {
        return false
      }
    },
    async getAdoPullRequestStatus({
      repoUrl,
      prNumber,
    }: {
      repoUrl: string
      prNumber: number
    }): Promise<ValidAdoPullRequestStatus> {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const res = await git.getPullRequest(repo, prNumber, projectName)
      const parsedPullRequestStatus = ValidPullRequestStatusZ.safeParse(
        res.status
      )
      if (!parsedPullRequestStatus.success) {
        throw new Error('bad pr status for ADO')
      }
      return parsedPullRequestStatus.data
    },
    async addCommentToAdoPullRequest({
      repoUrl,
      prNumber,
      markdownComment,
    }: {
      repoUrl: string
      prNumber: number
      markdownComment: string
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const comment = {
        comments: [
          {
            parentCommentId: 0, // Root comment
            content: markdownComment,
            commentType: 1, // Default type
          },
        ],
      }

      await git.createThread(comment, repo, prNumber, projectName)
    },
    async getAdoIsRemoteBranch({
      repoUrl,
      branch,
    }: {
      repoUrl: string
      branch: string
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      try {
        const branchStatus = await git.getBranch(repo, branch, projectName)
        if (!branchStatus?.commit) {
          console.log(`no branch status: ${JSON.stringify(branchStatus)}`)
          throw new InvalidRepoUrlError('no branch status')
        }
        return branchStatus.name === branch
      } catch (e) {
        console.error(`error in getAdoIsRemoteBranch: ${JSON.stringify(e)}`)
        return false
      }
    },
    async getAdoPrUrl({ url, prNumber }: { url: string; prNumber: number }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(url)
      const git = await api.getGitApi()
      const getRepositoryRes = await git.getRepository(
        decodeURI(repo),
        projectName ? decodeURI(projectName) : undefined
      )
      return `${getRepositoryRes.webUrl}/pullrequest/${prNumber}`
    },
    async getAdoCommitUrl({
      url,
      commitId,
    }: {
      url: string
      commitId: string
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(url)
      const git = await api.getGitApi()
      const getRepositoryRes = await git.getRepository(
        decodeURI(repo),
        projectName ? decodeURI(projectName) : undefined
      )
      return `${getRepositoryRes.webUrl}/commit/${commitId}`
    },
    async getAdoBranchCommitsUrl({
      repoUrl,
      branch,
    }: {
      repoUrl: string
      branch: string
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const getRepositoryRes = await git.getRepository(
        decodeURI(repo),
        projectName ? decodeURI(projectName) : undefined
      )
      return `${getRepositoryRes.webUrl}/commits?itemVersion=${branch}`
    },
    getAdoDownloadUrl({
      repoUrl,
      branch,
    }: {
      repoUrl: string
      branch: string
    }) {
      const { owner, repo, projectName, prefixPath } =
        parseAdoOwnerAndRepo(repoUrl)
      const url = new URL(repoUrl)
      const origin = url.origin.toLowerCase().endsWith('.visualstudio.com')
        ? DEFUALT_ADO_ORIGIN
        : url.origin.toLowerCase()
      // note wer can't use encode url params since we have encoding issue with the []
      const params = `path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=${branch}&resolveLfs=true&$format=zip&api-version=5.0&download=true`
      const path = [
        prefixPath,
        owner,
        projectName,
        '_apis',
        'git',
        'repositories',
        repo,
        'items',
        'items',
      ]
        // we use filter since prefix path can be empty string
        .filter(Boolean)
        .join('/')
      return new URL(`${path}?${params}`, origin).toString()
    },
    async getAdoBranchList({ repoUrl }: { repoUrl: string }) {
      try {
        const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
        const git = await api.getGitApi()
        const res = await git.getBranches(repo, projectName)
        res.sort((a, b) => {
          if (!a.commit?.committer?.date || !b.commit?.committer?.date) {
            return 0
          }
          return (
            b.commit?.committer?.date.getTime() -
            a.commit?.committer?.date.getTime()
          )
        })
        return res
          .reduce((acc, branch) => {
            if (!branch.name) {
              return acc
            }
            acc.push(branch.name)
            return acc
          }, [] as string[])
          .slice(0, MAX_BRANCHES_FETCH)
      } catch (e) {
        return []
      }
    },
    async createAdoPullRequest(options: {
      targetBranchName: string
      sourceBranchName: string
      title: string
      body: string
      repoUrl: string
    }) {
      const { repoUrl, sourceBranchName, targetBranchName, title, body } =
        options
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const res = await git.createPullRequest(
        {
          sourceRefName: `refs/heads/${sourceBranchName}`,
          targetRefName: `refs/heads/${targetBranchName}`,
          title,
          description: safeBody(body, MAX_ADO_PR_BODY_LENGTH),
        },
        repo,
        projectName
      )
      return res.pullRequestId
    },
    async getAdoPullRequestMetadata({
      repoUrl,
      prNumber,
    }: {
      repoUrl: string
      prNumber: number
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const pr = await git.getPullRequest(repo, prNumber, projectName)
      if (!pr) {
        throw new Error(`Pull request #${prNumber} not found`)
      }
      return {
        title: pr.title,
        targetBranch: (pr.targetRefName || '').replace('refs/heads/', ''),
        sourceBranch: (pr.sourceRefName || '').replace('refs/heads/', ''),
        headCommitSha:
          pr.lastMergeSourceCommit?.commitId ||
          pr.lastMergeCommit?.commitId ||
          '',
      }
    },
    async getAdoPrFiles({
      repoUrl,
      prNumber,
    }: {
      repoUrl: string
      prNumber: number
    }): Promise<string[]> {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const iterations = await git.getPullRequestIterations(
        repo,
        prNumber,
        projectName
      )
      if (!iterations || iterations.length === 0) {
        return []
      }
      const lastIteration = iterations[iterations.length - 1]
      if (!lastIteration?.id) {
        return []
      }
      const iterationId = lastIteration.id
      const changes = await git.getPullRequestIterationChanges(
        repo,
        prNumber,
        iterationId,
        projectName
      )
      if (!changes?.changeEntries) {
        return []
      }
      return changes.changeEntries
        .filter((entry) => {
          // Include added, modified, renamed files (exclude deletes)
          const changeType = entry.changeType
          // ADO VersionControlChangeType: Add=1, Edit=2, Rename=8, SourceRename=1024
          // Delete=16 should be excluded
          return changeType !== 16 && entry.item?.path
        })
        .map((entry) => {
          // Remove leading slash from ADO paths
          const path = entry.item!.path!
          return path.startsWith('/') ? path.slice(1) : path
        })
    },
    async searchAdoPullRequests({
      repoUrl,
      status,
      skip,
      top,
    }: {
      repoUrl: string
      status?: AdoPullRequestStatus
      skip?: number
      top?: number
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const searchCriteria = {
        // Cast to number to avoid TypeScript enum compatibility issues between
        // our AdoPullRequestStatus and azure-devops-node-api's PullRequestStatus
        status: (status ?? AdoPullRequestStatus.All) as number,
      }
      const prs = await git.getPullRequests(
        repo,
        searchCriteria,
        projectName,
        undefined, // maxCommentLength
        skip,
        top
      )
      return prs
    },
    async getAdoPullRequestMetrics({
      repoUrl,
      prNumber,
    }: {
      repoUrl: string
      prNumber: number
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const pr = await git.getPullRequest(repo, prNumber, projectName)
      if (!pr) {
        throw new Error(`Pull request #${prNumber} not found`)
      }

      // Get PR threads (comments)
      const threads = await git.getThreads(repo, prNumber, projectName)
      const commentIds = (threads || [])
        .filter((t) => t.id && t.comments && t.comments.length > 0)
        .map((t) => String(t.id))

      // ADO doesn't expose line counts via its API without fetching individual file diffs.
      // Return 0 and let the consumer enrich from S3 (same approach as GitLab).
      return {
        pr,
        commentIds,
        linesAdded: 0,
      }
    },
    async getAdoRecentCommits({
      repoUrl,
      since,
    }: {
      repoUrl: string
      since: string
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()

      // Get the default branch to fetch commits from
      const repository = await git.getRepository(
        decodeURI(repo),
        projectName ? decodeURI(projectName) : undefined
      )
      const defaultBranch = repository.defaultBranch?.replace('refs/heads/', '')

      const commits = await git.getCommits(
        repo,
        {
          fromDate: since,
          itemVersion: defaultBranch ? { version: defaultBranch } : undefined,
          $top: 100,
        },
        projectName
      )
      return commits
    },
    async getAdoPrCommits({
      repoUrl,
      prNumber,
    }: {
      repoUrl: string
      prNumber: number
    }): Promise<string[]> {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const commits = await git.getPullRequestCommits(
        repo,
        prNumber,
        projectName
      )
      return (commits || []).filter((c) => c.commitId).map((c) => c.commitId!)
    },
    async getAdoRepoDefaultBranch({
      repoUrl,
    }: {
      repoUrl: string
    }): Promise<string> {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const getRepositoryRes = await git.getRepository(
        decodeURI(repo),
        projectName ? decodeURI(projectName) : undefined
      )
      if (!getRepositoryRes?.defaultBranch) {
        throw new InvalidRepoUrlError('no default branch')
      }

      return getRepositoryRes.defaultBranch.replace('refs/heads/', '')
    },
    // todo: refactor this function
    async getAdoReferenceData({
      ref,
      repoUrl,
    }: {
      ref: string
      repoUrl: string
    }) {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)

      if (!projectName) {
        throw new InvalidUrlPatternError('no project name')
      }
      const git = await api.getGitApi()
      const results = await Promise.allSettled([
        (async () => {
          const res = await git.getBranch(repo, ref, projectName)
          if (!res.commit?.commitId) {
            throw new InvalidRepoUrlError('no commit on branch')
          }
          return {
            sha: res.commit.commitId,
            type: ReferenceType.BRANCH,
            date: res.commit.committer?.date || new Date(),
          }
        })(),
        (async () => {
          const res = await git.getCommits(
            repo,
            {
              fromCommitId: ref,
              toCommitId: ref,
              $top: 1,
            },
            projectName
          )
          const commit = res[0]
          if (!commit?.commitId) {
            throw new Error('no commit')
          }
          return {
            sha: commit.commitId,
            type: ReferenceType.COMMIT,
            date: commit.committer?.date || new Date(),
          }
        })(),
        (async () => {
          const res = await git.getRefs(
            repo,
            projectName,
            `tags/${ref}`,
            false,
            false,
            false,
            false,
            true
          )
          if (!res[0] || (!res[0].objectId && !res[0].peeledObjectId)) {
            throw new Error('no tag ref')
          }
          const sha = res[0].peeledObjectId || res[0].objectId
          if (!sha) {
            throw new Error('no sha')
          }
          const commitRes = await git.getCommits(
            repo,
            {
              fromCommitId: sha,
              toCommitId: sha,
              $top: 1,
            },
            projectName
          )
          const commit = commitRes[0]
          if (!commit) {
            throw new Error('no commit')
          }
          return {
            sha,
            type: ReferenceType.TAG,
            date: commit.committer?.date || new Date(),
          }
        })(),
      ])
      const [branchRes, commitRes, tagRes] = results
      if (tagRes.status === 'fulfilled') {
        return tagRes.value
      }
      if (branchRes.status === 'fulfilled') {
        return branchRes.value
      }
      if (commitRes.status === 'fulfilled') {
        return commitRes.value
      }
      throw new RefNotFoundError(`ref: ${ref} does not exist`)
    },
  }
}

export async function getAdoRepoList({
  orgName,
  tokenOrg,
  accessToken,
}: {
  orgName: string | undefined
  tokenOrg: string | undefined
  accessToken: string
}) {
  let orgs: string[] = []
  const adoTokenInfo = getAdoTokenInfo(accessToken)
  if (adoTokenInfo.type === AdoTokenTypeEnum.NONE) {
    return []
  }
  if (adoTokenInfo.type === AdoTokenTypeEnum.OAUTH) {
    orgs = await getOrgsForOauthToken({ oauthToken: accessToken })
  }
  if (orgs.length === 0 && !orgName) {
    throw new Error(`no orgs for ADO`)
  } else if (orgs.length === 0 && orgName) {
    orgs = [orgName as string]
  }

  const repos = (
    await Promise.allSettled(
      orgs.map(async (org) => {
        const orgApi = await getAdoApiClient({
          ...(await getAdoClientParams({
            accessToken,
            tokenOrg: tokenOrg || org,
            url: undefined,
          })),
          orgName: org,
        })
        const gitOrg = await orgApi.getGitApi()
        const orgRepos = await gitOrg.getRepositories()
        const repoLimit = pLimit(5)
        const repoInfoList = (
          await Promise.allSettled(
            orgRepos.map((repo) =>
              repoLimit(async () => {
                if (!repo.name || !repo.remoteUrl || !repo.defaultBranch) {
                  throw new InvalidRepoUrlError('bad repo')
                }
                const branch = await gitOrg.getBranch(
                  repo.name,
                  repo.defaultBranch.replace(/^refs\/heads\//, ''),
                  repo.project?.name
                )
                return {
                  repoName: repo.name,
                  repoUrl: repo.remoteUrl.replace(
                    /^[hH][tT][tT][pP][sS]:\/\/[^/]+@/,
                    'https://'
                  ),
                  repoOwner: org,
                  repoIsPublic:
                    repo.project?.visibility === ProjectVisibility.Public,
                  repoLanguages: [],
                  repoUpdatedAt:
                    // Use the latest available timestamp.
                    // branch.commit.committer.date = last commit on default branch.
                    // project.lastUpdateTime = last project-level change (may be stale).
                    // ADO doesn't expose a per-repo "last pushed" date like GitHub does,
                    // so feature branch pushes won't be reflected until merged.
                    branch.commit?.committer?.date?.toISOString() ||
                    repo.project?.lastUpdateTime?.toISOString() ||
                    new Date().toISOString(),
                }
              })
            )
          )
        ).reduce((acc, res) => {
          if (res.status === 'fulfilled') {
            acc.push(res.value)
          }
          return acc
        }, [] as ScmRepoInfo[])
        return repoInfoList
      })
    )
  ).reduce((acc, res) => {
    if (res.status === 'fulfilled') {
      return acc.concat(res.value)
    }
    return acc
  }, [] as ScmRepoInfo[])
  return repos
}
