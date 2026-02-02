// Original file: exa/knowledge_base_pb/knowledge_base.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface CreateConnectionRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'connectorType'?: (_exa_opensearch_clients_pb_ConnectorType);
  'accessToken'?: (string);
  'accessTokenExpiresAt'?: (_google_protobuf_Timestamp | null);
  'refreshToken'?: (string);
  'refreshTokenExpiresAt'?: (_google_protobuf_Timestamp | null);
}

export interface CreateConnectionRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'connectorType': (_exa_opensearch_clients_pb_ConnectorType__Output);
  'accessToken': (string);
  'accessTokenExpiresAt': (_google_protobuf_Timestamp__Output | null);
  'refreshToken': (string);
  'refreshTokenExpiresAt': (_google_protobuf_Timestamp__Output | null);
}
