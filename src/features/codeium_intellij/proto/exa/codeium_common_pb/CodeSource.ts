// Original file: exa/codeium_common_pb/codeium_common.proto

export const CodeSource = {
  CODE_SOURCE_UNSPECIFIED: 'CODE_SOURCE_UNSPECIFIED',
  CODE_SOURCE_BASE: 'CODE_SOURCE_BASE',
  CODE_SOURCE_CODEIUM: 'CODE_SOURCE_CODEIUM',
  CODE_SOURCE_USER: 'CODE_SOURCE_USER',
  CODE_SOURCE_USER_LARGE: 'CODE_SOURCE_USER_LARGE',
  CODE_SOURCE_UNKNOWN: 'CODE_SOURCE_UNKNOWN',
} as const;

export type CodeSource =
  | 'CODE_SOURCE_UNSPECIFIED'
  | 0
  | 'CODE_SOURCE_BASE'
  | 1
  | 'CODE_SOURCE_CODEIUM'
  | 2
  | 'CODE_SOURCE_USER'
  | 3
  | 'CODE_SOURCE_USER_LARGE'
  | 4
  | 'CODE_SOURCE_UNKNOWN'
  | 5

export type CodeSource__Output = typeof CodeSource[keyof typeof CodeSource]
