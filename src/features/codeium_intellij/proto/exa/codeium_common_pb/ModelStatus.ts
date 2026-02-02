// Original file: exa/codeium_common_pb/codeium_common.proto

export const ModelStatus = {
  MODEL_STATUS_UNSPECIFIED: 'MODEL_STATUS_UNSPECIFIED',
  MODEL_STATUS_INFO: 'MODEL_STATUS_INFO',
  MODEL_STATUS_WARNING: 'MODEL_STATUS_WARNING',
} as const;

export type ModelStatus =
  | 'MODEL_STATUS_UNSPECIFIED'
  | 0
  | 'MODEL_STATUS_INFO'
  | 1
  | 'MODEL_STATUS_WARNING'
  | 2

export type ModelStatus__Output = typeof ModelStatus[keyof typeof ModelStatus]
