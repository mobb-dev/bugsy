// Original file: exa/chat_pb/chat.proto

import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface IntentGenerateCode {
  'instruction'?: (string);
  'language'?: (_exa_codeium_common_pb_Language);
  'filePathMigrateMeToUri'?: (string);
  'lineNumber'?: (number);
  'uri'?: (string);
}

export interface IntentGenerateCode__Output {
  'instruction': (string);
  'language': (_exa_codeium_common_pb_Language__Output);
  'filePathMigrateMeToUri': (string);
  'lineNumber': (number);
  'uri': (string);
}
