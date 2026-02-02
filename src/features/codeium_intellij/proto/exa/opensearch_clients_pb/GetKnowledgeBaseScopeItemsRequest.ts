// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { IndexChoice as _exa_codeium_common_pb_IndexChoice, IndexChoice__Output as _exa_codeium_common_pb_IndexChoice__Output } from '../../exa/codeium_common_pb/IndexChoice';
import type { DocumentType as _exa_codeium_common_pb_DocumentType, DocumentType__Output as _exa_codeium_common_pb_DocumentType__Output } from '../../exa/codeium_common_pb/DocumentType';

export interface GetKnowledgeBaseScopeItemsRequest {
  'query'?: (string);
  'indexNames'?: (string)[];
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'indexChoices'?: (_exa_codeium_common_pb_IndexChoice)[];
  'documentTypes'?: (_exa_codeium_common_pb_DocumentType)[];
}

export interface GetKnowledgeBaseScopeItemsRequest__Output {
  'query': (string);
  'indexNames': (string)[];
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'indexChoices': (_exa_codeium_common_pb_IndexChoice__Output)[];
  'documentTypes': (_exa_codeium_common_pb_DocumentType__Output)[];
}
