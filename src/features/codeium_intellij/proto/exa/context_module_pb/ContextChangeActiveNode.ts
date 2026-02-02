// Original file: exa/context_module_pb/context_module.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';

export interface ContextChangeActiveNode {
  'activeNode'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'document'?: (_exa_codeium_common_pb_Document | null);
  'actualNodeChange'?: (boolean);
}

export interface ContextChangeActiveNode__Output {
  'activeNode': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'document': (_exa_codeium_common_pb_Document__Output | null);
  'actualNodeChange': (boolean);
}
