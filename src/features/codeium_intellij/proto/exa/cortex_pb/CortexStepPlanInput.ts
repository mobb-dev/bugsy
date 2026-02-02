// Original file: exa/cortex_pb/cortex.proto

import type { PlanInput as _exa_cortex_pb_PlanInput, PlanInput__Output as _exa_cortex_pb_PlanInput__Output } from '../../exa/cortex_pb/PlanInput';

export interface CortexStepPlanInput {
  'planInput'?: (_exa_cortex_pb_PlanInput | null);
  'userProvided'?: (boolean);
}

export interface CortexStepPlanInput__Output {
  'planInput': (_exa_cortex_pb_PlanInput__Output | null);
  'userProvided': (boolean);
}
