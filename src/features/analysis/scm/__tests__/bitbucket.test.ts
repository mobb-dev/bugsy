import { describe } from 'node:test'

import { expect, it } from 'vitest'
import { z } from 'zod'

import {
  getBitbucketSdk,
  getBitbucketToken,
  validateBitbucketParams,
} from '../bitbucket'
import { GetBitbucketTokenArgs } from '../bitbucket/types'
import {
  BitbucketSCMLib,
  InvalidAccessTokenError,
  InvalidRepoUrlError,
  RefNotFoundError,
  RepoNoTokenAccessError,
  SCMLib,
} from '../scm'
import { ScmLibScmType } from '../types'
import { env } from './env'

const EXPIRED_TOKEN =
  'XMT7WlQLoZpzpcExU-iwaBbKmsmDuejjY9m1_hppLlU4JN6tJBUlMiucmUaf4PgF6GBXoAChSA2QLEnf2VC6SAg9YLq6j85qWAUQlTnMWw4HfWqIHWB4Q_uZjE_PP8B7Wf1pXqGS1mgFke-8DDkFV6OO23iX'

const WORKSPACE_SLUG = 'mobb-dev'
const PUBLIC_URL = 'https://bitbucket.org/jwalton/opup'
const REPO = {
  URL: 'https://bitbucket.org/mobb-dev/webgoat',
  COMMIT_SHA: '3134f180660c138b820a10ca91144fd42b28ec08',
  BRANCH: 'helm',
  TAG: 'vtest9',
} as const

const ALLOWED_URLS = [
  REPO.URL,
  'https://bitbucket.org/mobb-dev/webgoat.git',
  'https://mobb-dev-admin@bitbucket.org/mobb-dev/webgoat.git',
]

const authUsername = env.TEST_MINIMAL_WEBGOAT_BITBUCKET_USERNAME
const authPassword = env.TEST_MINIMAL_WEBGOAT_BITBUCKET_PASSWORD

describe('bitbucket sdk function', async () => {
  it('should get user', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getUser()
    expect(res.username).toMatchInlineSnapshot('"mobb-dev-admin"')
  })
  it('should get all the repos of specific workspace', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getRepos({ workspaceSlug: WORKSPACE_SLUG })
    expect(res[0]?.repoName).toMatchInlineSnapshot('"WebGoat"')
  })
  it('should get all the repos all the users workspaces', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getRepos()

    expect(
      res.map((repo) => ({
        repoIsPublic: repo.repoIsPublic,
        repoName: repo.repoName,
        repoUrl: repo.repoUrl,
      }))
    ).toMatchInlineSnapshot(`
      [
        {
          "repoIsPublic": false,
          "repoName": "WebGoat",
          "repoUrl": "https://bitbucket.org/mobb-dev/webgoat",
        },
      ]
    `)
  })
  it('should get ref by BRANCH', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getReferenceData({
      url: REPO.URL,
      ref: REPO.BRANCH,
    })
    expect(res.type).toMatchInlineSnapshot('"BRANCH"')
  })
  it('should get ref by TAG', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getReferenceData({
      url: REPO.URL,
      ref: REPO.TAG,
    })
    expect(res).toMatchInlineSnapshot(`
      {
        "date": 2021-03-30T14:02:06.000Z,
        "sha": "d077a76063bab00fab590e9e470eb9122807e3be",
        "type": "TAG",
      }
    `)
  })
  it('should get ref by COMMIT', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getReferenceData({
      url: REPO.URL,
      ref: REPO.COMMIT_SHA,
    })
    expect(res.sha).toMatchInlineSnapshot(
      '"3134f180660c138b820a10ca91144fd42b28ec08"'
    )
  })

  it('should fail on invalid sha', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    expect(
      bitbucketSdk.getReferenceData({
        url: REPO.URL,
        ref: '111111',
      })
    ).rejects.toThrow(RefNotFoundError)
  })

  it('should test if the user is collaborator', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getIsUserCollaborator({
      repoUrl: REPO.URL,
    })
    expect(res).toMatchInlineSnapshot(`true`)
  })

  it('should get the branches of a repo', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getBranchList({
      repoUrl: REPO.URL,
    })
    expect(res.length).toMatchInlineSnapshot('10')
  })
  it("it checks if it's a remote branch", async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'basic',
      password: authPassword,
      username: authUsername,
    })
    const res = await bitbucketSdk.getBranch({
      branchName: REPO.BRANCH,
      repoUrl: REPO.URL,
    })
    expect(res.name).toBe(REPO.BRANCH)
  })
  it('should be able to validate true if there no token for public repo', async () => {
    const bitbucketSdk = getBitbucketSdk({ authType: 'public' })
    await expect(
      validateBitbucketParams({
        url: PUBLIC_URL,
        bitbucketClient: bitbucketSdk,
      })
    ).resolves.not.toThrowError()
  })
  it('should throw an error if a priavte repo is being access with no token', async () => {
    const bitbucketSdk = getBitbucketSdk({ authType: 'public' })
    await expect(
      validateBitbucketParams({ url: REPO.URL, bitbucketClient: bitbucketSdk })
    ).rejects.toThrowError(InvalidRepoUrlError)
  })
  it('should throw if the repo url does not exists', async () => {
    const bitbucketSdk = getBitbucketSdk({ authType: 'public' })
    await expect(
      validateBitbucketParams({
        url: 'https://bitbucket.org/yhaggai/notexist',
        bitbucketClient: bitbucketSdk,
      })
    ).rejects.toThrowError(InvalidRepoUrlError)
  })
  it('should throw an error if the token is invalid', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'token',
      token: 'invalid',
    })
    await expect(
      validateBitbucketParams({ bitbucketClient: bitbucketSdk })
    ).rejects.toThrowError(InvalidAccessTokenError)
  })
  it('should throw an error if the token is expired', async () => {
    const bitbucketSdk = getBitbucketSdk({
      authType: 'token',
      token: EXPIRED_TOKEN,
    })

    await expect(
      validateBitbucketParams({ bitbucketClient: bitbucketSdk })
    ).rejects.toThrowError(InvalidAccessTokenError)
  })
})

describe('scm instance tests', () => {
  it.each(ALLOWED_URLS)(
    'should return the correct headers for basic auth type %s',
    async (url: string) => {
      const scmLib = await SCMLib.init({
        url,
        scmType: ScmLibScmType.BITBUCKET,
        accessToken: `${authUsername}:${authPassword}`,
        scmOrg: undefined,
      })
      const headersZ = z.object({ authorization: z.string() })
      const authHeaders = scmLib.getAuthHeaders()
      const safeHeaders = headersZ.parse(authHeaders)
      const [_, token] = safeHeaders.authorization.split(' ')
      const userAndPasswordString = Buffer.from(
        z.string().parse(token),
        'base64'
      ).toString()
      const [parsedUser, parsedPassword] = userAndPasswordString.split(':')
      expect(parsedUser).toBe(authUsername)
      expect(parsedPassword).toBe(authPassword)
      const authoriazedUrl = await scmLib.getUrlWithCredentials()
      expect(authoriazedUrl).toBe(
        `https://${authUsername}:${authPassword}@bitbucket.org/mobb-dev/webgoat`
      )
    }
  )
  it('should return the correct headers for token auth type', async () => {
    const scmLib = await SCMLib.init({
      url: PUBLIC_URL,
      scmType: ScmLibScmType.BITBUCKET,
      accessToken: undefined,
      scmOrg: undefined,
    })
    expect(scmLib instanceof BitbucketSCMLib).toBe(true)
    expect(scmLib.getAuthHeaders()).toMatchInlineSnapshot('{}')
    const authoriazedUrl = await scmLib.getUrlWithCredentials()
    expect(authoriazedUrl).toBe(PUBLIC_URL)
  })
  it('should be stub scm in case repo in unreachable ', async () => {
    await expect(
      SCMLib.init({
        url: REPO.URL,
        scmType: ScmLibScmType.BITBUCKET,
        accessToken: undefined,
        scmOrg: undefined,
      })
    ).rejects.toThrowError(RepoNoTokenAccessError)
  })
  it.each<GetBitbucketTokenArgs>([
    {
      refreshToken: 'bad-refresh-token',
      bitbucketClientId: 'bad-client-id',
      bitbucketClientSecret: 'bad-client-secret',
      authType: 'refresh_token',
    },
    {
      code: 'bad-code',
      bitbucketClientId: 'bad-client-id',
      bitbucketClientSecret: 'bad-client-secret',
      authType: 'authorization_code',
    },
  ])(
    'should return {success: false} for bad $authType',
    async (getBitbucketTokenArgs) => {
      const getTokenRes = await getBitbucketToken(getBitbucketTokenArgs)
      expect(getTokenRes.success).toBe(false)
    }
  )
})
