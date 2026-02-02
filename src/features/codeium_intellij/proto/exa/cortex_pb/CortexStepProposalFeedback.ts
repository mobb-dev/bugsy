// Original file: exa/cortex_pb/cortex.proto

import type { AcknowledgementType as _exa_cortex_pb_AcknowledgementType, AcknowledgementType__Output as _exa_cortex_pb_AcknowledgementType__Output } from '../../exa/cortex_pb/AcknowledgementType';
import type { ReplacementChunk as _exa_cortex_pb_ReplacementChunk, ReplacementChunk__Output as _exa_cortex_pb_ReplacementChunk__Output } from '../../exa/cortex_pb/ReplacementChunk';

export interface CortexStepProposalFeedback {
  'acknowledgementType'?: (_exa_cortex_pb_AcknowledgementType);
  'targetStepIndex'?: (number);
  'replacementChunk'?: (_exa_cortex_pb_ReplacementChunk | null);
  'target'?: "replacementChunk";
}

export interface CortexStepProposalFeedback__Output {
  'acknowledgementType': (_exa_cortex_pb_AcknowledgementType__Output);
  'targetStepIndex': (number);
  'replacementChunk'?: (_exa_cortex_pb_ReplacementChunk__Output | null);
  'target'?: "replacementChunk";
}
