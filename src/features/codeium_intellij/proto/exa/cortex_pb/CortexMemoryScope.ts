// Original file: exa/cortex_pb/cortex.proto

import type { CortexMemoryGlobalScope as _exa_cortex_pb_CortexMemoryGlobalScope, CortexMemoryGlobalScope__Output as _exa_cortex_pb_CortexMemoryGlobalScope__Output } from '../../exa/cortex_pb/CortexMemoryGlobalScope';
import type { CortexMemoryLocalScope as _exa_cortex_pb_CortexMemoryLocalScope, CortexMemoryLocalScope__Output as _exa_cortex_pb_CortexMemoryLocalScope__Output } from '../../exa/cortex_pb/CortexMemoryLocalScope';
import type { CortexMemoryAllScope as _exa_cortex_pb_CortexMemoryAllScope, CortexMemoryAllScope__Output as _exa_cortex_pb_CortexMemoryAllScope__Output } from '../../exa/cortex_pb/CortexMemoryAllScope';
import type { CortexMemoryProjectScope as _exa_cortex_pb_CortexMemoryProjectScope, CortexMemoryProjectScope__Output as _exa_cortex_pb_CortexMemoryProjectScope__Output } from '../../exa/cortex_pb/CortexMemoryProjectScope';
import type { CortexMemorySystemScope as _exa_cortex_pb_CortexMemorySystemScope, CortexMemorySystemScope__Output as _exa_cortex_pb_CortexMemorySystemScope__Output } from '../../exa/cortex_pb/CortexMemorySystemScope';

export interface CortexMemoryScope {
  'globalScope'?: (_exa_cortex_pb_CortexMemoryGlobalScope | null);
  'localScope'?: (_exa_cortex_pb_CortexMemoryLocalScope | null);
  'allScope'?: (_exa_cortex_pb_CortexMemoryAllScope | null);
  'projectScope'?: (_exa_cortex_pb_CortexMemoryProjectScope | null);
  'systemScope'?: (_exa_cortex_pb_CortexMemorySystemScope | null);
  'scope'?: "globalScope"|"localScope"|"allScope"|"projectScope"|"systemScope";
}

export interface CortexMemoryScope__Output {
  'globalScope'?: (_exa_cortex_pb_CortexMemoryGlobalScope__Output | null);
  'localScope'?: (_exa_cortex_pb_CortexMemoryLocalScope__Output | null);
  'allScope'?: (_exa_cortex_pb_CortexMemoryAllScope__Output | null);
  'projectScope'?: (_exa_cortex_pb_CortexMemoryProjectScope__Output | null);
  'systemScope'?: (_exa_cortex_pb_CortexMemorySystemScope__Output | null);
  'scope'?: "globalScope"|"localScope"|"allScope"|"projectScope"|"systemScope";
}
