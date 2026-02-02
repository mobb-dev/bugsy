// Original file: exa/knowledge_base_pb/knowledge_base.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';

export interface CreateKnowledgeBaseItemRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'connectorType'?: (_exa_opensearch_clients_pb_ConnectorType);
  'urls'?: (string)[];
}

export interface CreateKnowledgeBaseItemRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'connectorType': (_exa_opensearch_clients_pb_ConnectorType__Output);
  'urls': (string)[];
}
