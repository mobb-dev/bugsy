// Original file: exa/cortex_pb/cortex.proto

import type { LineRangeList as _exa_cortex_pb_LineRangeList, LineRangeList__Output as _exa_cortex_pb_LineRangeList__Output } from '../../exa/cortex_pb/LineRangeList';
import type { InstantContextTiming as _exa_cortex_pb_InstantContextTiming, InstantContextTiming__Output as _exa_cortex_pb_InstantContextTiming__Output } from '../../exa/cortex_pb/InstantContextTiming';

export interface InstantContextResponse {
  'rangeMap'?: ({[key: string]: _exa_cortex_pb_LineRangeList});
  'deprecatedDurationField_2'?: (number | string);
  'duration'?: (number | string);
  'rawRangeMap'?: ({[key: string]: _exa_cortex_pb_LineRangeList});
  'timing'?: (_exa_cortex_pb_InstantContextTiming | null);
}

export interface InstantContextResponse__Output {
  'rangeMap': ({[key: string]: _exa_cortex_pb_LineRangeList__Output});
  'deprecatedDurationField_2': (number);
  'duration': (number);
  'rawRangeMap': ({[key: string]: _exa_cortex_pb_LineRangeList__Output});
  'timing': (_exa_cortex_pb_InstantContextTiming__Output | null);
}
