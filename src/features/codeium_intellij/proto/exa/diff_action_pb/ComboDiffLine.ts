// Original file: exa/diff_action_pb/diff_action.proto

import type { DiffChangeType as _exa_diff_action_pb_DiffChangeType, DiffChangeType__Output as _exa_diff_action_pb_DiffChangeType__Output } from '../../exa/diff_action_pb/DiffChangeType';
import type { CharacterDiff as _exa_diff_action_pb_CharacterDiff, CharacterDiff__Output as _exa_diff_action_pb_CharacterDiff__Output } from '../../exa/diff_action_pb/CharacterDiff';

export interface ComboDiffLine {
  'text'?: (string);
  'type'?: (_exa_diff_action_pb_DiffChangeType);
  'characterDiff'?: (_exa_diff_action_pb_CharacterDiff | null);
}

export interface ComboDiffLine__Output {
  'text': (string);
  'type': (_exa_diff_action_pb_DiffChangeType__Output);
  'characterDiff': (_exa_diff_action_pb_CharacterDiff__Output | null);
}
