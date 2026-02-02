// Original file: exa/cortex_pb/cortex.proto

import type { ChatNodeConfig as _exa_codeium_common_pb_ChatNodeConfig, ChatNodeConfig__Output as _exa_codeium_common_pb_ChatNodeConfig__Output } from '../../exa/codeium_common_pb/ChatNodeConfig';

export interface CortexPlanConfig {
  'modelConfig'?: (_exa_codeium_common_pb_ChatNodeConfig | null);
  'maxNominalContinuations'?: (number);
  'maxErrorContinuations'?: (number);
}

export interface CortexPlanConfig__Output {
  'modelConfig': (_exa_codeium_common_pb_ChatNodeConfig__Output | null);
  'maxNominalContinuations': (number);
  'maxErrorContinuations': (number);
}
