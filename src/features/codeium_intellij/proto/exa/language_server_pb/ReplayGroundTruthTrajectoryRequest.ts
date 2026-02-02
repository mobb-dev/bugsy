// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from '../../exa/cortex_pb/CortexTrajectoryStep';
import type { CascadeConfig as _exa_cortex_pb_CascadeConfig, CascadeConfig__Output as _exa_cortex_pb_CascadeConfig__Output } from '../../exa/cortex_pb/CascadeConfig';

export interface ReplayGroundTruthTrajectoryRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'replaySteps'?: (_exa_cortex_pb_CortexTrajectoryStep)[];
  'cascadeId'?: (string);
  'cascadeConfig'?: (_exa_cortex_pb_CascadeConfig | null);
}

export interface ReplayGroundTruthTrajectoryRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'replaySteps': (_exa_cortex_pb_CortexTrajectoryStep__Output)[];
  'cascadeId': (string);
  'cascadeConfig': (_exa_cortex_pb_CascadeConfig__Output | null);
}
