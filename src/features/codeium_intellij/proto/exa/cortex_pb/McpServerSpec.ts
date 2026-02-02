// Original file: exa/cortex_pb/cortex.proto

import type { McpOAuthConfig as _exa_cortex_pb_McpOAuthConfig, McpOAuthConfig__Output as _exa_cortex_pb_McpOAuthConfig__Output } from '../../exa/cortex_pb/McpOAuthConfig';

export interface McpServerSpec {
  'serverName'?: (string);
  'command'?: (string);
  'args'?: (string)[];
  'env'?: ({[key: string]: string});
  'serverIndex'?: (number);
  'serverUrl'?: (string);
  'disabled'?: (boolean);
  'disabledTools'?: (string)[];
  'headers'?: ({[key: string]: string});
  'oauth'?: (_exa_cortex_pb_McpOAuthConfig | null);
}

export interface McpServerSpec__Output {
  'serverName': (string);
  'command': (string);
  'args': (string)[];
  'env': ({[key: string]: string});
  'serverIndex': (number);
  'serverUrl': (string);
  'disabled': (boolean);
  'disabledTools': (string)[];
  'headers': ({[key: string]: string});
  'oauth': (_exa_cortex_pb_McpOAuthConfig__Output | null);
}
