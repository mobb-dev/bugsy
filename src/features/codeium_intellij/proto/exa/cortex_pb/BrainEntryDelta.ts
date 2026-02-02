// Original file: exa/cortex_pb/cortex.proto

import type { BrainEntry as _exa_cortex_pb_BrainEntry, BrainEntry__Output as _exa_cortex_pb_BrainEntry__Output } from '../../exa/cortex_pb/BrainEntry';
import type { BrainEntryDeltaSummary as _exa_cortex_pb_BrainEntryDeltaSummary, BrainEntryDeltaSummary__Output as _exa_cortex_pb_BrainEntryDeltaSummary__Output } from '../../exa/cortex_pb/BrainEntryDeltaSummary';

export interface BrainEntryDelta {
  'before'?: (_exa_cortex_pb_BrainEntry | null);
  'after'?: (_exa_cortex_pb_BrainEntry | null);
  'absolutePathUri'?: (string);
  'summary'?: (_exa_cortex_pb_BrainEntryDeltaSummary | null);
}

export interface BrainEntryDelta__Output {
  'before': (_exa_cortex_pb_BrainEntry__Output | null);
  'after': (_exa_cortex_pb_BrainEntry__Output | null);
  'absolutePathUri': (string);
  'summary': (_exa_cortex_pb_BrainEntryDeltaSummary__Output | null);
}
