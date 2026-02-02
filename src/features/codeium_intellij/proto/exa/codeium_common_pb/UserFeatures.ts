// Original file: exa/codeium_common_pb/codeium_common.proto

export const UserFeatures = {
  USER_FEATURES_UNSPECIFIED: 'USER_FEATURES_UNSPECIFIED',
  USER_FEATURES_CORTEX: 'USER_FEATURES_CORTEX',
  USER_FEATURES_CORTEX_TEST: 'USER_FEATURES_CORTEX_TEST',
} as const;

export type UserFeatures =
  | 'USER_FEATURES_UNSPECIFIED'
  | 0
  | 'USER_FEATURES_CORTEX'
  | 1
  | 'USER_FEATURES_CORTEX_TEST'
  | 2

export type UserFeatures__Output = typeof UserFeatures[keyof typeof UserFeatures]
