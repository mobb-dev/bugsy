// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';
import type { ConnectorConfig as _exa_opensearch_clients_pb_ConnectorConfig, ConnectorConfig__Output as _exa_opensearch_clients_pb_ConnectorConfig__Output } from '../../exa/opensearch_clients_pb/ConnectorConfig';
import type { DocumentTypeCount as _exa_opensearch_clients_pb_DocumentTypeCount, DocumentTypeCount__Output as _exa_opensearch_clients_pb_DocumentTypeCount__Output } from '../../exa/opensearch_clients_pb/DocumentTypeCount';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface ConnectorState {
  'connector'?: (_exa_opensearch_clients_pb_ConnectorType);
  'initialized'?: (boolean);
  'config'?: (_exa_opensearch_clients_pb_ConnectorConfig | null);
  'documentTypeCounts'?: (_exa_opensearch_clients_pb_DocumentTypeCount)[];
  'lastIndexedAt'?: (_google_protobuf_Timestamp | null);
  'unhealthySince'?: (_google_protobuf_Timestamp | null);
  'lastConfiguredAt'?: (_google_protobuf_Timestamp | null);
}

export interface ConnectorState__Output {
  'connector': (_exa_opensearch_clients_pb_ConnectorType__Output);
  'initialized': (boolean);
  'config': (_exa_opensearch_clients_pb_ConnectorConfig__Output | null);
  'documentTypeCounts': (_exa_opensearch_clients_pb_DocumentTypeCount__Output)[];
  'lastIndexedAt': (_google_protobuf_Timestamp__Output | null);
  'unhealthySince': (_google_protobuf_Timestamp__Output | null);
  'lastConfiguredAt': (_google_protobuf_Timestamp__Output | null);
}
