// Original file: exa/cortex_pb/cortex.proto

import type { ActionSpec as _exa_cortex_pb_ActionSpec, ActionSpec__Output as _exa_cortex_pb_ActionSpec__Output } from '../../exa/cortex_pb/ActionSpec';
import type { ActionResult as _exa_cortex_pb_ActionResult, ActionResult__Output as _exa_cortex_pb_ActionResult__Output } from '../../exa/cortex_pb/ActionResult';
import type { AcknowledgementType as _exa_cortex_pb_AcknowledgementType, AcknowledgementType__Output as _exa_cortex_pb_AcknowledgementType__Output } from '../../exa/cortex_pb/AcknowledgementType';
import type { CodeHeuristicFailure as _exa_cortex_pb_CodeHeuristicFailure, CodeHeuristicFailure__Output as _exa_cortex_pb_CodeHeuristicFailure__Output } from '../../exa/cortex_pb/CodeHeuristicFailure';
import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from '../../exa/codeium_common_pb/CodeDiagnostic';
import type { ReplacementChunkInfo as _exa_cortex_pb_ReplacementChunkInfo, ReplacementChunkInfo__Output as _exa_cortex_pb_ReplacementChunkInfo__Output } from '../../exa/cortex_pb/ReplacementChunkInfo';
import type { FastApplyFallbackInfo as _exa_cortex_pb_FastApplyFallbackInfo, FastApplyFallbackInfo__Output as _exa_cortex_pb_FastApplyFallbackInfo__Output } from '../../exa/cortex_pb/FastApplyFallbackInfo';
import type { CortexStepCompileDiagnostic as _exa_cortex_pb_CortexStepCompileDiagnostic, CortexStepCompileDiagnostic__Output as _exa_cortex_pb_CortexStepCompileDiagnostic__Output } from '../../exa/cortex_pb/CortexStepCompileDiagnostic';
import type { BrainEntryDelta as _exa_cortex_pb_BrainEntryDelta, BrainEntryDelta__Output as _exa_cortex_pb_BrainEntryDelta__Output } from '../../exa/cortex_pb/BrainEntryDelta';
import type { CortexTrajectoryType as _exa_cortex_pb_CortexTrajectoryType, CortexTrajectoryType__Output as _exa_cortex_pb_CortexTrajectoryType__Output } from '../../exa/cortex_pb/CortexTrajectoryType';

export interface CortexStepCodeAction {
  'actionSpec'?: (_exa_cortex_pb_ActionSpec | null);
  'actionResult'?: (_exa_cortex_pb_ActionResult | null);
  'useFastApply'?: (boolean);
  'acknowledgementType'?: (_exa_cortex_pb_AcknowledgementType);
  'blocking'?: (boolean);
  'heuristicFailure'?: (_exa_cortex_pb_CodeHeuristicFailure);
  'codeInstruction'?: (string);
  'markdownLanguage'?: (string);
  'dryRun'?: (boolean);
  'lintErrors'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'persistentLintErrors'?: (_exa_codeium_common_pb_CodeDiagnostic)[];
  'replacementInfos'?: (_exa_cortex_pb_ReplacementChunkInfo)[];
  'lintErrorIdsAimingToFix'?: (string)[];
  'fastApplyFallbackInfo'?: (_exa_cortex_pb_FastApplyFallbackInfo | null);
  'targetFileHasCarriageReturns'?: (boolean);
  'targetFileHasAllCarriageReturns'?: (boolean);
  'introducedErrors'?: (_exa_cortex_pb_CortexStepCompileDiagnostic)[];
  'triggeredMemories'?: (string);
  'brainDelta'?: (_exa_cortex_pb_BrainEntryDelta | null);
  'trajectoryType'?: (_exa_cortex_pb_CortexTrajectoryType);
}

export interface CortexStepCodeAction__Output {
  'actionSpec': (_exa_cortex_pb_ActionSpec__Output | null);
  'actionResult': (_exa_cortex_pb_ActionResult__Output | null);
  'useFastApply': (boolean);
  'acknowledgementType': (_exa_cortex_pb_AcknowledgementType__Output);
  'blocking': (boolean);
  'heuristicFailure': (_exa_cortex_pb_CodeHeuristicFailure__Output);
  'codeInstruction': (string);
  'markdownLanguage': (string);
  'dryRun': (boolean);
  'lintErrors': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'persistentLintErrors': (_exa_codeium_common_pb_CodeDiagnostic__Output)[];
  'replacementInfos': (_exa_cortex_pb_ReplacementChunkInfo__Output)[];
  'lintErrorIdsAimingToFix': (string)[];
  'fastApplyFallbackInfo': (_exa_cortex_pb_FastApplyFallbackInfo__Output | null);
  'targetFileHasCarriageReturns': (boolean);
  'targetFileHasAllCarriageReturns': (boolean);
  'introducedErrors': (_exa_cortex_pb_CortexStepCompileDiagnostic__Output)[];
  'triggeredMemories': (string);
  'brainDelta': (_exa_cortex_pb_BrainEntryDelta__Output | null);
  'trajectoryType': (_exa_cortex_pb_CortexTrajectoryType__Output);
}
