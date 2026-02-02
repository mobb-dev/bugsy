// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ClientModelConfig as _exa_codeium_common_pb_ClientModelConfig, ClientModelConfig__Output as _exa_codeium_common_pb_ClientModelConfig__Output } from '../../exa/codeium_common_pb/ClientModelConfig';
import type { ClientModelSort as _exa_codeium_common_pb_ClientModelSort, ClientModelSort__Output as _exa_codeium_common_pb_ClientModelSort__Output } from '../../exa/codeium_common_pb/ClientModelSort';
import type { DefaultOverrideModelConfig as _exa_codeium_common_pb_DefaultOverrideModelConfig, DefaultOverrideModelConfig__Output as _exa_codeium_common_pb_DefaultOverrideModelConfig__Output } from '../../exa/codeium_common_pb/DefaultOverrideModelConfig';

export interface CascadeModelConfigData {
  'clientModelConfigs'?: (_exa_codeium_common_pb_ClientModelConfig)[];
  'clientModelSorts'?: (_exa_codeium_common_pb_ClientModelSort)[];
  'defaultOverrideModelConfig'?: (_exa_codeium_common_pb_DefaultOverrideModelConfig | null);
  '_defaultOverrideModelConfig'?: "defaultOverrideModelConfig";
}

export interface CascadeModelConfigData__Output {
  'clientModelConfigs': (_exa_codeium_common_pb_ClientModelConfig__Output)[];
  'clientModelSorts': (_exa_codeium_common_pb_ClientModelSort__Output)[];
  'defaultOverrideModelConfig'?: (_exa_codeium_common_pb_DefaultOverrideModelConfig__Output | null);
  '_defaultOverrideModelConfig'?: "defaultOverrideModelConfig";
}
