// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Embedding as _exa_codeium_common_pb_Embedding, Embedding__Output as _exa_codeium_common_pb_Embedding__Output } from '../../exa/codeium_common_pb/Embedding';

export interface EmbeddingResponse {
  'embeddings'?: (_exa_codeium_common_pb_Embedding)[];
  'promptsExceededContextLength'?: (boolean);
}

export interface EmbeddingResponse__Output {
  'embeddings': (_exa_codeium_common_pb_Embedding__Output)[];
  'promptsExceededContextLength': (boolean);
}
