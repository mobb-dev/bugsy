import querystring from 'node:querystring'

import * as api from 'azure-devops-node-api'
import { z } from 'zod'

import {
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  InvalidUrlPatternError,
  ReferenceType,
  RefNotFoundError,
  ScmRepoInfo,
} from './scm'
import { parseScmURL } from './urlParser'

function removeTrailingSlash(str: string) {
  return str.trim().replace(/\/+$/, '')
}

async function _getOrgsForOauthToken({ oauthToken }: { oauthToken: string }) {
  const profileZ = z.object({
    displayName: z.string(),
    publicAlias: z.string().min(1),
    emailAddress: z.string(),
    coreRevision: z.number(),
    timeStamp: z.string(),
    id: z.string(),
    revision: z.number(),
  })
  const accountsZ = z.object({
    count: z.number(),
    value: z.array(
      z.object({
        accountId: z.string(),
        accountUri: z.string(),
        accountName: z.string(),
      })
    ),
  })

  const profileRes = await fetch(
    'https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=6.0',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${oauthToken}`,
      },
    }
  )
  const profileJson = await profileRes.json()
  const profile = profileZ.parse(profileJson)
  const accountsRes = await fetch(
    `https://app.vssps.visualstudio.com/_apis/accounts?memberId=${profile.publicAlias}&api-version=6.0`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${oauthToken}`,
      },
    }
  )
  const accountsJson = await accountsRes.json()
  const accounts = accountsZ.parse(accountsJson)
  const orgs = accounts.value
    .map((account) => account.accountName)
    .filter((value, index, array) => array.indexOf(value) === index)
  return orgs
}

function _getPublicAdoClient({ orgName }: { orgName: string }) {
  const orgUrl = `https://dev.azure.com/${orgName}`
  const authHandler = api.getPersonalAccessTokenHandler('')
  authHandler.canHandleAuthentication = () => false
  authHandler.prepareRequest = (_options) => {
    return
  }
  const connection = new api.WebApi(orgUrl, authHandler)
  return connection
}

export enum AdoTokenTypeEnum {
  PAT = 'PAT',
  OAUTH = 'OAUTH',
}

export function getAdoTokenType(token: string) {
  if (token.includes('.')) {
    return AdoTokenTypeEnum.OAUTH
  }
  return AdoTokenTypeEnum.PAT
}

export async function getAdoApiClient({
  accessToken,
  tokenOrg,
  orgName,
}: {
  accessToken: string | undefined
  tokenOrg: string | undefined
  orgName: string
}) {
  if (!accessToken || (tokenOrg && tokenOrg !== orgName)) {
    return _getPublicAdoClient({ orgName })
  }
  const orgUrl = `https://dev.azure.com/${orgName}`
  if (getAdoTokenType(accessToken) === AdoTokenTypeEnum.OAUTH) {
    const connection = new api.WebApi(orgUrl, api.getBearerHandler(accessToken))
    return connection
  }
  const authHandler = api.getPersonalAccessTokenHandler(accessToken)
  const connection = new api.WebApi(orgUrl, authHandler)
  return connection
}

export async function adoValidateParams({
  url,
  accessToken,
  tokenOrg,
}: {
  url: string | undefined
  accessToken: string | undefined
  tokenOrg: string | undefined
}) {
  try {
    if (
      !url &&
      accessToken &&
      getAdoTokenType(accessToken) === AdoTokenTypeEnum.OAUTH
    ) {
      await _getOrgsForOauthToken({ oauthToken: accessToken })
      return
    }
    let org = tokenOrg
    if (url) {
      const { owner } = parseAdoOwnerAndRepo(url)
      org = owner
    }
    if (!org) {
      throw new InvalidRepoUrlError(`invalid ADO ORG ${org}`)
    }
    const api = await getAdoApiClient({
      accessToken,
      tokenOrg,
      orgName: org,
    })
    await api.connect()
  } catch (e) {
    const error = e as {
      code?: string
      status?: number
      statusCode?: number
      response?: { status?: number; statusCode?: number; code?: string }
      description?: string
    }
    const code =
      error.code ||
      error.status ||
      error.statusCode ||
      error.response?.status ||
      error.response?.statusCode ||
      error.response?.code

    const description = error.description || `${e}`
    if (
      code === 401 ||
      code === 403 ||
      description.includes('401') ||
      description.includes('403')
    ) {
      throw new InvalidAccessTokenError(`invalid ADO access token`)
    }
    if (
      code === 404 ||
      description.includes('404') ||
      description.includes('Not Found')
    ) {
      throw new InvalidRepoUrlError(`invalid ADO repo URL ${url}`)
    }
    throw e
  }
}

export async function getAdoIsUserCollaborator({
  accessToken,
  tokenOrg,
  repoUrl,
}: {
  accessToken: string
  tokenOrg: string | undefined
  repoUrl: string
}) {
  try {
    const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
    const api = await getAdoApiClient({
      accessToken,
      tokenOrg,
      orgName: owner,
    })
    const git = await api.getGitApi()
    const branches = await git.getBranches(repo, projectName)
    if (!branches || branches.length === 0) {
      throw new InvalidRepoUrlError('no branches')
    }
    return true
  } catch (e) {
    return false
  }
}

export enum AdoPullRequestStatusEnum {
  completed = 'completed',
  active = 'active',
  all = 'all',
  abandoned = 'abandoned',
}

export const adoStatusNumberToEnumMap = {
  1: AdoPullRequestStatusEnum.active,
  2: AdoPullRequestStatusEnum.abandoned,
  3: AdoPullRequestStatusEnum.completed,
  4: AdoPullRequestStatusEnum.all,
}

export async function getAdoPullRequestStatus({
  accessToken,
  tokenOrg,
  repoUrl,
  prNumber,
}: {
  accessToken: string
  tokenOrg: string | undefined
  repoUrl: string
  prNumber: number
}) {
  const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
  const api = await getAdoApiClient({
    accessToken,
    tokenOrg,
    orgName: owner,
  })
  const git = await api.getGitApi()
  const res = await git.getPullRequest(repo, prNumber, projectName)
  if (!res.status || res.status < 1 || res.status > 3) {
    throw new Error('bad pr status for ADO')
  }
  return adoStatusNumberToEnumMap[res.status]
}

export async function getAdoIsRemoteBranch({
  accessToken,
  tokenOrg,
  repoUrl,
  branch,
}: {
  accessToken: string
  tokenOrg: string | undefined
  repoUrl: string
  branch: string
}) {
  const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
  const api = await getAdoApiClient({
    accessToken,
    tokenOrg,
    orgName: owner,
  })
  const git = await api.getGitApi()
  try {
    const branchStatus = await git.getBranch(repo, branch, projectName)
    if (!branchStatus || !branchStatus.commit) {
      throw new InvalidRepoUrlError('no branch status')
    }
    return branchStatus.name === branch
  } catch (e) {
    return false
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
  if (getAdoTokenType(accessToken) === AdoTokenTypeEnum.OAUTH) {
    orgs = await _getOrgsForOauthToken({ oauthToken: accessToken })
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
          accessToken,
          tokenOrg,
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
                repoIsPublic: repo.project?.visibility === 2, //2 is public in the ADO API
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

export function getAdoDownloadUrl({
  repoUrl,
  branch,
}: {
  repoUrl: string
  branch: string
}) {
  const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
  return `https://dev.azure.com/${owner}/${projectName}/_apis/git/repositories/${repo}/items/items?path=/&versionDescriptor[versionOptions]=0&versionDescriptor[versionType]=commit&versionDescriptor[version]=${branch}&resolveLfs=true&$format=zip&api-version=5.0&download=true`
}

export async function getAdoBranchList({
  accessToken,
  tokenOrg,
  repoUrl,
}: {
  accessToken: string
  tokenOrg: string | undefined
  repoUrl: string
}) {
  const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
  const api = await getAdoApiClient({
    accessToken,
    tokenOrg,
    orgName: owner,
  })
  const git = await api.getGitApi()
  try {
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
    return res.reduce((acc, branch) => {
      if (!branch.name) {
        return acc
      }
      acc.push(branch.name)
      return acc
    }, [] as string[])
  } catch (e) {
    return []
  }
}

export async function createAdoPullRequest(options: {
  accessToken: string
  tokenOrg: string | undefined
  targetBranchName: string
  sourceBranchName: string
  title: string
  body: string
  repoUrl: string
}) {
  const { owner, repo, projectName } = parseAdoOwnerAndRepo(options.repoUrl)
  const api = await getAdoApiClient({
    accessToken: options.accessToken,
    tokenOrg: options.tokenOrg,
    orgName: owner,
  })
  const git = await api.getGitApi()
  const res = await git.createPullRequest(
    {
      sourceRefName: `refs/heads/${options.sourceBranchName}`,
      targetRefName: `refs/heads/${options.targetBranchName}`,
      title: options.title,
      description: options.body,
    },
    repo,
    projectName
  )
  return res.pullRequestId
}

export async function getAdoRepoDefaultBranch({
  repoUrl,
  tokenOrg,
  accessToken,
}: {
  repoUrl: string
  tokenOrg: string | undefined
  accessToken: string | undefined
}): Promise<string> {
  const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
  const api = await getAdoApiClient({
    accessToken,
    tokenOrg,
    orgName: owner,
  })
  const git = await api.getGitApi()
  const branches = await git.getBranches(repo, projectName)
  if (!branches || branches.length === 0) {
    throw new InvalidRepoUrlError('no branches')
  }
  const res = branches.find((branch) => branch.isBaseVersion)
  if (!res || !res.name) {
    throw new InvalidRepoUrlError('no default branch')
  }
  return res.name
}

export async function getAdoReferenceData({
  ref,
  repoUrl,
  accessToken,
  tokenOrg,
}: {
  ref: string
  repoUrl: string
  accessToken: string | undefined
  tokenOrg: string | undefined
}) {
  const { owner, repo, projectName } = parseAdoOwnerAndRepo(repoUrl)
  const api = await getAdoApiClient({
    accessToken,
    tokenOrg,
    orgName: owner,
  })
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
      const res = await git.getRefs(repo, projectName, `tags/${ref}`)
      if (!res[0] || !res[0].objectId) {
        throw new Error('no tag ref')
      }
      let objectId = res[0].objectId
      try {
        //in some cases the call to git.getRefs() returns the sha of the commit in the objectId and in some cases
        //it returns the tag object ID which we then need to call git.getAnnotatedTag() on it
        const tag = await git.getAnnotatedTag(projectName, repo, objectId)
        if (tag.taggedObject?.objectId) {
          objectId = tag.taggedObject.objectId
        }
      } catch (e) {
        /* empty */
      }
      const commitRes = await git.getCommits(
        repo,
        {
          fromCommitId: objectId,
          toCommitId: objectId,
          $top: 1,
        },
        projectName
      )
      const commit = commitRes[0]
      if (!commit) {
        throw new Error('no commit')
      }
      return {
        sha: objectId,
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
}

export function parseAdoOwnerAndRepo(adoUrl: string) {
  adoUrl = removeTrailingSlash(adoUrl)
  const parsingResult = parseScmURL(adoUrl)

  if (!parsingResult || parsingResult.hostname !== 'dev.azure.com') {
    throw new InvalidUrlPatternError(`invalid ADO repo URL: ${adoUrl}`)
  }

  const { organization, repoName, projectName, projectPath, pathElements } =
    parsingResult
  return {
    owner: organization,
    repo: repoName,
    projectName,
    projectPath,
    pathElements,
  }
}

export async function getAdoBlameRanges() {
  return []
}

const ADO_ACCESS_TOKEN_URL = 'https://app.vssps.visualstudio.com/oauth2/token'

export enum AdoTokenRequestTypeEnum {
  CODE = 'code',
  REFRESH_TOKEN = 'refresh_token',
}

const AdoAuthResultZ = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  refresh_token: z.string().min(1),
})

export async function getAdoToken({
  token,
  adoClientSecret,
  tokenType,
  redirectUri,
}: {
  token: string
  adoClientSecret: string
  tokenType: AdoTokenRequestTypeEnum
  redirectUri: string
}) {
  const res = await fetch(ADO_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      client_assertion_type:
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: adoClientSecret,
      redirect_uri: redirectUri,
      assertion: token,
      grant_type:
        tokenType === AdoTokenRequestTypeEnum.CODE
          ? 'urn:ietf:params:oauth:grant-type:jwt-bearer'
          : 'refresh_token',
    }),
  })
  const authResult = await res.json()
  return AdoAuthResultZ.parse(authResult)
}
