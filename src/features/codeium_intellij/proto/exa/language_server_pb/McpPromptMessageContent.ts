// Original file: exa/language_server_pb/language_server.proto

import type { McpResourceContent as _exa_cortex_pb_McpResourceContent, McpResourceContent__Output as _exa_cortex_pb_McpResourceContent__Output } from '../../exa/cortex_pb/McpResourceContent';

export interface McpPromptMessageContent {
  'text'?: (string);
  'resource'?: (_exa_cortex_pb_McpResourceContent | null);
  'content'?: "text"|"resource";
}

export interface McpPromptMessageContent__Output {
  'text'?: (string);
  'resource'?: (_exa_cortex_pb_McpResourceContent__Output | null);
  'content'?: "text"|"resource";
}
