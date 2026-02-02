// Original file: exa/language_server_pb/language_server.proto

import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from '../../exa/codeium_common_pb/ChatToolCall';
import type { GRPCStatus as _exa_codeium_common_pb_GRPCStatus, GRPCStatus__Output as _exa_codeium_common_pb_GRPCStatus__Output } from '../../exa/codeium_common_pb/GRPCStatus';

export interface VibeAndReplaceData {
  'requestId'?: (string);
  'output'?: (string);
  'toolCalls'?: (_exa_codeium_common_pb_ChatToolCall)[];
  'error'?: (_exa_codeium_common_pb_GRPCStatus | null);
  'filePath'?: (string);
  'isSkipped'?: (boolean);
}

export interface VibeAndReplaceData__Output {
  'requestId': (string);
  'output': (string);
  'toolCalls': (_exa_codeium_common_pb_ChatToolCall__Output)[];
  'error': (_exa_codeium_common_pb_GRPCStatus__Output | null);
  'filePath': (string);
  'isSkipped': (boolean);
}
