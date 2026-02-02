// Original file: exa/language_server_pb/language_server.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';

export interface GetPatchAndCodeChangeRequest {
  'intent'?: (string);
  'baseStateRepoInfo'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'repoPath'?: (string);
}

export interface GetPatchAndCodeChangeRequest__Output {
  'intent': (string);
  'baseStateRepoInfo': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'repoPath': (string);
}
