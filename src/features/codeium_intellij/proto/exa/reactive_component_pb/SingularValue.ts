// Original file: exa/reactive_component_pb/reactive_component.proto

import type { MessageDiff as _exa_reactive_component_pb_MessageDiff, MessageDiff__Output as _exa_reactive_component_pb_MessageDiff__Output } from '../../exa/reactive_component_pb/MessageDiff';
import type { Long } from '@grpc/proto-loader';

export interface SingularValue {
  'doubleValue'?: (number | string);
  'floatValue'?: (number | string);
  'int32Value'?: (number);
  'int64Value'?: (number | string | Long);
  'uint32Value'?: (number);
  'uint64Value'?: (number | string | Long);
  'sint32Value'?: (number);
  'sint64Value'?: (number | string | Long);
  'fixed32Value'?: (number);
  'fixed64Value'?: (number | string | Long);
  'sfixed32Value'?: (number);
  'sfixed64Value'?: (number | string | Long);
  'boolValue'?: (boolean);
  'enumValue'?: (number);
  'stringValue'?: (string);
  'bytesValue'?: (Buffer | Uint8Array | string);
  'messageValue'?: (_exa_reactive_component_pb_MessageDiff | null);
  'value'?: "doubleValue"|"floatValue"|"int32Value"|"int64Value"|"uint32Value"|"uint64Value"|"sint32Value"|"sint64Value"|"fixed32Value"|"fixed64Value"|"sfixed32Value"|"sfixed64Value"|"boolValue"|"enumValue"|"stringValue"|"bytesValue"|"messageValue";
}

export interface SingularValue__Output {
  'doubleValue'?: (number);
  'floatValue'?: (number);
  'int32Value'?: (number);
  'int64Value'?: (string);
  'uint32Value'?: (number);
  'uint64Value'?: (string);
  'sint32Value'?: (number);
  'sint64Value'?: (string);
  'fixed32Value'?: (number);
  'fixed64Value'?: (string);
  'sfixed32Value'?: (number);
  'sfixed64Value'?: (string);
  'boolValue'?: (boolean);
  'enumValue'?: (number);
  'stringValue'?: (string);
  'bytesValue'?: (Buffer);
  'messageValue'?: (_exa_reactive_component_pb_MessageDiff__Output | null);
  'value'?: "doubleValue"|"floatValue"|"int32Value"|"int64Value"|"uint32Value"|"uint64Value"|"sint32Value"|"sint64Value"|"fixed32Value"|"fixed64Value"|"sfixed32Value"|"sfixed64Value"|"boolValue"|"enumValue"|"stringValue"|"bytesValue"|"messageValue";
}
