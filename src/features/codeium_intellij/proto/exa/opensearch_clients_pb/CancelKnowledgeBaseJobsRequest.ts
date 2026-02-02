// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { Long } from '@grpc/proto-loader';

export interface CancelKnowledgeBaseJobsRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'jobIds'?: (number | string | Long)[];
}

export interface CancelKnowledgeBaseJobsRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'jobIds': (string)[];
}
