// Original file: exa/cortex_pb/cortex.proto

import type { McpResource as _exa_cortex_pb_McpResource, McpResource__Output as _exa_cortex_pb_McpResource__Output } from '../../exa/cortex_pb/McpResource';

export interface CortexStepListResources {
  'serverName'?: (string);
  'cursor'?: (string);
  'resources'?: (_exa_cortex_pb_McpResource)[];
  'nextCursor'?: (string);
  '_cursor'?: "cursor";
}

export interface CortexStepListResources__Output {
  'serverName': (string);
  'cursor'?: (string);
  'resources': (_exa_cortex_pb_McpResource__Output)[];
  'nextCursor': (string);
  '_cursor'?: "cursor";
}
