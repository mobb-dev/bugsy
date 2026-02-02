// Original file: exa/context_module_pb/context_module.proto

import type { ContextScope as _exa_codeium_common_pb_ContextScope, ContextScope__Output as _exa_codeium_common_pb_ContextScope__Output } from '../../exa/codeium_common_pb/ContextScope';

export interface ContextChangePinnedContext {
  'pinnedScope'?: (_exa_codeium_common_pb_ContextScope | null);
  'mentionedScope'?: (_exa_codeium_common_pb_ContextScope | null);
  'scope'?: "pinnedScope"|"mentionedScope";
}

export interface ContextChangePinnedContext__Output {
  'pinnedScope'?: (_exa_codeium_common_pb_ContextScope__Output | null);
  'mentionedScope'?: (_exa_codeium_common_pb_ContextScope__Output | null);
  'scope'?: "pinnedScope"|"mentionedScope";
}
