// Original file: exa/codeium_common_pb/codeium_common.proto

import type { KnowledgeBaseItemWithMetadata as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata, KnowledgeBaseItemWithMetadata__Output as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItemWithMetadata';
import type { KnowledgeBaseGroup as _exa_codeium_common_pb_KnowledgeBaseGroup, KnowledgeBaseGroup__Output as _exa_codeium_common_pb_KnowledgeBaseGroup__Output } from '../../exa/codeium_common_pb/KnowledgeBaseGroup';

export interface KnowledgeBaseGroup {
  'description'?: (string);
  'item'?: (_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata | null);
  'children'?: (_exa_codeium_common_pb_KnowledgeBaseGroup)[];
}

export interface KnowledgeBaseGroup__Output {
  'description': (string);
  'item': (_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output | null);
  'children': (_exa_codeium_common_pb_KnowledgeBaseGroup__Output)[];
}
