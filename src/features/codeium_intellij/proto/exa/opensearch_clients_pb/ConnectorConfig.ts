// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ConnectorConfigSlack as _exa_opensearch_clients_pb_ConnectorConfigSlack, ConnectorConfigSlack__Output as _exa_opensearch_clients_pb_ConnectorConfigSlack__Output } from '../../exa/opensearch_clients_pb/ConnectorConfigSlack';
import type { ConnectorConfigGithub as _exa_opensearch_clients_pb_ConnectorConfigGithub, ConnectorConfigGithub__Output as _exa_opensearch_clients_pb_ConnectorConfigGithub__Output } from '../../exa/opensearch_clients_pb/ConnectorConfigGithub';
import type { ConnectorConfigGoogleDrive as _exa_opensearch_clients_pb_ConnectorConfigGoogleDrive, ConnectorConfigGoogleDrive__Output as _exa_opensearch_clients_pb_ConnectorConfigGoogleDrive__Output } from '../../exa/opensearch_clients_pb/ConnectorConfigGoogleDrive';
import type { ConnectorConfigJira as _exa_opensearch_clients_pb_ConnectorConfigJira, ConnectorConfigJira__Output as _exa_opensearch_clients_pb_ConnectorConfigJira__Output } from '../../exa/opensearch_clients_pb/ConnectorConfigJira';

export interface ConnectorConfig {
  'slack'?: (_exa_opensearch_clients_pb_ConnectorConfigSlack | null);
  'github'?: (_exa_opensearch_clients_pb_ConnectorConfigGithub | null);
  'googleDrive'?: (_exa_opensearch_clients_pb_ConnectorConfigGoogleDrive | null);
  'jira'?: (_exa_opensearch_clients_pb_ConnectorConfigJira | null);
  'config'?: "slack"|"github"|"googleDrive"|"jira";
}

export interface ConnectorConfig__Output {
  'slack'?: (_exa_opensearch_clients_pb_ConnectorConfigSlack__Output | null);
  'github'?: (_exa_opensearch_clients_pb_ConnectorConfigGithub__Output | null);
  'googleDrive'?: (_exa_opensearch_clients_pb_ConnectorConfigGoogleDrive__Output | null);
  'jira'?: (_exa_opensearch_clients_pb_ConnectorConfigJira__Output | null);
  'config'?: "slack"|"github"|"googleDrive"|"jira";
}
