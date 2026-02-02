// Original file: exa/codeium_common_pb/codeium_common.proto

export const UserTeamStatus = {
  USER_TEAM_STATUS_UNSPECIFIED: 'USER_TEAM_STATUS_UNSPECIFIED',
  USER_TEAM_STATUS_PENDING: 'USER_TEAM_STATUS_PENDING',
  USER_TEAM_STATUS_APPROVED: 'USER_TEAM_STATUS_APPROVED',
  USER_TEAM_STATUS_REJECTED: 'USER_TEAM_STATUS_REJECTED',
} as const;

export type UserTeamStatus =
  | 'USER_TEAM_STATUS_UNSPECIFIED'
  | 0
  | 'USER_TEAM_STATUS_PENDING'
  | 1
  | 'USER_TEAM_STATUS_APPROVED'
  | 2
  | 'USER_TEAM_STATUS_REJECTED'
  | 3

export type UserTeamStatus__Output = typeof UserTeamStatus[keyof typeof UserTeamStatus]
