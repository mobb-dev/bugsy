// Original file: exa/index_pb/index.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';

export interface GetMatchingFilePathsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'repository'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'query'?: (string);
  'maxItems'?: (number);
  'groupIdsFilter'?: (string)[];
}

export interface GetMatchingFilePathsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'repository': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'query': (string);
  'maxItems': (number);
  'groupIdsFilter': (string)[];
}
