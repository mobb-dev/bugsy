// Original file: exa/index_pb/index.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { ContextSnippetType as _exa_codeium_common_pb_ContextSnippetType, ContextSnippetType__Output as _exa_codeium_common_pb_ContextSnippetType__Output } from '../../exa/codeium_common_pb/ContextSnippetType';

export interface GetEmbeddingsForCodeContextItemsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'codeContextItems'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'snippetType'?: (_exa_codeium_common_pb_ContextSnippetType);
}

export interface GetEmbeddingsForCodeContextItemsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'codeContextItems': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'snippetType': (_exa_codeium_common_pb_ContextSnippetType__Output);
}
