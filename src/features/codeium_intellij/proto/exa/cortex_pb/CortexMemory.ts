// Original file: exa/cortex_pb/cortex.proto

import type { CortexMemoryMetadata as _exa_cortex_pb_CortexMemoryMetadata, CortexMemoryMetadata__Output as _exa_cortex_pb_CortexMemoryMetadata__Output } from '../../exa/cortex_pb/CortexMemoryMetadata';
import type { CortexMemorySource as _exa_cortex_pb_CortexMemorySource, CortexMemorySource__Output as _exa_cortex_pb_CortexMemorySource__Output } from '../../exa/cortex_pb/CortexMemorySource';
import type { CortexMemoryScope as _exa_cortex_pb_CortexMemoryScope, CortexMemoryScope__Output as _exa_cortex_pb_CortexMemoryScope__Output } from '../../exa/cortex_pb/CortexMemoryScope';
import type { CortexMemoryText as _exa_cortex_pb_CortexMemoryText, CortexMemoryText__Output as _exa_cortex_pb_CortexMemoryText__Output } from '../../exa/cortex_pb/CortexMemoryText';

export interface CortexMemory {
  'memoryId'?: (string);
  'metadata'?: (_exa_cortex_pb_CortexMemoryMetadata | null);
  'source'?: (_exa_cortex_pb_CortexMemorySource);
  'scope'?: (_exa_cortex_pb_CortexMemoryScope | null);
  'textMemory'?: (_exa_cortex_pb_CortexMemoryText | null);
  'title'?: (string);
  'memory'?: "textMemory";
}

export interface CortexMemory__Output {
  'memoryId': (string);
  'metadata': (_exa_cortex_pb_CortexMemoryMetadata__Output | null);
  'source': (_exa_cortex_pb_CortexMemorySource__Output);
  'scope': (_exa_cortex_pb_CortexMemoryScope__Output | null);
  'textMemory'?: (_exa_cortex_pb_CortexMemoryText__Output | null);
  'title': (string);
  'memory'?: "textMemory";
}
