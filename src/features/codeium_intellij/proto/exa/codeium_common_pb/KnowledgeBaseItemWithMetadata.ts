// Original file: exa/codeium_common_pb/codeium_common.proto

import type { KnowledgeBaseItem as _exa_codeium_common_pb_KnowledgeBaseItem, KnowledgeBaseItem__Output as _exa_codeium_common_pb_KnowledgeBaseItem__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItem';

export interface KnowledgeBaseItemWithMetadata {
  'knowledgeBaseItem'?: (_exa_codeium_common_pb_KnowledgeBaseItem | null);
  'score'?: (number | string);
  'indexName'?: (string);
  'documentSourceName'?: (string);
}

export interface KnowledgeBaseItemWithMetadata__Output {
  'knowledgeBaseItem': (_exa_codeium_common_pb_KnowledgeBaseItem__Output | null);
  'score': (number);
  'indexName': (string);
  'documentSourceName': (string);
}
