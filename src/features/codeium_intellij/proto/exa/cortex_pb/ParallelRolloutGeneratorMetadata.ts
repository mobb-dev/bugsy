// Original file: exa/cortex_pb/cortex.proto

import type { CortexStepTrajectoryChoice as _exa_cortex_pb_CortexStepTrajectoryChoice, CortexStepTrajectoryChoice__Output as _exa_cortex_pb_CortexStepTrajectoryChoice__Output } from '../../exa/cortex_pb/CortexStepTrajectoryChoice';

export interface ParallelRolloutGeneratorMetadata {
  'guideJudgementTrajectoryId'?: (string);
  'guideChoiceStep'?: (_exa_cortex_pb_CortexStepTrajectoryChoice | null);
}

export interface ParallelRolloutGeneratorMetadata__Output {
  'guideJudgementTrajectoryId': (string);
  'guideChoiceStep': (_exa_cortex_pb_CortexStepTrajectoryChoice__Output | null);
}
