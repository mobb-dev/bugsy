// Original file: exa/codeium_common_pb/codeium_common.proto

import type { DeploymentProvider as _exa_codeium_common_pb_DeploymentProvider, DeploymentProvider__Output as _exa_codeium_common_pb_DeploymentProvider__Output } from '../../exa/codeium_common_pb/DeploymentProvider';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface WindsurfDeployment {
  'windsurfDeploymentId'?: (string);
  'authUid'?: (string);
  'deploymentProvider'?: (_exa_codeium_common_pb_DeploymentProvider);
  'projectId'?: (string);
  'projectName'?: (string);
  'workspacePath'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'buildStatusUrl'?: (string);
  'projectUrl'?: (string);
  'expiresAt'?: (_google_protobuf_Timestamp | null);
  'deploymentUrl'?: (string);
  'deprovisionedAt'?: (_google_protobuf_Timestamp | null);
  'providerDeploymentId'?: (string);
  'claimedAt'?: (_google_protobuf_Timestamp | null);
  'domain'?: (string);
  'subdomainName'?: (string);
  'windsurfProjectId'?: (string);
  'providerTeamId'?: (string);
}

export interface WindsurfDeployment__Output {
  'windsurfDeploymentId': (string);
  'authUid': (string);
  'deploymentProvider': (_exa_codeium_common_pb_DeploymentProvider__Output);
  'projectId': (string);
  'projectName': (string);
  'workspacePath': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'buildStatusUrl': (string);
  'projectUrl': (string);
  'expiresAt': (_google_protobuf_Timestamp__Output | null);
  'deploymentUrl': (string);
  'deprovisionedAt': (_google_protobuf_Timestamp__Output | null);
  'providerDeploymentId': (string);
  'claimedAt': (_google_protobuf_Timestamp__Output | null);
  'domain': (string);
  'subdomainName': (string);
  'windsurfProjectId': (string);
  'providerTeamId': (string);
}
