// Original file: exa/index_pb/index.proto

import type { RepositoryConfig as _exa_index_pb_RepositoryConfig, RepositoryConfig__Output as _exa_index_pb_RepositoryConfig__Output } from '../../exa/index_pb/RepositoryConfig';
import type { Index as _exa_index_pb_Index, Index__Output as _exa_index_pb_Index__Output } from '../../exa/index_pb/Index';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface Repository {
  'repoName'?: (string);
  'config'?: (_exa_index_pb_RepositoryConfig | null);
  'latestIndex'?: (_exa_index_pb_Index | null);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'lastUsedAt'?: (_google_protobuf_Timestamp | null);
}

export interface Repository__Output {
  'repoName': (string);
  'config': (_exa_index_pb_RepositoryConfig__Output | null);
  'latestIndex': (_exa_index_pb_Index__Output | null);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'lastUsedAt': (_google_protobuf_Timestamp__Output | null);
}
