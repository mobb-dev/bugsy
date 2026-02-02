// Original file: exa/cortex_pb/cortex.proto

import type { ContextScopeItem as _exa_codeium_common_pb_ContextScopeItem, ContextScopeItem__Output as _exa_codeium_common_pb_ContextScopeItem__Output } from '../../exa/codeium_common_pb/ContextScopeItem';

export interface PlanInput {
  'goal'?: (string);
  'targetDirectories'?: (string)[];
  'targetFiles'?: (string)[];
  'scopeItems'?: (_exa_codeium_common_pb_ContextScopeItem)[];
  'nextSteps'?: (string)[];
}

export interface PlanInput__Output {
  'goal': (string);
  'targetDirectories': (string)[];
  'targetFiles': (string)[];
  'scopeItems': (_exa_codeium_common_pb_ContextScopeItem__Output)[];
  'nextSteps': (string)[];
}
