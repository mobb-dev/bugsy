// Original file: exa/cortex_pb/cortex.proto

import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from '../../exa/codeium_common_pb/Document';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface ActiveUserState {
  'activeDocument'?: (_exa_codeium_common_pb_Document | null);
  'openDocuments'?: (_exa_codeium_common_pb_Document)[];
  'activeNode'?: (_exa_codeium_common_pb_CodeContextItem | null);
}

export interface ActiveUserState__Output {
  'activeDocument': (_exa_codeium_common_pb_Document__Output | null);
  'openDocuments': (_exa_codeium_common_pb_Document__Output)[];
  'activeNode': (_exa_codeium_common_pb_CodeContextItem__Output | null);
}
