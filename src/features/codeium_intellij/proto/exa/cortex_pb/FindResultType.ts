// Original file: exa/cortex_pb/cortex.proto

export const FindResultType = {
  FIND_RESULT_TYPE_UNSPECIFIED: 'FIND_RESULT_TYPE_UNSPECIFIED',
  FIND_RESULT_TYPE_FILE: 'FIND_RESULT_TYPE_FILE',
  FIND_RESULT_TYPE_DIRECTORY: 'FIND_RESULT_TYPE_DIRECTORY',
  FIND_RESULT_TYPE_ANY: 'FIND_RESULT_TYPE_ANY',
} as const;

export type FindResultType =
  | 'FIND_RESULT_TYPE_UNSPECIFIED'
  | 0
  | 'FIND_RESULT_TYPE_FILE'
  | 1
  | 'FIND_RESULT_TYPE_DIRECTORY'
  | 2
  | 'FIND_RESULT_TYPE_ANY'
  | 3

export type FindResultType__Output = typeof FindResultType[keyof typeof FindResultType]
