import { MAX_BRANCHES_FETCH, ReferenceType, ScmRepoInfo } from '..'
import {
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  RefNotFoundError,
} from '../errors'
import { AdoTokenTypeEnum, DEFUALT_ADO_ORIGIN } from './constants'
import {
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
        if (!branchStatus || !branchStatus.commit) {
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
          description: body,
        },
        repo,
        projectName
      )
      return res.pullRequestId
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
          if (!res.commit || !res.commit.commitId) {
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
          if (!commit || !commit.commitId) {
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
    getAdoBlameRanges() {
      return []
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
        const repoInfoList = (
          await Promise.allSettled(
            orgRepos.map(async (repo) => {
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
                  branch.commit?.committer?.date?.toDateString() ||
                  repo.project?.lastUpdateTime?.toDateString() ||
                  new Date().toDateString(),
              }
            })
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
