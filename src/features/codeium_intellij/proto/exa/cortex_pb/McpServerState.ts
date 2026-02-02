// Original file: exa/cortex_pb/cortex.proto

import type { McpServerSpec as _exa_cortex_pb_McpServerSpec, McpServerSpec__Output as _exa_cortex_pb_McpServerSpec__Output } from '../../exa/cortex_pb/McpServerSpec';
import type { McpServerStatus as _exa_cortex_pb_McpServerStatus, McpServerStatus__Output as _exa_cortex_pb_McpServerStatus__Output } from '../../exa/cortex_pb/McpServerStatus';
import type { ChatToolDefinition as _exa_chat_pb_ChatToolDefinition, ChatToolDefinition__Output as _exa_chat_pb_ChatToolDefinition__Output } from '../../exa/chat_pb/ChatToolDefinition';
import type { McpServerInfo as _exa_cortex_pb_McpServerInfo, McpServerInfo__Output as _exa_cortex_pb_McpServerInfo__Output } from '../../exa/cortex_pb/McpServerInfo';
import type { McpPrompt as _exa_cortex_pb_McpPrompt, McpPrompt__Output as _exa_cortex_pb_McpPrompt__Output } from '../../exa/cortex_pb/McpPrompt';

export interface McpServerState {
  'spec'?: (_exa_cortex_pb_McpServerSpec | null);
  'status'?: (_exa_cortex_pb_McpServerStatus);
  'error'?: (string);
  'tools'?: (_exa_chat_pb_ChatToolDefinition)[];
  'serverInfo'?: (_exa_cortex_pb_McpServerInfo | null);
  'instructions'?: (string);
  'toolErrors'?: (string)[];
  'prompts'?: (_exa_cortex_pb_McpPrompt)[];
}

export interface McpServerState__Output {
  'spec': (_exa_cortex_pb_McpServerSpec__Output | null);
  'status': (_exa_cortex_pb_McpServerStatus__Output);
  'error': (string);
  'tools': (_exa_chat_pb_ChatToolDefinition__Output)[];
  'serverInfo': (_exa_cortex_pb_McpServerInfo__Output | null);
  'instructions': (string);
  'toolErrors': (string)[];
  'prompts': (_exa_cortex_pb_McpPrompt__Output)[];
}
