// Original file: exa/cortex_pb/cortex.proto

export const SemanticCodebaseSearchType = {
  SEMANTIC_CODEBASE_SEARCH_TYPE_UNSPECIFIED: 'SEMANTIC_CODEBASE_SEARCH_TYPE_UNSPECIFIED',
  SEMANTIC_CODEBASE_SEARCH_TYPE_MQUERY: 'SEMANTIC_CODEBASE_SEARCH_TYPE_MQUERY',
  SEMANTIC_CODEBASE_SEARCH_TYPE_VECTOR_INDEX: 'SEMANTIC_CODEBASE_SEARCH_TYPE_VECTOR_INDEX',
} as const;

export type SemanticCodebaseSearchType =
  | 'SEMANTIC_CODEBASE_SEARCH_TYPE_UNSPECIFIED'
  | 0
  | 'SEMANTIC_CODEBASE_SEARCH_TYPE_MQUERY'
  | 1
  | 'SEMANTIC_CODEBASE_SEARCH_TYPE_VECTOR_INDEX'
  | 2

export type SemanticCodebaseSearchType__Output = typeof SemanticCodebaseSearchType[keyof typeof SemanticCodebaseSearchType]
