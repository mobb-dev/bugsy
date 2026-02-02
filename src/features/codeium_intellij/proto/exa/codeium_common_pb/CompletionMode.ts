// Original file: exa/codeium_common_pb/codeium_common.proto

export const CompletionMode = {
  COMPLETION_MODE_UNSPECIFIED: 'COMPLETION_MODE_UNSPECIFIED',
  COMPLETION_MODE_SUPERCOMPLETE: 'COMPLETION_MODE_SUPERCOMPLETE',
  COMPLETION_MODE_AUTOCOMPLETE: 'COMPLETION_MODE_AUTOCOMPLETE',
  COMPLETION_MODE_OFF: 'COMPLETION_MODE_OFF',
} as const;

export type CompletionMode =
  | 'COMPLETION_MODE_UNSPECIFIED'
  | 0
  | 'COMPLETION_MODE_SUPERCOMPLETE'
  | 1
  | 'COMPLETION_MODE_AUTOCOMPLETE'
  | 2
  | 'COMPLETION_MODE_OFF'
  | 3

export type CompletionMode__Output = typeof CompletionMode[keyof typeof CompletionMode]
