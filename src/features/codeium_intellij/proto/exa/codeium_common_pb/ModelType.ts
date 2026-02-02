// Original file: exa/codeium_common_pb/codeium_common.proto

export const ModelType = {
  MODEL_TYPE_UNSPECIFIED: 'MODEL_TYPE_UNSPECIFIED',
  MODEL_TYPE_COMPLETION: 'MODEL_TYPE_COMPLETION',
  MODEL_TYPE_CHAT: 'MODEL_TYPE_CHAT',
  MODEL_TYPE_EMBED: 'MODEL_TYPE_EMBED',
  MODEL_TYPE_QUERY: 'MODEL_TYPE_QUERY',
} as const;

export type ModelType =
  | 'MODEL_TYPE_UNSPECIFIED'
  | 0
  | 'MODEL_TYPE_COMPLETION'
  | 1
  | 'MODEL_TYPE_CHAT'
  | 2
  | 'MODEL_TYPE_EMBED'
  | 3
  | 'MODEL_TYPE_QUERY'
  | 4

export type ModelType__Output = typeof ModelType[keyof typeof ModelType]
