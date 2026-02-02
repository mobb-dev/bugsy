// Original file: exa/auto_cascade_common_pb/auto_cascade_common.proto

export const BranchStatus = {
  BRANCH_STATUS_UNSPECIFIED: 'BRANCH_STATUS_UNSPECIFIED',
  BRANCH_STATUS_NO_PR: 'BRANCH_STATUS_NO_PR',
  BRANCH_STATUS_PR_OPEN: 'BRANCH_STATUS_PR_OPEN',
  BRANCH_STATUS_PR_CLOSED: 'BRANCH_STATUS_PR_CLOSED',
  BRANCH_STATUS_PR_MERGED: 'BRANCH_STATUS_PR_MERGED',
  BRANCH_STATUS_HAS_SUGGESTION: 'BRANCH_STATUS_HAS_SUGGESTION',
} as const;

export type BranchStatus =
  | 'BRANCH_STATUS_UNSPECIFIED'
  | 0
  | 'BRANCH_STATUS_NO_PR'
  | 1
  | 'BRANCH_STATUS_PR_OPEN'
  | 2
  | 'BRANCH_STATUS_PR_CLOSED'
  | 3
  | 'BRANCH_STATUS_PR_MERGED'
  | 4
  | 'BRANCH_STATUS_HAS_SUGGESTION'
  | 5

export type BranchStatus__Output = typeof BranchStatus[keyof typeof BranchStatus]
