// Original file: exa/index_pb/index.proto

import type { Index as _exa_index_pb_Index, Index__Output as _exa_index_pb_Index__Output } from '../../exa/index_pb/Index';
import type { Repository as _exa_index_pb_Repository, Repository__Output as _exa_index_pb_Repository__Output } from '../../exa/index_pb/Repository';

export interface GetIndexResponse {
  'index'?: (_exa_index_pb_Index | null);
  'repository'?: (_exa_index_pb_Repository | null);
}

export interface GetIndexResponse__Output {
  'index': (_exa_index_pb_Index__Output | null);
  'repository': (_exa_index_pb_Repository__Output | null);
}
