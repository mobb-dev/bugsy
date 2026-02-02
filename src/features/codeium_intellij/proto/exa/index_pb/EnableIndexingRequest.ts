// Original file: exa/index_pb/index.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { IndexBuildConfig as _exa_index_pb_IndexBuildConfig, IndexBuildConfig__Output as _exa_index_pb_IndexBuildConfig__Output } from '../../exa/index_pb/IndexBuildConfig';

export interface EnableIndexingRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'config'?: (_exa_index_pb_IndexBuildConfig | null);
}

export interface EnableIndexingRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'config': (_exa_index_pb_IndexBuildConfig__Output | null);
}
