// Original file: exa/diff_action_pb/diff_action.proto

import type { UnifiedDiff as _exa_diff_action_pb_UnifiedDiff, UnifiedDiff__Output as _exa_diff_action_pb_UnifiedDiff__Output } from '../../exa/diff_action_pb/UnifiedDiff';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface DiffBlock {
  'startLine'?: (number);
  'endLine'?: (number);
  'unifiedDiff'?: (_exa_diff_action_pb_UnifiedDiff | null);
  'fromLanguage'?: (_exa_codeium_common_pb_Language);
  'toLanguage'?: (_exa_codeium_common_pb_Language);
}

export interface DiffBlock__Output {
  'startLine': (number);
  'endLine': (number);
  'unifiedDiff': (_exa_diff_action_pb_UnifiedDiff__Output | null);
  'fromLanguage': (_exa_codeium_common_pb_Language__Output);
  'toLanguage': (_exa_codeium_common_pb_Language__Output);
}
