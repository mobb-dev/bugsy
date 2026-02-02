// Original file: exa/index_pb/index.proto

import type { Long } from '@grpc/proto-loader';

export interface GetDatabaseStatsResponse {
  'databaseTotalBytesCount'?: (number | string | Long);
  'tableTotalBytesCount'?: (number | string | Long);
  'indexTotalBytesCount'?: (number | string | Long);
  'estimatePrunableBytes'?: (number | string | Long);
  'isPruning'?: (boolean);
  'lastPruneError'?: (string);
  'allTablesBytesCount'?: (number | string | Long);
}

export interface GetDatabaseStatsResponse__Output {
  'databaseTotalBytesCount': (string);
  'tableTotalBytesCount': (string);
  'indexTotalBytesCount': (string);
  'estimatePrunableBytes': (string);
  'isPruning': (boolean);
  'lastPruneError': (string);
  'allTablesBytesCount': (string);
}
