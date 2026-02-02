// Original file: exa/cortex_pb/cortex.proto

import type { SupercompleteEphemeralFeedbackEntry as _exa_cortex_pb_SupercompleteEphemeralFeedbackEntry, SupercompleteEphemeralFeedbackEntry__Output as _exa_cortex_pb_SupercompleteEphemeralFeedbackEntry__Output } from '../../exa/cortex_pb/SupercompleteEphemeralFeedbackEntry';
import type { Long } from '@grpc/proto-loader';

export interface CortexStepSupercompleteEphemeralFeedback {
  'feedbackEntries'?: (_exa_cortex_pb_SupercompleteEphemeralFeedbackEntry)[];
  'creationTimestampMs'?: (number | string | Long);
}

export interface CortexStepSupercompleteEphemeralFeedback__Output {
  'feedbackEntries': (_exa_cortex_pb_SupercompleteEphemeralFeedbackEntry__Output)[];
  'creationTimestampMs': (string);
}
