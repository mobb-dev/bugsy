// Original file: exa/chat_pb/chat.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ChatMessage as _exa_chat_pb_ChatMessage, ChatMessage__Output as _exa_chat_pb_ChatMessage__Output } from '../../exa/chat_pb/ChatMessage';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface RawGetChatMessageRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'chatMessages'?: (_exa_chat_pb_ChatMessage)[];
  'systemPromptOverride'?: (string);
  'chatModel'?: (_exa_codeium_common_pb_Model);
  'chatModelName'?: (string);
}

export interface RawGetChatMessageRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'chatMessages': (_exa_chat_pb_ChatMessage__Output)[];
  'systemPromptOverride': (string);
  'chatModel': (_exa_codeium_common_pb_Model__Output);
  'chatModelName': (string);
}
