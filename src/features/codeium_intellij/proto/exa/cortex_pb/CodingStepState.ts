// Original file: exa/cortex_pb/cortex.proto

import type { ActionState as _exa_cortex_pb_ActionState, ActionState__Output as _exa_cortex_pb_ActionState__Output } from '../../exa/cortex_pb/ActionState';
import type { PlanDebugInfo as _exa_cortex_pb_PlanDebugInfo, PlanDebugInfo__Output as _exa_cortex_pb_PlanDebugInfo__Output } from '../../exa/cortex_pb/PlanDebugInfo';
import type { CortexStepOutline as _exa_cortex_pb_CortexStepOutline, CortexStepOutline__Output as _exa_cortex_pb_CortexStepOutline__Output } from '../../exa/cortex_pb/CortexStepOutline';
import type { CortexPlanSummaryComponent as _exa_cortex_pb_CortexPlanSummaryComponent, CortexPlanSummaryComponent__Output as _exa_cortex_pb_CortexPlanSummaryComponent__Output } from '../../exa/cortex_pb/CortexPlanSummaryComponent';
import type { CciWithSubrangeWithRetrievalMetadata as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata, CciWithSubrangeWithRetrievalMetadata__Output as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output } from '../../exa/context_module_pb/CciWithSubrangeWithRetrievalMetadata';

export interface CodingStepState {
  'planId'?: (string);
  'goal'?: (string);
  'actionStates'?: (_exa_cortex_pb_ActionState)[];
  'planFullyGenerated'?: (boolean);
  'planFinished'?: (boolean);
  'debugInfo'?: (_exa_cortex_pb_PlanDebugInfo | null);
  'outlines'?: (_exa_cortex_pb_CortexStepOutline)[];
  'summaryComponents'?: (_exa_cortex_pb_CortexPlanSummaryComponent)[];
  'postSummaryText'?: (string);
  'planSummaryConfirmed'?: (boolean);
  'planSummaryFullyGenerated'?: (boolean);
  'cciList'?: (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata)[];
}

export interface CodingStepState__Output {
  'planId': (string);
  'goal': (string);
  'actionStates': (_exa_cortex_pb_ActionState__Output)[];
  'planFullyGenerated': (boolean);
  'planFinished': (boolean);
  'debugInfo': (_exa_cortex_pb_PlanDebugInfo__Output | null);
  'outlines': (_exa_cortex_pb_CortexStepOutline__Output)[];
  'summaryComponents': (_exa_cortex_pb_CortexPlanSummaryComponent__Output)[];
  'postSummaryText': (string);
  'planSummaryConfirmed': (boolean);
  'planSummaryFullyGenerated': (boolean);
  'cciList': (_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output)[];
}
