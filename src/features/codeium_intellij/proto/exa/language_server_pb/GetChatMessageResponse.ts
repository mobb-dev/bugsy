// Original file: exa/language_server_pb/language_server.proto

import type { ChatMessage as _exa_chat_pb_ChatMessage, ChatMessage__Output as _exa_chat_pb_ChatMessage__Output } from '../../exa/chat_pb/ChatMessage';

export interface GetChatMessageResponse {
  'chatMessage'?: (_exa_chat_pb_ChatMessage | null);
  'numTokensInIntent'?: (number);
}

export interface GetChatMessageResponse__Output {
  'chatMessage': (_exa_chat_pb_ChatMessage__Output | null);
  'numTokensInIntent': (number);
}
