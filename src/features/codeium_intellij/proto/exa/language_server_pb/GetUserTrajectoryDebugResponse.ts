// Original file: exa/language_server_pb/language_server.proto

import type { ImplicitTrajectory as _exa_cortex_pb_ImplicitTrajectory, ImplicitTrajectory__Output as _exa_cortex_pb_ImplicitTrajectory__Output } from '../../exa/cortex_pb/ImplicitTrajectory';
import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from '../../exa/cortex_pb/CortexTrajectory';

export interface GetUserTrajectoryDebugResponse {
  'mainline'?: (_exa_cortex_pb_ImplicitTrajectory)[];
  'granular'?: (_exa_cortex_pb_CortexTrajectory | null);
}

export interface GetUserTrajectoryDebugResponse__Output {
  'mainline': (_exa_cortex_pb_ImplicitTrajectory__Output)[];
  'granular': (_exa_cortex_pb_CortexTrajectory__Output | null);
}
