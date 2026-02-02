// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { CodeContextItemChange as _exa_code_edit_code_edit_pb_CodeContextItemChange, CodeContextItemChange__Output as _exa_code_edit_code_edit_pb_CodeContextItemChange__Output } from '../../../exa/code_edit/code_edit_pb/CodeContextItemChange';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../../exa/codeium_common_pb/CodeContextItem';

export interface FileChange {
  'startFilePathMigrateMeToUri'?: (string);
  'endFilePathMigrateMeToUri'?: (string);
  'oldFileContent'?: (string);
  'newFileContent'?: (string);
  'codeContextItemChanges'?: (_exa_code_edit_code_edit_pb_CodeContextItemChange)[];
  'unchangedCodeContextItems'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'startFileRelPath'?: (string);
  'endFileRelPath'?: (string);
  'startFileUri'?: (string);
  'endFileUri'?: (string);
}

export interface FileChange__Output {
  'startFilePathMigrateMeToUri': (string);
  'endFilePathMigrateMeToUri': (string);
  'oldFileContent': (string);
  'newFileContent': (string);
  'codeContextItemChanges': (_exa_code_edit_code_edit_pb_CodeContextItemChange__Output)[];
  'unchangedCodeContextItems': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'startFileRelPath': (string);
  'endFileRelPath': (string);
  'startFileUri': (string);
  'endFileUri': (string);
}
