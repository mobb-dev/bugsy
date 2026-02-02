// Original file: exa/language_server_pb/language_server.proto

import type { WorkspaceInfo as _exa_language_server_pb_WorkspaceInfo, WorkspaceInfo__Output as _exa_language_server_pb_WorkspaceInfo__Output } from '../../exa/language_server_pb/WorkspaceInfo';

export interface GetWorkspaceInfosResponse {
  'homeDirPath'?: (string);
  'workspaceInfos'?: (_exa_language_server_pb_WorkspaceInfo)[];
  'homeDirUri'?: (string);
}

export interface GetWorkspaceInfosResponse__Output {
  'homeDirPath': (string);
  'workspaceInfos': (_exa_language_server_pb_WorkspaceInfo__Output)[];
  'homeDirUri': (string);
}
