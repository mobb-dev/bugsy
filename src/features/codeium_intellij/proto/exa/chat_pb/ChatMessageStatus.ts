// Original file: exa/chat_pb/chat.proto

import type { ChatMessageStatusContextRelevancy as _exa_chat_pb_ChatMessageStatusContextRelevancy, ChatMessageStatusContextRelevancy__Output as _exa_chat_pb_ChatMessageStatusContextRelevancy__Output } from '../../exa/chat_pb/ChatMessageStatusContextRelevancy';

export interface ChatMessageStatus {
  'contextRelevancy'?: (_exa_chat_pb_ChatMessageStatusContextRelevancy | null);
  'status'?: "contextRelevancy";
}

export interface ChatMessageStatus__Output {
  'contextRelevancy'?: (_exa_chat_pb_ChatMessageStatusContextRelevancy__Output | null);
  'status'?: "contextRelevancy";
}
