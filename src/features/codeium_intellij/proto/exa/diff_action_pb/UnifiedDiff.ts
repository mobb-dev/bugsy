// Original file: exa/diff_action_pb/diff_action.proto

import type { UnifiedDiffLineType as _exa_diff_action_pb_UnifiedDiffLineType, UnifiedDiffLineType__Output as _exa_diff_action_pb_UnifiedDiffLineType__Output } from '../../exa/diff_action_pb/UnifiedDiffLineType';

export interface _exa_diff_action_pb_UnifiedDiff_UnifiedDiffLine {
  'text'?: (string);
  'type'?: (_exa_diff_action_pb_UnifiedDiffLineType);
}

export interface _exa_diff_action_pb_UnifiedDiff_UnifiedDiffLine__Output {
  'text': (string);
  'type': (_exa_diff_action_pb_UnifiedDiffLineType__Output);
}

export interface UnifiedDiff {
  'lines'?: (_exa_diff_action_pb_UnifiedDiff_UnifiedDiffLine)[];
}

export interface UnifiedDiff__Output {
  'lines': (_exa_diff_action_pb_UnifiedDiff_UnifiedDiffLine__Output)[];
}
