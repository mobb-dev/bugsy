// Original file: exa/language_server_pb/language_server.proto

import type { Long } from '@grpc/proto-loader';

export interface InstallCascadePluginResponse {
  'installationCount'?: (number | string | Long);
}

export interface InstallCascadePluginResponse__Output {
  'installationCount': (string);
}
