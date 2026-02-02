// Original file: exa/cortex_pb/cortex.proto

export const PassiveCoderRequestSource = {
  PASSIVE_CODER_REQUEST_SOURCE_UNSPECIFIED: 'PASSIVE_CODER_REQUEST_SOURCE_UNSPECIFIED',
  PASSIVE_CODER_REQUEST_SOURCE_AFTER_RUN_COMMAND: 'PASSIVE_CODER_REQUEST_SOURCE_AFTER_RUN_COMMAND',
} as const;

export type PassiveCoderRequestSource =
  | 'PASSIVE_CODER_REQUEST_SOURCE_UNSPECIFIED'
  | 0
  | 'PASSIVE_CODER_REQUEST_SOURCE_AFTER_RUN_COMMAND'
  | 1

export type PassiveCoderRequestSource__Output = typeof PassiveCoderRequestSource[keyof typeof PassiveCoderRequestSource]
