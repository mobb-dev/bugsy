// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { ConnectorAdditionalParams as _exa_opensearch_clients_pb_ConnectorAdditionalParams, ConnectorAdditionalParams__Output as _exa_opensearch_clients_pb_ConnectorAdditionalParams__Output } from '../../exa/opensearch_clients_pb/ConnectorAdditionalParams';

export interface ConnectKnowledgeBaseAccountRequest {
  'connector'?: (_exa_opensearch_clients_pb_ConnectorType);
  'accessToken'?: (string);
  'accessTokenExpiresAt'?: (_google_protobuf_Timestamp | null);
  'refreshToken'?: (string);
  'refreshTokenExpiresAt'?: (_google_protobuf_Timestamp | null);
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'additionalParams'?: (_exa_opensearch_clients_pb_ConnectorAdditionalParams | null);
}

export interface ConnectKnowledgeBaseAccountRequest__Output {
  'connector': (_exa_opensearch_clients_pb_ConnectorType__Output);
  'accessToken': (string);
  'accessTokenExpiresAt': (_google_protobuf_Timestamp__Output | null);
  'refreshToken': (string);
  'refreshTokenExpiresAt': (_google_protobuf_Timestamp__Output | null);
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'additionalParams': (_exa_opensearch_clients_pb_ConnectorAdditionalParams__Output | null);
}
