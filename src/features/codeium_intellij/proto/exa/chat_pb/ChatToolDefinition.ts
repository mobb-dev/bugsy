// Original file: exa/chat_pb/chat.proto

import type { ComputerUseToolConfig as _exa_chat_pb_ComputerUseToolConfig, ComputerUseToolConfig__Output as _exa_chat_pb_ComputerUseToolConfig__Output } from '../../exa/chat_pb/ComputerUseToolConfig';

export interface ChatToolDefinition {
  'name'?: (string);
  'description'?: (string);
  'jsonSchemaString'?: (string);
  'strict'?: (boolean);
  'attributionFieldNames'?: (string)[];
  'serverName'?: (string);
  'readOnlyHint'?: (boolean);
  'computerUseConfig'?: (_exa_chat_pb_ComputerUseToolConfig | null);
  '_readOnlyHint'?: "readOnlyHint";
  '_computerUseConfig'?: "computerUseConfig";
}

export interface ChatToolDefinition__Output {
  'name': (string);
  'description': (string);
  'jsonSchemaString': (string);
  'strict': (boolean);
  'attributionFieldNames': (string)[];
  'serverName': (string);
  'readOnlyHint'?: (boolean);
  'computerUseConfig'?: (_exa_chat_pb_ComputerUseToolConfig__Output | null);
  '_readOnlyHint'?: "readOnlyHint";
  '_computerUseConfig'?: "computerUseConfig";
}
