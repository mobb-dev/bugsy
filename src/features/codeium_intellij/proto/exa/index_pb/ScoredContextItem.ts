// Original file: exa/index_pb/index.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface ScoredContextItem {
  'codeContextItem'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'score'?: (number | string);
}

export interface ScoredContextItem__Output {
  'codeContextItem': (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'score': (number);
}
