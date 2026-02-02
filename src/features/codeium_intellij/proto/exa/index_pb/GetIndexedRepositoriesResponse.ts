// Original file: exa/index_pb/index.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';
import type { Index as _exa_index_pb_Index, Index__Output as _exa_index_pb_Index__Output } from '../../exa/index_pb/Index';

export interface GetIndexedRepositoriesResponse {
  'repositories'?: (_exa_codeium_common_pb_GitRepoInfo)[];
  'indexes'?: (_exa_index_pb_Index)[];
}

export interface GetIndexedRepositoriesResponse__Output {
  'repositories': (_exa_codeium_common_pb_GitRepoInfo__Output)[];
  'indexes': (_exa_index_pb_Index__Output)[];
}
