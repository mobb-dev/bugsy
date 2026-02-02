// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface ConvergeArenaCascadesRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'targetCascadeId'?: (string);
}

export interface ConvergeArenaCascadesRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'targetCascadeId': (string);
}
