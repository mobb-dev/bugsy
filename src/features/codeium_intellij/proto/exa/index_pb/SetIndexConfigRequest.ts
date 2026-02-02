// Original file: exa/index_pb/index.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { IndexConfig as _exa_index_pb_IndexConfig, IndexConfig__Output as _exa_index_pb_IndexConfig__Output } from '../../exa/index_pb/IndexConfig';

export interface SetIndexConfigRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'indexConfig'?: (_exa_index_pb_IndexConfig | null);
}

export interface SetIndexConfigRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'indexConfig': (_exa_index_pb_IndexConfig__Output | null);
}
