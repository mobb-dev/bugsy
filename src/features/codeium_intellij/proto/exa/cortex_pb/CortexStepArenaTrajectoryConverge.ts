// Original file: exa/cortex_pb/cortex.proto

import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from '../../exa/cortex_pb/CortexTrajectoryStep';

export interface CortexStepArenaTrajectoryConverge {
  'sourceModelUid'?: (string);
  'sourceCascadeId'?: (string);
  'originalSteps'?: (_exa_cortex_pb_CortexTrajectoryStep)[];
  'destinationModelUid'?: (string);
}

export interface CortexStepArenaTrajectoryConverge__Output {
  'sourceModelUid': (string);
  'sourceCascadeId': (string);
  'originalSteps': (_exa_cortex_pb_CortexTrajectoryStep__Output)[];
  'destinationModelUid': (string);
}
