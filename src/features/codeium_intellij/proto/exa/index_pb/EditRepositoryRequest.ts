// Original file: exa/index_pb/index.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { RepositoryConfig as _exa_index_pb_RepositoryConfig, RepositoryConfig__Output as _exa_index_pb_RepositoryConfig__Output } from '../../exa/index_pb/RepositoryConfig';

export interface EditRepositoryRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'repoName'?: (string);
  'config'?: (_exa_index_pb_RepositoryConfig | null);
}

export interface EditRepositoryRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'repoName': (string);
  'config': (_exa_index_pb_RepositoryConfig__Output | null);
}
