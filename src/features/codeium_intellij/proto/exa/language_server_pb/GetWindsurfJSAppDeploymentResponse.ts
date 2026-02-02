// Original file: exa/language_server_pb/language_server.proto

import type { WindsurfDeployment as _exa_codeium_common_pb_WindsurfDeployment, WindsurfDeployment__Output as _exa_codeium_common_pb_WindsurfDeployment__Output } from '../../exa/codeium_common_pb/WindsurfDeployment';
import type { DeploymentBuildStatus as _exa_codeium_common_pb_DeploymentBuildStatus, DeploymentBuildStatus__Output as _exa_codeium_common_pb_DeploymentBuildStatus__Output } from '../../exa/codeium_common_pb/DeploymentBuildStatus';

export interface GetWindsurfJSAppDeploymentResponse {
  'deployment'?: (_exa_codeium_common_pb_WindsurfDeployment | null);
  'buildStatus'?: (_exa_codeium_common_pb_DeploymentBuildStatus);
  'deploymentUrl'?: (string);
  'buildError'?: (string);
  'buildLogs'?: (string);
  'isClaimed'?: (boolean);
  'claimUrl'?: (string);
}

export interface GetWindsurfJSAppDeploymentResponse__Output {
  'deployment': (_exa_codeium_common_pb_WindsurfDeployment__Output | null);
  'buildStatus': (_exa_codeium_common_pb_DeploymentBuildStatus__Output);
  'deploymentUrl': (string);
  'buildError': (string);
  'buildLogs': (string);
  'isClaimed': (boolean);
  'claimUrl': (string);
}
