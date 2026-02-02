// Original file: exa/codeium_common_pb/codeium_common.proto

import type { EmbeddingPriority as _exa_codeium_common_pb_EmbeddingPriority, EmbeddingPriority__Output as _exa_codeium_common_pb_EmbeddingPriority__Output } from '../../exa/codeium_common_pb/EmbeddingPriority';
import type { EmbeddingPrefix as _exa_codeium_common_pb_EmbeddingPrefix, EmbeddingPrefix__Output as _exa_codeium_common_pb_EmbeddingPrefix__Output } from '../../exa/codeium_common_pb/EmbeddingPrefix';
import type { Model as _exa_codeium_common_pb_Model, Model__Output as _exa_codeium_common_pb_Model__Output } from '../../exa/codeium_common_pb/Model';

export interface EmbeddingsRequest {
  'prompts'?: (string)[];
  'priority'?: (_exa_codeium_common_pb_EmbeddingPriority);
  'prefix'?: (_exa_codeium_common_pb_EmbeddingPrefix);
  'model'?: (_exa_codeium_common_pb_Model);
}

export interface EmbeddingsRequest__Output {
  'prompts': (string)[];
  'priority': (_exa_codeium_common_pb_EmbeddingPriority__Output);
  'prefix': (_exa_codeium_common_pb_EmbeddingPrefix__Output);
  'model': (_exa_codeium_common_pb_Model__Output);
}
