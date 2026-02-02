// Original file: exa/language_server_pb/language_server.proto

import type { BranchInfo as _exa_language_server_pb_BranchInfo, BranchInfo__Output as _exa_language_server_pb_BranchInfo__Output } from '../../exa/language_server_pb/BranchInfo';
import type { ScmType as _exa_codeium_common_pb_ScmType, ScmType__Output as _exa_codeium_common_pb_ScmType__Output } from '../../exa/codeium_common_pb/ScmType';

export interface RepoInfo {
  'name'?: (string);
  'repoPath'?: (string);
  'branches'?: (_exa_language_server_pb_BranchInfo)[];
  'scmType'?: (_exa_codeium_common_pb_ScmType);
  'fullRepoName'?: (string);
}

export interface RepoInfo__Output {
  'name': (string);
  'repoPath': (string);
  'branches': (_exa_language_server_pb_BranchInfo__Output)[];
  'scmType': (_exa_codeium_common_pb_ScmType__Output);
  'fullRepoName': (string);
}
