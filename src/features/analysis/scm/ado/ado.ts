import pLimit from 'p-limit'

import { contextLogger } from '../../../../utils/contextLogger'
import {
  MAX_BRANCHES_FETCH,
  RecentCommitAuthor,
  ReferenceType,
  ScmRepoInfo,
} from '..'
import { MAX_ACTIVE_BRANCHES_SCAN } from '../constants'
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
    // Distinct commit authors since `since`, paged with $skip (the plain
    // getAdoRecentCommits above fetches only the first 100 — no pagination — so
    // it under-reports 90-day contributors on any active repo). Accumulates one
    // row per author as pages arrive → memory bounded by author count, uncapped
    // walk (the per-repo sync timeout bounds pathological repos). ADO commits
    // carry no stable author account id here, so authors are keyed by email.
    async getAdoRecentCommitAuthors({
      repoUrl,
      since,
    }: {
      repoUrl: string
      since: string
    }): Promise<RecentCommitAuthor[]> {
      const { repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
      const git = await api.getGitApi()
      const repository = await git.getRepository(
        decodeURI(repo),
        projectName ? decodeURI(projectName) : undefined
      )
      const defaultBranch = repository.defaultBranch?.replace('refs/heads/', '')
      const byEmail = new Map<string, RecentCommitAuthor>()
      const PAGE = 100

      // Accumulate distinct authors (keyed by lowercased email), keeping the most
      // recent commit date. We do NOT early-stop on an already-seen commit: ADO
      // returns commits newest-first by date, not strictly topologically, so a
      // branch's unique in-window commit can sort after shared/merged history —
      // stopping early would drop a feature-branch-only committer. `fromDate`
      // bounds every walk to the window; the active-branch cap + per-repo timeout
      // bound the cost of re-walking shared in-window history per branch.
      const accumulate = (page: Awaited<ReturnType<typeof git.getCommits>>) => {
        for (const c of page) {
          const email = c.author?.email
          if (!email) continue
          const date = c.author?.date
            ? new Date(c.author.date).toISOString()
            : since
          const key = email.toLowerCase()
          const prev = byEmail.get(key)
          if (
            !prev ||
            new Date(date).getTime() > new Date(prev.date).getTime()
          ) {
            byEmail.set(key, {
              email: key,
              name: c.author?.name ?? null,
              date,
              externalId: null,
              isBot: false,
            })
          }
        }
      }

      const walk = async (branch: string | undefined) => {
        let skip = 0
        let hasMore = true
        while (hasMore) {
          const page = await git.getCommits(
            repo,
            {
              fromDate: since,
              itemVersion: branch ? { version: branch } : undefined,
              $top: PAGE,
              $skip: skip,
            },
            projectName
          )
          const count = page?.length ?? 0
          if (count > 0) {
            accumulate(page)
          }
          hasMore = count === PAGE
          skip += PAGE
        }
      }

      // 1) Default branch — the bulk of history.
      await walk(defaultBranch)

      // 2) Every OTHER branch active within the window, most-recently-committed
      //    first. git.getBranches is UNSORTED, so we sort by tip date and keep
      //    only branches whose tip is inside the window before applying the cap —
      //    otherwise the cap could drop the active branches and keep stale ones.
      //    A committer whose only recent commits are on a feature/release branch
      //    is still counted. Any failure falls back to the default-branch authors.
      try {
        const sinceMs = new Date(since).getTime()
        const branches = await git.getBranches(repo, projectName)
        const active = (branches ?? [])
          .filter(
            (b) =>
              !!b.name &&
              b.name !== defaultBranch &&
              !!b.commit?.committer?.date &&
              b.commit.committer.date.getTime() >= sinceMs
          )
          .sort(
            (a, b) =>
              (b.commit?.committer?.date?.getTime() ?? 0) -
              (a.commit?.committer?.date?.getTime() ?? 0)
          )
          .map((b) => b.name as string)
        if (active.length > MAX_ACTIVE_BRANCHES_SCAN) {
          console.warn(
            `[ADO] active-branch scan hit cap (${MAX_ACTIVE_BRANCHES_SCAN}) for ${repoUrl}; some branches skipped`
          )
        }
        for (const branch of active.slice(0, MAX_ACTIVE_BRANCHES_SCAN)) {
          await walk(branch)
        }
      } catch (err) {
        console.warn(
          `[ADO] all-branch author scan failed for ${repoUrl}; using default-branch count`,
          err instanceof Error ? err.message : String(err)
        )
      }
      return [...byEmail.values()]
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
    async listProjectMembers({ repoUrl }: { repoUrl: string }) {
      try {
        const { projectName } = parseAdoOwnerAndRepo(repoUrl)
        if (!projectName) return []
        const coreApi = await api.getCoreApi()
        const teams = await coreApi.getTeams(projectName)
        const allMembers: {
          id: string
          displayName: string
          uniqueName: string
          imageUrl: string
        }[] = []
        const seenIds = new Set<string>()
        for (const team of teams) {
          if (!team.id || !team.projectId) continue
          const members = await coreApi.getTeamMembersWithExtendedProperties(
            team.projectId,
            team.id
          )
          for (const member of members) {
            const identity = member.identity
            if (!identity?.id || seenIds.has(identity.id)) continue
            seenIds.add(identity.id)
            allMembers.push({
              id: identity.id,
              displayName: identity.displayName ?? '',
              uniqueName:
                ((identity as Record<string, unknown>)[
                  'uniqueName'
                ] as string) ?? '',
              imageUrl:
                ((identity as Record<string, unknown>)['imageUrl'] as string) ??
                '',
            })
          }
        }
        return allMembers
      } catch (e) {
        contextLogger.warn(
          '[listProjectMembers] Failed to list ADO project members — scope may be insufficient',
          { error: e instanceof Error ? e.message : String(e), repoUrl }
        )
        return []
      }
    },
  }
}

export async function getAdoRepoList({
  orgName,
  tokenOrg,
  accessToken,
  url,
}: {
  orgName: string | undefined
  tokenOrg: string | undefined
  accessToken: string
  url?: string | undefined
}) {
  let orgs: string[] = []
  const adoTokenInfo = getAdoTokenInfo(accessToken)
  if (adoTokenInfo.type === AdoTokenTypeEnum.NONE) {
    return []
  }
  if (adoTokenInfo.type === AdoTokenTypeEnum.OAUTH) {
    orgs = await getOrgsForOauthToken({ oauthToken: accessToken })
  }
  const effectiveOrgName = orgName || tokenOrg
  if (orgs.length === 0 && !effectiveOrgName) {
    throw new Error(`no orgs for ADO`)
  } else if (orgs.length === 0 && effectiveOrgName) {
    orgs = [effectiveOrgName]
  }

  const repos = (
    await Promise.allSettled(
      orgs.map(async (org) => {
        const orgApi = await getAdoApiClient({
          ...(await getAdoClientParams({
            accessToken,
            tokenOrg: tokenOrg || org,
            url,
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
