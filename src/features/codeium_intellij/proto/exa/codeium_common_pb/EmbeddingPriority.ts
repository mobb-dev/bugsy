// Original file: exa/codeium_common_pb/codeium_common.proto

export const EmbeddingPriority = {
  EMBEDDING_PRIORITY_UNSPECIFIED: 'EMBEDDING_PRIORITY_UNSPECIFIED',
  EMBEDDING_PRIORITY_HIGH: 'EMBEDDING_PRIORITY_HIGH',
  EMBEDDING_PRIORITY_LOW: 'EMBEDDING_PRIORITY_LOW',
} as const;

export type EmbeddingPriority =
  | 'EMBEDDING_PRIORITY_UNSPECIFIED'
  | 0
  | 'EMBEDDING_PRIORITY_HIGH'
  | 1
  | 'EMBEDDING_PRIORITY_LOW'
  | 2

export type EmbeddingPriority__Output = typeof EmbeddingPriority[keyof typeof EmbeddingPriority]
