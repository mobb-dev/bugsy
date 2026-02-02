// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface GetAvailableCascadePluginsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'os'?: (string);
  'searchQuery'?: (string);
  '_searchQuery'?: "searchQuery";
}

export interface GetAvailableCascadePluginsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'os': (string);
  'searchQuery'?: (string);
  '_searchQuery'?: "searchQuery";
}
