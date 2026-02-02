// Original file: exa/index_pb/index.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';

export interface DeleteRepositoryRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'repoName'?: (string);
  'repoNames'?: (string)[];
}

export interface DeleteRepositoryRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'repoName': (string);
  'repoNames': (string)[];
}
