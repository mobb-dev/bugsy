// Original file: exa/cortex_pb/cortex.proto

import type { CommandTiming as _exa_cortex_pb_CommandTiming, CommandTiming__Output as _exa_cortex_pb_CommandTiming__Output } from '../../exa/cortex_pb/CommandTiming';

export interface TurnTiming {
  'modelLatencySecs'?: (number | string);
  'toolCallParseDurationSecs'?: (number | string);
  'commandBuildDurationSecs'?: (number | string);
  'toolExecDurationSecs'?: (number | string);
  'commands'?: (_exa_cortex_pb_CommandTiming)[];
}

export interface TurnTiming__Output {
  'modelLatencySecs': (number);
  'toolCallParseDurationSecs': (number);
  'commandBuildDurationSecs': (number);
  'toolExecDurationSecs': (number);
  'commands': (_exa_cortex_pb_CommandTiming__Output)[];
}
