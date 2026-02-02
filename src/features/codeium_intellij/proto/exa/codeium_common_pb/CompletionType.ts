// Original file: exa/codeium_common_pb/codeium_common.proto

export const CompletionType = {
  COMPLETION_TYPE_UNSPECIFIED: 'COMPLETION_TYPE_UNSPECIFIED',
  COMPLETION_TYPE_SINGLE: 'COMPLETION_TYPE_SINGLE',
  COMPLETION_TYPE_MULTI: 'COMPLETION_TYPE_MULTI',
  COMPLETION_TYPE_INLINE_FIM: 'COMPLETION_TYPE_INLINE_FIM',
  COMPLETION_TYPE_CASCADE: 'COMPLETION_TYPE_CASCADE',
} as const;

export type CompletionType =
  | 'COMPLETION_TYPE_UNSPECIFIED'
  | 0
  | 'COMPLETION_TYPE_SINGLE'
  | 1
  | 'COMPLETION_TYPE_MULTI'
  | 2
  | 'COMPLETION_TYPE_INLINE_FIM'
  | 3
  | 'COMPLETION_TYPE_CASCADE'
  | 4

export type CompletionType__Output = typeof CompletionType[keyof typeof CompletionType]
