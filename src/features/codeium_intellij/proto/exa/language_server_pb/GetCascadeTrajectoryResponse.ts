// Original file: exa/language_server_pb/language_server.proto

import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from '../../exa/cortex_pb/CortexTrajectory';
import type { CascadeRunStatus as _exa_cortex_pb_CascadeRunStatus, CascadeRunStatus__Output as _exa_cortex_pb_CascadeRunStatus__Output } from '../../exa/cortex_pb/CascadeRunStatus';

export interface GetCascadeTrajectoryResponse {
  'trajectory'?: (_exa_cortex_pb_CortexTrajectory | null);
  'status'?: (_exa_cortex_pb_CascadeRunStatus);
  'numTotalSteps'?: (number);
  'numTotalGeneratorMetadata'?: (number);
}

export interface GetCascadeTrajectoryResponse__Output {
  'trajectory': (_exa_cortex_pb_CortexTrajectory__Output | null);
  'status': (_exa_cortex_pb_CascadeRunStatus__Output);
  'numTotalSteps': (number);
  'numTotalGeneratorMetadata': (number);
}
