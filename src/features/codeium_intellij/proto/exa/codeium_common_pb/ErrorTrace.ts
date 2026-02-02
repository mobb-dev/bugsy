// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface ErrorTrace {
  'errorId'?: (string);
  'timestampUnixMs'?: (number | string | Long);
  'stacktrace'?: (string);
  'recovered'?: (boolean);
}

export interface ErrorTrace__Output {
  'errorId': (string);
  'timestampUnixMs': (string);
  'stacktrace': (string);
  'recovered': (boolean);
}
