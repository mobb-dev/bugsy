// Original file: exa/cortex_pb/cortex.proto

import type { CortexMemory as _exa_cortex_pb_CortexMemory, CortexMemory__Output as _exa_cortex_pb_CortexMemory__Output } from '../../exa/cortex_pb/CortexMemory';
import type { MemoryActionType as _exa_cortex_pb_MemoryActionType, MemoryActionType__Output as _exa_cortex_pb_MemoryActionType__Output } from '../../exa/cortex_pb/MemoryActionType';

export interface CortexStepMemory {
  'memoryId'?: (string);
  'memory'?: (_exa_cortex_pb_CortexMemory | null);
  'action'?: (_exa_cortex_pb_MemoryActionType);
  'prevMemory'?: (_exa_cortex_pb_CortexMemory | null);
}

export interface CortexStepMemory__Output {
  'memoryId': (string);
  'memory': (_exa_cortex_pb_CortexMemory__Output | null);
  'action': (_exa_cortex_pb_MemoryActionType__Output);
  'prevMemory': (_exa_cortex_pb_CortexMemory__Output | null);
}
