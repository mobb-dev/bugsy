// Original file: exa/cortex_pb/cortex.proto

import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';

export interface CortexStepToolCallProposal {
  'toolCall'?: (_exa_codeium_common_pb_ChatToolCall | null);
}

export interface CortexStepToolCallProposal__Output {
  'toolCall': (_exa_codeium_common_pb_ChatToolCall__Output | null);
}
