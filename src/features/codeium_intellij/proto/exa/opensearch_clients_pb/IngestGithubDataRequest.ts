// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';

export interface IngestGithubDataRequest {
  'organization'?: (string);
  'repository'?: (string);
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
}

export interface IngestGithubDataRequest__Output {
  'organization': (string);
  'repository': (string);
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
}
