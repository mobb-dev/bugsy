// Original file: exa/cortex_pb/cortex.proto

import type { CortexStepType as _exa_cortex_pb_CortexStepType, CortexStepType__Output as _exa_cortex_pb_CortexStepType__Output } from '../../exa/cortex_pb/CortexStepType';

export interface TrajectoryConversionConfig {
  'useToolFormat'?: (boolean);
  'includeInputStep'?: (boolean);
  'groupToolsWithPlannerResponse'?: (boolean);
  'disabledStepTypes'?: (_exa_cortex_pb_CortexStepType)[];
  'toolCallFooter'?: (string);
  '_useToolFormat'?: "useToolFormat";
  '_includeInputStep'?: "includeInputStep";
  '_groupToolsWithPlannerResponse'?: "groupToolsWithPlannerResponse";
  '_toolCallFooter'?: "toolCallFooter";
}

export interface TrajectoryConversionConfig__Output {
  'useToolFormat'?: (boolean);
  'includeInputStep'?: (boolean);
  'groupToolsWithPlannerResponse'?: (boolean);
  'disabledStepTypes': (_exa_cortex_pb_CortexStepType__Output)[];
  'toolCallFooter'?: (string);
  '_useToolFormat'?: "useToolFormat";
  '_includeInputStep'?: "includeInputStep";
  '_groupToolsWithPlannerResponse'?: "groupToolsWithPlannerResponse";
  '_toolCallFooter'?: "toolCallFooter";
}
