// Original file: exa/language_server_pb/language_server.proto

import type { OnboardingActionType as _exa_codeium_common_pb_OnboardingActionType, OnboardingActionType__Output as _exa_codeium_common_pb_OnboardingActionType__Output } from '../../exa/codeium_common_pb/OnboardingActionType';

export interface OnboardingItemState {
  'actionType'?: (_exa_codeium_common_pb_OnboardingActionType);
  'completed'?: (boolean);
}

export interface OnboardingItemState__Output {
  'actionType': (_exa_codeium_common_pb_OnboardingActionType__Output);
  'completed': (boolean);
}
