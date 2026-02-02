// Original file: exa/language_server_pb/language_server.proto

import type { Long } from '@grpc/proto-loader';

export interface Suffix {
  'text'?: (string);
  'deltaCursorOffset'?: (number | string | Long);
}

export interface Suffix__Output {
  'text': (string);
  'deltaCursorOffset': (string);
}
