// Original file: exa/reactive_component_pb/reactive_component.proto

import type { SingularValue as _exa_reactive_component_pb_SingularValue, SingularValue__Output as _exa_reactive_component_pb_SingularValue__Output } from '../../exa/reactive_component_pb/SingularValue';

export interface RepeatedDiff {
  'newLength'?: (number);
  'updateValues'?: (_exa_reactive_component_pb_SingularValue)[];
  'updateIndices'?: (number)[];
}

export interface RepeatedDiff__Output {
  'newLength': (number);
  'updateValues': (_exa_reactive_component_pb_SingularValue__Output)[];
  'updateIndices': (number)[];
}
