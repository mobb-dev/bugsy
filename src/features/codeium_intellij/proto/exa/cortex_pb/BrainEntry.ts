// Original file: exa/cortex_pb/cortex.proto

import type { BrainEntryType as _exa_cortex_pb_BrainEntryType, BrainEntryType__Output as _exa_cortex_pb_BrainEntryType__Output } from '../../exa/cortex_pb/BrainEntryType';

export interface BrainEntry {
  'id'?: (string);
  'type'?: (_exa_cortex_pb_BrainEntryType);
  'content'?: (string);
}

export interface BrainEntry__Output {
  'id': (string);
  'type': (_exa_cortex_pb_BrainEntryType__Output);
  'content': (string);
}
