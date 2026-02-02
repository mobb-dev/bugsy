// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../../exa/codeium_common_pb/GitRepoInfo';

export interface CommitToFileChangeRequest {
  'repoRoot'?: (string);
  'repository'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'unrelatedCciMultiple'?: (number);
  'dbDir'?: (string);
}

export interface CommitToFileChangeRequest__Output {
  'repoRoot': (string);
  'repository': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'unrelatedCciMultiple': (number);
  'dbDir': (string);
}
