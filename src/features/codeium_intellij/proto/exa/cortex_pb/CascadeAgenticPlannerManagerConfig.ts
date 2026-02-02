// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface CascadeAgenticPlannerManagerConfig {
  'enabled'?: (boolean);
  'modelDeprecated'?: (_exa_codeium_common_pb_Model);
  'condenseMessages'?: (boolean);
  'sendOnlyUserMessages'?: (boolean);
  'modelUid'?: (string);
  '_enabled'?: "enabled";
  '_condenseMessages'?: "condenseMessages";
  '_sendOnlyUserMessages'?: "sendOnlyUserMessages";
}

export interface CascadeAgenticPlannerManagerConfig__Output {
  'enabled'?: (boolean);
  'modelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'condenseMessages'?: (boolean);
  'sendOnlyUserMessages'?: (boolean);
  'modelUid': (string);
  '_enabled'?: "enabled";
  '_condenseMessages'?: "condenseMessages";
  '_sendOnlyUserMessages'?: "sendOnlyUserMessages";
}
