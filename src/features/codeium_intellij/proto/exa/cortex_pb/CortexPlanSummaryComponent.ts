// Original file: exa/cortex_pb/cortex.proto

import type { ContextScopeItem as _exa_codeium_common_pb_ContextScopeItem, ContextScopeItem__Output as _exa_codeium_common_pb_ContextScopeItem__Output } from '../../exa/codeium_common_pb/ContextScopeItem';

export interface CortexPlanSummaryComponent {
  'text'?: (string);
  'citation'?: (_exa_codeium_common_pb_ContextScopeItem | null);
  'component'?: "text"|"citation";
}

export interface CortexPlanSummaryComponent__Output {
  'text'?: (string);
  'citation'?: (_exa_codeium_common_pb_ContextScopeItem__Output | null);
  'component'?: "text"|"citation";
}
