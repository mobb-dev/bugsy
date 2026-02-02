// Original file: exa/codeium_common_pb/codeium_common.proto

export const SearchResultType = {
  SEARCH_RESULT_TYPE_UNSPECIFIED: 'SEARCH_RESULT_TYPE_UNSPECIFIED',
  SEARCH_RESULT_TYPE_CLUSTER: 'SEARCH_RESULT_TYPE_CLUSTER',
  SEARCH_RESULT_TYPE_EXACT: 'SEARCH_RESULT_TYPE_EXACT',
} as const;

export type SearchResultType =
  | 'SEARCH_RESULT_TYPE_UNSPECIFIED'
  | 0
  | 'SEARCH_RESULT_TYPE_CLUSTER'
  | 1
  | 'SEARCH_RESULT_TYPE_EXACT'
  | 2

export type SearchResultType__Output = typeof SearchResultType[keyof typeof SearchResultType]
