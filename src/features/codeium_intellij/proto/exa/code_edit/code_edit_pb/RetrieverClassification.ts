// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { RetrieverInfo as _exa_code_edit_code_edit_pb_RetrieverInfo, RetrieverInfo__Output as _exa_code_edit_code_edit_pb_RetrieverInfo__Output } from '../../../exa/code_edit/code_edit_pb/RetrieverInfo';

export interface RetrieverClassification {
  'relevanceScore'?: (number | string);
  'retrieverInfo'?: (_exa_code_edit_code_edit_pb_RetrieverInfo | null);
}

export interface RetrieverClassification__Output {
  'relevanceScore': (number);
  'retrieverInfo': (_exa_code_edit_code_edit_pb_RetrieverInfo__Output | null);
}
