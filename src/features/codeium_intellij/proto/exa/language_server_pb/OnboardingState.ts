// Original file: exa/language_server_pb/language_server.proto

import type { OnboardingItemState as _exa_language_server_pb_OnboardingItemState, OnboardingItemState__Output as _exa_language_server_pb_OnboardingItemState__Output } from '../../exa/language_server_pb/OnboardingItemState';

export interface OnboardingState {
  'hasSkipped'?: (boolean);
  'items'?: (_exa_language_server_pb_OnboardingItemState)[];
}

export interface OnboardingState__Output {
  'hasSkipped': (boolean);
  'items': (_exa_language_server_pb_OnboardingItemState__Output)[];
}
