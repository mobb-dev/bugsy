// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ConnectorType as _exa_opensearch_clients_pb_ConnectorType, ConnectorType__Output as _exa_opensearch_clients_pb_ConnectorType__Output } from '../../exa/opensearch_clients_pb/ConnectorType';
import type { JobStatus as _exa_opensearch_clients_pb_JobStatus, JobStatus__Output as _exa_opensearch_clients_pb_JobStatus__Output } from '../../exa/opensearch_clients_pb/JobStatus';
import type { Long } from '@grpc/proto-loader';

export interface JobState {
  'connector'?: (_exa_opensearch_clients_pb_ConnectorType);
  'id'?: (number | string | Long);
  'status'?: (_exa_opensearch_clients_pb_JobStatus);
}

export interface JobState__Output {
  'connector': (_exa_opensearch_clients_pb_ConnectorType__Output);
  'id': (string);
  'status': (_exa_opensearch_clients_pb_JobStatus__Output);
}
