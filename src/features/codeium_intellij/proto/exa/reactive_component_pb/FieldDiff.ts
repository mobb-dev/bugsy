// Original file: exa/reactive_component_pb/reactive_component.proto

import type { SingularValue as _exa_reactive_component_pb_SingularValue, SingularValue__Output as _exa_reactive_component_pb_SingularValue__Output } from '../../exa/reactive_component_pb/SingularValue';
import type { RepeatedDiff as _exa_reactive_component_pb_RepeatedDiff, RepeatedDiff__Output as _exa_reactive_component_pb_RepeatedDiff__Output } from '../../exa/reactive_component_pb/RepeatedDiff';
import type { MapDiff as _exa_reactive_component_pb_MapDiff, MapDiff__Output as _exa_reactive_component_pb_MapDiff__Output } from '../../exa/reactive_component_pb/MapDiff';

export interface FieldDiff {
  'fieldNumber'?: (number);
  'updateSingular'?: (_exa_reactive_component_pb_SingularValue | null);
  'updateRepeated'?: (_exa_reactive_component_pb_RepeatedDiff | null);
  'updateMap'?: (_exa_reactive_component_pb_MapDiff | null);
  'clear'?: (boolean);
  'diff'?: "updateSingular"|"updateRepeated"|"updateMap"|"clear";
}

export interface FieldDiff__Output {
  'fieldNumber': (number);
  'updateSingular'?: (_exa_reactive_component_pb_SingularValue__Output | null);
  'updateRepeated'?: (_exa_reactive_component_pb_RepeatedDiff__Output | null);
  'updateMap'?: (_exa_reactive_component_pb_MapDiff__Output | null);
  'clear'?: (boolean);
  'diff'?: "updateSingular"|"updateRepeated"|"updateMap"|"clear";
}
