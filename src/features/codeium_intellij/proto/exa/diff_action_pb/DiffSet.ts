// Original file: exa/diff_action_pb/diff_action.proto

import type { UnifiedDiff as _exa_diff_action_pb_UnifiedDiff, UnifiedDiff__Output as _exa_diff_action_pb_UnifiedDiff__Output } from '../../exa/diff_action_pb/UnifiedDiff';
import type { CharacterDiff as _exa_diff_action_pb_CharacterDiff, CharacterDiff__Output as _exa_diff_action_pb_CharacterDiff__Output } from '../../exa/diff_action_pb/CharacterDiff';
import type { ComboDiff as _exa_diff_action_pb_ComboDiff, ComboDiff__Output as _exa_diff_action_pb_ComboDiff__Output } from '../../exa/diff_action_pb/ComboDiff';

export interface DiffSet {
  'unifiedDiff'?: (_exa_diff_action_pb_UnifiedDiff | null);
  'characterDiff'?: (_exa_diff_action_pb_CharacterDiff | null);
  'comboDiff'?: (_exa_diff_action_pb_ComboDiff | null);
}

export interface DiffSet__Output {
  'unifiedDiff': (_exa_diff_action_pb_UnifiedDiff__Output | null);
  'characterDiff': (_exa_diff_action_pb_CharacterDiff__Output | null);
  'comboDiff': (_exa_diff_action_pb_ComboDiff__Output | null);
}
