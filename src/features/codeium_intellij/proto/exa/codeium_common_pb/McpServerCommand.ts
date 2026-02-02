// Original file: exa/codeium_common_pb/codeium_common.proto

import type { McpCommandTemplate as _exa_codeium_common_pb_McpCommandTemplate, McpCommandTemplate__Output as _exa_codeium_common_pb_McpCommandTemplate__Output } from '../../exa/codeium_common_pb/McpCommandTemplate';
import type { McpCommandVariable as _exa_codeium_common_pb_McpCommandVariable, McpCommandVariable__Output as _exa_codeium_common_pb_McpCommandVariable__Output } from '../../exa/codeium_common_pb/McpCommandVariable';

export interface McpServerCommand {
  'template'?: (_exa_codeium_common_pb_McpCommandTemplate | null);
  'variables'?: (_exa_codeium_common_pb_McpCommandVariable)[];
}

export interface McpServerCommand__Output {
  'template': (_exa_codeium_common_pb_McpCommandTemplate__Output | null);
  'variables': (_exa_codeium_common_pb_McpCommandVariable__Output)[];
}
