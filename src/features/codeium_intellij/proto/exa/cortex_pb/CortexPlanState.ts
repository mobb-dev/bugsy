// Original file: exa/cortex_pb/cortex.proto

import type { CortexStepState as _exa_cortex_pb_CortexStepState, CortexStepState__Output as _exa_cortex_pb_CortexStepState__Output } from '../../exa/cortex_pb/CortexStepState';
import type { CortexStepOutline as _exa_cortex_pb_CortexStepOutline, CortexStepOutline__Output as _exa_cortex_pb_CortexStepOutline__Output } from '../../exa/cortex_pb/CortexStepOutline';
import type { PlanDebugInfo as _exa_cortex_pb_PlanDebugInfo, PlanDebugInfo__Output as _exa_cortex_pb_PlanDebugInfo__Output } from '../../exa/cortex_pb/PlanDebugInfo';

export interface CortexPlanState {
  'steps'?: (_exa_cortex_pb_CortexStepState)[];
  'outlines'?: (_exa_cortex_pb_CortexStepOutline)[];
  'currentStepIndex'?: (number);
  'debugInfo'?: (_exa_cortex_pb_PlanDebugInfo | null);
}

export interface CortexPlanState__Output {
  'steps': (_exa_cortex_pb_CortexStepState__Output)[];
  'outlines': (_exa_cortex_pb_CortexStepOutline__Output)[];
  'currentStepIndex': (number);
  'debugInfo': (_exa_cortex_pb_PlanDebugInfo__Output | null);
}
