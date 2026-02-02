// Original file: exa/language_server_pb/language_server.proto

import type { WebAppDeploymentConfig as _exa_codeium_common_pb_WebAppDeploymentConfig, WebAppDeploymentConfig__Output as _exa_codeium_common_pb_WebAppDeploymentConfig__Output } from '../../exa/codeium_common_pb/WebAppDeploymentConfig';
import type { WindsurfDeployment as _exa_codeium_common_pb_WindsurfDeployment, WindsurfDeployment__Output as _exa_codeium_common_pb_WindsurfDeployment__Output } from '../../exa/codeium_common_pb/WindsurfDeployment';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface GetActiveAppDeploymentForWorkspaceResponse {
  'deploymentConfig'?: (_exa_codeium_common_pb_WebAppDeploymentConfig | null);
  'deployment'?: (_exa_codeium_common_pb_WindsurfDeployment | null);
  'projectName'?: (string);
  'subdomain'?: (string);
  'projectCreatedAt'?: (_google_protobuf_Timestamp | null);
  'teamSlug'?: (string);
}

export interface GetActiveAppDeploymentForWorkspaceResponse__Output {
  'deploymentConfig': (_exa_codeium_common_pb_WebAppDeploymentConfig__Output | null);
  'deployment': (_exa_codeium_common_pb_WindsurfDeployment__Output | null);
  'projectName': (string);
  'subdomain': (string);
  'projectCreatedAt': (_google_protobuf_Timestamp__Output | null);
  'teamSlug': (string);
}
