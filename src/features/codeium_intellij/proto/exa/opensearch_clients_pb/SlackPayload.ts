// Original file: exa/opensearch_clients_pb/opensearch_clients.proto

import type { SlackMessagePayload as _exa_opensearch_clients_pb_SlackMessagePayload, SlackMessagePayload__Output as _exa_opensearch_clients_pb_SlackMessagePayload__Output } from '../../exa/opensearch_clients_pb/SlackMessagePayload';
import type { SlackChannelPayload as _exa_opensearch_clients_pb_SlackChannelPayload, SlackChannelPayload__Output as _exa_opensearch_clients_pb_SlackChannelPayload__Output } from '../../exa/opensearch_clients_pb/SlackChannelPayload';

export interface SlackPayload {
  'message'?: (_exa_opensearch_clients_pb_SlackMessagePayload | null);
  'channel'?: (_exa_opensearch_clients_pb_SlackChannelPayload | null);
  'payload'?: "message"|"channel";
}

export interface SlackPayload__Output {
  'message'?: (_exa_opensearch_clients_pb_SlackMessagePayload__Output | null);
  'channel'?: (_exa_opensearch_clients_pb_SlackChannelPayload__Output | null);
  'payload'?: "message"|"channel";
}
