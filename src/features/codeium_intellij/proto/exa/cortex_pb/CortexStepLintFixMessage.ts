// Original file: exa/cortex_pb/cortex.proto

import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from '../../exa/codeium_common_pb/CodeDiagnostic';

export interface CortexStepLintFixMessage {
  'lintErrors'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'persistentLintErrors'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
}

export interface CortexStepLintFixMessage__Output {
  'lintErrors': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'persistentLintErrors': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
}
