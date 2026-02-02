// Original file: exa/codeium_common_pb/codeium_common.proto

import type { EmbedType as _exa_codeium_common_pb_EmbedType, EmbedType__Output as _exa_codeium_common_pb_EmbedType__Output } from '../../exa/codeium_common_pb/EmbedType';

export interface EmbeddingMetadata {
  'nodeName'?: (string);
  'startLine'?: (number);
  'endLine'?: (number);
  'embedType'?: (_exa_codeium_common_pb_EmbedType);
}

export interface EmbeddingMetadata__Output {
  'nodeName': (string);
  'startLine': (number);
  'endLine': (number);
  'embedType': (_exa_codeium_common_pb_EmbedType__Output);
}
