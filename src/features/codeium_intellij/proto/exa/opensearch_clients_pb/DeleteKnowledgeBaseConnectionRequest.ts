// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';

export interface DeleteKnowledgeBaseConnectionRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'connector'?: (_exa_opensearch_clients_pb_ConnectorType);
}

export interface DeleteKnowledgeBaseConnectionRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'connector': (_exa_opensearch_clients_pb_ConnectorType__Output);
}
