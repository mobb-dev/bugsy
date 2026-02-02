// Original file: exa/chat_pb/chat.proto

import type { ChatMessageSource as _exa_codeium_common_pb_ChatMessageSource, ChatMessageSource__Output as _exa_codeium_common_pb_ChatMessageSource__Output } from '../../exa/codeium_common_pb/ChatMessageSource';

export interface FormattedChatMessage {
  'role'?: (_exa_codeium_common_pb_ChatMessageSource);
  'header'?: (string);
  'content'?: (string);
  'footer'?: (string);
}

export interface FormattedChatMessage__Output {
  'role': (_exa_codeium_common_pb_ChatMessageSource__Output);
  'header': (string);
  'content': (string);
  'footer': (string);
}
