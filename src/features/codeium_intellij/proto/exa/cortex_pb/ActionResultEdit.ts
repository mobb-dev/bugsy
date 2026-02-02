// Original file: exa/cortex_pb/cortex.proto

import type { DiffBlock as _exa_diff_action_pb_DiffBlock, DiffBlock__Output as _exa_diff_action_pb_DiffBlock__Output } from '../../exa/diff_action_pb/DiffBlock';
import type { ActionDebugInfo as _exa_cortex_pb_ActionDebugInfo, ActionDebugInfo__Output as _exa_cortex_pb_ActionDebugInfo__Output } from '../../exa/cortex_pb/ActionDebugInfo';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface ActionResultEdit {
  'absolutePathMigrateMeToUri'?: (string);
  'diff'?: (_exa_diff_action_pb_DiffBlock | null);
  'contextPrefix'?: (string);
  'contextSuffix'?: (string);
  'debugInfo'?: (_exa_cortex_pb_ActionDebugInfo | null);
  'completionId'?: (string);
  'fileContentHash'?: (string);
  'absoluteUri'?: (string);
  'resultCcis'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'originalContent'?: (string);
  'createFile'?: (boolean);
  'promptId'?: (string);
  'newContent'?: (string);
}

export interface ActionResultEdit__Output {
  'absolutePathMigrateMeToUri': (string);
  'diff': (_exa_diff_action_pb_DiffBlock__Output | null);
  'contextPrefix': (string);
  'contextSuffix': (string);
  'debugInfo': (_exa_cortex_pb_ActionDebugInfo__Output | null);
  'completionId': (string);
  'fileContentHash': (string);
  'absoluteUri': (string);
  'resultCcis': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'originalContent': (string);
  'createFile': (boolean);
  'promptId': (string);
  'newContent': (string);
}
