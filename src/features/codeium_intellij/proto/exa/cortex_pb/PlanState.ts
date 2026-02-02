// Original file: exa/cortex_pb/cortex.proto

import type { PlanInput as _exa_cortex_pb_PlanInput, PlanInput__Output as _exa_cortex_pb_PlanInput__Output } from '../../exa/cortex_pb/PlanInput';
import type { ActionState as _exa_cortex_pb_ActionState, ActionState__Output as _exa_cortex_pb_ActionState__Output } from '../../exa/cortex_pb/ActionState';
import type { PlanStatus as _exa_cortex_pb_PlanStatus, PlanStatus__Output as _exa_cortex_pb_PlanStatus__Output } from '../../exa/cortex_pb/PlanStatus';
import type { RetrievalStatus as _exa_cortex_pb_RetrievalStatus, RetrievalStatus__Output as _exa_cortex_pb_RetrievalStatus__Output } from '../../exa/cortex_pb/RetrievalStatus';
import type { PlanDebugInfo as _exa_cortex_pb_PlanDebugInfo, PlanDebugInfo__Output as _exa_cortex_pb_PlanDebugInfo__Output } from '../../exa/cortex_pb/PlanDebugInfo';

export interface PlanState {
  'planId'?: (string);
  'planInput'?: (_exa_cortex_pb_PlanInput | null);
  'actions'?: (_exa_cortex_pb_ActionState)[];
  'status'?: (_exa_cortex_pb_PlanStatus);
  'error'?: (string);
  'retrievalStatus'?: (_exa_cortex_pb_RetrievalStatus | null);
  'debugInfo'?: (_exa_cortex_pb_PlanDebugInfo | null);
}

export interface PlanState__Output {
  'planId': (string);
  'planInput': (_exa_cortex_pb_PlanInput__Output | null);
  'actions': (_exa_cortex_pb_ActionState__Output)[];
  'status': (_exa_cortex_pb_PlanStatus__Output);
  'error': (string);
  'retrievalStatus': (_exa_cortex_pb_RetrievalStatus__Output | null);
  'debugInfo': (_exa_cortex_pb_PlanDebugInfo__Output | null);
}
