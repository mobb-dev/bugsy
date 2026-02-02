// Original file: exa/cortex_pb/cortex.proto

import type { KnowledgeBaseItem as _exa_codeium_common_pb_KnowledgeBaseItem, KnowledgeBaseItem__Output as _exa_codeium_common_pb_KnowledgeBaseItem__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItem';
import type { AutoRunDecision as _exa_cortex_pb_AutoRunDecision, AutoRunDecision__Output as _exa_cortex_pb_AutoRunDecision__Output } from '../../exa/cortex_pb/AutoRunDecision';

export interface CortexStepReadUrlContent {
  'url'?: (string);
  'webDocument'?: (_exa_codeium_common_pb_KnowledgeBaseItem | null);
  'resolvedUrl'?: (string);
  'latencyMs'?: (number);
  'userRejected'?: (boolean);
  'autoRunDecision'?: (_exa_cortex_pb_AutoRunDecision);
}

export interface CortexStepReadUrlContent__Output {
  'url': (string);
  'webDocument': (_exa_codeium_common_pb_KnowledgeBaseItem__Output | null);
  'resolvedUrl': (string);
  'latencyMs': (number);
  'userRejected': (boolean);
  'autoRunDecision': (_exa_cortex_pb_AutoRunDecision__Output);
}
