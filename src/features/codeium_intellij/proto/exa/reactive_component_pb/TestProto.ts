// Original file: exa/reactive_component_pb/reactive_component.proto

import type { TestProto as _exa_reactive_component_pb_TestProto, TestProto__Output as _exa_reactive_component_pb_TestProto__Output } from '../../exa/reactive_component_pb/TestProto';

export interface TestProto {
  'counter'?: (number);
  'values'?: (number)[];
  'nested'?: (_exa_reactive_component_pb_TestProto | null);
  'nestedRepeated'?: (_exa_reactive_component_pb_TestProto)[];
}

export interface TestProto__Output {
  'counter': (number);
  'values': (number)[];
  'nested': (_exa_reactive_component_pb_TestProto__Output | null);
  'nestedRepeated': (_exa_reactive_component_pb_TestProto__Output)[];
}
