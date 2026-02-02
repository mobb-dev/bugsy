// Original file: exa/cortex_pb/cortex.proto

import type { CascadeAgenticPlannerManagerConfig as _exa_cortex_pb_CascadeAgenticPlannerManagerConfig, CascadeAgenticPlannerManagerConfig__Output as _exa_cortex_pb_CascadeAgenticPlannerManagerConfig__Output } from '../../exa/cortex_pb/CascadeAgenticPlannerManagerConfig';
import type { CascadeAgenticPlannerApplierConfig as _exa_cortex_pb_CascadeAgenticPlannerApplierConfig, CascadeAgenticPlannerApplierConfig__Output as _exa_cortex_pb_CascadeAgenticPlannerApplierConfig__Output } from '../../exa/cortex_pb/CascadeAgenticPlannerApplierConfig';
import type { CascadeAgentToolSet as _exa_cortex_pb_CascadeAgentToolSet, CascadeAgentToolSet__Output as _exa_cortex_pb_CascadeAgentToolSet__Output } from '../../exa/cortex_pb/CascadeAgentToolSet';
import type { AgenticMixin as _exa_cortex_pb_AgenticMixin, AgenticMixin__Output as _exa_cortex_pb_AgenticMixin__Output } from '../../exa/cortex_pb/AgenticMixin';

export interface CascadeAgenticPlannerConfig {
  'enableFeedbackLoop'?: (boolean);
  'evalMode'?: (boolean);
  'managerConfig'?: (_exa_cortex_pb_CascadeAgenticPlannerManagerConfig | null);
  'applierConfig'?: (_exa_cortex_pb_CascadeAgenticPlannerApplierConfig | null);
  'toolSet'?: (_exa_cortex_pb_CascadeAgentToolSet);
  'mixin'?: (_exa_cortex_pb_AgenticMixin);
  '_enableFeedbackLoop'?: "enableFeedbackLoop";
  '_evalMode'?: "evalMode";
  '_managerConfig'?: "managerConfig";
  '_applierConfig'?: "applierConfig";
}

export interface CascadeAgenticPlannerConfig__Output {
  'enableFeedbackLoop'?: (boolean);
  'evalMode'?: (boolean);
  'managerConfig'?: (_exa_cortex_pb_CascadeAgenticPlannerManagerConfig__Output | null);
  'applierConfig'?: (_exa_cortex_pb_CascadeAgenticPlannerApplierConfig__Output | null);
  'toolSet': (_exa_cortex_pb_CascadeAgentToolSet__Output);
  'mixin': (_exa_cortex_pb_AgenticMixin__Output);
  '_enableFeedbackLoop'?: "enableFeedbackLoop";
  '_evalMode'?: "evalMode";
  '_managerConfig'?: "managerConfig";
  '_applierConfig'?: "applierConfig";
}
