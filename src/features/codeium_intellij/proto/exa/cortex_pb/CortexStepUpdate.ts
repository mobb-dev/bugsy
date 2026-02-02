// Original file: exa/cortex_pb/cortex.proto

import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from '../../exa/cortex_pb/CortexTrajectoryStep';
import type { CortexStepStatus as _exa_cortex_pb_CortexStepStatus, CortexStepStatus__Output as _exa_cortex_pb_CortexStepStatus__Output } from '../../exa/cortex_pb/CortexStepStatus';
import type { UserStepAnnotations as _exa_cortex_pb_UserStepAnnotations, UserStepAnnotations__Output as _exa_cortex_pb_UserStepAnnotations__Output } from '../../exa/cortex_pb/UserStepAnnotations';

export interface CortexStepUpdate {
  'stepIndex'?: (number);
  'step'?: (_exa_cortex_pb_CortexTrajectoryStep | null);
  'status'?: (_exa_cortex_pb_CortexStepStatus);
  'userAnnotations'?: (_exa_cortex_pb_UserStepAnnotations | null);
}

export interface CortexStepUpdate__Output {
  'stepIndex': (number);
  'step': (_exa_cortex_pb_CortexTrajectoryStep__Output | null);
  'status': (_exa_cortex_pb_CortexStepStatus__Output);
  'userAnnotations': (_exa_cortex_pb_UserStepAnnotations__Output | null);
}
