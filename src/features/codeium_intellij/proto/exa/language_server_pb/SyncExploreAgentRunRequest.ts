// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { TextOrScopeItem as _exa_codeium_common_pb_TextOrScopeItem, TextOrScopeItem__Output as _exa_codeium_common_pb_TextOrScopeItem__Output } from '../../exa/codeium_common_pb/TextOrScopeItem';

export interface SyncExploreAgentRunRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'cascadeId'?: (string);
  'queryId'?: (string);
  'messageIndex'?: (number);
  'items'?: (_exa_codeium_common_pb_TextOrScopeItem)[];
  'response'?: (string);
  'isComplete'?: (boolean);
  'title'?: (string);
  '_title'?: "title";
  '_response'?: "response";
}

export interface SyncExploreAgentRunRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'cascadeId': (string);
  'queryId': (string);
  'messageIndex': (number);
  'items': (_exa_codeium_common_pb_TextOrScopeItem__Output)[];
  'response'?: (string);
  'isComplete': (boolean);
  'title'?: (string);
  '_title'?: "title";
  '_response'?: "response";
}
