// Original file: exa/codeium_common_pb/codeium_common.proto

import type { McpLocalServer as _exa_codeium_common_pb_McpLocalServer, McpLocalServer__Output as _exa_codeium_common_pb_McpLocalServer__Output } from '../../exa/codeium_common_pb/McpLocalServer';
import type { McpRemoteServer as _exa_codeium_common_pb_McpRemoteServer, McpRemoteServer__Output as _exa_codeium_common_pb_McpRemoteServer__Output } from '../../exa/codeium_common_pb/McpRemoteServer';

export interface McpServerConfig {
  'serverId'?: (string);
  'local'?: (_exa_codeium_common_pb_McpLocalServer | null);
  'remote'?: (_exa_codeium_common_pb_McpRemoteServer | null);
  'configuration'?: "local"|"remote";
}

export interface McpServerConfig__Output {
  'serverId': (string);
  'local'?: (_exa_codeium_common_pb_McpLocalServer__Output | null);
  'remote'?: (_exa_codeium_common_pb_McpRemoteServer__Output | null);
  'configuration'?: "local"|"remote";
}
