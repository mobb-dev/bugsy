// Original file: exa/cortex_pb/cortex.proto

import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';

export interface CortexStepToolCallChoice {
  'proposalToolCalls'?: (_exa_codeium_common_pb_ChatToolCall)[];
  'choice'?: (number);
  'reason'?: (string);
}

export interface CortexStepToolCallChoice__Output {
  'proposalToolCalls': (_exa_codeium_common_pb_ChatToolCall__Output)[];
  'choice': (number);
  'reason': (string);
}
