// Original file: exa/codeium_common_pb/codeium_common.proto

import type { EventType as _exa_codeium_common_pb_EventType, EventType__Output as _exa_codeium_common_pb_EventType__Output } from '../../exa/codeium_common_pb/EventType';
import type { Long } from '@grpc/proto-loader';

export interface Event {
  'eventType'?: (_exa_codeium_common_pb_EventType);
  'eventJson'?: (string);
  'timestampUnixMs'?: (number | string | Long);
}

export interface Event__Output {
  'eventType': (_exa_codeium_common_pb_EventType__Output);
  'eventJson': (string);
  'timestampUnixMs': (string);
}
