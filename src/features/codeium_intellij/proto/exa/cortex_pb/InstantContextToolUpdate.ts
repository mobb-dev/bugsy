// Original file: exa/cortex_pb/cortex.proto

import type { _exa_cortex_pb_InstantContextToolCall_ExecutionStatus, _exa_cortex_pb_InstantContextToolCall_ExecutionStatus__Output } from '../../exa/cortex_pb/InstantContextToolCall';

export interface InstantContextToolUpdate {
  'toolCallId'?: (string);
  'executionStatus'?: (_exa_cortex_pb_InstantContextToolCall_ExecutionStatus);
  'errorMessage'?: (string);
  'durationSeconds'?: (number | string);
  'toolIndex'?: (number);
  'commandType'?: (string);
}

export interface InstantContextToolUpdate__Output {
  'toolCallId': (string);
  'executionStatus': (_exa_cortex_pb_InstantContextToolCall_ExecutionStatus__Output);
  'errorMessage': (string);
  'durationSeconds': (number);
  'toolIndex': (number);
  'commandType': (string);
}
