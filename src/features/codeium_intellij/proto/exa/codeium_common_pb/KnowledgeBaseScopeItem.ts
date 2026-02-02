// Original file: exa/codeium_common_pb/codeium_common.proto

import type { IndexChoice as _exa_codeium_common_pb_IndexChoice, IndexChoice__Output as _exa_codeium_common_pb_IndexChoice__Output } from '../../exa/codeium_common_pb/IndexChoice';
import type { DocumentType as _exa_codeium_common_pb_DocumentType, DocumentType__Output as _exa_codeium_common_pb_DocumentType__Output } from '../../exa/codeium_common_pb/DocumentType';

export interface KnowledgeBaseScopeItem {
  'documentId'?: (string);
  'displayName'?: (string);
  'description'?: (string);
  'displaySource'?: (string);
  'url'?: (string);
  'index'?: (_exa_codeium_common_pb_IndexChoice);
  'documentType'?: (_exa_codeium_common_pb_DocumentType);
}

export interface KnowledgeBaseScopeItem__Output {
  'documentId': (string);
  'displayName': (string);
  'description': (string);
  'displaySource': (string);
  'url': (string);
  'index': (_exa_codeium_common_pb_IndexChoice__Output);
  'documentType': (_exa_codeium_common_pb_DocumentType__Output);
}
