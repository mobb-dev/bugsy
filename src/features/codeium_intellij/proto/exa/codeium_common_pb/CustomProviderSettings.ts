// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ClientModelConfig as _exa_codeium_common_pb_ClientModelConfig, ClientModelConfig__Output as _exa_codeium_common_pb_ClientModelConfig__Output } from '../../exa/codeium_common_pb/ClientModelConfig';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface CustomProviderSettings {
  'customApiServerEndpoint'?: (string);
  'cascadeModelConfigs'?: (_exa_codeium_common_pb_ClientModelConfig)[];
  'commandModelConfigs'?: (_exa_codeium_common_pb_ClientModelConfig)[];
  'fallbackModel'?: (_exa_codeium_common_pb_Model);
}

export interface CustomProviderSettings__Output {
  'customApiServerEndpoint': (string);
  'cascadeModelConfigs': (_exa_codeium_common_pb_ClientModelConfig__Output)[];
  'commandModelConfigs': (_exa_codeium_common_pb_ClientModelConfig__Output)[];
  'fallbackModel': (_exa_codeium_common_pb_Model__Output);
}
