// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../../exa/codeium_common_pb/GitRepoInfo';
import type { CodeContextItemWithClassification as _exa_code_edit_code_edit_pb_CodeContextItemWithClassification, CodeContextItemWithClassification__Output as _exa_code_edit_code_edit_pb_CodeContextItemWithClassification__Output } from '../../../exa/code_edit/code_edit_pb/CodeContextItemWithClassification';
import type { RetrievalMetrics as _exa_code_edit_code_edit_pb_RetrievalMetrics, RetrievalMetrics__Output as _exa_code_edit_code_edit_pb_RetrievalMetrics__Output } from '../../../exa/code_edit/code_edit_pb/RetrievalMetrics';

export interface CodeRetrievalEvalResult {
  'repository'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'classifiedItems'?: (_exa_code_edit_code_edit_pb_CodeContextItemWithClassification)[];
  'metrics'?: (_exa_code_edit_code_edit_pb_RetrievalMetrics | null);
}

export interface CodeRetrievalEvalResult__Output {
  'repository': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'classifiedItems': (_exa_code_edit_code_edit_pb_CodeContextItemWithClassification__Output)[];
  'metrics': (_exa_code_edit_code_edit_pb_RetrievalMetrics__Output | null);
}
