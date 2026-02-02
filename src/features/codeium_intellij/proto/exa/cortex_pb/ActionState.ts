// Original file: exa/cortex_pb/cortex.proto

import type { ActionStatus as _exa_cortex_pb_ActionStatus, ActionStatus__Output as _exa_cortex_pb_ActionStatus__Output } from '../../exa/cortex_pb/ActionStatus';
import type { ActionSpec as _exa_cortex_pb_ActionSpec, ActionSpec__Output as _exa_cortex_pb_ActionSpec__Output } from '../../exa/cortex_pb/ActionSpec';
import type { ActionResult as _exa_cortex_pb_ActionResult, ActionResult__Output as _exa_cortex_pb_ActionResult__Output } from '../../exa/cortex_pb/ActionResult';

export interface ActionState {
  'status'?: (_exa_cortex_pb_ActionStatus);
  'spec'?: (_exa_cortex_pb_ActionSpec | null);
  'result'?: (_exa_cortex_pb_ActionResult | null);
  'error'?: (string);
  'stepId'?: (string);
  'stepVersion'?: (number);
  'planVersion'?: (number);
}

export interface ActionState__Output {
  'status': (_exa_cortex_pb_ActionStatus__Output);
  'spec': (_exa_cortex_pb_ActionSpec__Output | null);
  'result': (_exa_cortex_pb_ActionResult__Output | null);
  'error': (string);
  'stepId': (string);
  'stepVersion': (number);
  'planVersion': (number);
}
