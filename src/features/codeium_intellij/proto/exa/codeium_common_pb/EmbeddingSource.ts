// Original file: exa/codeium_common_pb/codeium_common.proto

export const EmbeddingSource = {
  EMBEDDING_SOURCE_UNSPECIFIED: 'EMBEDDING_SOURCE_UNSPECIFIED',
  EMBEDDING_SOURCE_CODE_CONTEXT_ITEM: 'EMBEDDING_SOURCE_CODE_CONTEXT_ITEM',
  EMBEDDING_SOURCE_COMMIT_INTENT: 'EMBEDDING_SOURCE_COMMIT_INTENT',
} as const;

export type EmbeddingSource =
  | 'EMBEDDING_SOURCE_UNSPECIFIED'
  | 0
  | 'EMBEDDING_SOURCE_CODE_CONTEXT_ITEM'
  | 1
  | 'EMBEDDING_SOURCE_COMMIT_INTENT'
  | 2

export type EmbeddingSource__Output = typeof EmbeddingSource[keyof typeof EmbeddingSource]
