// Original file: exa/cortex_pb/cortex.proto

import type { BrainEntryType as _exa_cortex_pb_BrainEntryType, BrainEntryType__Output as _exa_cortex_pb_BrainEntryType__Output } from '../../exa/cortex_pb/BrainEntryType';
import type { BrainEntryDelta as _exa_cortex_pb_BrainEntryDelta, BrainEntryDelta__Output as _exa_cortex_pb_BrainEntryDelta__Output } from '../../exa/cortex_pb/BrainEntryDelta';
import type { BrainUpdateTrigger as _exa_cortex_pb_BrainUpdateTrigger, BrainUpdateTrigger__Output as _exa_cortex_pb_BrainUpdateTrigger__Output } from '../../exa/cortex_pb/BrainUpdateTrigger';

export interface CortexStepBrainUpdate {
  'entryType'?: (_exa_cortex_pb_BrainEntryType);
  'deltas'?: (_exa_cortex_pb_BrainEntryDelta)[];
  'trigger'?: (_exa_cortex_pb_BrainUpdateTrigger);
  'target'?: "entryType";
}

export interface CortexStepBrainUpdate__Output {
  'entryType'?: (_exa_cortex_pb_BrainEntryType__Output);
  'deltas': (_exa_cortex_pb_BrainEntryDelta__Output)[];
  'trigger': (_exa_cortex_pb_BrainUpdateTrigger__Output);
  'target'?: "entryType";
}
