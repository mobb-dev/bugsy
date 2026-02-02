// Original file: exa/chat_pb/chat.proto

import type { ChatMessageSource as _exa_codeium_common_pb_ChatMessageSource, ChatMessageSource__Output as _exa_codeium_common_pb_ChatMessageSource__Output } from '../../exa/codeium_common_pb/ChatMessageSource';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface RawChatMessage {
  'messageId'?: (string);
  'source'?: (_exa_codeium_common_pb_ChatMessageSource);
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'conversationId'?: (string);
  'text'?: (string);
  'inProgress'?: (boolean);
  'isError'?: (boolean);
}

export interface RawChatMessage__Output {
  'messageId': (string);
  'source': (_exa_codeium_common_pb_ChatMessageSource__Output);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'conversationId': (string);
  'text': (string);
  'inProgress': (boolean);
  'isError': (boolean);
}
