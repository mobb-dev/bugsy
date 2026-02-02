// Original file: exa/cortex_pb/cortex.proto

import type { CortexStepStatus as _exa_cortex_pb_CortexStepStatus, CortexStepStatus__Output as _exa_cortex_pb_CortexStepStatus__Output } from '../../exa/cortex_pb/CortexStepStatus';
import type { CortexErrorDetails as _exa_cortex_pb_CortexErrorDetails, CortexErrorDetails__Output as _exa_cortex_pb_CortexErrorDetails__Output } from '../../exa/cortex_pb/CortexErrorDetails';
import type { CommandOutputPriority as _exa_cortex_pb_CommandOutputPriority, CommandOutputPriority__Output as _exa_cortex_pb_CommandOutputPriority__Output } from '../../exa/cortex_pb/CommandOutputPriority';

export interface CortexStepCommandStatus {
  'commandId'?: (string);
  'status'?: (_exa_cortex_pb_CortexStepStatus);
  'stdout'?: (string);
  'stderr'?: (string);
  'exitCode'?: (number);
  'error'?: (_exa_cortex_pb_CortexErrorDetails | null);
  'outputPriority'?: (_exa_cortex_pb_CommandOutputPriority);
  'outputCharacterCount'?: (number);
  'combined'?: (string);
  'waitDurationSeconds'?: (number);
  'waitedDurationSeconds'?: (number);
  'delta'?: (string);
  '_delta'?: "delta";
  '_exitCode'?: "exitCode";
}

export interface CortexStepCommandStatus__Output {
  'commandId': (string);
  'status': (_exa_cortex_pb_CortexStepStatus__Output);
  'stdout': (string);
  'stderr': (string);
  'exitCode'?: (number);
  'error': (_exa_cortex_pb_CortexErrorDetails__Output | null);
  'outputPriority': (_exa_cortex_pb_CommandOutputPriority__Output);
  'outputCharacterCount': (number);
  'combined': (string);
  'waitDurationSeconds': (number);
  'waitedDurationSeconds': (number);
  'delta'?: (string);
  '_delta'?: "delta";
  '_exitCode'?: "exitCode";
}
