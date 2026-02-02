// Original file: exa/codeium_common_pb/codeium_common.proto

import type { FileLineRange as _exa_codeium_common_pb_FileLineRange, FileLineRange__Output as _exa_codeium_common_pb_FileLineRange__Output } from '../../exa/codeium_common_pb/FileLineRange';

export interface TextBlock {
  'content'?: (string);
  'fileLineRange'?: (_exa_codeium_common_pb_FileLineRange | null);
  'label'?: (string);
  'identifier'?: "fileLineRange"|"label";
}

export interface TextBlock__Output {
  'content': (string);
  'fileLineRange'?: (_exa_codeium_common_pb_FileLineRange__Output | null);
  'label'?: (string);
  'identifier'?: "fileLineRange"|"label";
}
