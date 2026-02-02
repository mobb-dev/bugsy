// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { DocumentType as _exa_codeium_common_pb_DocumentType, DocumentType__Output as _exa_codeium_common_pb_DocumentType__Output } from '../../exa/codeium_common_pb/DocumentType';
import type { Long } from '@grpc/proto-loader';

export interface DocumentTypeCount {
  'documentType'?: (_exa_codeium_common_pb_DocumentType);
  'count'?: (number | string | Long);
}

export interface DocumentTypeCount__Output {
  'documentType': (_exa_codeium_common_pb_DocumentType__Output);
  'count': (string);
}
