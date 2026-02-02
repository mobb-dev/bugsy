// Original file: exa/cortex_pb/cortex.proto

import type { CommandHookSpec as _exa_cortex_pb_CommandHookSpec, CommandHookSpec__Output as _exa_cortex_pb_CommandHookSpec__Output } from '../../exa/cortex_pb/CommandHookSpec';

export interface HookExecutionSpec {
  'command'?: (_exa_cortex_pb_CommandHookSpec | null);
  'hook'?: "command";
}

export interface HookExecutionSpec__Output {
  'command'?: (_exa_cortex_pb_CommandHookSpec__Output | null);
  'hook'?: "command";
}
