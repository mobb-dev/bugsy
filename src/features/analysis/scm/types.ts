import { z } from 'zod'

import { Pr_Status_Enum } from './generates/client_generates'
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

export type GetSubmitRequestInfo = {
  submitRequestId: string
  submitRequestNumber: number
  title: string
  status: ScmSubmitRequestStatus
  sourceBranch: string
  targetBranch: string
  authorName?: string
  authorEmail?: string
  createdAt: Date
  updatedAt: Date
  description?: string
  tickets: { name: string; title: string; url: string }[]
  changedLines: { added: number; removed: number }
}

export type SubmitRequestSortField = 'updated' | 'created' | 'comments'
export type SortOrder = 'asc' | 'desc'

export type SubmitRequestSort = {
  field: SubmitRequestSortField
  order: SortOrder
}

export type SearchSubmitRequestsParams = {
  repoUrl: string
  filters?: {
    updatedAfter?: Date
    state?: 'open' | 'closed' | 'all'
  }
  sort?: SubmitRequestSort
  limit?: number
  cursor?: string
}

export type SearchSubmitRequestsResult = {
  results: GetSubmitRequestInfo[]
  nextCursor?: string
  hasMore: boolean
}

export type RepoSortField = 'updated' | 'name' | 'created' // 'created' is mapped to 'updated' in implementation

export type RepoSort = {
  field: RepoSortField
  order: SortOrder
}

export type SearchReposParams = {
  scmOrg: string | undefined
  sort?: RepoSort
  limit?: number
  cursor?: string
}

export type SearchReposResult = {
  results: ScmRepoInfo[]
  nextCursor?: string
  hasMore: boolean
}

export type PullRequestMetrics = {
  prId: string
  repositoryUrl: string
  prCreatedAt: Date
  prMergedAt: Date | null
  linesAdded: number
  prStatus: Pr_Status_Enum
  commentIds: string[]
}

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

export const GetReferenceResultZ = z.object({
  date: z.date().optional(),
  sha: z.string(),
  type: z.nativeEnum(ReferenceType),
})

export type GetReferenceResult = z.infer<typeof GetReferenceResultZ>

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

export type RateLimitStatus = {
  remaining: number
  reset: Date
  limit?: number
}

/**
 * Lightweight PR metadata result.
 * Only requires a single API call (getPr for GitHub, MR show for GitLab).
 */
export type GetSubmitRequestMetadataResult = {
  title?: string
  targetBranch: string
  sourceBranch: string
  headCommitSha: string
}

export type CommitLite = {
  sha: string
  commit: {
    committer?: { date?: string }
    author?: { email?: string; name?: string }
    message?: string
  }
  parents?: { sha: string }[]
}

export type RecentCommitsResult = {
  data: CommitLite[]
}
