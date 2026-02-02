// Original file: exa/cortex_pb/cortex.proto

import type { TrajectoryScope as _exa_cortex_pb_TrajectoryScope, TrajectoryScope__Output as _exa_cortex_pb_TrajectoryScope__Output } from '../../exa/cortex_pb/TrajectoryScope';

export interface ImplicitTrajectoryDescription {
  'trajectoryId'?: (string);
  'trajectoryScope'?: (_exa_cortex_pb_TrajectoryScope | null);
  'current'?: (boolean);
}

export interface ImplicitTrajectoryDescription__Output {
  'trajectoryId': (string);
  'trajectoryScope': (_exa_cortex_pb_TrajectoryScope__Output | null);
  'current': (boolean);
}
