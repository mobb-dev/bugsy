// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../../exa/codeium_common_pb/GitRepoInfo';
import type { FileChange as _exa_code_edit_code_edit_pb_FileChange, FileChange__Output as _exa_code_edit_code_edit_pb_FileChange__Output } from '../../../exa/code_edit/code_edit_pb/FileChange';
import type { GitCommit as _exa_code_edit_code_edit_pb_GitCommit, GitCommit__Output as _exa_code_edit_code_edit_pb_GitCommit__Output } from '../../../exa/code_edit/code_edit_pb/GitCommit';
import type { IndexStats as _exa_index_pb_IndexStats, IndexStats__Output as _exa_index_pb_IndexStats__Output } from '../../../exa/index_pb/IndexStats';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../../exa/codeium_common_pb/CodeContextItem';
import type { Intent as _exa_code_edit_code_edit_pb_Intent, Intent__Output as _exa_code_edit_code_edit_pb_Intent__Output } from '../../../exa/code_edit/code_edit_pb/Intent';

export interface CodeChangeWithContext {
  'repository'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'fileChanges'?: (_exa_code_edit_code_edit_pb_FileChange)[];
  'intent'?: (string);
  'gitCommit'?: (_exa_code_edit_code_edit_pb_GitCommit | null);
  'indexStats'?: (_exa_index_pb_IndexStats | null);
  'unrelatedCcis'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'syntheticIntents'?: (_exa_code_edit_code_edit_pb_Intent)[];
  'testFileChanges'?: (_exa_code_edit_code_edit_pb_FileChange)[];
  'codeChangeDataSource'?: "gitCommit";
}

export interface CodeChangeWithContext__Output {
  'repository': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'fileChanges': (_exa_code_edit_code_edit_pb_FileChange__Output)[];
  'intent': (string);
  'gitCommit'?: (_exa_code_edit_code_edit_pb_GitCommit__Output | null);
  'indexStats': (_exa_index_pb_IndexStats__Output | null);
  'unrelatedCcis': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'syntheticIntents': (_exa_code_edit_code_edit_pb_Intent__Output)[];
  'testFileChanges': (_exa_code_edit_code_edit_pb_FileChange__Output)[];
  'codeChangeDataSource'?: "gitCommit";
}
