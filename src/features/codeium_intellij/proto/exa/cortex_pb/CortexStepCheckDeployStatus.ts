// Original file: exa/cortex_pb/cortex.proto

import type { WindsurfDeployment as _exa_codeium_common_pb_WindsurfDeployment, WindsurfDeployment__Output as _exa_codeium_common_pb_WindsurfDeployment__Output } from '../../exa/codeium_common_pb/WindsurfDeployment';
import type { DeploymentBuildStatus as _exa_codeium_common_pb_DeploymentBuildStatus, DeploymentBuildStatus__Output as _exa_codeium_common_pb_DeploymentBuildStatus__Output } from '../../exa/codeium_common_pb/DeploymentBuildStatus';

export interface CortexStepCheckDeployStatus {
  'windsurfDeploymentId'?: (string);
  'deployment'?: (_exa_codeium_common_pb_WindsurfDeployment | null);
  'buildStatus'?: (_exa_codeium_common_pb_DeploymentBuildStatus);
  'buildError'?: (string);
  'buildLogs'?: (string);
  'isClaimed'?: (boolean);
  'claimUrl'?: (string);
}

export interface CortexStepCheckDeployStatus__Output {
  'windsurfDeploymentId': (string);
  'deployment': (_exa_codeium_common_pb_WindsurfDeployment__Output | null);
  'buildStatus': (_exa_codeium_common_pb_DeploymentBuildStatus__Output);
  'buildError': (string);
  'buildLogs': (string);
  'isClaimed': (boolean);
  'claimUrl': (string);
}
