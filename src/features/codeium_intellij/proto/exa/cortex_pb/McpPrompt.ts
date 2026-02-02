// Original file: exa/cortex_pb/cortex.proto

import type { McpPromptArgument as _exa_cortex_pb_McpPromptArgument, McpPromptArgument__Output as _exa_cortex_pb_McpPromptArgument__Output } from '../../exa/cortex_pb/McpPromptArgument';

export interface McpPrompt {
  'name'?: (string);
  'description'?: (string);
  'arguments'?: (_exa_cortex_pb_McpPromptArgument)[];
}

export interface McpPrompt__Output {
  'name': (string);
  'description': (string);
  'arguments': (_exa_cortex_pb_McpPromptArgument__Output)[];
}
