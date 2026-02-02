// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { RepositoryConfig as _exa_index_pb_RepositoryConfig, RepositoryConfig__Output as _exa_index_pb_RepositoryConfig__Output } from '../../exa/index_pb/RepositoryConfig';
import type { RequestIndexVersion as _exa_index_pb_RequestIndexVersion, RequestIndexVersion__Output as _exa_index_pb_RequestIndexVersion__Output } from '../../exa/index_pb/RequestIndexVersion';

export interface OpenSearchAddRepositoryRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'config'?: (_exa_index_pb_RepositoryConfig | null);
  'initialIndex'?: (_exa_index_pb_RequestIndexVersion | null);
}

export interface OpenSearchAddRepositoryRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'config': (_exa_index_pb_RepositoryConfig__Output | null);
  'initialIndex': (_exa_index_pb_RequestIndexVersion__Output | null);
}
