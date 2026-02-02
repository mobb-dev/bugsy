// Original file: exa/language_server_pb/language_server.proto

import type { McpPromptMessageContent as _exa_language_server_pb_McpPromptMessageContent, McpPromptMessageContent__Output as _exa_language_server_pb_McpPromptMessageContent__Output } from '../../exa/language_server_pb/McpPromptMessageContent';

export interface McpPromptMessage {
  'role'?: (string);
  'content'?: (_exa_language_server_pb_McpPromptMessageContent)[];
}

export interface McpPromptMessage__Output {
  'role': (string);
  'content': (_exa_language_server_pb_McpPromptMessageContent__Output)[];
}
