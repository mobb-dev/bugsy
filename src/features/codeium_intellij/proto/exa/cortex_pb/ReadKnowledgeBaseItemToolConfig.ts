// Original file: exa/cortex_pb/cortex.proto

import type { KnowledgeBaseItem as _exa_codeium_common_pb_KnowledgeBaseItem, KnowledgeBaseItem__Output as _exa_codeium_common_pb_KnowledgeBaseItem__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItem';

export interface ReadKnowledgeBaseItemToolConfig {
  'enabled'?: (boolean);
  'knowledgeBaseItems'?: (_exa_codeium_common_pb_KnowledgeBaseItem)[];
  '_enabled'?: "enabled";
}

export interface ReadKnowledgeBaseItemToolConfig__Output {
  'enabled'?: (boolean);
  'knowledgeBaseItems': (_exa_codeium_common_pb_KnowledgeBaseItem__Output)[];
  '_enabled'?: "enabled";
}
