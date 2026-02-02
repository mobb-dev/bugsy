// Original file: exa/knowledge_base_pb/knowledge_base.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';

export interface ReadKnowledgeBaseItemRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'identifier'?: (string);
}

export interface ReadKnowledgeBaseItemRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'identifier': (string);
}
