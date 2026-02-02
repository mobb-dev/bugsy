// Original file: exa/cortex_pb/cortex.proto

import type { Long } from '@grpc/proto-loader';

export interface ListDirectoryResult {
  'name'?: (string);
  'isDir'?: (boolean);
  'numChildren'?: (number);
  'sizeBytes'?: (number | string | Long);
}

export interface ListDirectoryResult__Output {
  'name': (string);
  'isDir': (boolean);
  'numChildren': (number);
  'sizeBytes': (string);
}
