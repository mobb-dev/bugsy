// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { TrajectoryShareStatus as _exa_cortex_pb_TrajectoryShareStatus, TrajectoryShareStatus__Output as _exa_cortex_pb_TrajectoryShareStatus__Output } from '../../exa/cortex_pb/TrajectoryShareStatus';

export interface CreateTrajectoryShareRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'shareStatus'?: (_exa_cortex_pb_TrajectoryShareStatus);
  'cascadeId'?: (string);
}

export interface CreateTrajectoryShareRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'shareStatus': (_exa_cortex_pb_TrajectoryShareStatus__Output);
  'cascadeId': (string);
}
