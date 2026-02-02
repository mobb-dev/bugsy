// Original file: exa/cortex_pb/cortex.proto

import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';
import type { McpServerInfo as _exa_cortex_pb_McpServerInfo, McpServerInfo__Output as _exa_cortex_pb_McpServerInfo__Output } from '../../exa/cortex_pb/McpServerInfo';
import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from '../../exa/codeium_common_pb/ImageData';

export interface CortexStepMcpTool {
  'serverName'?: (string);
  'toolCall'?: (_exa_codeium_common_pb_ChatToolCall | null);
  'resultString'?: (string);
  'serverInfo'?: (_exa_cortex_pb_McpServerInfo | null);
  'images'?: (_exa_codeium_common_pb_ImageData)[];
}

export interface CortexStepMcpTool__Output {
  'serverName': (string);
  'toolCall': (_exa_codeium_common_pb_ChatToolCall__Output | null);
  'resultString': (string);
  'serverInfo': (_exa_cortex_pb_McpServerInfo__Output | null);
  'images': (_exa_codeium_common_pb_ImageData__Output)[];
}
