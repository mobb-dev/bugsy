// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { CommonDocument as _exa_opensearch_clients_pb_CommonDocument, CommonDocument__Output as _exa_opensearch_clients_pb_CommonDocument__Output } from '../../exa/opensearch_clients_pb/CommonDocument';

export interface CommonDocumentWithScore {
  'document'?: (_exa_opensearch_clients_pb_CommonDocument | null);
  'score'?: (number | string);
}

export interface CommonDocumentWithScore__Output {
  'document': (_exa_opensearch_clients_pb_CommonDocument__Output | null);
  'score': (number);
}
