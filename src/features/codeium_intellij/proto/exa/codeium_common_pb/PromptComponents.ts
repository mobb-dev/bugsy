// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface PromptComponents {
  'document'?: (_exa_codeium_common_pb_Document | null);
  'otherDocuments'?: (_exa_codeium_common_pb_Document)[];
  'codeContextItems'?: (_exa_codeium_common_pb_CodeContextItem)[];
}

export interface PromptComponents__Output {
  'document': (_exa_codeium_common_pb_Document__Output | null);
  'otherDocuments': (_exa_codeium_common_pb_Document__Output)[];
  'codeContextItems': (_exa_codeium_common_pb_CodeContextItem__Output)[];
}
