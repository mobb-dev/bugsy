// Original file: exa/index_pb/index.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface GetIndexedRepositoriesRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'includeIncomplete'?: (boolean);
  'groupIdsFilter'?: (string)[];
}

export interface GetIndexedRepositoriesRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'includeIncomplete': (boolean);
  'groupIdsFilter': (string)[];
}
