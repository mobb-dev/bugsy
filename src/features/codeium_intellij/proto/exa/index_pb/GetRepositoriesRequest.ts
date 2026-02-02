// Original file: exa/index_pb/index.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { GetRepositoriesFilter as _exa_index_pb_GetRepositoriesFilter, GetRepositoriesFilter__Output as _exa_index_pb_GetRepositoriesFilter__Output } from '../../exa/index_pb/GetRepositoriesFilter';

export interface GetRepositoriesRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'filter'?: (_exa_index_pb_GetRepositoriesFilter | null);
}

export interface GetRepositoriesRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'filter': (_exa_index_pb_GetRepositoriesFilter__Output | null);
}
