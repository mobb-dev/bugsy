// Original file: exa/codeium_common_pb/codeium_common.proto

import type { DeploymentProvider as _exa_codeium_common_pb_DeploymentProvider, DeploymentProvider__Output as _exa_codeium_common_pb_DeploymentProvider__Output } from '../../exa/codeium_common_pb/DeploymentProvider';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface WindsurfProject {
  'windsurfProjectId'?: (string);
  'authUid'?: (string);
  'deploymentProvider'?: (_exa_codeium_common_pb_DeploymentProvider);
  'providerProjectId'?: (string);
  'projectName'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'domain'?: (string);
  'subdomainName'?: (string);
  'expiresAt'?: (_google_protobuf_Timestamp | null);
  'claimedAt'?: (_google_protobuf_Timestamp | null);
  'deprovisionedAt'?: (_google_protobuf_Timestamp | null);
  'projectUrl'?: (string);
  'providerTeamId'?: (string);
}

export interface WindsurfProject__Output {
  'windsurfProjectId': (string);
  'authUid': (string);
  'deploymentProvider': (_exa_codeium_common_pb_DeploymentProvider__Output);
  'providerProjectId': (string);
  'projectName': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'domain': (string);
  'subdomainName': (string);
  'expiresAt': (_google_protobuf_Timestamp__Output | null);
  'claimedAt': (_google_protobuf_Timestamp__Output | null);
  'deprovisionedAt': (_google_protobuf_Timestamp__Output | null);
  'projectUrl': (string);
  'providerTeamId': (string);
}
