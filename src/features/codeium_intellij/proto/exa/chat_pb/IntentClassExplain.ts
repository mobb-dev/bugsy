// Original file: exa/chat_pb/chat.proto

import type { ClassInfo as _exa_codeium_common_pb_ClassInfo, ClassInfo__Output as _exa_codeium_common_pb_ClassInfo__Output } from '../../exa/codeium_common_pb/ClassInfo';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface IntentClassExplain {
  'classInfo'?: (_exa_codeium_common_pb_ClassInfo | null);
  'language'?: (_exa_codeium_common_pb_Language);
  'filePathMigrateMeToUri'?: (string);
  'uri'?: (string);
}

export interface IntentClassExplain__Output {
  'classInfo': (_exa_codeium_common_pb_ClassInfo__Output | null);
  'language': (_exa_codeium_common_pb_Language__Output);
  'filePathMigrateMeToUri': (string);
  'uri': (string);
}
