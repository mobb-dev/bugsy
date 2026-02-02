// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ModelOrAlias as _exa_codeium_common_pb_ModelOrAlias, ModelOrAlias__Output as _exa_codeium_common_pb_ModelOrAlias__Output } from '../../exa/codeium_common_pb/ModelOrAlias';

export interface AllowedModelConfig {
  'modelOrAlias'?: (_exa_codeium_common_pb_ModelOrAlias | null);
  'creditMultiplier'?: (number | string);
}

export interface AllowedModelConfig__Output {
  'modelOrAlias': (_exa_codeium_common_pb_ModelOrAlias__Output | null);
  'creditMultiplier': (number);
}
