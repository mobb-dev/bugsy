// Original file: exa/cortex_pb/cortex.proto

import type { HookExecutionSpec as _exa_cortex_pb_HookExecutionSpec, HookExecutionSpec__Output as _exa_cortex_pb_HookExecutionSpec__Output } from '../../exa/cortex_pb/HookExecutionSpec';
import type { HookCondition as _exa_cortex_pb_HookCondition, HookCondition__Output as _exa_cortex_pb_HookCondition__Output } from '../../exa/cortex_pb/HookCondition';

export interface CascadeHook {
  'hookSpec'?: (_exa_cortex_pb_HookExecutionSpec | null);
  'condition'?: (_exa_cortex_pb_HookCondition | null);
}

export interface CascadeHook__Output {
  'hookSpec': (_exa_cortex_pb_HookExecutionSpec__Output | null);
  'condition': (_exa_cortex_pb_HookCondition__Output | null);
}
