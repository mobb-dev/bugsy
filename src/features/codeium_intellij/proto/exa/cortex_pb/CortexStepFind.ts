// Original file: exa/cortex_pb/cortex.proto

import type { FindResultType as _exa_cortex_pb_FindResultType, FindResultType__Output as _exa_cortex_pb_FindResultType__Output } from '../../exa/cortex_pb/FindResultType';

export interface CortexStepFind {
  'pattern'?: (string);
  'includes'?: (string)[];
  'excludes'?: (string)[];
  'type'?: (_exa_cortex_pb_FindResultType);
  'maxDepth'?: (number);
  'totalResults'?: (number);
  'findError'?: (string);
  'commandRun'?: (string);
  'searchDirectory'?: (string);
  'rawOutput'?: (string);
  'extensions'?: (string)[];
  'fullPath'?: (boolean);
  'truncatedOutput'?: (string);
  'truncatedTotalResults'?: (number);
}

export interface CortexStepFind__Output {
  'pattern': (string);
  'includes': (string)[];
  'excludes': (string)[];
  'type': (_exa_cortex_pb_FindResultType__Output);
  'maxDepth': (number);
  'totalResults': (number);
  'findError': (string);
  'commandRun': (string);
  'searchDirectory': (string);
  'rawOutput': (string);
  'extensions': (string)[];
  'fullPath': (boolean);
  'truncatedOutput': (string);
  'truncatedTotalResults': (number);
}
