import { getAdoSdk } from './ado'

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

export type GetAdoSdkPromise = ReturnType<typeof getAdoSdk>
