// Original file: exa/cortex_pb/cortex.proto

import type { RunExtensionCodeAutoRunDecision as _exa_cortex_pb_RunExtensionCodeAutoRunDecision, RunExtensionCodeAutoRunDecision__Output as _exa_cortex_pb_RunExtensionCodeAutoRunDecision__Output } from '../../exa/cortex_pb/RunExtensionCodeAutoRunDecision';

export interface CortexStepRunExtensionCode {
  'code'?: (string);
  'language'?: (string);
  'output'?: (string);
  'userRejected'?: (boolean);
  'autoRunDecision'?: (_exa_cortex_pb_RunExtensionCodeAutoRunDecision);
  'modelWantsAutoRun'?: (boolean);
  'userFacingExplanation'?: (string);
}

export interface CortexStepRunExtensionCode__Output {
  'code': (string);
  'language': (string);
  'output': (string);
  'userRejected': (boolean);
  'autoRunDecision': (_exa_cortex_pb_RunExtensionCodeAutoRunDecision__Output);
  'modelWantsAutoRun': (boolean);
  'userFacingExplanation': (string);
}
