import querystring from 'node:querystring'

import * as bitbucketPkgNode from 'bitbucket'
import bitbucketPkg, { APIClient, Schema } from 'bitbucket'
import Debug from 'debug'
import { z } from 'zod'

import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  RefNotFoundError,
} from '../errors'
import { parseScmURL, ScmType } from '../shared/src'
import {
  GetReferenceResult,
  GetReferenceResultZ,
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
        repoOwner: repo.owner?.username || 'unknown owner',
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
      // note: initially I thought about using this endpoint - https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-permissions-config-users-get
      // which is more precision but it requires the user to have admin access to the repo

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
      const parsedRepoUrl = z.string().url().parse(repoRes.links?.html?.href)
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
