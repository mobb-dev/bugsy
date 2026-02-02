// Original file: exa/cortex_pb/cortex.proto

import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from '../../exa/cortex_pb/CortexTrajectory';

export interface BaseTrajectoryIdentifier {
  'cascadeId'?: (string);
  'implicitTrajectoryFileUri'?: (string);
  'lastActiveDoc'?: (boolean);
  'trajectory'?: (_exa_cortex_pb_CortexTrajectory | null);
  'identifier'?: "cascadeId"|"implicitTrajectoryFileUri"|"lastActiveDoc"|"trajectory";
}

export interface BaseTrajectoryIdentifier__Output {
  'cascadeId'?: (string);
  'implicitTrajectoryFileUri'?: (string);
  'lastActiveDoc'?: (boolean);
  'trajectory'?: (_exa_cortex_pb_CortexTrajectory__Output | null);
  'identifier'?: "cascadeId"|"implicitTrajectoryFileUri"|"lastActiveDoc"|"trajectory";
}
