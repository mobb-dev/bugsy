// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface CustomRecipeConfig {
  'forceDisable'?: (boolean);
  'subagentModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'subagentModelUid'?: (string);
  '_forceDisable'?: "forceDisable";
}

export interface CustomRecipeConfig__Output {
  'forceDisable'?: (boolean);
  'subagentModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'subagentModelUid': (string);
  '_forceDisable'?: "forceDisable";
}
