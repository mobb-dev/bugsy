// Original file: exa/cortex_pb/cortex.proto


// Original file: exa/cortex_pb/cortex.proto

export const _exa_cortex_pb_InstantContextToolCall_ExecutionStatus = {
  EXECUTION_STATUS_UNSPECIFIED: 'EXECUTION_STATUS_UNSPECIFIED',
  EXECUTION_STATUS_PENDING: 'EXECUTION_STATUS_PENDING',
  EXECUTION_STATUS_COMPLETED: 'EXECUTION_STATUS_COMPLETED',
  EXECUTION_STATUS_ERROR: 'EXECUTION_STATUS_ERROR',
  EXECUTION_STATUS_TIMED_OUT: 'EXECUTION_STATUS_TIMED_OUT',
} as const;

export type _exa_cortex_pb_InstantContextToolCall_ExecutionStatus =
  | 'EXECUTION_STATUS_UNSPECIFIED'
  | 0
  | 'EXECUTION_STATUS_PENDING'
  | 1
  | 'EXECUTION_STATUS_COMPLETED'
  | 2
  | 'EXECUTION_STATUS_ERROR'
  | 3
  | 'EXECUTION_STATUS_TIMED_OUT'
  | 4

export type _exa_cortex_pb_InstantContextToolCall_ExecutionStatus__Output = typeof _exa_cortex_pb_InstantContextToolCall_ExecutionStatus[keyof typeof _exa_cortex_pb_InstantContextToolCall_ExecutionStatus]

export interface InstantContextToolCall {
  'commandType'?: (string);
  'param'?: (string);
  'executionStatus'?: (_exa_cortex_pb_InstantContextToolCall_ExecutionStatus);
  'errorMessage'?: (string);
  'toolCallId'?: (string);
  'durationSeconds'?: (number | string);
}

export interface InstantContextToolCall__Output {
  'commandType': (string);
  'param': (string);
  'executionStatus': (_exa_cortex_pb_InstantContextToolCall_ExecutionStatus__Output);
  'errorMessage': (string);
  'toolCallId': (string);
  'durationSeconds': (number);
}
