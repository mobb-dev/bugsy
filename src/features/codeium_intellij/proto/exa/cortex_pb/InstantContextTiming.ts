// Original file: exa/cortex_pb/cortex.proto

import type { TurnTiming as _exa_cortex_pb_TurnTiming, TurnTiming__Output as _exa_cortex_pb_TurnTiming__Output } from '../../exa/cortex_pb/TurnTiming';

export interface InstantContextTiming {
  'totalDurationSecs'?: (number | string);
  'answerParseDurationSecs'?: (number | string);
  'turns'?: (_exa_cortex_pb_TurnTiming)[];
}

export interface InstantContextTiming__Output {
  'totalDurationSecs': (number);
  'answerParseDurationSecs': (number);
  'turns': (_exa_cortex_pb_TurnTiming__Output)[];
}
