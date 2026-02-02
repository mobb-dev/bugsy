// Original file: exa/context_module_pb/context_module.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface LocalNodeState {
  'currentNode'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'closestAboveNode'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'closestBelowNode'?: (_exa_codeium_common_pb_CodeContextItem | null);
}

export interface LocalNodeState__Output {
  'currentNode': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'closestAboveNode': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'closestBelowNode': (_exa_codeium_common_pb_CodeContextItem__Output | null);
}
