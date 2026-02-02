// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ContextScopeItem as _exa_codeium_common_pb_ContextScopeItem, ContextScopeItem__Output as _exa_codeium_common_pb_ContextScopeItem__Output } from '../../exa/codeium_common_pb/ContextScopeItem';

export interface TextOrScopeItem {
  'text'?: (string);
  'item'?: (_exa_codeium_common_pb_ContextScopeItem | null);
  'chunk'?: "text"|"item";
}

export interface TextOrScopeItem__Output {
  'text'?: (string);
  'item'?: (_exa_codeium_common_pb_ContextScopeItem__Output | null);
  'chunk'?: "text"|"item";
}
