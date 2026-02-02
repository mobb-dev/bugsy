// Original file: exa/cortex_pb/cortex.proto

import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from '../../exa/cortex_pb/CortexTrajectory';
import type { TrajectoryScope as _exa_cortex_pb_TrajectoryScope, TrajectoryScope__Output as _exa_cortex_pb_TrajectoryScope__Output } from '../../exa/cortex_pb/TrajectoryScope';

export interface ImplicitTrajectory {
  'trajectory'?: (_exa_cortex_pb_CortexTrajectory | null);
  'trajectoryScope'?: (_exa_cortex_pb_TrajectoryScope | null);
}

export interface ImplicitTrajectory__Output {
  'trajectory': (_exa_cortex_pb_CortexTrajectory__Output | null);
  'trajectoryScope': (_exa_cortex_pb_TrajectoryScope__Output | null);
}
