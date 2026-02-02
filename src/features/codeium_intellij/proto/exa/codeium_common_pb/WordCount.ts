// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface WordCount {
  'wordCountMap'?: ({[key: string]: number | string | Long});
}

export interface WordCount__Output {
  'wordCountMap': ({[key: string]: string});
}
