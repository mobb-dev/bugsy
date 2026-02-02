// Original file: exa/codeium_common_pb/codeium_common.proto

export const StatusLevel = {
  STATUS_LEVEL_UNSPECIFIED: 'STATUS_LEVEL_UNSPECIFIED',
  STATUS_LEVEL_ERROR: 'STATUS_LEVEL_ERROR',
  STATUS_LEVEL_WARNING: 'STATUS_LEVEL_WARNING',
  STATUS_LEVEL_INFO: 'STATUS_LEVEL_INFO',
  STATUS_LEVEL_DEBUG: 'STATUS_LEVEL_DEBUG',
} as const;

export type StatusLevel =
  | 'STATUS_LEVEL_UNSPECIFIED'
  | 0
  | 'STATUS_LEVEL_ERROR'
  | 1
  | 'STATUS_LEVEL_WARNING'
  | 2
  | 'STATUS_LEVEL_INFO'
  | 3
  | 'STATUS_LEVEL_DEBUG'
  | 4

export type StatusLevel__Output = typeof StatusLevel[keyof typeof StatusLevel]
