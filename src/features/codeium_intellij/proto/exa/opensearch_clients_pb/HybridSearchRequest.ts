// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { Embedding as _exa_codeium_common_pb_Embedding, Embedding__Output as _exa_codeium_common_pb_Embedding__Output } from '../../exa/codeium_common_pb/Embedding';
import type { Long } from '@grpc/proto-loader';

export interface HybridSearchRequest {
  'query'?: (string);
  'embedding'?: (_exa_codeium_common_pb_Embedding | null);
  'maxResults'?: (number | string | Long);
}

export interface HybridSearchRequest__Output {
  'query': (string);
  'embedding': (_exa_codeium_common_pb_Embedding__Output | null);
  'maxResults': (string);
}
