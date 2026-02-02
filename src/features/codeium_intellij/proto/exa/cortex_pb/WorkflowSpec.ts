// Original file: exa/cortex_pb/cortex.proto

import type { CortexMemoryScope as _exa_cortex_pb_CortexMemoryScope, CortexMemoryScope__Output as _exa_cortex_pb_CortexMemoryScope__Output } from '../../exa/cortex_pb/CortexMemoryScope';
import type { CascadeCommandsAutoExecution as _exa_codeium_common_pb_CascadeCommandsAutoExecution, CascadeCommandsAutoExecution__Output as _exa_codeium_common_pb_CascadeCommandsAutoExecution__Output } from '../../exa/codeium_common_pb/CascadeCommandsAutoExecution';

export interface WorkflowSpec {
  'path'?: (string);
  'name'?: (string);
  'description'?: (string);
  'content'?: (string);
  'isBuiltin'?: (boolean);
  'scope'?: (_exa_cortex_pb_CortexMemoryScope | null);
  'baseDir'?: (string);
  'executionMode'?: (_exa_codeium_common_pb_CascadeCommandsAutoExecution);
  'isOverridden'?: (boolean);
}

export interface WorkflowSpec__Output {
  'path': (string);
  'name': (string);
  'description': (string);
  'content': (string);
  'isBuiltin': (boolean);
  'scope': (_exa_cortex_pb_CortexMemoryScope__Output | null);
  'baseDir': (string);
  'executionMode': (_exa_codeium_common_pb_CascadeCommandsAutoExecution__Output);
  'isOverridden': (boolean);
}
