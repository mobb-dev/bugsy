// Original file: exa/cortex_pb/cortex.proto

import type { CortexTrajectoryType as _exa_cortex_pb_CortexTrajectoryType, CortexTrajectoryType__Output as _exa_cortex_pb_CortexTrajectoryType__Output } from '../../exa/cortex_pb/CortexTrajectoryType';
import type { CortexStepType as _exa_cortex_pb_CortexStepType, CortexStepType__Output as _exa_cortex_pb_CortexStepType__Output } from '../../exa/cortex_pb/CortexStepType';

export interface CortexTrajectoryReference {
  'trajectoryId'?: (string);
  'stepIndex'?: (number);
  'trajectoryType'?: (_exa_cortex_pb_CortexTrajectoryType);
  'stepType'?: (_exa_cortex_pb_CortexStepType);
  'forceBillable'?: (boolean);
}

export interface CortexTrajectoryReference__Output {
  'trajectoryId': (string);
  'stepIndex': (number);
  'trajectoryType': (_exa_cortex_pb_CortexTrajectoryType__Output);
  'stepType': (_exa_cortex_pb_CortexStepType__Output);
  'forceBillable': (boolean);
}
