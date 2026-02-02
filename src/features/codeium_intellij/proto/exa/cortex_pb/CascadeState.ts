// Original file: exa/cortex_pb/cortex.proto

import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from '../../exa/cortex_pb/CortexTrajectory';
import type { CascadeRunStatus as _exa_cortex_pb_CascadeRunStatus, CascadeRunStatus__Output as _exa_cortex_pb_CascadeRunStatus__Output } from '../../exa/cortex_pb/CascadeRunStatus';
import type { ExecutorMetadata as _exa_cortex_pb_ExecutorMetadata, ExecutorMetadata__Output as _exa_cortex_pb_ExecutorMetadata__Output } from '../../exa/cortex_pb/ExecutorMetadata';

export interface CascadeState {
  'cascadeId'?: (string);
  'trajectory'?: (_exa_cortex_pb_CortexTrajectory | null);
  'status'?: (_exa_cortex_pb_CascadeRunStatus);
  'executorMetadata'?: (_exa_cortex_pb_ExecutorMetadata | null);
  'isRevert'?: (boolean);
}

export interface CascadeState__Output {
  'cascadeId': (string);
  'trajectory': (_exa_cortex_pb_CortexTrajectory__Output | null);
  'status': (_exa_cortex_pb_CascadeRunStatus__Output);
  'executorMetadata': (_exa_cortex_pb_ExecutorMetadata__Output | null);
  'isRevert': (boolean);
}
