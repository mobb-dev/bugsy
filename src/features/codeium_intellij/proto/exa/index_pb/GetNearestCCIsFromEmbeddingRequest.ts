// Original file: exa/index_pb/index.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Embedding as _exa_codeium_common_pb_Embedding, Embedding__Output as _exa_codeium_common_pb_Embedding__Output } from '../../exa/codeium_common_pb/Embedding';
import type { RepositoryFilter as _exa_index_pb_RepositoryFilter, RepositoryFilter__Output as _exa_index_pb_RepositoryFilter__Output } from '../../exa/index_pb/RepositoryFilter';
import type { Long } from '@grpc/proto-loader';

export interface GetNearestCCIsFromEmbeddingRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'embedding'?: (_exa_codeium_common_pb_Embedding | null);
  'repositoryFilters'?: (_exa_index_pb_RepositoryFilter)[];
  'maxResults'?: (number | string | Long);
  'groupIdsFilter'?: (string)[];
}

export interface GetNearestCCIsFromEmbeddingRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'embedding': (_exa_codeium_common_pb_Embedding__Output | null);
  'repositoryFilters': (_exa_index_pb_RepositoryFilter__Output)[];
  'maxResults': (string);
  'groupIdsFilter': (string)[];
}
