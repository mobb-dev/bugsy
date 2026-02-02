// Original file: exa/cortex_pb/cortex.proto

import type { CortexMemory as _exa_cortex_pb_CortexMemory, CortexMemory__Output as _exa_cortex_pb_CortexMemory__Output } from '../../exa/cortex_pb/CortexMemory';

export interface CortexStepRetrieveMemory {
  'runSubagent'?: (boolean);
  'cascadeMemorySummary'?: (string);
  'userMemorySummary'?: (string);
  'reason'?: (string);
  'showReason'?: (boolean);
  'retrievedMemories'?: (_exa_cortex_pb_CortexMemory)[];
  'blocking'?: (boolean);
  'addUserMemories'?: (boolean);
  'autoCascadeMemorySummary'?: (string);
  'addAutoCascadeMemories'?: (boolean);
}

export interface CortexStepRetrieveMemory__Output {
  'runSubagent': (boolean);
  'cascadeMemorySummary': (string);
  'userMemorySummary': (string);
  'reason': (string);
  'showReason': (boolean);
  'retrievedMemories': (_exa_cortex_pb_CortexMemory__Output)[];
  'blocking': (boolean);
  'addUserMemories': (boolean);
  'autoCascadeMemorySummary': (string);
  'addAutoCascadeMemories': (boolean);
}
