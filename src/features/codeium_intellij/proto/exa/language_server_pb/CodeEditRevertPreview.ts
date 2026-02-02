// Original file: exa/language_server_pb/language_server.proto

import type { UnifiedDiff as _exa_diff_action_pb_UnifiedDiff, UnifiedDiff__Output as _exa_diff_action_pb_UnifiedDiff__Output } from '../../exa/diff_action_pb/UnifiedDiff';
import type { CodeRevertActionType as _exa_language_server_pb_CodeRevertActionType, CodeRevertActionType__Output as _exa_language_server_pb_CodeRevertActionType__Output } from '../../exa/language_server_pb/CodeRevertActionType';

export interface CodeEditRevertPreview {
  'fileUri'?: (string);
  'diff'?: (_exa_diff_action_pb_UnifiedDiff | null);
  'actionType'?: (_exa_language_server_pb_CodeRevertActionType);
}

export interface CodeEditRevertPreview__Output {
  'fileUri': (string);
  'diff': (_exa_diff_action_pb_UnifiedDiff__Output | null);
  'actionType': (_exa_language_server_pb_CodeRevertActionType__Output);
}
