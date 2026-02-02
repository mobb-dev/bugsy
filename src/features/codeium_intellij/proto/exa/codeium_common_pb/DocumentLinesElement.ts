// Original file: exa/codeium_common_pb/codeium_common.proto

import type { DocumentQuery as _exa_codeium_common_pb_DocumentQuery, DocumentQuery__Output as _exa_codeium_common_pb_DocumentQuery__Output } from '../../exa/codeium_common_pb/DocumentQuery';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface DocumentLinesElement {
  'documentQuery'?: (_exa_codeium_common_pb_DocumentQuery | null);
  'overlappedCodeContextItems'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'firstElementSuffixOverlap'?: (number);
  'lastElementPrefixOverlap'?: (number);
}

export interface DocumentLinesElement__Output {
  'documentQuery': (_exa_codeium_common_pb_DocumentQuery__Output | null);
  'overlappedCodeContextItems': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'firstElementSuffixOverlap': (number);
  'lastElementPrefixOverlap': (number);
}
