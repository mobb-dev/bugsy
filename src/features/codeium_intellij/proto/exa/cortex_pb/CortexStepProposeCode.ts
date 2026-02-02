// Original file: exa/cortex_pb/cortex.proto

import type { ActionSpec as _exa_cortex_pb_ActionSpec, ActionSpec__Output as _exa_cortex_pb_ActionSpec__Output } from '../../exa/cortex_pb/ActionSpec';
import type { ActionResult as _exa_cortex_pb_ActionResult, ActionResult__Output as _exa_cortex_pb_ActionResult__Output } from '../../exa/cortex_pb/ActionResult';
import type { AcknowledgementType as _exa_cortex_pb_AcknowledgementType, AcknowledgementType__Output as _exa_cortex_pb_AcknowledgementType__Output } from '../../exa/cortex_pb/AcknowledgementType';

export interface CortexStepProposeCode {
  'actionSpec'?: (_exa_cortex_pb_ActionSpec | null);
  'actionResult'?: (_exa_cortex_pb_ActionResult | null);
  'codeInstruction'?: (string);
  'markdownLanguage'?: (string);
  'blocking'?: (boolean);
  'acknowledgementType'?: (_exa_cortex_pb_AcknowledgementType);
}

export interface CortexStepProposeCode__Output {
  'actionSpec': (_exa_cortex_pb_ActionSpec__Output | null);
  'actionResult': (_exa_cortex_pb_ActionResult__Output | null);
  'codeInstruction': (string);
  'markdownLanguage': (string);
  'blocking': (boolean);
  'acknowledgementType': (_exa_cortex_pb_AcknowledgementType__Output);
}
