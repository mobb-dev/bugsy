// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { TerminalCommandData as _exa_codeium_common_pb_TerminalCommandData, TerminalCommandData__Output as _exa_codeium_common_pb_TerminalCommandData__Output } from '../../exa/codeium_common_pb/TerminalCommandData';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';
import type { TerminalCommandConversationEntry as _exa_language_server_pb_TerminalCommandConversationEntry, TerminalCommandConversationEntry__Output as _exa_language_server_pb_TerminalCommandConversationEntry__Output } from '../../exa/language_server_pb/TerminalCommandConversationEntry';

export interface HandleStreamingTerminalCommandRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'commandText'?: (string);
  'terminalCommandData'?: (_exa_codeium_common_pb_TerminalCommandData | null);
  'model'?: (_exa_codeium_common_pb_Model);
  'conversationHistory'?: (_exa_language_server_pb_TerminalCommandConversationEntry)[];
  '_model'?: "model";
}

export interface HandleStreamingTerminalCommandRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'commandText': (string);
  'terminalCommandData': (_exa_codeium_common_pb_TerminalCommandData__Output | null);
  'model'?: (_exa_codeium_common_pb_Model__Output);
  'conversationHistory': (_exa_language_server_pb_TerminalCommandConversationEntry__Output)[];
  '_model'?: "model";
}
