// Original file: exa/cortex_pb/cortex.proto

import type { ActionResultEdit as _exa_cortex_pb_ActionResultEdit, ActionResultEdit__Output as _exa_cortex_pb_ActionResultEdit__Output } from '../../exa/cortex_pb/ActionResultEdit';

export interface ActionResult {
  'edit'?: (_exa_cortex_pb_ActionResultEdit | null);
  'applyExistingResult'?: (boolean);
  'result'?: "edit";
}

export interface ActionResult__Output {
  'edit'?: (_exa_cortex_pb_ActionResultEdit__Output | null);
  'applyExistingResult': (boolean);
  'result'?: "edit";
}
