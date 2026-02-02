// Original file: exa/chat_pb/chat.proto

import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';
import type { CodeBlockInfo as _exa_chat_pb_CodeBlockInfo, CodeBlockInfo__Output as _exa_chat_pb_CodeBlockInfo__Output } from '../../exa/chat_pb/CodeBlockInfo';

export interface IntentFastApply {
  'diffOutline'?: (string);
  'language'?: (_exa_codeium_common_pb_Language);
  'oldCode'?: (_exa_chat_pb_CodeBlockInfo | null);
}

export interface IntentFastApply__Output {
  'diffOutline': (string);
  'language': (_exa_codeium_common_pb_Language__Output);
  'oldCode': (_exa_chat_pb_CodeBlockInfo__Output | null);
}
