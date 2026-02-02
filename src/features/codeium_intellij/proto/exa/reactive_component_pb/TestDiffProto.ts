// Original file: exa/reactive_component_pb/reactive_component.proto

import type { TestProto as _exa_reactive_component_pb_TestProto, TestProto__Output as _exa_reactive_component_pb_TestProto__Output } from '../../exa/reactive_component_pb/TestProto';
import type { TestEnum as _exa_reactive_component_pb_TestEnum, TestEnum__Output as _exa_reactive_component_pb_TestEnum__Output } from '../../exa/reactive_component_pb/TestEnum';

export interface TestDiffProto {
  'singularScalarValue'?: (number | string);
  'singularMessageValue'?: (_exa_reactive_component_pb_TestProto | null);
  'repeatedScalarValue'?: (number | string)[];
  'repeatedMessageValue'?: (_exa_reactive_component_pb_TestProto)[];
  'mapScalarValue'?: ({[key: number]: number | string});
  'mapMessageValue'?: ({[key: string]: _exa_reactive_component_pb_TestProto});
  'oneofScalarValue'?: (number | string);
  'oneofMessageValue'?: (_exa_reactive_component_pb_TestProto | null);
  'enumValue'?: (_exa_reactive_component_pb_TestEnum);
  'optionalScalarValue'?: (number | string);
  'oneofTest'?: "oneofScalarValue"|"oneofMessageValue";
  '_optionalScalarValue'?: "optionalScalarValue";
}

export interface TestDiffProto__Output {
  'singularScalarValue': (number);
  'singularMessageValue': (_exa_reactive_component_pb_TestProto__Output | null);
  'repeatedScalarValue': (number)[];
  'repeatedMessageValue': (_exa_reactive_component_pb_TestProto__Output)[];
  'mapScalarValue': ({[key: number]: number});
  'mapMessageValue': ({[key: string]: _exa_reactive_component_pb_TestProto__Output});
  'oneofScalarValue'?: (number);
  'oneofMessageValue'?: (_exa_reactive_component_pb_TestProto__Output | null);
  'enumValue': (_exa_reactive_component_pb_TestEnum__Output);
  'optionalScalarValue'?: (number);
  'oneofTest'?: "oneofScalarValue"|"oneofMessageValue";
  '_optionalScalarValue'?: "optionalScalarValue";
}
