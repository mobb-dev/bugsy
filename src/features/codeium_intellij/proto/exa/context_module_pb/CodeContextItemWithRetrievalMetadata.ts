// Original file: exa/context_module_pb/context_module.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { RetrievedCodeContextItemMetadata as _exa_context_module_pb_RetrievedCodeContextItemMetadata, RetrievedCodeContextItemMetadata__Output as _exa_context_module_pb_RetrievedCodeContextItemMetadata__Output } from '../../exa/context_module_pb/RetrievedCodeContextItemMetadata';

export interface CodeContextItemWithRetrievalMetadata {
  'codeContextItem'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'metadata'?: (_exa_context_module_pb_RetrievedCodeContextItemMetadata | null);
}

export interface CodeContextItemWithRetrievalMetadata__Output {
  'codeContextItem': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'metadata': (_exa_context_module_pb_RetrievedCodeContextItemMetadata__Output | null);
}
