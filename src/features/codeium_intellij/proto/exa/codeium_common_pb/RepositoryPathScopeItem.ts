// Original file: exa/codeium_common_pb/codeium_common.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';

export interface RepositoryPathScopeItem {
  'repoInfo'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'relativePath'?: (string);
  'isDir'?: (boolean);
}

export interface RepositoryPathScopeItem__Output {
  'repoInfo': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'relativePath': (string);
  'isDir': (boolean);
}
