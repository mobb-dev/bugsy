// Original file: exa/cortex_pb/cortex.proto

import type { CortexErrorDetails as _exa_cortex_pb_CortexErrorDetails, CortexErrorDetails__Output as _exa_cortex_pb_CortexErrorDetails__Output } from '../../exa/cortex_pb/CortexErrorDetails';

export interface CortexStepErrorMessage {
  'error'?: (_exa_cortex_pb_CortexErrorDetails | null);
  'shouldShowModel'?: (boolean);
  'shouldShowUser'?: (boolean);
}

export interface CortexStepErrorMessage__Output {
  'error': (_exa_cortex_pb_CortexErrorDetails__Output | null);
  'shouldShowModel': (boolean);
  'shouldShowUser': (boolean);
}
