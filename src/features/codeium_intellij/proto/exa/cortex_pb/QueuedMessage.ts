// Original file: exa/cortex_pb/cortex.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from '../../exa/cortex_pb/CortexTrajectoryStep';
import type { CascadeConfig as _exa_cortex_pb_CascadeConfig, CascadeConfig__Output as _exa_cortex_pb_CascadeConfig__Output } from '../../exa/cortex_pb/CascadeConfig';

export interface QueuedMessage {
  'queueId'?: (string);
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'userInputStep'?: (_exa_cortex_pb_CortexTrajectoryStep | null);
  'overrideConfig'?: (_exa_cortex_pb_CascadeConfig | null);
}

export interface QueuedMessage__Output {
  'queueId': (string);
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'userInputStep': (_exa_cortex_pb_CortexTrajectoryStep__Output | null);
  'overrideConfig': (_exa_cortex_pb_CascadeConfig__Output | null);
}
