// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface FunctionInfo {
  'rawSource'?: (string);
  'cleanFunction'?: (string);
  'docstring'?: (string);
  'nodeName'?: (string);
  'params'?: (string);
  'definitionLine'?: (number);
  'startLine'?: (number);
  'endLine'?: (number);
  'startCol'?: (number);
  'endCol'?: (number);
  'leadingWhitespace'?: (string);
  'language'?: (_exa_codeium_common_pb_Language);
  'bodyStartLine'?: (number);
  'bodyStartCol'?: (number);
}

export interface FunctionInfo__Output {
  'rawSource': (string);
  'cleanFunction': (string);
  'docstring': (string);
  'nodeName': (string);
  'params': (string);
  'definitionLine': (number);
  'startLine': (number);
  'endLine': (number);
  'startCol': (number);
  'endCol': (number);
  'leadingWhitespace': (string);
  'language': (_exa_codeium_common_pb_Language__Output);
  'bodyStartLine': (number);
  'bodyStartCol': (number);
}
