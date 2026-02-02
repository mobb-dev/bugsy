// Original file: exa/cortex_pb/cortex.proto

import type { InstantContextToolCall as _exa_cortex_pb_InstantContextToolCall, InstantContextToolCall__Output as _exa_cortex_pb_InstantContextToolCall__Output } from '../../exa/cortex_pb/InstantContextToolCall';

export interface InstantContextStep {
  'toolCalls'?: (_exa_cortex_pb_InstantContextToolCall)[];
  'thoughts'?: (string);
}

export interface InstantContextStep__Output {
  'toolCalls': (_exa_cortex_pb_InstantContextToolCall__Output)[];
  'thoughts': (string);
}
