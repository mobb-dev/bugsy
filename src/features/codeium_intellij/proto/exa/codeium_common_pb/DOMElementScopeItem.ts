// Original file: exa/codeium_common_pb/codeium_common.proto

import type { FileLineRange as _exa_codeium_common_pb_FileLineRange, FileLineRange__Output as _exa_codeium_common_pb_FileLineRange__Output } from '../../exa/codeium_common_pb/FileLineRange';

export interface DOMElementScopeItem {
  'tagName'?: (string);
  'outerHtml'?: (string);
  'id'?: (string);
  'reactComponentName'?: (string);
  'fileLineRange'?: (_exa_codeium_common_pb_FileLineRange | null);
}

export interface DOMElementScopeItem__Output {
  'tagName': (string);
  'outerHtml': (string);
  'id': (string);
  'reactComponentName': (string);
  'fileLineRange': (_exa_codeium_common_pb_FileLineRange__Output | null);
}
