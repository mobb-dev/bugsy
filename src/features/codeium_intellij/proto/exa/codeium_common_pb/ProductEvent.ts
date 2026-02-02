// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface ProductEvent {
  'eventName'?: (string);
  'apiKey'?: (string);
  'installationId'?: (string);
  'ideName'?: (string);
  'os'?: (string);
  'codeiumVersion'?: (string);
  'ideVersion'?: (string);
  'durationMs'?: (number | string | Long);
  'extra'?: ({[key: string]: string});
}

export interface ProductEvent__Output {
  'eventName': (string);
  'apiKey': (string);
  'installationId': (string);
  'ideName': (string);
  'os': (string);
  'codeiumVersion': (string);
  'ideVersion': (string);
  'durationMs': (string);
  'extra': ({[key: string]: string});
}
