// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { Long } from '@grpc/proto-loader';

export interface ConnectorAdditionalParamsGithub {
  'installationId'?: (number | string | Long);
}

export interface ConnectorAdditionalParamsGithub__Output {
  'installationId': (string);
}
