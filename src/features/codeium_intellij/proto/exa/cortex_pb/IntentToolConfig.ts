// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface IntentToolConfig {
  'intentModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'maxContextTokens'?: (number);
  'intentModelUid'?: (string);
}

export interface IntentToolConfig__Output {
  'intentModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'maxContextTokens': (number);
  'intentModelUid': (string);
}
