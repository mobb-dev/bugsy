// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface CheckpointConfig {
  'tokenThreshold'?: (number);
  'maxOverheadRatio'?: (number | string);
  'movingWindowSize'?: (number);
  'maxTokenLimit'?: (number);
  'enabled'?: (boolean);
  'checkpointModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'maxOutputTokens'?: (number);
  'maxPlanSearchSteps'?: (number);
  'checkpointModelFallbackDeprecated'?: (_exa_codeium_common_pb_Model);
  'checkpointModelUid'?: (string);
  'checkpointModelFallbackUid'?: (string);
  '_enabled'?: "enabled";
}

export interface CheckpointConfig__Output {
  'tokenThreshold': (number);
  'maxOverheadRatio': (number);
  'movingWindowSize': (number);
  'maxTokenLimit': (number);
  'enabled'?: (boolean);
  'checkpointModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'maxOutputTokens': (number);
  'maxPlanSearchSteps': (number);
  'checkpointModelFallbackDeprecated': (_exa_codeium_common_pb_Model__Output);
  'checkpointModelUid': (string);
  'checkpointModelFallbackUid': (string);
  '_enabled'?: "enabled";
}
