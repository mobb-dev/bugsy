// Original file: exa/codeium_common_pb/codeium_common.proto

export const CommitIntentType = {
  COMMIT_INTENT_TYPE_UNSPECIFIED: 'COMMIT_INTENT_TYPE_UNSPECIFIED',
  COMMIT_INTENT_TYPE_COMMIT_MESSAGE: 'COMMIT_INTENT_TYPE_COMMIT_MESSAGE',
} as const;

export type CommitIntentType =
  | 'COMMIT_INTENT_TYPE_UNSPECIFIED'
  | 0
  | 'COMMIT_INTENT_TYPE_COMMIT_MESSAGE'
  | 1

export type CommitIntentType__Output = typeof CommitIntentType[keyof typeof CommitIntentType]
