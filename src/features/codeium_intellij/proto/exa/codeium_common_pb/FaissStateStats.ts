// Original file: exa/codeium_common_pb/codeium_common.proto

import type { EmbeddingSource as _exa_codeium_common_pb_EmbeddingSource, EmbeddingSource__Output as _exa_codeium_common_pb_EmbeddingSource__Output } from '../../exa/codeium_common_pb/EmbeddingSource';
import type { Long } from '@grpc/proto-loader';

export interface FaissStateStats {
  'embeddingSource'?: (_exa_codeium_common_pb_EmbeddingSource);
  'workspace'?: (string);
  'itemCount'?: (number | string | Long);
}

export interface FaissStateStats__Output {
  'embeddingSource': (_exa_codeium_common_pb_EmbeddingSource__Output);
  'workspace': (string);
  'itemCount': (string);
}
