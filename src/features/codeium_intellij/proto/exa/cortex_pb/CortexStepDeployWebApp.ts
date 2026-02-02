// Original file: exa/cortex_pb/cortex.proto

import type { DeployWebAppFileUploadStatus as _exa_cortex_pb_DeployWebAppFileUploadStatus, DeployWebAppFileUploadStatus__Output as _exa_cortex_pb_DeployWebAppFileUploadStatus__Output } from '../../exa/cortex_pb/DeployWebAppFileUploadStatus';
import type { WindsurfDeployment as _exa_codeium_common_pb_WindsurfDeployment, WindsurfDeployment__Output as _exa_codeium_common_pb_WindsurfDeployment__Output } from '../../exa/codeium_common_pb/WindsurfDeployment';
import type { WebAppDeploymentConfig as _exa_codeium_common_pb_WebAppDeploymentConfig, WebAppDeploymentConfig__Output as _exa_codeium_common_pb_WebAppDeploymentConfig__Output } from '../../exa/codeium_common_pb/WebAppDeploymentConfig';
import type { DeployTarget as _exa_codeium_common_pb_DeployTarget, DeployTarget__Output as _exa_codeium_common_pb_DeployTarget__Output } from '../../exa/codeium_common_pb/DeployTarget';

export interface CortexStepDeployWebApp {
  'projectPath'?: (string);
  'subdomain'?: (string);
  'framework'?: (string);
  'userConfirmed'?: (boolean);
  'fileUploadStatus'?: ({[key: string]: _exa_cortex_pb_DeployWebAppFileUploadStatus});
  'deployment'?: (_exa_codeium_common_pb_WindsurfDeployment | null);
  'deploymentConfigUri'?: (string);
  'deploymentConfigOutput'?: (_exa_codeium_common_pb_WebAppDeploymentConfig | null);
  'subdomainUsed'?: (string);
  'claimUrl'?: (string);
  'projectId'?: (string);
  'subdomainForProjectId'?: (string);
  'subdomainUserSpecified'?: (string);
  'projectIdUsed'?: (string);
  'deployTargetForProjectId'?: (_exa_codeium_common_pb_DeployTarget | null);
  'deployTargetUserSpecified'?: (_exa_codeium_common_pb_DeployTarget | null);
  'deployTargetUsed'?: (_exa_codeium_common_pb_DeployTarget | null);
}

export interface CortexStepDeployWebApp__Output {
  'projectPath': (string);
  'subdomain': (string);
  'framework': (string);
  'userConfirmed': (boolean);
  'fileUploadStatus': ({[key: string]: _exa_cortex_pb_DeployWebAppFileUploadStatus__Output});
  'deployment': (_exa_codeium_common_pb_WindsurfDeployment__Output | null);
  'deploymentConfigUri': (string);
  'deploymentConfigOutput': (_exa_codeium_common_pb_WebAppDeploymentConfig__Output | null);
  'subdomainUsed': (string);
  'claimUrl': (string);
  'projectId': (string);
  'subdomainForProjectId': (string);
  'subdomainUserSpecified': (string);
  'projectIdUsed': (string);
  'deployTargetForProjectId': (_exa_codeium_common_pb_DeployTarget__Output | null);
  'deployTargetUserSpecified': (_exa_codeium_common_pb_DeployTarget__Output | null);
  'deployTargetUsed': (_exa_codeium_common_pb_DeployTarget__Output | null);
}
