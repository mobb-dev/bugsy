// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { GithubRepoConfig as _exa_opensearch_clients_pb_GithubRepoConfig, GithubRepoConfig__Output as _exa_opensearch_clients_pb_GithubRepoConfig__Output } from '../../exa/opensearch_clients_pb/GithubRepoConfig';
import type { Long } from '@grpc/proto-loader';

export interface ConnectorInternalConfigGithub {
  'installationId'?: (number | string | Long);
  'repoConfigs'?: (_exa_opensearch_clients_pb_GithubRepoConfig)[];
}

export interface ConnectorInternalConfigGithub__Output {
  'installationId': (string);
  'repoConfigs': (_exa_opensearch_clients_pb_GithubRepoConfig__Output)[];
}
