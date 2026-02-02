// Original file: exa/cortex_pb/cortex.proto

import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface ParallelRolloutConfig {
  'numParallelRollouts'?: (number);
  'maxInvocationsPerRollout'?: (number);
  'guideModelDeprecated'?: (_exa_codeium_common_pb_Model);
  'maxGuideInvocations'?: (number);
  'forceBadRollout'?: (boolean);
  'guideModelUid'?: (string);
}

export interface ParallelRolloutConfig__Output {
  'numParallelRollouts': (number);
  'maxInvocationsPerRollout': (number);
  'guideModelDeprecated': (_exa_codeium_common_pb_Model__Output);
  'maxGuideInvocations': (number);
  'forceBadRollout': (boolean);
  'guideModelUid': (string);
}
