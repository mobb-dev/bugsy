// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ScmProvider as _exa_codeium_common_pb_ScmProvider, ScmProvider__Output as _exa_codeium_common_pb_ScmProvider__Output } from '../../exa/codeium_common_pb/ScmProvider';

export interface GitRepoInfo {
  'name'?: (string);
  'owner'?: (string);
  'commit'?: (string);
  'versionAlias'?: (string);
  'repoName'?: (string);
  'scmProvider'?: (_exa_codeium_common_pb_ScmProvider);
  'baseGitUrl'?: (string);
}

export interface GitRepoInfo__Output {
  'name': (string);
  'owner': (string);
  'commit': (string);
  'versionAlias': (string);
  'repoName': (string);
  'scmProvider': (_exa_codeium_common_pb_ScmProvider__Output);
  'baseGitUrl': (string);
}
