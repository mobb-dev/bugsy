// Original file: exa/cortex_pb/cortex.proto

import type { KnowledgeBaseItem as _exa_codeium_common_pb_KnowledgeBaseItem, KnowledgeBaseItem__Output as _exa_codeium_common_pb_KnowledgeBaseItem__Output } from '../../exa/codeium_common_pb/KnowledgeBaseItem';
import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';

export interface CortexStepReadKnowledgeBaseItem {
  'identifier'?: (string);
  'knowledgeBaseItem'?: (_exa_codeium_common_pb_KnowledgeBaseItem | null);
  'connectorType'?: (_exa_opensearch_clients_pb_ConnectorType);
}

export interface CortexStepReadKnowledgeBaseItem__Output {
  'identifier': (string);
  'knowledgeBaseItem': (_exa_codeium_common_pb_KnowledgeBaseItem__Output | null);
  'connectorType': (_exa_opensearch_clients_pb_ConnectorType__Output);
}
