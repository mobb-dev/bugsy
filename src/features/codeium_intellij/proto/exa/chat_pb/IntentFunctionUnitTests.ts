// Original file: exa/chat_pb/chat.proto

import type { FunctionInfo as _exa_codeium_common_pb_FunctionInfo, FunctionInfo__Output as _exa_codeium_common_pb_FunctionInfo__Output } from '../../exa/codeium_common_pb/FunctionInfo';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface IntentFunctionUnitTests {
  'functionInfo'?: (_exa_codeium_common_pb_FunctionInfo | null);
  'language'?: (_exa_codeium_common_pb_Language);
  'filePathMigrateMeToUri'?: (string);
  'instructions'?: (string);
  'uri'?: (string);
}

export interface IntentFunctionUnitTests__Output {
  'functionInfo': (_exa_codeium_common_pb_FunctionInfo__Output | null);
  'language': (_exa_codeium_common_pb_Language__Output);
  'filePathMigrateMeToUri': (string);
  'instructions': (string);
  'uri': (string);
}
