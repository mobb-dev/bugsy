// Original file: exa/cortex_pb/cortex.proto

import type { ChatModelMetadata as _exa_cortex_pb_ChatModelMetadata, ChatModelMetadata__Output as _exa_cortex_pb_ChatModelMetadata__Output } from '../../exa/cortex_pb/ChatModelMetadata';
import type { CascadePlannerConfig as _exa_cortex_pb_CascadePlannerConfig, CascadePlannerConfig__Output as _exa_cortex_pb_CascadePlannerConfig__Output } from '../../exa/cortex_pb/CascadePlannerConfig';
import type { ParallelRolloutGeneratorMetadata as _exa_cortex_pb_ParallelRolloutGeneratorMetadata, ParallelRolloutGeneratorMetadata__Output as _exa_cortex_pb_ParallelRolloutGeneratorMetadata__Output } from '../../exa/cortex_pb/ParallelRolloutGeneratorMetadata';

export interface CortexStepGeneratorMetadata {
  'chatModel'?: (_exa_cortex_pb_ChatModelMetadata | null);
  'stepIndices'?: (number)[];
  'plannerConfig'?: (_exa_cortex_pb_CascadePlannerConfig | null);
  'executionId'?: (string);
  'error'?: (string);
  'parallelRolloutGeneratorMetadata'?: (_exa_cortex_pb_ParallelRolloutGeneratorMetadata | null);
  'arenaCapReached'?: (boolean);
  'metadata'?: "chatModel";
}

export interface CortexStepGeneratorMetadata__Output {
  'chatModel'?: (_exa_cortex_pb_ChatModelMetadata__Output | null);
  'stepIndices': (number)[];
  'plannerConfig': (_exa_cortex_pb_CascadePlannerConfig__Output | null);
  'executionId': (string);
  'error': (string);
  'parallelRolloutGeneratorMetadata': (_exa_cortex_pb_ParallelRolloutGeneratorMetadata__Output | null);
  'arenaCapReached': (boolean);
  'metadata'?: "chatModel";
}
