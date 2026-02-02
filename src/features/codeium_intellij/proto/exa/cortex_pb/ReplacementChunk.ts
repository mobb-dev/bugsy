// Original file: exa/cortex_pb/cortex.proto

import type { AcknowledgementType as _exa_cortex_pb_AcknowledgementType, AcknowledgementType__Output as _exa_cortex_pb_AcknowledgementType__Output } from '../../exa/cortex_pb/AcknowledgementType';

export interface ReplacementChunk {
  'targetContent'?: (string);
  'replacementContent'?: (string);
  'allowMultiple'?: (boolean);
  'targetHasCarriageReturn'?: (boolean);
  'contextLines'?: (string)[];
  'acknowledgementType'?: (_exa_cortex_pb_AcknowledgementType);
}

export interface ReplacementChunk__Output {
  'targetContent': (string);
  'replacementContent': (string);
  'allowMultiple': (boolean);
  'targetHasCarriageReturn': (boolean);
  'contextLines': (string)[];
  'acknowledgementType': (_exa_cortex_pb_AcknowledgementType__Output);
}
