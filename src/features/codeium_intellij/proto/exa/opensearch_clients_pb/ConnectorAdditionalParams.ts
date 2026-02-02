// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ConnectorAdditionalParamsGithub as _exa_opensearch_clients_pb_ConnectorAdditionalParamsGithub, ConnectorAdditionalParamsGithub__Output as _exa_opensearch_clients_pb_ConnectorAdditionalParamsGithub__Output } from '../../exa/opensearch_clients_pb/ConnectorAdditionalParamsGithub';
import type { ConnectorAdditionalParamsSlack as _exa_opensearch_clients_pb_ConnectorAdditionalParamsSlack, ConnectorAdditionalParamsSlack__Output as _exa_opensearch_clients_pb_ConnectorAdditionalParamsSlack__Output } from '../../exa/opensearch_clients_pb/ConnectorAdditionalParamsSlack';

export interface ConnectorAdditionalParams {
  'github'?: (_exa_opensearch_clients_pb_ConnectorAdditionalParamsGithub | null);
  'slack'?: (_exa_opensearch_clients_pb_ConnectorAdditionalParamsSlack | null);
  'config'?: "slack"|"github";
}

export interface ConnectorAdditionalParams__Output {
  'github'?: (_exa_opensearch_clients_pb_ConnectorAdditionalParamsGithub__Output | null);
  'slack'?: (_exa_opensearch_clients_pb_ConnectorAdditionalParamsSlack__Output | null);
  'config'?: "slack"|"github";
}
