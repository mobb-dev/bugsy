// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Long } from '@grpc/proto-loader';

export interface CancelRequestRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'requestId'?: (number | string | Long);
}

export interface CancelRequestRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'requestId': (string);
}
