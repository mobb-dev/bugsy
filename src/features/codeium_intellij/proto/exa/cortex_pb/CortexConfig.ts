// Original file: exa/cortex_pb/cortex.proto

import type { CortexPlanConfig as _exa_cortex_pb_CortexPlanConfig, CortexPlanConfig__Output as _exa_cortex_pb_CortexPlanConfig__Output } from '../../exa/cortex_pb/CortexPlanConfig';
import type { MQueryConfig as _exa_codeium_common_pb_MQueryConfig, MQueryConfig__Output as _exa_codeium_common_pb_MQueryConfig__Output } from '../../exa/codeium_common_pb/MQueryConfig';
import type { PlanConfig as _exa_cortex_pb_PlanConfig, PlanConfig__Output as _exa_cortex_pb_PlanConfig__Output } from '../../exa/cortex_pb/PlanConfig';
import type { ChatNodeConfig as _exa_codeium_common_pb_ChatNodeConfig, ChatNodeConfig__Output as _exa_codeium_common_pb_ChatNodeConfig__Output } from '../../exa/codeium_common_pb/ChatNodeConfig';

export interface CortexConfig {
  'useMacroPlanner'?: (boolean);
  'autoPrepareApply'?: (boolean);
  'numPrepareRetries'?: (number);
  'macroPlanConfig'?: (_exa_cortex_pb_CortexPlanConfig | null);
  'codePlanConfig'?: (_exa_cortex_pb_CortexPlanConfig | null);
  'addDistillNode'?: (boolean);
  'mQueryConfig'?: (_exa_codeium_common_pb_MQueryConfig | null);
  'planConfig'?: (_exa_cortex_pb_PlanConfig | null);
  'distillConfig'?: (_exa_codeium_common_pb_ChatNodeConfig | null);
  'recordTelemetry'?: (boolean);
  'mQueryModelName'?: (string);
}

export interface CortexConfig__Output {
  'useMacroPlanner': (boolean);
  'autoPrepareApply': (boolean);
  'numPrepareRetries': (number);
  'macroPlanConfig': (_exa_cortex_pb_CortexPlanConfig__Output | null);
  'codePlanConfig': (_exa_cortex_pb_CortexPlanConfig__Output | null);
  'addDistillNode': (boolean);
  'mQueryConfig': (_exa_codeium_common_pb_MQueryConfig__Output | null);
  'planConfig': (_exa_cortex_pb_PlanConfig__Output | null);
  'distillConfig': (_exa_codeium_common_pb_ChatNodeConfig__Output | null);
  'recordTelemetry': (boolean);
  'mQueryModelName': (string);
}
