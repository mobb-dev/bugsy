import querystring from 'node:querystring'

import * as bitbucketPkg from 'bitbucket'
import { APIClient, Schema } from 'bitbucket'
import { z } from 'zod'

import {
  GetRefererenceResult,
  GetRefererenceResultZ,
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  RefNotFoundError,
} from '../scm'
import { ReferenceType, ScmRepoInfo, ScmType } from '../types'
import { parseScmURL } from '../urlParser'
import { normalizeUrl } from '../utils'
import {
  CreatePullRequestParams,
  GetBitbucketTokenArgs,
  GetReposParam,
} from './types'

const { Bitbucket } = bitbucketPkg

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

const BitbucketAuthResultZ = z.object({
  access_token: z.string(),
  token_type: z.string(),
  refresh_token: z.string(),
})

type BitbucketRequestTypeKeys = keyof typeof bitbucketRequestType
export type BitbucketRequestType =
  (typeof bitbucketRequestType)[BitbucketRequestTypeKeys]

const BitbucketParseResultZ = z.object({
  organization: z.string(),
  repoName: z.string(),
  hostname: z.literal(BITBUCKET_HOSTNAME),
})
export function parseBitbucketOrganizationAndRepo(bitbucketUrl: string): {
  workspace: string
  repoSlug: string
} {
  const parsedGitHubUrl = normalizeUrl(bitbucketUrl)
  const parsingResult = parseScmURL(parsedGitHubUrl, ScmType.Bitbucket)
  const validatedBitbucketResult = BitbucketParseResultZ.parse(parsingResult)

  return {
    workspace: validatedBitbucketResult.organization,
    repoSlug: validatedBitbucketResult.repoName,
  }
}
const bitbucketRequestType = {
  CODE: 'authorization_code',
  REFRESH_TOKEN: 'refresh_token',
} as const

export async function getBitbucketToken(params: GetBitbucketTokenArgs) {
  const { bitbucketClientId, bitbucketClientSecret, authType } = params
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
  return BitbucketAuthResultZ.parse(authResult)
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

function getBitbucketIntance(params: GetBitbucketSdkParams) {
  switch (params.authType) {
    case 'public':
      return new Bitbucket()
    case 'token':
      return new Bitbucket({ auth: { token: params.token } })
    case 'basic':
      return new Bitbucket({
        auth: {
          password: params.password,
          username: params.username,
        },
      })
  }
}
type BitbucketSdk = ReturnType<typeof getBitbucketSdk>
export function getBitbucketSdk(params: GetBitbucketSdkParams) {
  const bitbucketClient = getBitbucketIntance(params)

  return {
    getAuthType() {
      return params.authType
    },
    async getRepos(params?: GetReposParam): Promise<ScmRepoInfo[]> {
      const repoRes = params?.workspaceSlug
        ? await getRepositoriesByWorkspace(bitbucketClient, {
            workspaceSlug: params.workspaceSlug,
          })
        : await getllUsersrepositories(bitbucketClient)

      // for some reason the bitbucket client returns a list of repos with a null value
      // even though the api docments the values are not nullable
      // https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-get
      return repoRes.map((repo) => ({
        repoIsPublic: !repo.is_private,
        repoName: repo.name || 'unknown repo name',
        repoOwner: repo.owner?.username || 'unknown owner',
        // language can be empty string
        repoLanguages: repo.language ? [repo.language] : [],
        repoUpdatedAt: repo.updated_on
          ? repo.updated_on
          : new Date().toISOString(),
        repoUrl: repo.links?.html?.href || '',
      }))
    },
    async getBranchList(params: { repoUrl: string }) {
      const { workspace, repoSlug } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.refs.listBranches({
        repo_slug: repoSlug,
        workspace,
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
      const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(repoUrl)
      const fullRepoName = `${workspace}/${repoSlug}`
      // note: initially I thought about ussing this endpoint - https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-permissions-config-users-get
      // which is more percision but it requires the user to have admin access to the repo

      // note we're using ~ for case insensitive search
      const res = await bitbucketClient.user.listPermissionsForRepos({
        q: `repository.full_name~"${fullRepoName}"`,
      })
      return (
        res.data.values?.some(
          (res) => res.repository?.full_name === fullRepoName
        ) ?? false
      )
    },
    async createPullRequest(params: CreatePullRequestParams) {
      const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.pullrequests.create({
        repo_slug: repoSlug,
        workspace,
        _body: {
          type: 'pullrequest',
          title: params.title,
          summary: {
            raw: params.body,
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
    async getDownloadlink(params: { repoUrl: string }) {
      const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.downloads.list({
        repo_slug: repoSlug,
        workspace,
      })
      return res.data
    },
    async getBranch(params: GetBranchParams) {
      const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.refs.getBranch({
        name: params.branchName,
        repo_slug: repoSlug,
        workspace,
      })
      return res.data
    },
    async getRepo(params: { repoUrl: string }) {
      const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.repositories.get({
        repo_slug: repoSlug,
        workspace,
      })
      return res.data
    },
    async getCommit(params: GetCommitParams) {
      const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(
        params.repoUrl
      )
      const res = await bitbucketClient.commits.get({
        commit: params.commitSha,
        repo_slug: repoSlug,
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
    }): Promise<GetRefererenceResult> {
      return Promise.allSettled([
        this.getTagRef({ repoUrl: url, tagName: ref }),
        this.getBranchRef({ repoUrl: url, branchName: ref }),
        this.getCommitRef({ repoUrl: url, commitSha: ref }),
      ]).then((promisesResult) => {
        // note: tag is being retrevied by getCommitRef as well, so we take the first one which is getTagRef
        const [refPromise] = promisesResult.filter(
          (promise): promise is PromiseFulfilledResult<GetRefererenceResult> =>
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
      const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(repoUrl)
      const tagRes = await bitbucketClient.refs.getTag({
        repo_slug: repoSlug,
        workspace,
        name: tagName,
      })
      return GetRefererenceResultZ.parse({
        sha: tagRes.data.target?.hash,
        type: ReferenceType.TAG,
        date: new Date(z.string().parse(tagRes.data.target?.date)),
      })
    },
    async getBranchRef(params: GetBranchParams) {
      const getBranchRes = await this.getBranch(params)
      return GetRefererenceResultZ.parse({
        sha: getBranchRes.target?.hash,
        type: ReferenceType.BRANCH,
        date: new Date(z.string().parse(getBranchRes.target?.date)),
      })
    },
    async getCommitRef(params: GetCommitParams) {
      const getCommitRes = await this.getCommit(params)
      return GetRefererenceResultZ.parse({
        sha: getCommitRes.hash,
        type: ReferenceType.COMMIT,
        date: new Date(z.string().parse(getCommitRes.date)),
      })
    },
    async getDownloadUrl({ url, sha }: { url: string; sha: string }) {
      // validate that the sha is a valid reference
      this.getReferenceData({ ref: sha, url })
      const repoRes = await this.getRepo({ repoUrl: url })
      const parsedRepoUrl = z.string().url().parse(repoRes.links?.html?.href)
      return `${parsedRepoUrl}/get/${sha}.zip`
    },
    async getPullRequest(params: { url: string; prNumber: number }) {
      const { repoSlug, workspace } = parseBitbucketOrganizationAndRepo(
        params.url
      )
      const res = await bitbucketClient.pullrequests.get({
        pull_request_id: params.prNumber,
        repo_slug: repoSlug,
        workspace,
      })
      return res.data
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
    if (params.url) {
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
    throw e
  }
}

async function getUsersworkspacesSlugs(bitbucketClient: APIClient) {
  const res = await bitbucketClient.workspaces.getWorkspaces({})
  return res.data.values?.map((v) => z.string().parse(v.slug))
}

async function getllUsersrepositories(bitbucketClient: APIClient) {
  const userWorspacesSlugs = await getUsersworkspacesSlugs(bitbucketClient)
  if (!userWorspacesSlugs) {
    return []
  }
  const allWorkspaceRepos: Schema.Repository[] = []
  for (const workspaceSlug of userWorspacesSlugs) {
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
