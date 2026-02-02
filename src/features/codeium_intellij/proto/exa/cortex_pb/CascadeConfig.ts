// Original file: exa/cortex_pb/cortex.proto

import type { CascadePlannerConfig as _exa_cortex_pb_CascadePlannerConfig, CascadePlannerConfig__Output as _exa_cortex_pb_CascadePlannerConfig__Output } from '../../exa/cortex_pb/CascadePlannerConfig';
import type { CheckpointConfig as _exa_cortex_pb_CheckpointConfig, CheckpointConfig__Output as _exa_cortex_pb_CheckpointConfig__Output } from '../../exa/cortex_pb/CheckpointConfig';
import type { CascadeExecutorConfig as _exa_cortex_pb_CascadeExecutorConfig, CascadeExecutorConfig__Output as _exa_cortex_pb_CascadeExecutorConfig__Output } from '../../exa/cortex_pb/CascadeExecutorConfig';
import type { TrajectoryConversionConfig as _exa_cortex_pb_TrajectoryConversionConfig, TrajectoryConversionConfig__Output as _exa_cortex_pb_TrajectoryConversionConfig__Output } from '../../exa/cortex_pb/TrajectoryConversionConfig';
import type { MemoryConfig as _exa_cortex_pb_MemoryConfig, MemoryConfig__Output as _exa_cortex_pb_MemoryConfig__Output } from '../../exa/cortex_pb/MemoryConfig';
import type { BrainConfig as _exa_cortex_pb_BrainConfig, BrainConfig__Output as _exa_cortex_pb_BrainConfig__Output } from '../../exa/cortex_pb/BrainConfig';
import type { ParallelRolloutConfig as _exa_cortex_pb_ParallelRolloutConfig, ParallelRolloutConfig__Output as _exa_cortex_pb_ParallelRolloutConfig__Output } from '../../exa/cortex_pb/ParallelRolloutConfig';
import type { CascadeHook as _exa_cortex_pb_CascadeHook, CascadeHook__Output as _exa_cortex_pb_CascadeHook__Output } from '../../exa/cortex_pb/CascadeHook';

export interface CascadeConfig {
  'plannerConfig'?: (_exa_cortex_pb_CascadePlannerConfig | null);
  'checkpointConfig'?: (_exa_cortex_pb_CheckpointConfig | null);
  'executorConfig'?: (_exa_cortex_pb_CascadeExecutorConfig | null);
  'trajectoryConversionConfig'?: (_exa_cortex_pb_TrajectoryConversionConfig | null);
  'memoryConfig'?: (_exa_cortex_pb_MemoryConfig | null);
  'applyModelDefaultOverride'?: (boolean);
  'brainConfig'?: (_exa_cortex_pb_BrainConfig | null);
  'parallelRolloutConfig'?: (_exa_cortex_pb_ParallelRolloutConfig | null);
  'hooks'?: (_exa_cortex_pb_CascadeHook)[];
  '_applyModelDefaultOverride'?: "applyModelDefaultOverride";
}

export interface CascadeConfig__Output {
  'plannerConfig': (_exa_cortex_pb_CascadePlannerConfig__Output | null);
  'checkpointConfig': (_exa_cortex_pb_CheckpointConfig__Output | null);
  'executorConfig': (_exa_cortex_pb_CascadeExecutorConfig__Output | null);
  'trajectoryConversionConfig': (_exa_cortex_pb_TrajectoryConversionConfig__Output | null);
  'memoryConfig': (_exa_cortex_pb_MemoryConfig__Output | null);
  'applyModelDefaultOverride'?: (boolean);
  'brainConfig': (_exa_cortex_pb_BrainConfig__Output | null);
  'parallelRolloutConfig': (_exa_cortex_pb_ParallelRolloutConfig__Output | null);
  'hooks': (_exa_cortex_pb_CascadeHook__Output)[];
  '_applyModelDefaultOverride'?: "applyModelDefaultOverride";
}
