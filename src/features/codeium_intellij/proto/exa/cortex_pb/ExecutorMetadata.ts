// Original file: exa/cortex_pb/cortex.proto

import type { ExecutorTerminationReason as _exa_cortex_pb_ExecutorTerminationReason, ExecutorTerminationReason__Output as _exa_cortex_pb_ExecutorTerminationReason__Output } from '../../exa/cortex_pb/ExecutorTerminationReason';

export interface ExecutorMetadata {
  'terminationReason'?: (_exa_cortex_pb_ExecutorTerminationReason);
  'numGeneratorInvocations'?: (number);
  'lastStepIdx'?: (number);
  'proceededWithAutoContinue'?: (boolean);
}

export interface ExecutorMetadata__Output {
  'terminationReason': (_exa_cortex_pb_ExecutorTerminationReason__Output);
  'numGeneratorInvocations': (number);
  'lastStepIdx': (number);
  'proceededWithAutoContinue': (boolean);
}
