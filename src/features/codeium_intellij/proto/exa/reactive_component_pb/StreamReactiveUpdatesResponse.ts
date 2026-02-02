// Original file: exa/reactive_component_pb/reactive_component.proto

import type { MessageDiff as _exa_reactive_component_pb_MessageDiff, MessageDiff__Output as _exa_reactive_component_pb_MessageDiff__Output } from '../../exa/reactive_component_pb/MessageDiff';
import type { Long } from '@grpc/proto-loader';

export interface StreamReactiveUpdatesResponse {
  'version'?: (number | string | Long);
  'diff'?: (_exa_reactive_component_pb_MessageDiff | null);
  'fullState'?: (Buffer | Uint8Array | string);
}

export interface StreamReactiveUpdatesResponse__Output {
  'version': (string);
  'diff': (_exa_reactive_component_pb_MessageDiff__Output | null);
  'fullState': (Buffer);
}
