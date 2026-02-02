// Original file: exa/language_server_pb/language_server.proto

import type { ChatToolDefinition as _exa_chat_pb_ChatToolDefinition, ChatToolDefinition__Output as _exa_chat_pb_ChatToolDefinition__Output } from '../../exa/chat_pb/ChatToolDefinition';

export interface GetSystemPromptAndToolsResponse {
  'systemPrompt'?: (string);
  'toolDefinitions'?: (_exa_chat_pb_ChatToolDefinition)[];
}

export interface GetSystemPromptAndToolsResponse__Output {
  'systemPrompt': (string);
  'toolDefinitions': (_exa_chat_pb_ChatToolDefinition__Output)[];
}
