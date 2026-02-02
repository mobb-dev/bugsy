// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { FileChange as _exa_code_edit_code_edit_pb_FileChange, FileChange__Output as _exa_code_edit_code_edit_pb_FileChange__Output } from '../../../exa/code_edit/code_edit_pb/FileChange';
import type { IndexStats as _exa_index_pb_IndexStats, IndexStats__Output as _exa_index_pb_IndexStats__Output } from '../../../exa/index_pb/IndexStats';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../../exa/codeium_common_pb/CodeContextItem';

export interface CommitToFileChangeResponse {
  'fileChanges'?: (_exa_code_edit_code_edit_pb_FileChange)[];
  'parentCommitHash'?: (string);
  'indexStats'?: (_exa_index_pb_IndexStats | null);
  'unrelatedCcis'?: (_exa_codeium_common_pb_CodeContextItem)[];
}

export interface CommitToFileChangeResponse__Output {
  'fileChanges': (_exa_code_edit_code_edit_pb_FileChange__Output)[];
  'parentCommitHash': (string);
  'indexStats': (_exa_index_pb_IndexStats__Output | null);
  'unrelatedCcis': (_exa_codeium_common_pb_CodeContextItem__Output)[];
}
