// Original file: exa/cortex_pb/cortex.proto

import type { CortexStepType as _exa_cortex_pb_CortexStepType, CortexStepType__Output as _exa_cortex_pb_CortexStepType__Output } from '../../exa/cortex_pb/CortexStepType';

export interface CascadeExecutorConfig {
  'disableAsync'?: (boolean);
  'maxGeneratorInvocations'?: (number);
  'terminalStepTypes'?: (_exa_cortex_pb_CortexStepType)[];
  'runPendingSteps'?: (boolean);
  'holdForValidCheckpoint'?: (boolean);
  'holdForValidCheckpointTimeout'?: (number);
  'researchOnly'?: (boolean);
  'useAggressiveSnapshotting'?: (boolean);
  'enableBackgroundLinting'?: (boolean);
  'maxLintInjectionCount'?: (number);
  '_disableAsync'?: "disableAsync";
  '_runPendingSteps'?: "runPendingSteps";
  '_holdForValidCheckpoint'?: "holdForValidCheckpoint";
  '_useAggressiveSnapshotting'?: "useAggressiveSnapshotting";
}

export interface CascadeExecutorConfig__Output {
  'disableAsync'?: (boolean);
  'maxGeneratorInvocations': (number);
  'terminalStepTypes': (_exa_cortex_pb_CortexStepType__Output)[];
  'runPendingSteps'?: (boolean);
  'holdForValidCheckpoint'?: (boolean);
  'holdForValidCheckpointTimeout': (number);
  'researchOnly': (boolean);
  'useAggressiveSnapshotting'?: (boolean);
  'enableBackgroundLinting': (boolean);
  'maxLintInjectionCount': (number);
  '_disableAsync'?: "disableAsync";
  '_runPendingSteps'?: "runPendingSteps";
  '_holdForValidCheckpoint'?: "holdForValidCheckpoint";
  '_useAggressiveSnapshotting'?: "useAggressiveSnapshotting";
}
