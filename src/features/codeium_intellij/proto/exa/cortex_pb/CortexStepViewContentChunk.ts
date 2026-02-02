// Original file: exa/cortex_pb/cortex.proto

import type { KnowledgeBaseItem as _exa_codeium_common_pb_KnowledgeBaseItem, KnowledgeBaseItem__Output as _exa_codeium_common_pb_KnowledgeBaseItem__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItem';

export interface CortexStepViewContentChunk {
  'position'?: (number);
  'croppedItem'?: (_exa_codeium_common_pb_KnowledgeBaseItem | null);
  'documentId'?: (string);
}

export interface CortexStepViewContentChunk__Output {
  'position': (number);
  'croppedItem': (_exa_codeium_common_pb_KnowledgeBaseItem__Output | null);
  'documentId': (string);
}
