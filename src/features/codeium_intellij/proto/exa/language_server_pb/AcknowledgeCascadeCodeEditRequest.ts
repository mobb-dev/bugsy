// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface AcknowledgeCascadeCodeEditRequest {
  'cascadeId'?: (string);
  'absoluteUri'?: (string)[];
  'accept'?: (boolean);
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'contents'?: (string)[];
}

export interface AcknowledgeCascadeCodeEditRequest__Output {
  'cascadeId': (string);
  'absoluteUri': (string)[];
  'accept': (boolean);
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'contents': (string)[];
}
