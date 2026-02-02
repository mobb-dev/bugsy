// Original file: exa/index_pb/index.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';

export interface RepositoryFilter {
  'repository'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'excludedFiles'?: (string)[];
  'filterPaths'?: (string)[];
}

export interface RepositoryFilter__Output {
  'repository': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'excludedFiles': (string)[];
  'filterPaths': (string)[];
}
