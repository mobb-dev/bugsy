// Original file: exa/cortex_pb/cortex.proto

import type { InformPlannerMode as _exa_cortex_pb_InformPlannerMode, InformPlannerMode__Output as _exa_cortex_pb_InformPlannerMode__Output } from '../../exa/cortex_pb/InformPlannerMode';

export interface InformPlannerConfig {
  'cciRatio'?: (number | string);
  'randomize'?: (boolean);
  'manualSeed'?: (number);
  'mode'?: (_exa_cortex_pb_InformPlannerMode);
  'isCertain'?: (boolean);
}

export interface InformPlannerConfig__Output {
  'cciRatio': (number);
  'randomize': (boolean);
  'manualSeed': (number);
  'mode': (_exa_cortex_pb_InformPlannerMode__Output);
  'isCertain': (boolean);
}
