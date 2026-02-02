// Original file: exa/chat_pb/chat.proto

import type { CodeBlockInfo as _exa_chat_pb_CodeBlockInfo, CodeBlockInfo__Output as _exa_chat_pb_CodeBlockInfo__Output } from '../../exa/chat_pb/CodeBlockInfo';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface IntentCodeBlockRefactor {
  'codeBlockInfo'?: (_exa_chat_pb_CodeBlockInfo | null);
  'language'?: (_exa_codeium_common_pb_Language);
  'filePathMigrateMeToUri'?: (string);
  'refactorDescription'?: (string);
  'uri'?: (string);
}

export interface IntentCodeBlockRefactor__Output {
  'codeBlockInfo': (_exa_chat_pb_CodeBlockInfo__Output | null);
  'language': (_exa_codeium_common_pb_Language__Output);
  'filePathMigrateMeToUri': (string);
  'refactorDescription': (string);
  'uri': (string);
}
