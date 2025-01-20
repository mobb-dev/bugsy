import { z } from 'zod'

import {
  DeleteGeneralPrCommentResponse,
  GetGeneralPrCommentResponse,
  PostGeneralPrCommentResponse,
} from './github/types'
import { scmCloudUrl, ScmType } from './shared/src'

export enum ReferenceType {
  BRANCH = 'BRANCH',
  COMMIT = 'COMMIT',
  TAG = 'TAG',
}

export type GetReferenceDataResponse = {
  type: ReferenceType
  sha: string
  date: Date | undefined
}

export type GetGitBlameReponse = {
  startingLine: number
  endingLine: number
  name: string
  login: string
  email: string
}[]

export const scmSubmitRequestStatus = {
  MERGED: 'merged',
  OPEN: 'open',
  CLOSED: 'closed',
  DRAFT: 'draft',
  ERROR: 'error',
  SKIPPED: 'skipped',
  NO_ACCESS: 'no_access',
} as const

export type ScmSubmitRequestStatus =
  (typeof scmSubmitRequestStatus)[keyof typeof scmSubmitRequestStatus]

export enum ScmLibScmType {
  GITHUB = 'GITHUB',
  GITLAB = 'GITLAB',
  ADO = 'ADO',
  BITBUCKET = 'BITBUCKET',
}

export type ScmRepoInfo = {
  repoName: string
  repoUrl: string
  repoOwner: string
  repoLanguages: string[]
  repoIsPublic: boolean
  repoUpdatedAt: string | null
}

export const scmCloudHostname: Record<ScmType, string> = {
  [ScmType.GitLab]: new URL(scmCloudUrl.GitLab).hostname,
  [ScmType.GitHub]: new URL(scmCloudUrl.GitHub).hostname,
  [ScmType.Ado]: new URL(scmCloudUrl.Ado).hostname,
  [ScmType.Bitbucket]: new URL(scmCloudUrl.Bitbucket).hostname,
} as const

export const scmLibScmTypeToScmType: Record<ScmLibScmType, ScmType> = {
  [ScmLibScmType.GITLAB]: ScmType.GitLab,
  [ScmLibScmType.GITHUB]: ScmType.GitHub,
  [ScmLibScmType.ADO]: ScmType.Ado,
  [ScmLibScmType.BITBUCKET]: ScmType.Bitbucket,
} as const

export const scmTypeToScmLibScmType: Record<ScmType, ScmLibScmType> = {
  [ScmType.GitLab]: ScmLibScmType.GITLAB,
  [ScmType.GitHub]: ScmLibScmType.GITHUB,
  [ScmType.Ado]: ScmLibScmType.ADO,
  [ScmType.Bitbucket]: ScmLibScmType.BITBUCKET,
} as const

export type CreateSubmitRequestParams = {
  targetBranchName: string
  sourceBranchName: string
  title: string
  body: string
}

export const GetRefererenceResultZ = z.object({
  date: z.date().optional(),
  sha: z.string(),
  type: z.nativeEnum(ReferenceType),
})

export type GetRefererenceResult = z.infer<typeof GetRefererenceResultZ>

export type PostPRReviewCommentParams = {
  prNumber: number
  body: string
}
export type SCMGetPrReviewCommentsParams = {
  prNumber: number
}
export type SCMGetPrReviewCommentsResponse =
  Promise<GetGeneralPrCommentResponse>
export type SCMPostGeneralPrCommentsResponse =
  Promise<PostGeneralPrCommentResponse>
export type SCMDeleteGeneralPrCommentParams = {
  commentId: number
}

export type SCMDeleteGeneralPrReviewResponse =
  Promise<DeleteGeneralPrCommentResponse>

export type ScmInitParams = {
  url: string | undefined
  accessToken: string | undefined
  scmType: ScmLibScmType | undefined

  scmOrg?: string
}

export type ScmConfig = {
  id: string
  orgId?: string | null
  refreshToken?: string | null
  scmOrg?: string | null | undefined
  scmType: string
  scmUrl: string
  scmUsername?: string | null
  token?: string | null
  tokenLastUpdate?: string | null
  userId?: string | null
  isTokenAvailable: boolean
}
