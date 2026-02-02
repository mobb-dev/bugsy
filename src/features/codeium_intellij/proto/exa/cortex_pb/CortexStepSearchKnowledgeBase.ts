// Original file: exa/cortex_pb/cortex.proto

import type { KnowledgeBaseGroup as _exa_codeium_common_pb_KnowledgeBaseGroup, KnowledgeBaseGroup__Output as _exa_codeium_common_pb_KnowledgeBaseGroup__Output } from '../../exa/codeium_common_pb/KnowledgeBaseGroup';
import type { TimeRange as _exa_opensearch_clients_pb_TimeRange, TimeRange__Output as _exa_opensearch_clients_pb_TimeRange__Output } from '../../exa/opensearch_clients_pb/TimeRange';
import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';

export interface CortexStepSearchKnowledgeBase {
  'queries'?: (string)[];
  'knowledgeBaseGroups'?: (_exa_codeium_common_pb_KnowledgeBaseGroup)[];
  'timeRange'?: (_exa_opensearch_clients_pb_TimeRange | null);
  'connectorTypes'?: (_exa_opensearch_clients_pb_ConnectorType)[];
  'aggregateIds'?: (string)[];
}

export interface CortexStepSearchKnowledgeBase__Output {
  'queries': (string)[];
  'knowledgeBaseGroups': (_exa_codeium_common_pb_KnowledgeBaseGroup__Output)[];
  'timeRange': (_exa_opensearch_clients_pb_TimeRange__Output | null);
  'connectorTypes': (_exa_opensearch_clients_pb_ConnectorType__Output)[];
  'aggregateIds': (string)[];
}
