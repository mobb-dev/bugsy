// Original file: exa/index_pb/index.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';

export interface RetryIndexingRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'indexId'?: (string);
  'indexIds'?: (string)[];
}

export interface RetryIndexingRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'indexId': (string);
  'indexIds': (string)[];
}
