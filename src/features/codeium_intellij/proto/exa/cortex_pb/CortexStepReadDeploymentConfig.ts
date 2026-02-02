// Original file: exa/cortex_pb/cortex.proto

import type { WebAppDeploymentConfig as _exa_codeium_common_pb_WebAppDeploymentConfig, WebAppDeploymentConfig__Output as _exa_codeium_common_pb_WebAppDeploymentConfig__Output } from '../../exa/codeium_common_pb/WebAppDeploymentConfig';

export interface CortexStepReadDeploymentConfig {
  'projectPath'?: (string);
  'deploymentConfigUri'?: (string);
  'deploymentConfig'?: (_exa_codeium_common_pb_WebAppDeploymentConfig | null);
  'missingFileUris'?: (string)[];
  'willUploadNodeModules'?: (boolean);
  'willUploadDist'?: (boolean);
  'ignoreFileUris'?: (string)[];
  'numFilesToUpload'?: (number);
  'envFileUris'?: (string)[];
}

export interface CortexStepReadDeploymentConfig__Output {
  'projectPath': (string);
  'deploymentConfigUri': (string);
  'deploymentConfig': (_exa_codeium_common_pb_WebAppDeploymentConfig__Output | null);
  'missingFileUris': (string)[];
  'willUploadNodeModules': (boolean);
  'willUploadDist': (boolean);
  'ignoreFileUris': (string)[];
  'numFilesToUpload': (number);
  'envFileUris': (string)[];
}
