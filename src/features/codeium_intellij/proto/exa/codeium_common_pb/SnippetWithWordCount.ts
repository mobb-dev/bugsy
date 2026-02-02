// Original file: exa/codeium_common_pb/codeium_common.proto

import type { WordCount as _exa_codeium_common_pb_WordCount, WordCount__Output as _exa_codeium_common_pb_WordCount__Output } from '../../exa/codeium_common_pb/WordCount';

export interface SnippetWithWordCount {
  'snippet'?: (string);
  'wordCountBySplitter'?: ({[key: string]: _exa_codeium_common_pb_WordCount});
}

export interface SnippetWithWordCount__Output {
  'snippet': (string);
  'wordCountBySplitter': ({[key: string]: _exa_codeium_common_pb_WordCount__Output});
}
