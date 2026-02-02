// Original file: exa/context_module_pb/context_module.proto

import type { Guideline as _exa_codeium_common_pb_Guideline, Guideline__Output as _exa_codeium_common_pb_Guideline__Output } from '../../exa/codeium_common_pb/Guideline';
import type { ContextScope as _exa_codeium_common_pb_ContextScope, ContextScope__Output as _exa_codeium_common_pb_ContextScope__Output } from '../../exa/codeium_common_pb/ContextScope';

export interface PersistentContextModuleState {
  'pinnedGuideline'?: (_exa_codeium_common_pb_Guideline | null);
  'pinnedContextScope'?: (_exa_codeium_common_pb_ContextScope | null);
}

export interface PersistentContextModuleState__Output {
  'pinnedGuideline': (_exa_codeium_common_pb_Guideline__Output | null);
  'pinnedContextScope': (_exa_codeium_common_pb_ContextScope__Output | null);
}
