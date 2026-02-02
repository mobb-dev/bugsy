// Original file: exa/cortex_pb/cortex.proto

import type { McpResourceContent as _exa_cortex_pb_McpResourceContent, McpResourceContent__Output as _exa_cortex_pb_McpResourceContent__Output } from '../../exa/cortex_pb/McpResourceContent';

export interface CortexStepReadResource {
  'serverName'?: (string);
  'uri'?: (string);
  'contents'?: (_exa_cortex_pb_McpResourceContent)[];
  'skippedNonImageBinaryContent'?: (boolean);
}

export interface CortexStepReadResource__Output {
  'serverName': (string);
  'uri': (string);
  'contents': (_exa_cortex_pb_McpResourceContent__Output)[];
  'skippedNonImageBinaryContent': (boolean);
}
