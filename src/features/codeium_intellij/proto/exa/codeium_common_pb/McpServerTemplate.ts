// Original file: exa/codeium_common_pb/codeium_common.proto

import type { McpServerCommand as _exa_codeium_common_pb_McpServerCommand, McpServerCommand__Output as _exa_codeium_common_pb_McpServerCommand__Output } from '../../exa/codeium_common_pb/McpServerCommand';

export interface McpServerTemplate {
  'title'?: (string);
  'id'?: (string);
  'link'?: (string);
  'description'?: (string);
  'commands'?: ({[key: string]: _exa_codeium_common_pb_McpServerCommand});
}

export interface McpServerTemplate__Output {
  'title': (string);
  'id': (string);
  'link': (string);
  'description': (string);
  'commands': ({[key: string]: _exa_codeium_common_pb_McpServerCommand__Output});
}
