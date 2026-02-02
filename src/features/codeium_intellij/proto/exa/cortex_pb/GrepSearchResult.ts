// Original file: exa/cortex_pb/cortex.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface GrepSearchResult {
  'relativePath'?: (string);
  'lineNumber'?: (number);
  'content'?: (string);
  'absolutePath'?: (string);
  'cci'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'matchCount'?: (number);
}

export interface GrepSearchResult__Output {
  'relativePath': (string);
  'lineNumber': (number);
  'content': (string);
  'absolutePath': (string);
  'cci': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'matchCount': (number);
}
