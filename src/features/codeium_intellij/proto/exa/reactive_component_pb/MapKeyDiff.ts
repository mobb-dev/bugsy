// Original file: exa/reactive_component_pb/reactive_component.proto

import type { SingularValue as _exa_reactive_component_pb_SingularValue, SingularValue__Output as _exa_reactive_component_pb_SingularValue__Output } from '../../exa/reactive_component_pb/SingularValue';

export interface MapKeyDiff {
  'mapKey'?: (_exa_reactive_component_pb_SingularValue | null);
  'updateSingular'?: (_exa_reactive_component_pb_SingularValue | null);
  'clear'?: (boolean);
  'diff'?: "updateSingular"|"clear";
}

export interface MapKeyDiff__Output {
  'mapKey': (_exa_reactive_component_pb_SingularValue__Output | null);
  'updateSingular'?: (_exa_reactive_component_pb_SingularValue__Output | null);
  'clear'?: (boolean);
  'diff'?: "updateSingular"|"clear";
}
