import { z } from 'zod'

import { BitbucketAuthResultZ } from './validation'

export type GetReposParam = {
  workspaceSlug?: string
}

export type CreatePullRequestParams = {
  targetBranchName: string
  sourceBranchName: string
  title: string
  body: string
  repoUrl: string
}

export type ValidateParamsArgs = {
  url: string | undefined
  accessToken: string | undefined
  tokenOrg: string | undefined
}

export type GetBitbucketTokenArgs =
  | {
      code: string
      bitbucketClientId: string
      bitbucketClientSecret: string
      authType: 'authorization_code'
    }
  | {
      refreshToken: string
      bitbucketClientId: string
      bitbucketClientSecret: string
      authType: 'refresh_token'
    }

export type BitbucketAuthResult = z.infer<typeof BitbucketAuthResultZ>

export type GetBitbucketTokenRes =
  | {
      success: false
    }
  | {
      success: true
      authResult: BitbucketAuthResult
    }
