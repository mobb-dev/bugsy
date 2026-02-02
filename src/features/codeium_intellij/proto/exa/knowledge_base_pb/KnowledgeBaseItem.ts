// Original file: exa/knowledge_base_pb/knowledge_base.proto

import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface KnowledgeBaseItem {
  'identifier'?: (string);
  'connectorType'?: (_exa_opensearch_clients_pb_ConnectorType);
  'url'?: (string);
  'title'?: (string);
  'description'?: (string);
  'content'?: (string);
  'lastCrawledAt'?: (_google_protobuf_Timestamp | null);
  'userName'?: (string);
}

export interface KnowledgeBaseItem__Output {
  'identifier': (string);
  'connectorType': (_exa_opensearch_clients_pb_ConnectorType__Output);
  'url': (string);
  'title': (string);
  'description': (string);
  'content': (string);
  'lastCrawledAt': (_google_protobuf_Timestamp__Output | null);
  'userName': (string);
}
