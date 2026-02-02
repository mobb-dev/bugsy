// Original file: exa/cortex_pb/cortex.proto

import type { AcknowledgementType as _exa_cortex_pb_AcknowledgementType, AcknowledgementType__Output as _exa_cortex_pb_AcknowledgementType__Output } from '../../exa/cortex_pb/AcknowledgementType';
import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from '../../exa/codeium_common_pb/CodeDiagnostic';
import type { UnifiedDiff as _exa_diff_action_pb_UnifiedDiff, UnifiedDiff__Output as _exa_diff_action_pb_UnifiedDiff__Output } from '../../exa/diff_action_pb/UnifiedDiff';

// Original file: exa/cortex_pb/cortex.proto

export const _exa_cortex_pb_CortexStepEditNotebook_EditMode = {
  EDIT_MODE_UNSPECIFIED: 'EDIT_MODE_UNSPECIFIED',
  EDIT_MODE_REPLACE: 'EDIT_MODE_REPLACE',
  EDIT_MODE_INSERT: 'EDIT_MODE_INSERT',
  EDIT_MODE_DELETE: 'EDIT_MODE_DELETE',
} as const;

export type _exa_cortex_pb_CortexStepEditNotebook_EditMode =
  | 'EDIT_MODE_UNSPECIFIED'
  | 0
  | 'EDIT_MODE_REPLACE'
  | 1
  | 'EDIT_MODE_INSERT'
  | 2
  | 'EDIT_MODE_DELETE'
  | 3

export type _exa_cortex_pb_CortexStepEditNotebook_EditMode__Output = typeof _exa_cortex_pb_CortexStepEditNotebook_EditMode[keyof typeof _exa_cortex_pb_CortexStepEditNotebook_EditMode]

export interface CortexStepEditNotebook {
  'absolutePathUri'?: (string);
  'cellNumber'?: (number);
  'newSource'?: (string);
  'cellType'?: (string);
  'editMode'?: (_exa_cortex_pb_CortexStepEditNotebook_EditMode);
  'cellId'?: (string);
  'originalContent'?: (string);
  'newContent'?: (string);
  'acknowledgementType'?: (_exa_cortex_pb_AcknowledgementType);
  'triggeredMemories'?: (string);
  'lintErrors'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'persistentLintErrors'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'cellDiff'?: (_exa_diff_action_pb_UnifiedDiff | null);
}

export interface CortexStepEditNotebook__Output {
  'absolutePathUri': (string);
  'cellNumber': (number);
  'newSource': (string);
  'cellType': (string);
  'editMode': (_exa_cortex_pb_CortexStepEditNotebook_EditMode__Output);
  'cellId': (string);
  'originalContent': (string);
  'newContent': (string);
  'acknowledgementType': (_exa_cortex_pb_AcknowledgementType__Output);
  'triggeredMemories': (string);
  'lintErrors': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'persistentLintErrors': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'cellDiff': (_exa_diff_action_pb_UnifiedDiff__Output | null);
}
