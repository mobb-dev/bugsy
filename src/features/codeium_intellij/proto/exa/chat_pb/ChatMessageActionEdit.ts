// Original file: exa/chat_pb/chat.proto

import type { DiffBlock as _exa_diff_action_pb_DiffBlock, DiffBlock__Output as _exa_diff_action_pb_DiffBlock__Output } from '../../exa/diff_action_pb/DiffBlock';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface ChatMessageActionEdit {
  'filePathMigrateMeToUri'?: (string);
  'diff'?: (_exa_diff_action_pb_DiffBlock | null);
  'language'?: (_exa_codeium_common_pb_Language);
  'textPre'?: (string);
  'textPost'?: (string);
  'uri'?: (string);
}

export interface ChatMessageActionEdit__Output {
  'filePathMigrateMeToUri': (string);
  'diff': (_exa_diff_action_pb_DiffBlock__Output | null);
  'language': (_exa_codeium_common_pb_Language__Output);
  'textPre': (string);
  'textPost': (string);
  'uri': (string);
}
