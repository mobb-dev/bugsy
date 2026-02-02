// Original file: exa/index_pb/index.proto

import type { Long } from '@grpc/proto-loader';

export interface RemoteIndexStats {
  'indexId'?: (string);
  'cciCount'?: (number | string | Long);
  'snippetCount'?: (number | string | Long);
  'embeddingCount'?: (number | string | Long);
}

export interface RemoteIndexStats__Output {
  'indexId': (string);
  'cciCount': (string);
  'snippetCount': (string);
  'embeddingCount': (string);
}
