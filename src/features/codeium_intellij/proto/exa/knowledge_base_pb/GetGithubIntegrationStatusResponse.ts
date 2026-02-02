// Original file: exa/knowledge_base_pb/knowledge_base.proto

import type { GithubInstallationInfo as _exa_auto_cascade_common_pb_GithubInstallationInfo, GithubInstallationInfo__Output as _exa_auto_cascade_common_pb_GithubInstallationInfo__Output } from '../../exa/auto_cascade_common_pb/GithubInstallationInfo';

export interface GetGithubIntegrationStatusResponse {
  'username'?: (string);
  'installations'?: (_exa_auto_cascade_common_pb_GithubInstallationInfo)[];
}

export interface GetGithubIntegrationStatusResponse__Output {
  'username': (string);
  'installations': (_exa_auto_cascade_common_pb_GithubInstallationInfo__Output)[];
}
