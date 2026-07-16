import querystring from 'node:querystring'

import * as bitbucketPkgNode from 'bitbucket'
import bitbucketPkg, { APIClient, Schema } from 'bitbucket'
import Debug from 'debug'
import { z } from 'zod'

import { MAX_ACTIVE_BRANCHES_SCAN } from '../constants'
import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  RefNotFoundError,
} from '../errors'
import { parseScmURL, ScmType } from '../shared/src'
import {
  GetReferenceResult,
  GetReferenceResultZ,
  RecentCommitAuthor,
  ReferenceType,
  ScmRepoInfo,
} from '../types'
import { normalizeUrl, shouldValidateUrl } from '../utils'
import { safeBody } from '../utils'
import {
  CreatePullRequestParams,
  GetBitbucketTokenArgs,
  GetBitbucketTokenRes,
  GetReposParam,
} from './types'
import { BitbucketAuthResultZ } from './validation'

const debug = Debug('scm:bitbucket')

// Permission-denied only (member listing needs elevated scope) — safe to
// swallow and fall back to commit authors. Auth/rate-limit/network errors must
// propagate so the contributor sync classifies the repo.
function isBitbucketPermissionDenied(e: unknown): boolean {
  const status = (e as { status?: number; response?: { status?: number } })
    ?.status
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase()
  return status === 403 || /forbidden|insufficient/.test(msg)
}

const BITBUCKET_HOSTNAME = 'bitbucket.org'

const TokenExpiredErrorZ = z.object({
  status: z.number(),
  error: z.object({
    type: z.string(),
    error: z.object({
      message: z.string(),
    }),
  }),
})

const BITBUCKET_ACCESS_TOKEN_URL = `https://${BITBUCKET_HOSTNAME}/site/oauth2/access_token`

const MAX_BITBUCKET_PR_BODY_LENGTH = 32768

type BitbucketRequestTypeKeys = keyof typeof bitbucketRequestType
export type BitbucketRequestType =
  (typeof bitbucketRequestType)[BitbucketRequestTypeKeys]

const BitbucketParseResultZ = z.object({
  organization: z.string(),
  repoName: z.string(),
  hostname: z.literal(BITBUCKET_HOSTNAME),
})
// Response schema for GET /2.0/user/workspaces/{workspace}/permissions/repositories
// https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-user-workspaces-workspace-permissions-repositories-get
const UserWorkspacePermissionsRepositoriesResponseZ = z.object({
  values: z
    .array(
      z.object({
        repository: z
          .object({
            full_name: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional(),
})
export function parseBitbucketOrganizationAndRepo(bitbucketUrl: string): {
  workspace: string
  repo_slug: string
} {
  const parsedGitHubUrl = normalizeUrl(bitbucketUrl)
  const parsingResult = parseScmURL(parsedGitHubUrl, ScmType.Bitbucket)
  const validatedBitbucketResult = BitbucketParseResultZ.parse(parsingResult)

  return {
    workspace: validatedBitbucketResult.organization,
    repo_slug: validatedBitbucketResult.repoName,
  }
}
const bitbucketRequestType = {
  CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
} as const

export async function getBitbucketToken(
  params: GetBitbucketTokenArgs
): Promise<GetBitbucketTokenRes> {
  const { bitbucketClientId, bitbucketClientSecret, authType } = params
  try {
    const res = await fetch(BITBUCKET_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + btoa(`${bitbucketClientId}:${bitbucketClientSecret}`),
      },
      body: querystring.stringify(
        authType === 'refresh_token'
          ? {
              grant_type: authType,
              refresh_token: params.refreshToken,
            }
          : {
              grant_type: authType,
              code: params.code,
            }
      ),
    })
    const authResult = await res.json()

    const parseResult = BitbucketAuthResultZ.safeParse(authResult)
    if (!parseResult.success) {
      debug(
        `failed to parse bitbucket auth result for: ${authType}`,
        parseResult.error
      )
      return {
        success: false,
      }
    }
    return {
      success: true,
      authResult: parseResult.data,
    }
  } catch (e) {
    debug(`failed to get bitbucket token:`, e)
    return {
      success: false,
    }
  }
}

type GetBranchParams = {
  repoUrl: string
  branchName: string
}

type GetCommitParams = {
  repoUrl: string
  commitSha: string
}

type GetBitbucketSdkParams =
  | { authType: 'public' }
  | { authType: 'token'; token: string }
  | { authType: 'basic'; username: string; password: string }

function getBitbucketInstance(params: GetBitbucketSdkParams) {
  // we have an issue importing the bitbucket package both in bugsy and node - https://linear.app/mobb/issue/MOBB-2190
  const BitbucketConstructor =
    bitbucketPkg && 'Bitbucket' in bitbucketPkg
      ? bitbucketPkg.Bitbucket
      : bitbucketPkgNode.Bitbucket
  switch (params.authType) {
    case 'public':
      return new BitbucketConstructor()
    case 'token':
      return new BitbucketConstructor({ auth: { token: params.token } })
    case 'basic':
      return new BitbucketConstructor({
        auth: {
          password: params.password,
          username: params.username,
        },
      })
  }
}
type BitbucketSdk = ReturnType<typeof getBitbucketSdk>
export function getBitbucketSdk(params: GetBitbucketSdkParams) {
  const bitbucketClient = getBitbucketInstance(params)

  return {
    getAuthType() {
      return params.authType
    },
    async getRepos(params?: GetReposParam): Promise<ScmRepoInfo[]> {
      const repoRes = params?.workspaceSlug
        ? await getRepositoriesByWorkspace(bitbucketClient, {
            workspaceSlug: params.workspaceSlug,
          })
        : await getAllUsersRepositories(bitbucketClient)

      // for some reason the bitbucket client returns a list of repos with a null value
      // even though the api docents the values are not nullable
      // https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-get
      return repoRes.map((repo) => ({
        repoIsPublic: !repo.is_private,
        repoName: repo.name || 'unknown repo name',
        repoOwner: (repo.owner?.['username'] || 'unknown owner') as string,
        repoLanguages: repo.language ? [repo.language] : [],
        repoUpdatedAt: repo.updated_on
          ? repo.updated_on
          : new Date().toISOString(),
        repoUrl: repo.links?.html?.href || '',
      }))
    },
    async getBranchList(params: { repoUrl: string }) {
      const { workspace, repo_slug } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.refs.listBranches({
        repo_slug: repo_slug,
        workspace,
        pagelen: 100, //It seems to not work with very large numbers like 1000 (MAX_BRANCHES_FETCH) and returns a bad request response
        sort: '-target.date',
      })
      if (!res.data.values) {
        return []
      }
      return res.data.values
        .filter((branch) => !!branch.name)
        .map((branch) => z.string().parse(branch.name))
    },
    async getIsUserCollaborator(params: { repoUrl: string }) {
      const { repoUrl } = params
      const { repo_slug, workspace } =
        parseBitbucketOrganizationAndRepo(repoUrl)
      const fullRepoName = `${workspace}/${repo_slug}`
      // We used to call GET /user/permissions/repositories (cross-workspace),
      // but Bitbucket sunset that endpoint on 2026-04-14 and it now returns
      // HTTP 410 Gone. The workspace-scoped replacement is
      // GET /user/workspaces/{workspace}/permissions/repositories, which isn't
      // yet exposed as a named method in bitbucket@2.12.0, so we call it via
      // the SDK's generic request() helper.
      //
      // note: we previously considered the repo-scoped permissions-config endpoint
      // (/repositories/{workspace}/{repo_slug}/permissions-config/users) which is
      // more precise, but it requires repo admin access and would 403 for regular users.
      //
      // note: we're using ~ for case insensitive search
      const res = await bitbucketClient.request({
        method: 'GET',
        url: '/user/workspaces/{workspace}/permissions/repositories',
        workspace,
        q: `repository.full_name~"${fullRepoName}"`,
      })
      const parsed = UserWorkspacePermissionsRepositoriesResponseZ.safeParse(
        res.data
      )
      const values = parsed.success ? parsed.data.values : undefined
      return (
        values?.some((v) => v.repository?.full_name === fullRepoName) ?? false
      )
    },
    async createPullRequest(params: CreatePullRequestParams) {
      const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.pullrequests.create({
        repo_slug: repo_slug,
        workspace,
        _body: {
          type: 'pullrequest',
          title: params.title,
          summary: {
            raw: safeBody(params.body, MAX_BITBUCKET_PR_BODY_LENGTH),
          },
          source: {
            branch: {
              name: params.sourceBranchName,
            },
          },
          destination: {
            branch: {
              name: params.targetBranchName,
            },
          },
        },
      })
      return res.data
    },
    async getDownloadLink(params: { repoUrl: string }) {
      const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.downloads.list({
        repo_slug: repo_slug,
        workspace,
      })
      return res.data
    },
    async getBranch(params: GetBranchParams) {
      const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.refs.getBranch({
        name: params.branchName,
        repo_slug: repo_slug,
        workspace,
      })
      return res.data
    },
    async getRepo(params: { repoUrl: string }) {
      const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.repositories.get({
        repo_slug: repo_slug,
        workspace,
      })
      return res.data
    },
    async getCommit(params: GetCommitParams) {
      const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.commits.get({
        commit: params.commitSha,
        repo_slug: repo_slug,
        workspace,
      })
      return res.data
    },
    async getUser() {
      const res = await bitbucketClient.user.get({})
      return res.data
    },
    async getReferenceData({
      ref,
      url,
    }: {
      ref: string
      url: string
    }): Promise<GetReferenceResult> {
      return Promise.allSettled([
        this.getTagRef({ repoUrl: url, tagName: ref }),
        this.getBranchRef({ repoUrl: url, branchName: ref }),
        this.getCommitRef({ repoUrl: url, commitSha: ref }),
      ]).then((promisesResult) => {
        // note: tag is being retrieved by getCommitRef as well, so we take the first one which is getTagRef
        const [refPromise] = promisesResult.filter(
          (promise): promise is PromiseFulfilledResult<GetReferenceResult> =>
            promise.status === 'fulfilled'
        )
        if (!refPromise) {
          throw new RefNotFoundError(`Invalid reference ${ref} for ${url}`)
        }
        return refPromise.value
      })
    },
    async getTagRef(params: { repoUrl: string; tagName: string }) {
      const { tagName, repoUrl } = params
      const { repo_slug, workspace } =
        parseBitbucketOrganizationAndRepo(repoUrl)
      const tagRes = await bitbucketClient.refs.getTag({
        repo_slug: repo_slug,
        workspace,
        name: tagName,
      })
      return GetReferenceResultZ.parse({
        sha: tagRes.data.target?.hash,
        type: ReferenceType.TAG,
        date: new Date(z.string().parse(tagRes.data.target?.date)),
      })
    },
    async getBranchRef(params: GetBranchParams) {
      const getBranchRes = await this.getBranch(params)
      return GetReferenceResultZ.parse({
        sha: getBranchRes.target?.hash,
        type: ReferenceType.BRANCH,
        date: new Date(z.string().parse(getBranchRes.target?.date)),
      })
    },
    async getCommitRef(params: GetCommitParams) {
      const getCommitRes = await this.getCommit(params)
      return GetReferenceResultZ.parse({
        sha: getCommitRes.hash,
        type: ReferenceType.COMMIT,
        date: new Date(z.string().parse(getCommitRes.date)),
      })
    },
    async getDownloadUrl({ url, sha }: { url: string; sha: string }) {
      // validate that the sha is a valid reference
      this.getReferenceData({ ref: sha, url })
      const repoRes = await this.getRepo({ repoUrl: url })
      const parsedRepoUrl = z.url().parse(repoRes.links?.html?.href)
      return `${parsedRepoUrl}/get/${sha}.zip`
    },
    async getPullRequest(params: { url: string; prNumber: number }) {
      const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(
        params.url
      )
      const res = await bitbucketClient.pullrequests.get({
        pull_request_id: params.prNumber,
        repo_slug,
        workspace,
      })
      return res.data
    },
    async addCommentToPullRequest({
      url,
      prNumber,
      markdownComment,
    }: {
      url: string
      prNumber: number
      markdownComment: string
    }) {
      const { repo_slug, workspace } = parseBitbucketOrganizationAndRepo(url)
      const res = await bitbucketClient.pullrequests.createComment({
        //@ts-expect-error type requires _body.type, but it its uses api fails
        _body: {
          content: {
            raw: markdownComment,
          },
        },
        pull_request_id: prNumber,
        repo_slug,
        workspace,
      })
      return res.data
    },
    async getWorkspaceMembers(params: { workspace: string }) {
      // Best-effort: workspace member listing can require more than repo read.
      // A token that can still read commits shouldn't fail the repo — return no
      // members and let the caller fall back to commit authors.
      try {
        const allMembers: Record<string, unknown>[] = []
        let hasMore = true
        let page = 1
        while (hasMore) {
          const res = await bitbucketClient.workspaces.getMembersForWorkspace({
            workspace: params.workspace,
            page: String(page),
            pagelen: 100,
          } as Parameters<
            typeof bitbucketClient.workspaces.getMembersForWorkspace
          >[0])
          const values = res.data.values ?? []
          allMembers.push(...values)
          hasMore = Boolean(res.data.next) && values.length > 0
          page++
        }
        return allMembers
      } catch (e) {
        // Only swallow permission-denied (member listing needs workspace-admin
        // scope) — fall back to commit authors. Auth/rate-limit/network errors
        // must propagate so the sync classifies the repo instead of recording
        // it accessible-with-zero-contributors.
        if (isBitbucketPermissionDenied(e)) {
          return []
        }
        throw e
      }
    },

    async getCurrentUserWithEmail(): Promise<{
      accountId: string | null
      email: string | null
    }> {
      try {
        const [userRes, emailsRes] = await Promise.all([
          bitbucketClient.user.get({}),
          bitbucketClient.user.listEmails({}),
        ])
        const accountId =
          ((userRes.data as Record<string, unknown>)?.['account_id'] as
            string | null) ?? null
        const emails = ((emailsRes.data as { values?: unknown[] })?.values ??
          []) as {
          email?: string
          is_primary?: boolean
          is_confirmed?: boolean
        }[]
        const primary = emails.find((e) => e.is_primary && e.is_confirmed)
        const confirmed = emails.find((e) => e.is_confirmed)
        const email =
          primary?.email ?? confirmed?.email ?? emails[0]?.email ?? null
        return { accountId, email }
      } catch {
        return { accountId: null, email: null }
      }
    },

    async listRecentCommits(params: {
      workspace: string
      repo_slug: string
      since: string
    }) {
      const sinceDate = new Date(params.since)
      const commits: unknown[] = []
      // hard page cap (100 pages × 100 = 10k commits) so a busy repo
      // can't run the loop unbounded; raise if 90-day windows ever exceed it.
      const MAX_PAGES = 100
      let page = 1
      let done = false
      while (!done && page <= MAX_PAGES) {
        const res = await bitbucketClient.repositories.listCommits({
          repo_slug: params.repo_slug,
          workspace: params.workspace,
          page: String(page),
          pagelen: 100,
        } as Parameters<typeof bitbucketClient.repositories.listCommits>[0])
        const data = res.data as { values?: unknown[]; next?: string }
        const values = data?.values ?? []
        if (values.length === 0) break
        for (const commit of values) {
          const date = (commit as Record<string, unknown>)?.['date'] as
            string | undefined
          if (date && new Date(date) < sinceDate) {
            // Reached the age boundary — don't fetch further pages, but keep
            // scanning this page: commits aren't strictly date-ordered (merges
            // can interleave), so a newer commit may follow an older one here.
            done = true
            continue
          }
          commits.push(commit)
        }
        // Bitbucket returns commits newest-first; stop once the page ran out
        // or the API reports no further pages.
        if (!data?.next) break
        page++
      }
      return commits
    },

    // Distinct authors of commits in the window (since), streamed and
    // window-bounded by date rather than a fixed page cap, so the 90-day count
    // is exact even on a busy repo. Accumulates one row per author (latest date)
    // as pages arrive → memory bounded by author count. Errors propagate for
    // classification (the repo is the read-commits population source).
    async streamRecentCommitAuthors(params: {
      workspace: string
      repo_slug: string
      since: string
    }): Promise<RecentCommitAuthor[]> {
      const sinceMs = new Date(params.since).getTime()
      const byKey = new Map<string, RecentCommitAuthor>()
      // Generous page ceiling purely as a runaway guard; the date boundary below
      // is the real stop. The per-repo sync timeout bounds pathological repos.
      const HARD_PAGE_CEILING = 10000

      // include=undefined → main branch; include=<branch> → that branch's reachable
      // commits. We do NOT early-stop on already-seen commits: Bitbucket's commit
      // list isn't strictly date-ordered (merges/imports/clock-skew interleave), so
      // a branch's unique in-window commit can follow shared history on the same
      // page — stopping early would drop a feature-branch-only committer. The
      // date-window stop below bounds each walk to the 90-day window; distinct
      // authors are deduped by the byKey map, so re-seeing shared commits is a
      // harmless no-op.
      const walkRef = async (include: string | undefined) => {
        let page = 1
        while (page <= HARD_PAGE_CEILING) {
          const res = await bitbucketClient.repositories.listCommits({
            repo_slug: params.repo_slug,
            workspace: params.workspace,
            page: String(page),
            pagelen: 100,
            ...(include ? { include } : {}),
          } as Parameters<typeof bitbucketClient.repositories.listCommits>[0])
          const data = res.data as { values?: unknown[]; next?: string }
          const commits = data?.values ?? []
          if (commits.length === 0) break
          // Bitbucket has no server-side date filter and its commit list isn't
          // strictly date-ordered (merges/imports/clock-skew interleave). Stop
          // only after a FULL page with NO in-window commit — a single old commit
          // on an otherwise in-window page must not truncate the walk and drop
          // later in-window authors.
          let sawInWindow = false
          for (const commit of commits) {
            const record = commit as Record<string, unknown>
            const dateStr = record['date'] as string | undefined
            if (dateStr && new Date(dateStr).getTime() < sinceMs) {
              continue
            }
            sawInWindow = true
            const author = record['author'] as
              { raw?: string; user?: { account_id?: string } } | undefined
            if (!author?.raw) continue
            const match = author.raw.match(/^(.+?)\s*<([^>]+)>/)
            if (!match) continue
            const [, name, email] = match
            if (!email) continue
            const externalId = author.user?.account_id ?? null
            const date = dateStr ?? params.since
            const key = externalId ?? email.toLowerCase()
            const prev = byKey.get(key)
            if (
              !prev ||
              new Date(date).getTime() > new Date(prev.date).getTime()
            ) {
              byKey.set(key, {
                email: email.toLowerCase(),
                name: name!.trim() || null,
                date,
                externalId,
                isBot: false,
              })
            }
          }
          // Whole page was older than the window → we've walked past it, stop.
          if (!sawInWindow) break
          if (!data?.next) break
          page++
        }
      }

      // 1) Main branch — the bulk of history.
      await walkRef(undefined)

      // 2) Other branches, most-recently-active first (Bitbucket sorts by
      //    -target.date). Page through them until one predates the window (all
      //    later ones are older too — stop) or the cap is hit, so stale branches
      //    aren't even walked. A committer whose only recent commits are on a
      //    feature/release branch is still counted (revenue). Any failure falls
      //    back to the main-branch authors already gathered — no regression.
      try {
        const branches: string[] = []
        let bpage = 1
        let bdone = false
        while (!bdone && branches.length < MAX_ACTIVE_BRANCHES_SCAN) {
          const branchRes = await bitbucketClient.refs.listBranches({
            repo_slug: params.repo_slug,
            workspace: params.workspace,
            pagelen: 100,
            page: String(bpage),
            sort: '-target.date',
          } as Parameters<typeof bitbucketClient.refs.listBranches>[0])
          const vals = (branchRes.data.values ?? []) as {
            name?: string
            target?: { date?: string }
          }[]
          if (vals.length === 0) break
          for (const b of vals) {
            const d = b.target?.date
            if (!d || new Date(d).getTime() < sinceMs) {
              bdone = true // sorted -target.date → everything after is older too
              break
            }
            if (b.name) branches.push(b.name)
            if (branches.length >= MAX_ACTIVE_BRANCHES_SCAN) break
          }
          if (!(branchRes.data as { next?: string }).next) break
          bpage++
        }
        if (branches.length >= MAX_ACTIVE_BRANCHES_SCAN) {
          console.warn(
            `[Bitbucket] active-branch scan hit cap (${MAX_ACTIVE_BRANCHES_SCAN}) for ${params.workspace}/${params.repo_slug}; some branches skipped`
          )
        }
        for (const branch of branches) {
          await walkRef(branch)
        }
      } catch (err) {
        console.warn(
          `[Bitbucket] all-branch author scan failed for ${params.workspace}/${params.repo_slug}; using main-branch count`,
          err instanceof Error ? err.message : String(err)
        )
      }
      return [...byKey.values()]
    },

    async getRepoCommitAuthors(params: {
      workspace: string
      repo_slug: string
    }) {
      // Distinct commit authors. This is the read-only fallback population, so
      // it must (a) page beyond the first 100 commits — otherwise a busy repo
      // reports only the last ~100 commits' authors as authoritative — and
      // (b) NOT swallow errors: a failure means the repo can't be read, which
      // must propagate for classification/failover. Capped like listRecentCommits.
      const MAX_PAGES = 100
      const authorMap = new Map<
        string,
        { name: string; email: string; accountId: string | null }
      >()
      let page = 1
      while (page <= MAX_PAGES) {
        const res = await bitbucketClient.repositories.listCommits({
          repo_slug: params.repo_slug,
          workspace: params.workspace,
          page: String(page),
          pagelen: 100,
        } as Parameters<typeof bitbucketClient.repositories.listCommits>[0])
        const data = res.data as { values?: unknown[]; next?: string }
        const commits = data?.values ?? []
        if (commits.length === 0) break
        for (const commit of commits) {
          const raw = (commit as Record<string, unknown>)?.['author'] as
            | {
                raw?: string
                user?: { account_id?: string; nickname?: string }
              }
            | undefined
          if (!raw?.raw) continue
          const match = raw.raw.match(/^(.+?)\s*<([^>]+)>/)
          if (!match) continue
          const [, name, email] = match
          if (!email) continue
          const accountId = raw.user?.account_id ?? null
          const dedupeKey = accountId ?? raw.user?.nickname ?? email
          if (!authorMap.has(dedupeKey)) {
            authorMap.set(dedupeKey, {
              name: name!.trim(),
              email,
              accountId,
            })
          }
        }
        if (!data?.next) break
        page++
      }
      return Array.from(authorMap.values())
    },
  }
}

export async function validateBitbucketParams(params: {
  url?: string
  bitbucketClient: BitbucketSdk
}) {
  const { bitbucketClient } = params
  const authType = bitbucketClient.getAuthType()
  try {
    if (authType !== 'public') {
      await bitbucketClient.getUser()
    }
    if (params.url && shouldValidateUrl(params.url)) {
      await bitbucketClient.getRepo({ repoUrl: params.url })
    }
  } catch (e) {
    const safeParseError = TokenExpiredErrorZ.safeParse(e)
    if (safeParseError.success) {
      switch (safeParseError.data.status) {
        case 401:
          throw new InvalidAccessTokenError(
            safeParseError.data.error.error.message
          )
        case 404:
          throw new InvalidRepoUrlError(safeParseError.data.error.error.message)
      }
    }
    console.log('validateBitbucketParams error', e)
    throw new InvalidRepoUrlError(
      `cannot access BB repo URL: ${params.url} with the provided access token`
    )
  }
}

async function getUsersWorkspacesSlugs(bitbucketClient: APIClient) {
  const res = await bitbucketClient.workspaces.getWorkspaces({})
  return res.data.values?.map((v) => z.string().parse(v.slug))
}

async function getAllUsersRepositories(bitbucketClient: APIClient) {
  const userWorkspacesSlugs = await getUsersWorkspacesSlugs(bitbucketClient)
  if (!userWorkspacesSlugs) {
    return []
  }
  const allWorkspaceRepos: Schema.Repository[] = []
  for (const workspaceSlug of userWorkspacesSlugs) {
    const repos = await bitbucketClient.repositories.list({
      workspace: workspaceSlug,
    })
    if (!repos.data.values) {
      continue
    }
    allWorkspaceRepos.push(...repos.data.values)
  }
  return allWorkspaceRepos
}
async function getRepositoriesByWorkspace(
  bitbucketClient: APIClient,
  { workspaceSlug }: { workspaceSlug: string }
) {
  const res = await bitbucketClient.repositories.list({
    workspace: workspaceSlug,
  })
  return res.data.values ?? []
}
