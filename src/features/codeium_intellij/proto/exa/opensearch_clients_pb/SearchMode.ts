// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

export const SearchMode = {
  SEARCH_MODE_UNSPECIFIED: 'SEARCH_MODE_UNSPECIFIED',
  SEARCH_MODE_HYBRID: 'SEARCH_MODE_HYBRID',
  SEARCH_MODE_KEYWORD: 'SEARCH_MODE_KEYWORD',
  SEARCH_MODE_APPROXIMATE_KNN: 'SEARCH_MODE_APPROXIMATE_KNN',
  SEARCH_MODE_BRUTE_FORCE_KNN: 'SEARCH_MODE_BRUTE_FORCE_KNN',
} as const;

export type SearchMode =
  | 'SEARCH_MODE_UNSPECIFIED'
  | 0
  | 'SEARCH_MODE_HYBRID'
  | 1
  | 'SEARCH_MODE_KEYWORD'
  | 2
  | 'SEARCH_MODE_APPROXIMATE_KNN'
  | 3
  | 'SEARCH_MODE_BRUTE_FORCE_KNN'
  | 4

export type SearchMode__Output = typeof SearchMode[keyof typeof SearchMode]
