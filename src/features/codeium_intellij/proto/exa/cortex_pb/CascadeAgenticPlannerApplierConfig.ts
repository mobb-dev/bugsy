// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface CascadeAgenticPlannerApplierConfig {
  'enabled'?: (boolean);
  'modelDeprecated'?: (_exa_codeium_common_pb_Model);
  'numRollouts'?: (number);
  'judgeModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'modelUid'?: (string);
  'judgeModelUid'?: (string);
  '_enabled'?: "enabled";
}

export interface CascadeAgenticPlannerApplierConfig__Output {
  'enabled'?: (boolean);
  'modelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'numRollouts': (number);
  'judgeModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'modelUid': (string);
  'judgeModelUid': (string);
  '_enabled'?: "enabled";
}
