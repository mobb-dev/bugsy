// Original file: exa/cortex_pb/cortex.proto

import type { PlanInput as _exa_cortex_pb_PlanInput, PlanInput__Output as _exa_cortex_pb_PlanInput__Output } from '../../exa/cortex_pb/PlanInput';

export interface CortexStepGitCommit {
  'input'?: (_exa_cortex_pb_PlanInput | null);
  'commitMessage'?: (string);
  'commitHash'?: (string);
}

export interface CortexStepGitCommit__Output {
  'input': (_exa_cortex_pb_PlanInput__Output | null);
  'commitMessage': (string);
  'commitHash': (string);
}
