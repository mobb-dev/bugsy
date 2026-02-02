// Original file: exa/codeium_common_pb/codeium_common.proto

import type { FaissStateStats as _exa_codeium_common_pb_FaissStateStats, FaissStateStats__Output as _exa_codeium_common_pb_FaissStateStats__Output } from '../../exa/codeium_common_pb/FaissStateStats';
import type { Long } from '@grpc/proto-loader';

export interface LocalSqliteFaissDbStats {
  'faissStateStats'?: (_exa_codeium_common_pb_FaissStateStats)[];
  'totalItemCount'?: (number | string | Long);
  'quantized'?: (boolean);
}

export interface LocalSqliteFaissDbStats__Output {
  'faissStateStats': (_exa_codeium_common_pb_FaissStateStats__Output)[];
  'totalItemCount': (string);
  'quantized': (boolean);
}
