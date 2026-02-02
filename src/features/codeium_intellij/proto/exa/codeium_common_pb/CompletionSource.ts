// Original file: exa/codeium_common_pb/codeium_common.proto

export const CompletionSource = {
  COMPLETION_SOURCE_UNSPECIFIED: 'COMPLETION_SOURCE_UNSPECIFIED',
  COMPLETION_SOURCE_TYPING_AS_SUGGESTED: 'COMPLETION_SOURCE_TYPING_AS_SUGGESTED',
  COMPLETION_SOURCE_CACHE: 'COMPLETION_SOURCE_CACHE',
  COMPLETION_SOURCE_NETWORK: 'COMPLETION_SOURCE_NETWORK',
} as const;

export type CompletionSource =
  | 'COMPLETION_SOURCE_UNSPECIFIED'
  | 0
  | 'COMPLETION_SOURCE_TYPING_AS_SUGGESTED'
  | 1
  | 'COMPLETION_SOURCE_CACHE'
  | 2
  | 'COMPLETION_SOURCE_NETWORK'
  | 3

export type CompletionSource__Output = typeof CompletionSource[keyof typeof CompletionSource]
