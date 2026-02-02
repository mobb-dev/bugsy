// Original file: exa/chat_pb/chat.proto

export const CacheControlType = {
  CACHE_CONTROL_TYPE_UNSPECIFIED: 'CACHE_CONTROL_TYPE_UNSPECIFIED',
  CACHE_CONTROL_TYPE_EPHEMERAL: 'CACHE_CONTROL_TYPE_EPHEMERAL',
} as const;

export type CacheControlType =
  | 'CACHE_CONTROL_TYPE_UNSPECIFIED'
  | 0
  | 'CACHE_CONTROL_TYPE_EPHEMERAL'
  | 1

export type CacheControlType__Output = typeof CacheControlType[keyof typeof CacheControlType]
