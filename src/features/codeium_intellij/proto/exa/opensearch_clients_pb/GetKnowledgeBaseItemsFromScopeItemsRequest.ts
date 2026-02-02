// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { KnowledgeBaseScopeItem as _exa_codeium_common_pb_KnowledgeBaseScopeItem, KnowledgeBaseScopeItem__Output as _exa_codeium_common_pb_KnowledgeBaseScopeItem__Output } from '../../exa/codeium_common_pb/KnowledgeBaseScopeItem';

export interface GetKnowledgeBaseItemsFromScopeItemsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'scopeItems'?: (_exa_codeium_common_pb_KnowledgeBaseScopeItem)[];
}

export interface GetKnowledgeBaseItemsFromScopeItemsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'scopeItems': (_exa_codeium_common_pb_KnowledgeBaseScopeItem__Output)[];
}
