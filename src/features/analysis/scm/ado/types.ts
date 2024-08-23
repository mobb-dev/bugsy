import { AdoTokenTypeEnum } from './constants'

export enum ProjectVisibility {
  Unchanged = -1,
  /**
   * The project is only visible to users with explicit access.
   */
  Private = 0,
  /**
   * Enterprise level project visibility
   */
  Organization = 1,
  /**
   * The project is visible to all.
   */
  Public = 2,
  SystemPrivate = 3,
}

export enum AdoPullRequestStatus {
  /**
   * Status not set. Default state.
   */
  NotSet = 0,
  /**
   * Pull request is active.
   */
  Active = 1,
  /**
   * Pull request is abandoned.
   */
  Abandoned = 2,
  /**
   * Pull request is completed.
   */
  Completed = 3,
  /**
   * Used in pull request search criteria to include all statuses.
   */
  All = 4,
}
export type AdoValidateParamsArgs = {
  url: string | undefined
  accessToken: string | undefined
  tokenOrg: string | undefined
}

export type GetAdoApiClientParams = BaseGetAdoParma & {
  origin?: string
  orgName: string
}

export type BaseGetAdoParma =
  | {
      tokenType: AdoTokenTypeEnum.PAT
      accessToken: string
      // the org name that is associated with the token - only applicable for PAT
      patTokenOrg: string
    }
  | {
      tokenType: AdoTokenTypeEnum.OAUTH
      accessToken: string
    }
  | {
      tokenType: AdoTokenTypeEnum.NONE
    }

export type GetAdoParams = BaseGetAdoParma & {
  repoUrl: string
  orgName: string
}

export type ValidAdoPullRequestStatus =
  | AdoPullRequestStatus.Active
  | AdoPullRequestStatus.Abandoned
  | AdoPullRequestStatus.Completed

export type AdoOAuthTokenType = 'code' | 'refresh_token'

export type AdoTokenInfo =
  | {
      type: AdoTokenTypeEnum.NONE
    }
  | {
      type: AdoTokenTypeEnum.OAUTH
      accessToken: string
    }
  | {
      type: AdoTokenTypeEnum.PAT
      accessToken: string
    }
