// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../../exa/codeium_common_pb/GitRepoInfo';
import type { RelevantCodeContext as _exa_code_edit_code_edit_pb_RelevantCodeContext, RelevantCodeContext__Output as _exa_code_edit_code_edit_pb_RelevantCodeContext__Output } from '../../../exa/code_edit/code_edit_pb/RelevantCodeContext';
import type { GitCommit as _exa_code_edit_code_edit_pb_GitCommit, GitCommit__Output as _exa_code_edit_code_edit_pb_GitCommit__Output } from '../../../exa/code_edit/code_edit_pb/GitCommit';

export interface CodeRetrievalEvalTask {
  'repository'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'query'?: (string);
  'targetCodeContexts'?: (_exa_code_edit_code_edit_pb_RelevantCodeContext)[];
  'subdirectory'?: (string);
  'commitInfo'?: (_exa_code_edit_code_edit_pb_GitCommit | null);
}

export interface CodeRetrievalEvalTask__Output {
  'repository': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'query': (string);
  'targetCodeContexts': (_exa_code_edit_code_edit_pb_RelevantCodeContext__Output)[];
  'subdirectory': (string);
  'commitInfo': (_exa_code_edit_code_edit_pb_GitCommit__Output | null);
}
