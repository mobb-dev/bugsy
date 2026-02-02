// Original file: exa/index_pb/index.proto

import type { Long } from '@grpc/proto-loader';

export interface VectorIndexStats {
  'numEmbeddings'?: (number | string | Long);
  'indexBytesCount'?: (number | string | Long);
}

export interface VectorIndexStats__Output {
  'numEmbeddings': (string);
  'indexBytesCount': (string);
}
