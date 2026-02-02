// Original file: exa/cortex_pb/cortex.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { WorkspaceInitializationData as _exa_cortex_pb_WorkspaceInitializationData, WorkspaceInitializationData__Output as _exa_cortex_pb_WorkspaceInitializationData__Output } from '../../exa/cortex_pb/WorkspaceInitializationData';

export interface StateInitializationData {
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'stateId'?: (string);
  'workspaces'?: (_exa_cortex_pb_WorkspaceInitializationData)[];
}

export interface StateInitializationData__Output {
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'stateId': (string);
  'workspaces': (_exa_cortex_pb_WorkspaceInitializationData__Output)[];
}
