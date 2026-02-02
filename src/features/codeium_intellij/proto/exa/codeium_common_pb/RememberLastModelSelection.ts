// Original file: exa/codeium_common_pb/codeium_common.proto

export const RememberLastModelSelection = {
  REMEMBER_LAST_MODEL_SELECTION_UNSPECIFIED: 'REMEMBER_LAST_MODEL_SELECTION_UNSPECIFIED',
  REMEMBER_LAST_MODEL_SELECTION_ENABLED: 'REMEMBER_LAST_MODEL_SELECTION_ENABLED',
  REMEMBER_LAST_MODEL_SELECTION_DISABLED: 'REMEMBER_LAST_MODEL_SELECTION_DISABLED',
} as const;

export type RememberLastModelSelection =
  | 'REMEMBER_LAST_MODEL_SELECTION_UNSPECIFIED'
  | 0
  | 'REMEMBER_LAST_MODEL_SELECTION_ENABLED'
  | 1
  | 'REMEMBER_LAST_MODEL_SELECTION_DISABLED'
  | 2

export type RememberLastModelSelection__Output = typeof RememberLastModelSelection[keyof typeof RememberLastModelSelection]
