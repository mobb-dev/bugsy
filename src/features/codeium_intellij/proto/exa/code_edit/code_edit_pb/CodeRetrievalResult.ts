// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../../exa/codeium_common_pb/GitRepoInfo';
import type { RetrieverInfo as _exa_code_edit_code_edit_pb_RetrieverInfo, RetrieverInfo__Output as _exa_code_edit_code_edit_pb_RetrieverInfo__Output } from '../../../exa/code_edit/code_edit_pb/RetrieverInfo';
import type { CodeContextItemWithRetrievalMetadata as _exa_context_module_pb_CodeContextItemWithRetrievalMetadata, CodeContextItemWithRetrievalMetadata__Output as _exa_context_module_pb_CodeContextItemWithRetrievalMetadata__Output } from '../../../exa/context_module_pb/CodeContextItemWithRetrievalMetadata';

export interface CodeRetrievalResult {
  'repository'?: (_exa_codeium_common_pb_GitRepoInfo | null);
  'retrieverName'?: (string);
  'retrieverInfo'?: (_exa_code_edit_code_edit_pb_RetrieverInfo | null);
  'codeContextWithMetadatas'?: (_exa_context_module_pb_CodeContextItemWithRetrievalMetadata)[];
}

export interface CodeRetrievalResult__Output {
  'repository': (_exa_codeium_common_pb_GitRepoInfo__Output | null);
  'retrieverName': (string);
  'retrieverInfo': (_exa_code_edit_code_edit_pb_RetrieverInfo__Output | null);
  'codeContextWithMetadatas': (_exa_context_module_pb_CodeContextItemWithRetrievalMetadata__Output)[];
}
