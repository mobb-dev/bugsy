// Original file: exa/cortex_pb/cortex.proto

import type { ConversationalPlannerMode as _exa_codeium_common_pb_ConversationalPlannerMode, ConversationalPlannerMode__Output as _exa_codeium_common_pb_ConversationalPlannerMode__Output } from '../../exa/codeium_common_pb/ConversationalPlannerMode';

export interface CascadeConversationalV2PlannerConfig {
  'plannerMode'?: (_exa_codeium_common_pb_ConversationalPlannerMode);
  'useClusters'?: (boolean);
  'clusterPath'?: (string);
  'evalMode'?: (boolean);
  '_useClusters'?: "useClusters";
  '_evalMode'?: "evalMode";
}

export interface CascadeConversationalV2PlannerConfig__Output {
  'plannerMode': (_exa_codeium_common_pb_ConversationalPlannerMode__Output);
  'useClusters'?: (boolean);
  'clusterPath': (string);
  'evalMode'?: (boolean);
  '_useClusters'?: "useClusters";
  '_evalMode'?: "evalMode";
}
