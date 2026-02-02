// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface LifeguardModeConfig {
  'enabled'?: (boolean);
  'model'?: (_exa_codeium_common_pb_Model);
  'modelDisplayName'?: (string);
  'agentVersion'?: (string);
}

export interface LifeguardModeConfig__Output {
  'enabled': (boolean);
  'model': (_exa_codeium_common_pb_Model__Output);
  'modelDisplayName': (string);
  'agentVersion': (string);
}
