// Original file: exa/chat_pb/chat.proto

import type { ChatMessageSource as _exa_codeium_common_pb_ChatMessageSource, ChatMessageSource__Output as _exa_codeium_common_pb_ChatMessageSource__Output } from '../../exa/codeium_common_pb/ChatMessageSource';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { ChatMessageIntent as _exa_chat_pb_ChatMessageIntent, ChatMessageIntent__Output as _exa_chat_pb_ChatMessageIntent__Output } from '../../exa/chat_pb/ChatMessageIntent';
import type { ChatMessageAction as _exa_chat_pb_ChatMessageAction, ChatMessageAction__Output as _exa_chat_pb_ChatMessageAction__Output } from '../../exa/chat_pb/ChatMessageAction';
import type { ChatMessageError as _exa_chat_pb_ChatMessageError, ChatMessageError__Output as _exa_chat_pb_ChatMessageError__Output } from '../../exa/chat_pb/ChatMessageError';
import type { ChatMessageStatus as _exa_chat_pb_ChatMessageStatus, ChatMessageStatus__Output as _exa_chat_pb_ChatMessageStatus__Output } from '../../exa/chat_pb/ChatMessageStatus';
import type { GetChatMessageRequest as _exa_chat_pb_GetChatMessageRequest, GetChatMessageRequest__Output as _exa_chat_pb_GetChatMessageRequest__Output } from '../../exa/chat_pb/GetChatMessageRequest';

export interface ChatMessage {
  'messageId'?: (string);
  'source'?: (_exa_codeium_common_pb_ChatMessageSource);
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'conversationId'?: (string);
  'intent'?: (_exa_chat_pb_ChatMessageIntent | null);
  'action'?: (_exa_chat_pb_ChatMessageAction | null);
  'error'?: (_exa_chat_pb_ChatMessageError | null);
  'status'?: (_exa_chat_pb_ChatMessageStatus | null);
  'inProgress'?: (boolean);
  'request'?: (_exa_chat_pb_GetChatMessageRequest | null);
  'redact'?: (boolean);
  'content'?: "intent"|"action"|"error"|"status";
}

export interface ChatMessage__Output {
  'messageId': (string);
  'source': (_exa_codeium_common_pb_ChatMessageSource__Output);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'conversationId': (string);
  'intent'?: (_exa_chat_pb_ChatMessageIntent__Output | null);
  'action'?: (_exa_chat_pb_ChatMessageAction__Output | null);
  'error'?: (_exa_chat_pb_ChatMessageError__Output | null);
  'status'?: (_exa_chat_pb_ChatMessageStatus__Output | null);
  'inProgress': (boolean);
  'request': (_exa_chat_pb_GetChatMessageRequest__Output | null);
  'redact': (boolean);
  'content'?: "intent"|"action"|"error"|"status";
}
