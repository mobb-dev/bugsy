// Original file: exa/cortex_pb/cortex.proto

import type { CodeStepCreationOptions as _exa_cortex_pb_CodeStepCreationOptions, CodeStepCreationOptions__Output as _exa_cortex_pb_CodeStepCreationOptions__Output } from '../../exa/cortex_pb/CodeStepCreationOptions';
import type { ViewFileStepCreationOptions as _exa_cortex_pb_ViewFileStepCreationOptions, ViewFileStepCreationOptions__Output as _exa_cortex_pb_ViewFileStepCreationOptions__Output } from '../../exa/cortex_pb/ViewFileStepCreationOptions';
import type { ViewedFileTrackerConfig as _exa_cortex_pb_ViewedFileTrackerConfig, ViewedFileTrackerConfig__Output as _exa_cortex_pb_ViewedFileTrackerConfig__Output } from '../../exa/cortex_pb/ViewedFileTrackerConfig';
import type { CortexStepType as _exa_cortex_pb_CortexStepType, CortexStepType__Output as _exa_cortex_pb_CortexStepType__Output } from '../../exa/cortex_pb/CortexStepType';
import type { UserGrepStepCreationOptions as _exa_cortex_pb_UserGrepStepCreationOptions, UserGrepStepCreationOptions__Output as _exa_cortex_pb_UserGrepStepCreationOptions__Output } from '../../exa/cortex_pb/UserGrepStepCreationOptions';
import type { RunCommandStepCreationOptions as _exa_cortex_pb_RunCommandStepCreationOptions, RunCommandStepCreationOptions__Output as _exa_cortex_pb_RunCommandStepCreationOptions__Output } from '../../exa/cortex_pb/RunCommandStepCreationOptions';
import type { LintDiffStepCreationOptions as _exa_cortex_pb_LintDiffStepCreationOptions, LintDiffStepCreationOptions__Output as _exa_cortex_pb_LintDiffStepCreationOptions__Output } from '../../exa/cortex_pb/LintDiffStepCreationOptions';
import type { BrainUpdateStepCreationOptions as _exa_cortex_pb_BrainUpdateStepCreationOptions, BrainUpdateStepCreationOptions__Output as _exa_cortex_pb_BrainUpdateStepCreationOptions__Output } from '../../exa/cortex_pb/BrainUpdateStepCreationOptions';

export interface SnapshotToStepsOptions {
  'codeStepCreationOptions'?: (_exa_cortex_pb_CodeStepCreationOptions | null);
  'viewFileStepCreationOptions'?: (_exa_cortex_pb_ViewFileStepCreationOptions | null);
  'viewedFileTrackerConfig'?: (_exa_cortex_pb_ViewedFileTrackerConfig | null);
  'stepTypeAllowList'?: (_exa_cortex_pb_CortexStepType)[];
  'userGrepStepCreationOptions'?: (_exa_cortex_pb_UserGrepStepCreationOptions | null);
  'runCommandStepCreationOptions'?: (_exa_cortex_pb_RunCommandStepCreationOptions | null);
  'lintDiffStepCreationOptions'?: (_exa_cortex_pb_LintDiffStepCreationOptions | null);
  'brainUpdateStepCreationOptions'?: (_exa_cortex_pb_BrainUpdateStepCreationOptions | null);
}

export interface SnapshotToStepsOptions__Output {
  'codeStepCreationOptions': (_exa_cortex_pb_CodeStepCreationOptions__Output | null);
  'viewFileStepCreationOptions': (_exa_cortex_pb_ViewFileStepCreationOptions__Output | null);
  'viewedFileTrackerConfig': (_exa_cortex_pb_ViewedFileTrackerConfig__Output | null);
  'stepTypeAllowList': (_exa_cortex_pb_CortexStepType__Output)[];
  'userGrepStepCreationOptions': (_exa_cortex_pb_UserGrepStepCreationOptions__Output | null);
  'runCommandStepCreationOptions': (_exa_cortex_pb_RunCommandStepCreationOptions__Output | null);
  'lintDiffStepCreationOptions': (_exa_cortex_pb_LintDiffStepCreationOptions__Output | null);
  'brainUpdateStepCreationOptions': (_exa_cortex_pb_BrainUpdateStepCreationOptions__Output | null);
}
