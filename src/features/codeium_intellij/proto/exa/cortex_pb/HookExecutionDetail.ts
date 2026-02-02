// Original file: exa/cortex_pb/cortex.proto

import type { HookExecutionSpec as _exa_cortex_pb_HookExecutionSpec, HookExecutionSpec__Output as _exa_cortex_pb_HookExecutionSpec__Output } from '../../exa/cortex_pb/HookExecutionSpec';
import type { HookExecutionResult as _exa_cortex_pb_HookExecutionResult, HookExecutionResult__Output as _exa_cortex_pb_HookExecutionResult__Output } from '../../exa/cortex_pb/HookExecutionResult';

export interface HookExecutionDetail {
  'spec'?: (_exa_cortex_pb_HookExecutionSpec | null);
  'result'?: (_exa_cortex_pb_HookExecutionResult | null);
}

export interface HookExecutionDetail__Output {
  'spec': (_exa_cortex_pb_HookExecutionSpec__Output | null);
  'result': (_exa_cortex_pb_HookExecutionResult__Output | null);
}
