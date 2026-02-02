// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface DocumentPosition {
  'row'?: (number | string | Long);
  'col'?: (number | string | Long);
}

export interface DocumentPosition__Output {
  'row': (string);
  'col': (string);
}
