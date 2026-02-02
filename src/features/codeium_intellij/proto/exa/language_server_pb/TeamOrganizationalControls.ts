// Original file: exa/language_server_pb/language_server.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { APIProvider as _exa_codeium_common_pb_APIProvider, APIProvider__Output as _exa_codeium_common_pb_APIProvider__Output } from '../../exa/codeium_common_pb/APIProvider';

export interface TeamOrganizationalControls {
  'teamId'?: (string);
  'cascadeModelLabels'?: (string)[];
  'commandModelLabels'?: (string)[];
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'extensionModelLabels'?: (string)[];
  'allowedApiProviders'?: (_exa_codeium_common_pb_APIProvider)[];
}

export interface TeamOrganizationalControls__Output {
  'teamId': (string);
  'cascadeModelLabels': (string)[];
  'commandModelLabels': (string)[];
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'extensionModelLabels': (string)[];
  'allowedApiProviders': (_exa_codeium_common_pb_APIProvider__Output)[];
}
