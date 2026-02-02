// Original file: exa/language_server_pb/language_server.proto

import type { TextOrScopeItem as _exa_codeium_common_pb_TextOrScopeItem, TextOrScopeItem__Output as _exa_codeium_common_pb_TextOrScopeItem__Output } from '../../exa/codeium_common_pb/TextOrScopeItem';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface UserInputWithMetadata {
  'cascadeId'?: (string);
  'userResponse'?: (string);
  'items'?: (_exa_codeium_common_pb_TextOrScopeItem)[];
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface UserInputWithMetadata__Output {
  'cascadeId': (string);
  'userResponse': (string);
  'items': (_exa_codeium_common_pb_TextOrScopeItem__Output)[];
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}
