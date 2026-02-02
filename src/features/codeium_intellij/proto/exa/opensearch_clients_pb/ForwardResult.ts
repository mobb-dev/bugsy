// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ForwardStatus as _exa_opensearch_clients_pb_ForwardStatus, ForwardStatus__Output as _exa_opensearch_clients_pb_ForwardStatus__Output } from '../../exa/opensearch_clients_pb/ForwardStatus';

export interface ForwardResult {
  'status'?: (_exa_opensearch_clients_pb_ForwardStatus);
  'error'?: (string);
  '_error'?: "error";
}

export interface ForwardResult__Output {
  'status': (_exa_opensearch_clients_pb_ForwardStatus__Output);
  'error'?: (string);
  '_error'?: "error";
}
