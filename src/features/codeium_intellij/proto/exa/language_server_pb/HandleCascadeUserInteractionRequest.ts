// Original file: exa/language_server_pb/language_server.proto

import type { CascadeUserInteraction as _exa_cortex_pb_CascadeUserInteraction, CascadeUserInteraction__Output as _exa_cortex_pb_CascadeUserInteraction__Output } from '../../exa/cortex_pb/CascadeUserInteraction';

export interface HandleCascadeUserInteractionRequest {
  'cascadeId'?: (string);
  'interaction'?: (_exa_cortex_pb_CascadeUserInteraction | null);
}

export interface HandleCascadeUserInteractionRequest__Output {
  'cascadeId': (string);
  'interaction': (_exa_cortex_pb_CascadeUserInteraction__Output | null);
}
