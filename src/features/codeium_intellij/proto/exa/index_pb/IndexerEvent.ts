// Original file: exa/index_pb/index.proto

import type { WorkspacePath as _exa_codeium_common_pb_WorkspacePath, WorkspacePath__Output as _exa_codeium_common_pb_WorkspacePath__Output } from '../../exa/codeium_common_pb/WorkspacePath';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface _exa_index_pb_IndexerEvent_AddCommit {
  'sha'?: (string);
}

export interface _exa_index_pb_IndexerEvent_AddCommit__Output {
  'sha': (string);
}

export interface _exa_index_pb_IndexerEvent_AddWorkspace {
  'addWorkspaceUid'?: (number | string | Long);
  'addWorkspaceQueueUid'?: (number | string | Long);
  'workspaceUri'?: (string);
  'numFiles'?: (number | string | Long);
  'size'?: (number | string | Long);
}

export interface _exa_index_pb_IndexerEvent_AddWorkspace__Output {
  'addWorkspaceUid': (string);
  'addWorkspaceQueueUid': (string);
  'workspaceUri': (string);
  'numFiles': (string);
  'size': (string);
}

export interface _exa_index_pb_IndexerEvent_Update_AddWorkspaceInfo {
  'addWorkspaceUid'?: (number | string | Long);
  'addWorkspaceQueueUid'?: (number | string | Long);
}

export interface _exa_index_pb_IndexerEvent_Update_AddWorkspaceInfo__Output {
  'addWorkspaceUid': (string);
  'addWorkspaceQueueUid': (string);
}

export interface _exa_index_pb_IndexerEvent_Deletion {
  'absoluteUri'?: (string);
}

export interface _exa_index_pb_IndexerEvent_Deletion__Output {
  'absoluteUri': (string);
}

export interface _exa_index_pb_IndexerEvent_IgnoreWorkspace {
  'workspaceUri'?: (string);
}

export interface _exa_index_pb_IndexerEvent_IgnoreWorkspace__Output {
  'workspaceUri': (string);
}

export interface _exa_index_pb_IndexerEvent_RemoveWorkspace {
  'workspaceUri'?: (string);
}

export interface _exa_index_pb_IndexerEvent_RemoveWorkspace__Output {
  'workspaceUri': (string);
}

export interface _exa_index_pb_IndexerEvent_Untrack {
  'absoluteUri'?: (string);
  'paths'?: (_exa_codeium_common_pb_WorkspacePath)[];
  'workspaceUri'?: (string);
}

export interface _exa_index_pb_IndexerEvent_Untrack__Output {
  'absoluteUri': (string);
  'paths': (_exa_codeium_common_pb_WorkspacePath__Output)[];
  'workspaceUri': (string);
}

export interface _exa_index_pb_IndexerEvent_Update {
  'absoluteUri'?: (string);
  'paths'?: (_exa_codeium_common_pb_WorkspacePath)[];
  'modTime'?: (_google_protobuf_Timestamp | null);
  'addWorkspaceInfo'?: (_exa_index_pb_IndexerEvent_Update_AddWorkspaceInfo | null);
}

export interface _exa_index_pb_IndexerEvent_Update__Output {
  'absoluteUri': (string);
  'paths': (_exa_codeium_common_pb_WorkspacePath__Output)[];
  'modTime': (_google_protobuf_Timestamp__Output | null);
  'addWorkspaceInfo': (_exa_index_pb_IndexerEvent_Update_AddWorkspaceInfo__Output | null);
}

export interface IndexerEvent {
  'uid'?: (number | string | Long);
  'deletion'?: (_exa_index_pb_IndexerEvent_Deletion | null);
  'untrack'?: (_exa_index_pb_IndexerEvent_Untrack | null);
  'update'?: (_exa_index_pb_IndexerEvent_Update | null);
  'addWorkspace'?: (_exa_index_pb_IndexerEvent_AddWorkspace | null);
  'removeWorkspace'?: (_exa_index_pb_IndexerEvent_RemoveWorkspace | null);
  'ignoreWorkspace'?: (_exa_index_pb_IndexerEvent_IgnoreWorkspace | null);
  'addCommit'?: (_exa_index_pb_IndexerEvent_AddCommit | null);
  'eventOneof'?: "deletion"|"untrack"|"update"|"addWorkspace"|"removeWorkspace"|"ignoreWorkspace"|"addCommit";
}

export interface IndexerEvent__Output {
  'uid': (string);
  'deletion'?: (_exa_index_pb_IndexerEvent_Deletion__Output | null);
  'untrack'?: (_exa_index_pb_IndexerEvent_Untrack__Output | null);
  'update'?: (_exa_index_pb_IndexerEvent_Update__Output | null);
  'addWorkspace'?: (_exa_index_pb_IndexerEvent_AddWorkspace__Output | null);
  'removeWorkspace'?: (_exa_index_pb_IndexerEvent_RemoveWorkspace__Output | null);
  'ignoreWorkspace'?: (_exa_index_pb_IndexerEvent_IgnoreWorkspace__Output | null);
  'addCommit'?: (_exa_index_pb_IndexerEvent_AddCommit__Output | null);
  'eventOneof'?: "deletion"|"untrack"|"update"|"addWorkspace"|"removeWorkspace"|"ignoreWorkspace"|"addCommit";
}
