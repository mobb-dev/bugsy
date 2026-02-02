// Original file: exa/cortex_pb/cortex.proto

import type { PlanInput as _exa_cortex_pb_PlanInput, PlanInput__Output as _exa_cortex_pb_PlanInput__Output } from '../../exa/cortex_pb/PlanInput';
import type { CortexResearchState as _exa_cortex_pb_CortexResearchState, CortexResearchState__Output as _exa_cortex_pb_CortexResearchState__Output } from '../../exa/cortex_pb/CortexResearchState';
import type { CortexPlanState as _exa_cortex_pb_CortexPlanState, CortexPlanState__Output as _exa_cortex_pb_CortexPlanState__Output } from '../../exa/cortex_pb/CortexPlanState';
import type { CortexRequestSource as _exa_cortex_pb_CortexRequestSource, CortexRequestSource__Output as _exa_cortex_pb_CortexRequestSource__Output } from '../../exa/cortex_pb/CortexRequestSource';

export interface CortexWorkflowState {
  'goal'?: (string);
  'planInput'?: (_exa_cortex_pb_PlanInput | null);
  'researchState'?: (_exa_cortex_pb_CortexResearchState | null);
  'planState'?: (_exa_cortex_pb_CortexPlanState | null);
  'error'?: (string);
  'requestSource'?: (_exa_cortex_pb_CortexRequestSource);
}

export interface CortexWorkflowState__Output {
  'goal': (string);
  'planInput': (_exa_cortex_pb_PlanInput__Output | null);
  'researchState': (_exa_cortex_pb_CortexResearchState__Output | null);
  'planState': (_exa_cortex_pb_CortexPlanState__Output | null);
  'error': (string);
  'requestSource': (_exa_cortex_pb_CortexRequestSource__Output);
}
