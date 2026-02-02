// Original file: exa/cortex_pb/cortex.proto

import type { LintDiffType as _exa_cortex_pb_LintDiffType, LintDiffType__Output as _exa_cortex_pb_LintDiffType__Output } from '../../exa/cortex_pb/LintDiffType';
import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from '../../exa/codeium_common_pb/CodeDiagnostic';

export interface CortexStepLintDiff {
  'type'?: (_exa_cortex_pb_LintDiffType);
  'lint'?: (_exa_codeium_common_pb_CodeDiagnostic | null);
}

export interface CortexStepLintDiff__Output {
  'type': (_exa_cortex_pb_LintDiffType__Output);
  'lint': (_exa_codeium_common_pb_CodeDiagnostic__Output | null);
}
