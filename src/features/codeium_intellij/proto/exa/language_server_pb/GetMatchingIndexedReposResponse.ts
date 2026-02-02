// Original file: exa/language_server_pb/language_server.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';

export interface GetMatchingIndexedReposResponse {
  'matchedRepositories'?: (_exa_codeium_common_pb_GitRepoInfo)[];
}

export interface GetMatchingIndexedReposResponse__Output {
  'matchedRepositories': (_exa_codeium_common_pb_GitRepoInfo__Output)[];
}
