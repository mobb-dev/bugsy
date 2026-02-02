// Original file: exa/codeium_common_pb/codeium_common.proto

import type { GitCommitData as _exa_codeium_common_pb_GitCommitData, GitCommitData__Output as _exa_codeium_common_pb_GitCommitData__Output } from '../../exa/codeium_common_pb/GitCommitData';
import type { GitDiffData as _exa_codeium_common_pb_GitDiffData, GitDiffData__Output as _exa_codeium_common_pb_GitDiffData__Output } from '../../exa/codeium_common_pb/GitDiffData';
import type { GitWorkingChangesData as _exa_codeium_common_pb_GitWorkingChangesData, GitWorkingChangesData__Output as _exa_codeium_common_pb_GitWorkingChangesData__Output } from '../../exa/codeium_common_pb/GitWorkingChangesData';

export interface GitScopeItem {
  'repoRootUri'?: (string);
  'commit'?: (_exa_codeium_common_pb_GitCommitData | null);
  'diff'?: (_exa_codeium_common_pb_GitDiffData | null);
  'workingChanges'?: (_exa_codeium_common_pb_GitWorkingChangesData | null);
  'formattedContent'?: (string);
  'repoDisplayName'?: (string);
  'gitData'?: "commit"|"diff"|"workingChanges";
}

export interface GitScopeItem__Output {
  'repoRootUri': (string);
  'commit'?: (_exa_codeium_common_pb_GitCommitData__Output | null);
  'diff'?: (_exa_codeium_common_pb_GitDiffData__Output | null);
  'workingChanges'?: (_exa_codeium_common_pb_GitWorkingChangesData__Output | null);
  'formattedContent': (string);
  'repoDisplayName': (string);
  'gitData'?: "commit"|"diff"|"workingChanges";
}
