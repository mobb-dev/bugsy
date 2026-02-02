// Original file: exa/cortex_pb/cortex.proto

import type { CortexWorkspaceMetadata as _exa_cortex_pb_CortexWorkspaceMetadata, CortexWorkspaceMetadata__Output as _exa_cortex_pb_CortexWorkspaceMetadata__Output } from '../../exa/cortex_pb/CortexWorkspaceMetadata';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface CortexTrajectoryMetadata {
  'workspaces'?: (_exa_cortex_pb_CortexWorkspaceMetadata)[];
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'initializationStateId'?: (string);
  'experimentTags'?: (string);
}

export interface CortexTrajectoryMetadata__Output {
  'workspaces': (_exa_cortex_pb_CortexWorkspaceMetadata__Output)[];
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'initializationStateId': (string);
  'experimentTags': (string);
}
