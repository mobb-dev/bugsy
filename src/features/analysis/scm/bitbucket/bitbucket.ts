import querystring from 'node:querystring'

import * as bitbucketPkgNode from 'bitbucket'
import { APIClient, Schema } from 'bitbucket'
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
import { escapeBitbucketFilterValue } from '../utils/repoSearch'
import {
  CreatePullRequestParams,
  GetBitbucketTokenArgs,
  GetBitbucketTokenRes,
  GetReposParam,
} from './types'
import { BitbucketAuthResultZ } from './validation'

// Static default import breaks CJS bundling (binary build); derive it instead.
const bitbucketPkg = (bitbucketPkgNode as { default?: typeof bitbucketPkgNode })
  .default

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
// Response schema for GET /2.0/user/workspaces — the replacement for the
// end-of-lifed cross-workspace endpoints.
// https://developer.atlassian.com/cloud/bitbucket/changelog/
const UserWorkspacesResponseZ = z.object({
  next: z.string().optional(),
  values: z
    .array(
      z.object({
        slug: z.string().optional(),
        workspace: z
          .object({
            slug: z.string().optional(),
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

      return repoRes.map(toScmRepoInfo)
    },
    /**
     * One page of a workspace (or every workspace) with optional `q=name~`.
     * https://developer.atlassian.com/cloud/bitbucket/rest/intro/#filtering
     */
    async searchRepos(params: {
      workspaceSlug?: string
      query?: string
      page?: number
      pagelen?: number
      /**
       * Multi-workspace pagination state: slug → next page to fetch, or null
       * once that workspace is exhausted. One shared page number was wrong —
       * page 2 of a 1-page workspace is an out-of-range request (Bitbucket
       * errors on it), which killed the whole search past the smallest
       * workspace's depth.
       */
      workspacePages?: Record<string, number | null>
    }): Promise<{
      items: ScmRepoInfo[]
      hasMore: boolean
      totalCount?: number
      workspacePages?: Record<string, number | null>
    }> {
      const page = params.page ?? 1
      const pagelen = params.pagelen ?? BITBUCKET_PAGE_LEN
      const query = params.query?.trim() || undefined

      if (params.workspaceSlug) {
        const result = await listWorkspaceRepositoriesPage(bitbucketClient, {
          workspaceSlug: params.workspaceSlug,
          page,
          pagelen,
          query,
        })
        return {
          items: result.values.map(toScmRepoInfo),
          hasMore: result.hasMore,
          totalCount: result.size,
        }
      }

      const pages =
        params.workspacePages ??
        Object.fromEntries(
          (await getUsersWorkspacesSlugs(bitbucketClient)).map((slug) => [
            slug,
            1,
          ])
        )
      const active = Object.entries(pages).filter(
        (entry): entry is [string, number] => entry[1] !== null
      )
      // Independent workspaces — fetch in parallel, not one-after-another.
      const results = await Promise.all(
        active.map(async ([workspaceSlug, wsPage]) => {
          try {
            const result = await listWorkspaceRepositoriesPage(
              bitbucketClient,
              { workspaceSlug, page: wsPage, pagelen, query }
            )
            return { workspaceSlug, result }
          } catch (e) {
            // An out-of-range page reads as exhaustion, not failure — it can
            // only happen when the workspace shrank between pages.
            const status = (e as { status?: number })?.status
            if (status === 404 || /404/.test(String(e))) {
              return { workspaceSlug, result: null }
            }
            throw e
          }
        })
      )

      const items: ScmRepoInfo[] = []
      const nextPages: Record<string, number | null> = { ...pages }
      for (const { workspaceSlug, result } of results) {
        if (!result) {
          nextPages[workspaceSlug] = null
          continue
        }
        items.push(...result.values.map(toScmRepoInfo))
        nextPages[workspaceSlug] = result.hasMore
          ? (pages[workspaceSlug] as number) + 1
          : null
      }
      const hasMore = Object.values(nextPages).some((p) => p !== null)
      return { items, hasMore, workspacePages: nextPages }
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

/**
 * The workspace a repository belongs to.
 *
 * `owner.username` only exists when the owner is a personal *user* account. A
 * workspace-owned repository — which is every repository under a team workspace,
 * so most of them — carries a workspace object there instead, with `slug` and no
 * `username`, so every one of those came back as "unknown owner". The onboarding
 * org picker groups by this, so Bitbucket showed one "unknown owner" bucket and
 * the owner filter matched nothing.
 *
 * `full_name` is `<workspace-slug>/<repo-slug>` and is present on every
 * repository, so it is the reliable source; the rest are fallbacks.
 */
function repoWorkspaceSlug(repo: Schema.Repository): string {
  const fromFullName = repo.full_name?.split('/')[0]
  if (fromFullName) {
    return fromFullName
  }
  const workspace = repo['workspace'] as { slug?: string } | undefined
  return (
    workspace?.slug ??
    (repo.owner?.['username'] as string | undefined) ??
    (repo.owner?.['display_name'] as string | undefined) ??
    'unknown owner'
  )
}

/** Bitbucket's max; the default is 10, which silently truncated every listing. */
const BITBUCKET_PAGE_LEN = 100
/** Backstop against a `next` link that never stops. */
const BITBUCKET_MAX_PAGES = 100

/**
 * Names the endpoint on the way out.
 *
 * Bitbucket is mid-sunset on several endpoints and answers the retired ones with
 * a bare `410 Gone`. That reached us as "unexpected SCM error: Gone" with no
 * indication of *which* call died, so diagnosing it was guesswork. Any Bitbucket
 * call whose failure could plausibly be a sunset should go through this.
 */
async function withEndpointContext<T>(
  endpoint: string,
  call: () => Promise<T>
): Promise<T> {
  try {
    return await call()
  } catch (e) {
    const status = (e as { status?: number })?.status
    const message = e instanceof Error ? e.message : String(e)
    const error = new Error(
      `${endpoint} failed${status ? ` with ${status}` : ''}: ${message}` +
        (status === 410
          ? ' — this endpoint has been sunset by Bitbucket, see https://developer.atlassian.com/cloud/bitbucket/changelog/'
          : '')
    )
    // Keep the original for anything downstream that inspects `status`.
    ;(error as { cause?: unknown }).cause = e
    throw error
  }
}

function toScmRepoInfo(repo: Schema.Repository): ScmRepoInfo {
  return {
    repoIsPublic: !repo.is_private,
    repoName: repo.name || 'unknown repo name',
    repoOwner: repoWorkspaceSlug(repo),
    repoLanguages: repo.language ? [repo.language] : [],
    repoUpdatedAt: repo.updated_on ? repo.updated_on : new Date().toISOString(),
    repoUrl: repo.links?.html?.href || '',
    repoDefaultBranch:
      (repo.mainbranch as { name?: string } | undefined)?.name ?? null,
  }
}

async function listWorkspaceRepositoriesPage(
  bitbucketClient: APIClient,
  params: {
    workspaceSlug: string
    page: number
    pagelen: number
    query?: string
  }
): Promise<{
  values: Schema.Repository[]
  hasMore: boolean
  size?: number
}> {
  // `name` and `full_name` are both documented filter fields (`full_name` is
  // `workspace/slug`, so it covers a typed slug); `slug` is not, and an
  // undocumented field makes the whole request a 400.
  // https://developer.atlassian.com/cloud/bitbucket/rest/intro/#filtering
  const term = params.query
    ? escapeBitbucketFilterValue(params.query)
    : undefined
  const q = term ? `(name~"${term}" OR full_name~"${term}")` : undefined
  const res = await withEndpointContext(
    `GET /2.0/repositories/${params.workspaceSlug}`,
    () =>
      bitbucketClient.request({
        method: 'GET',
        url: `/repositories/${encodeURIComponent(params.workspaceSlug)}`,
        pagelen: params.pagelen,
        page: String(params.page),
        sort: '-updated_on',
        ...(q ? { q } : {}),
      })
  )
  const values = (res.data.values ?? []) as Schema.Repository[]
  const size =
    typeof res.data.size === 'number' && Number.isFinite(res.data.size)
      ? res.data.size
      : undefined
  return {
    values,
    hasMore: Boolean(res.data.next),
    size,
  }
}

/**
 * Every page of one workspace's repositories.
 *
 * `repositories.list` returns a *page* — 10 by default. Both callers used to
 * take that single page and treat it as the whole workspace, so a workspace with
 * more than ten repositories quietly lost the rest.
 */
async function listWorkspaceRepositories(
  bitbucketClient: APIClient,
  workspaceSlug: string
): Promise<Schema.Repository[]> {
  const repos: Schema.Repository[] = []
  for (let page = 1; page <= BITBUCKET_MAX_PAGES; page += 1) {
    const result = await listWorkspaceRepositoriesPage(bitbucketClient, {
      workspaceSlug,
      page,
      pagelen: BITBUCKET_PAGE_LEN,
    })
    if (!result.values.length) {
      break
    }
    repos.push(...result.values)
    if (!result.hasMore) {
      break
    }
  }
  return repos
}

/**
 * The workspaces the token can see.
 *
 * Bitbucket ended life on every cross-workspace API on 2026-03-31; the old calls
 * now answer **410 Gone**, which is what broke repository listing entirely (every
 * repo is fetched per workspace, so losing the workspace list loses everything).
 * All of these are dead:
 *
 * - `GET /2.0/workspaces`               ← what `workspaces.getWorkspaces` calls
 * - `GET /2.0/user/permissions/workspaces`
 * - `GET /2.0/user/permissions/repositories`  ← already worked around above
 * - `GET /2.0/repositories`             ← the cross-workspace repo list
 *
 * `GET /2.0/user/workspaces` is the sanctioned replacement, in the same
 * `/user/workspaces` namespace this file already uses for repository
 * permissions. No named method in bitbucket@2.12.0, so it goes through request().
 *
 * Which replacement is *the* replacement is genuinely unclear: the REST
 * reference marks `/user/workspaces` deprecated and points at
 * `/user/permissions/workspaces`, while the end-of-life announcement and
 * CHANGE-2770 say the opposite. Rather than bet on one, try them in order and
 * let Bitbucket answer — a retired endpoint says 410/404, anything else is a
 * real failure and propagates. This also self-heals whenever the next one goes.
 *
 * The item shape is read leniently — `slug` at the top level or nested under
 * `workspace` — because the two endpoints document different shapes.
 */
const WORKSPACE_LIST_ENDPOINTS = [
  '/user/permissions/workspaces',
  '/user/workspaces',
] as const
async function listWorkspacesFrom(
  bitbucketClient: APIClient,
  path: string
): Promise<string[]> {
  const slugs: string[] = []
  for (let page = 1; page <= BITBUCKET_MAX_PAGES; page += 1) {
    const res = await withEndpointContext(`GET /2.0${path}`, () =>
      bitbucketClient.request({
        method: 'GET',
        url: path,
        pagelen: BITBUCKET_PAGE_LEN,
        page: String(page),
      })
    )
    const parsed = UserWorkspacesResponseZ.safeParse(res.data)
    // A payload we cannot read is a failure, not an empty page. Returning []
    // here set the caller's `sawEmpty`, and if both endpoints answered with
    // something unrecognisable the result was a healthy "0 workspaces, 0
    // repositories" — the exact silent failure this fallback exists to prevent.
    if (!parsed.success) {
      throw new Error(
        `GET /2.0${path} returned an unrecognised payload: ${parsed.error.message}`
      )
    }
    const values = parsed.data.values ?? []
    if (values.length === 0) {
      break
    }
    for (const value of values) {
      const slug = value.slug ?? value.workspace?.slug
      if (slug) {
        slugs.push(slug)
      }
    }
    if (!parsed.data.next) {
      break
    }
  }
  return slugs
}

/** A retired endpoint, as opposed to a real failure worth surfacing. */
function isGoneOrMissing(e: unknown): boolean {
  const status =
    (e as { status?: number })?.status ??
    ((e as { cause?: { status?: number } })?.cause?.status || undefined)
  if (status === 410 || status === 404) {
    return true
  }
  const message = e instanceof Error ? e.message : String(e)
  return / with (410|404):/.test(message)
}

async function getUsersWorkspacesSlugs(bitbucketClient: APIClient) {
  let lastError: unknown
  /**
   * An endpoint answered, just with nothing.
   *
   * Tracked separately from an error because a 200 with no `values` is
   * ambiguous: it is what a genuinely empty account returns, and also what an
   * under-scoped token can return instead of a 403. Returning that first empty
   * answer meant the other endpoint was never tried, and the caller reported a
   * healthy "0 workspaces, 0 repositories" for a connection that in fact works.
   * So: keep looking, and only settle for empty once nothing else is left.
   */
  let sawEmpty = false
  for (const path of WORKSPACE_LIST_ENDPOINTS) {
    try {
      const slugs = await listWorkspacesFrom(bitbucketClient, path)
      if (slugs.length > 0) {
        return slugs
      }
      debug(`bitbucket workspace listing ${path} returned nothing, trying next`)
      sawEmpty = true
    } catch (e) {
      // Only a retirement moves us on. A 401/403/5xx is a real problem and must
      // not be masked by trying the next URL.
      if (!isGoneOrMissing(e)) {
        throw e
      }
      debug(`bitbucket workspace listing ${path} is retired, trying next`)
      lastError = e
    }
  }
  // Every endpoint that answered said "none" — that is a real, empty account.
  if (sawEmpty) {
    return []
  }
  throw (
    lastError ??
    new Error('no usable Bitbucket workspace-listing endpoint remains')
  )
}

async function getAllUsersRepositories(bitbucketClient: APIClient) {
  const userWorkspacesSlugs = await getUsersWorkspacesSlugs(bitbucketClient)
  const allWorkspaceRepos: Schema.Repository[] = []
  for (const workspaceSlug of userWorkspacesSlugs) {
    allWorkspaceRepos.push(
      ...(await listWorkspaceRepositories(bitbucketClient, workspaceSlug))
    )
  }
  return allWorkspaceRepos
}
async function getRepositoriesByWorkspace(
  bitbucketClient: APIClient,
  { workspaceSlug }: { workspaceSlug: string }
) {
  return listWorkspaceRepositories(bitbucketClient, workspaceSlug)
}
