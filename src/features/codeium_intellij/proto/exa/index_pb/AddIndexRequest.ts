// Original file: exa/index_pb/index.proto

import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from '../../exa/index_pb/ManagementMetadata';
import type { RequestIndexVersion as _exa_index_pb_RequestIndexVersion, RequestIndexVersion__Output as _exa_index_pb_RequestIndexVersion__Output } from '../../exa/index_pb/RequestIndexVersion';

export interface AddIndexRequest {
  'metadata'?: (_exa_index_pb_ManagementMetadata | null);
  'repoName'?: (string);
  'version'?: (_exa_index_pb_RequestIndexVersion | null);
}

export interface AddIndexRequest__Output {
  'metadata': (_exa_index_pb_ManagementMetadata__Output | null);
  'repoName': (string);
  'version': (_exa_index_pb_RequestIndexVersion__Output | null);
}
