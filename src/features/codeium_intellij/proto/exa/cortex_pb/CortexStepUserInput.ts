// Original file: exa/cortex_pb/cortex.proto

import type { TextOrScopeItem as _exa_codeium_common_pb_TextOrScopeItem, TextOrScopeItem__Output as _exa_codeium_common_pb_TextOrScopeItem__Output } from '../../exa/codeium_common_pb/TextOrScopeItem';
import type { ContextModuleResult as _exa_context_module_pb_ContextModuleResult, ContextModuleResult__Output as _exa_context_module_pb_ContextModuleResult__Output } from '../../exa/context_module_pb/ContextModuleResult';
import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from '../../exa/codeium_common_pb/ImageData';

export interface CortexStepUserInput {
  'query'?: (string);
  'userResponse'?: (string);
  'items'?: (_exa_codeium_common_pb_TextOrScopeItem)[];
  'activeUserState'?: (_exa_context_module_pb_ContextModuleResult | null);
  'images'?: (_exa_codeium_common_pb_ImageData)[];
}

export interface CortexStepUserInput__Output {
  'query': (string);
  'userResponse': (string);
  'items': (_exa_codeium_common_pb_TextOrScopeItem__Output)[];
  'activeUserState': (_exa_context_module_pb_ContextModuleResult__Output | null);
  'images': (_exa_codeium_common_pb_ImageData__Output)[];
}
