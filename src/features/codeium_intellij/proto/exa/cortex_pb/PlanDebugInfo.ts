// Original file: exa/cortex_pb/cortex.proto

import type { ChatMessagePrompt as _exa_chat_pb_ChatMessagePrompt, ChatMessagePrompt__Output as _exa_chat_pb_ChatMessagePrompt__Output } from '../../exa/chat_pb/ChatMessagePrompt';

export interface PlanDebugInfo {
  'rawResponse'?: (string);
  'planTokens'?: (number);
  'planCost'?: (number | string);
  'systemPrompt'?: (string);
  'messagePrompts'?: (_exa_chat_pb_ChatMessagePrompt)[];
}

export interface PlanDebugInfo__Output {
  'rawResponse': (string);
  'planTokens': (number);
  'planCost': (number);
  'systemPrompt': (string);
  'messagePrompts': (_exa_chat_pb_ChatMessagePrompt__Output)[];
}
