// Original file: exa/cortex_pb/cortex.proto

import type { UnifiedDiff as _exa_diff_action_pb_UnifiedDiff, UnifiedDiff__Output as _exa_diff_action_pb_UnifiedDiff__Output } from '../../exa/diff_action_pb/UnifiedDiff';
import type { SupercompleteTabJumpInfo as _exa_cortex_pb_SupercompleteTabJumpInfo, SupercompleteTabJumpInfo__Output as _exa_cortex_pb_SupercompleteTabJumpInfo__Output } from '../../exa/cortex_pb/SupercompleteTabJumpInfo';
import type { Long } from '@grpc/proto-loader';

export interface SupercompleteEphemeralFeedbackEntry {
  'accepted'?: (boolean);
  'intentionalReject'?: (boolean);
  'completionId'?: (string);
  'timestampMs'?: (number | string | Long);
  'unifiedDiff'?: (_exa_diff_action_pb_UnifiedDiff | null);
  'tabjumpSuggestion'?: (_exa_cortex_pb_SupercompleteTabJumpInfo | null);
  'selectionStartLine'?: (number | string | Long);
}

export interface SupercompleteEphemeralFeedbackEntry__Output {
  'accepted': (boolean);
  'intentionalReject': (boolean);
  'completionId': (string);
  'timestampMs': (string);
  'unifiedDiff': (_exa_diff_action_pb_UnifiedDiff__Output | null);
  'tabjumpSuggestion': (_exa_cortex_pb_SupercompleteTabJumpInfo__Output | null);
  'selectionStartLine': (string);
}
