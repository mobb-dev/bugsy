// Original file: exa/cortex_pb/cortex.proto

import type { PlanStatus as _exa_codeium_common_pb_PlanStatus, PlanStatus__Output as _exa_codeium_common_pb_PlanStatus__Output } from '../../exa/codeium_common_pb/PlanStatus';
import type { UserSettings as _exa_codeium_common_pb_UserSettings, UserSettings__Output as _exa_codeium_common_pb_UserSettings__Output } from '../../exa/codeium_common_pb/UserSettings';

export interface CascadePanelState {
  'planStatus'?: (_exa_codeium_common_pb_PlanStatus | null);
  'userSettings'?: (_exa_codeium_common_pb_UserSettings | null);
  'workspaceTrusted'?: (boolean);
  '_workspaceTrusted'?: "workspaceTrusted";
}

export interface CascadePanelState__Output {
  'planStatus': (_exa_codeium_common_pb_PlanStatus__Output | null);
  'userSettings': (_exa_codeium_common_pb_UserSettings__Output | null);
  'workspaceTrusted'?: (boolean);
  '_workspaceTrusted'?: "workspaceTrusted";
}
