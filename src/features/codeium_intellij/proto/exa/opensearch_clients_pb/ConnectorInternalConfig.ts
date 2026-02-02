// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { ConnectorInternalConfigSlack as _exa_opensearch_clients_pb_ConnectorInternalConfigSlack, ConnectorInternalConfigSlack__Output as _exa_opensearch_clients_pb_ConnectorInternalConfigSlack__Output } from '../../exa/opensearch_clients_pb/ConnectorInternalConfigSlack';
import type { ConnectorInternalConfigGithub as _exa_opensearch_clients_pb_ConnectorInternalConfigGithub, ConnectorInternalConfigGithub__Output as _exa_opensearch_clients_pb_ConnectorInternalConfigGithub__Output } from '../../exa/opensearch_clients_pb/ConnectorInternalConfigGithub';
import type { ConnectorInternalConfigGoogleDrive as _exa_opensearch_clients_pb_ConnectorInternalConfigGoogleDrive, ConnectorInternalConfigGoogleDrive__Output as _exa_opensearch_clients_pb_ConnectorInternalConfigGoogleDrive__Output } from '../../exa/opensearch_clients_pb/ConnectorInternalConfigGoogleDrive';
import type { ConnectorInternalConfigJira as _exa_opensearch_clients_pb_ConnectorInternalConfigJira, ConnectorInternalConfigJira__Output as _exa_opensearch_clients_pb_ConnectorInternalConfigJira__Output } from '../../exa/opensearch_clients_pb/ConnectorInternalConfigJira';

export interface ConnectorInternalConfig {
  'slack'?: (_exa_opensearch_clients_pb_ConnectorInternalConfigSlack | null);
  'github'?: (_exa_opensearch_clients_pb_ConnectorInternalConfigGithub | null);
  'googleDrive'?: (_exa_opensearch_clients_pb_ConnectorInternalConfigGoogleDrive | null);
  'jira'?: (_exa_opensearch_clients_pb_ConnectorInternalConfigJira | null);
  'config'?: "slack"|"github"|"googleDrive"|"jira";
}

export interface ConnectorInternalConfig__Output {
  'slack'?: (_exa_opensearch_clients_pb_ConnectorInternalConfigSlack__Output | null);
  'github'?: (_exa_opensearch_clients_pb_ConnectorInternalConfigGithub__Output | null);
  'googleDrive'?: (_exa_opensearch_clients_pb_ConnectorInternalConfigGoogleDrive__Output | null);
  'jira'?: (_exa_opensearch_clients_pb_ConnectorInternalConfigJira__Output | null);
  'config'?: "slack"|"github"|"googleDrive"|"jira";
}
