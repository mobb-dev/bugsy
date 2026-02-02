// Original file: exa/codeium_common_pb/codeium_common.proto

import type { FunctionInfo as _exa_codeium_common_pb_FunctionInfo, FunctionInfo__Output as _exa_codeium_common_pb_FunctionInfo__Output } from '../../exa/codeium_common_pb/FunctionInfo';
import type { Language as _exa_codeium_common_pb_Language, Language__Output as _exa_codeium_common_pb_Language__Output } from '../../exa/codeium_common_pb/Language';

export interface ClassInfo {
  'rawSource'?: (string);
  'startLine'?: (number);
  'endLine'?: (number);
  'startCol'?: (number);
  'endCol'?: (number);
  'leadingWhitespace'?: (string);
  'fieldsAndConstructors'?: (string)[];
  'docstring'?: (string);
  'nodeName'?: (string);
  'methods'?: (_exa_codeium_common_pb_FunctionInfo)[];
  'nodeLineage'?: (string)[];
  'isExported'?: (boolean);
  'language'?: (_exa_codeium_common_pb_Language);
  'definitionLine'?: (number);
}

export interface ClassInfo__Output {
  'rawSource': (string);
  'startLine': (number);
  'endLine': (number);
  'startCol': (number);
  'endCol': (number);
  'leadingWhitespace': (string);
  'fieldsAndConstructors': (string)[];
  'docstring': (string);
  'nodeName': (string);
  'methods': (_exa_codeium_common_pb_FunctionInfo__Output)[];
  'nodeLineage': (string)[];
  'isExported': (boolean);
  'language': (_exa_codeium_common_pb_Language__Output);
  'definitionLine': (number);
}
