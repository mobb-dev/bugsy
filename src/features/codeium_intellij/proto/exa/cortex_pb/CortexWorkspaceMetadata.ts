// Original file: exa/cortex_pb/cortex.proto

import type { Repository as _exa_codeium_common_pb_Repository, Repository__Output as _exa_codeium_common_pb_Repository__Output } from '../../exa/codeium_common_pb/Repository';

export interface CortexWorkspaceMetadata {
  'workspaceFolderAbsoluteUri'?: (string);
  'gitRootAbsoluteUri'?: (string);
  'repository'?: (_exa_codeium_common_pb_Repository | null);
  'branchName'?: (string);
}

export interface CortexWorkspaceMetadata__Output {
  'workspaceFolderAbsoluteUri': (string);
  'gitRootAbsoluteUri': (string);
  'repository': (_exa_codeium_common_pb_Repository__Output | null);
  'branchName': (string);
}
