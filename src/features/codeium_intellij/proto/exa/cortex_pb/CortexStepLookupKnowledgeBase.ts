// Original file: exa/cortex_pb/cortex.proto

import type { KnowledgeBaseItemWithMetadata as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata, KnowledgeBaseItemWithMetadata__Output as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItemWithMetadata';

export interface CortexStepLookupKnowledgeBase {
  'urls'?: (string)[];
  'documentIds'?: (string)[];
  'knowledgeBaseItems'?: (_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata)[];
}

export interface CortexStepLookupKnowledgeBase__Output {
  'urls': (string)[];
  'documentIds': (string)[];
  'knowledgeBaseItems': (_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output)[];
}
