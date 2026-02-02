// Original file: exa/auto_cascade_common_pb/auto_cascade_common.proto

export const GithubCICheckStatus = {
  GITHUB_CI_CHECK_STATUS_UNSPECIFIED: 'GITHUB_CI_CHECK_STATUS_UNSPECIFIED',
  GITHUB_CI_CHECK_STATUS_SUCCESS: 'GITHUB_CI_CHECK_STATUS_SUCCESS',
  GITHUB_CI_CHECK_STATUS_FAILED: 'GITHUB_CI_CHECK_STATUS_FAILED',
  GITHUB_CI_CHECK_STATUS_PENDING: 'GITHUB_CI_CHECK_STATUS_PENDING',
} as const;

export type GithubCICheckStatus =
  | 'GITHUB_CI_CHECK_STATUS_UNSPECIFIED'
  | 0
  | 'GITHUB_CI_CHECK_STATUS_SUCCESS'
  | 1
  | 'GITHUB_CI_CHECK_STATUS_FAILED'
  | 2
  | 'GITHUB_CI_CHECK_STATUS_PENDING'
  | 3

export type GithubCICheckStatus__Output = typeof GithubCICheckStatus[keyof typeof GithubCICheckStatus]
