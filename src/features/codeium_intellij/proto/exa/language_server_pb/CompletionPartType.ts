// Original file: exa/language_server_pb/language_server.proto

export const CompletionPartType = {
  COMPLETION_PART_TYPE_UNSPECIFIED: 'COMPLETION_PART_TYPE_UNSPECIFIED',
  COMPLETION_PART_TYPE_INLINE: 'COMPLETION_PART_TYPE_INLINE',
  COMPLETION_PART_TYPE_BLOCK: 'COMPLETION_PART_TYPE_BLOCK',
  COMPLETION_PART_TYPE_INLINE_MASK: 'COMPLETION_PART_TYPE_INLINE_MASK',
} as const;

export type CompletionPartType =
  | 'COMPLETION_PART_TYPE_UNSPECIFIED'
  | 0
  | 'COMPLETION_PART_TYPE_INLINE'
  | 1
  | 'COMPLETION_PART_TYPE_BLOCK'
  | 2
  | 'COMPLETION_PART_TYPE_INLINE_MASK'
  | 3

export type CompletionPartType__Output = typeof CompletionPartType[keyof typeof CompletionPartType]
