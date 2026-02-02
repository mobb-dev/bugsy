// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { RelevantCodeContext as _exa_code_edit_code_edit_pb_RelevantCodeContext, RelevantCodeContext__Output as _exa_code_edit_code_edit_pb_RelevantCodeContext__Output } from '../../../exa/code_edit/code_edit_pb/RelevantCodeContext';
import type { RetrieverClassification as _exa_code_edit_code_edit_pb_RetrieverClassification, RetrieverClassification__Output as _exa_code_edit_code_edit_pb_RetrieverClassification__Output } from '../../../exa/code_edit/code_edit_pb/RetrieverClassification';

export interface CodeContextItemWithClassification {
  'codeContextItem'?: (_exa_code_edit_code_edit_pb_RelevantCodeContext | null);
  'relevant'?: (boolean);
  'prediction'?: (_exa_code_edit_code_edit_pb_RetrieverClassification | null);
}

export interface CodeContextItemWithClassification__Output {
  'codeContextItem': (_exa_code_edit_code_edit_pb_RelevantCodeContext__Output | null);
  'relevant': (boolean);
  'prediction': (_exa_code_edit_code_edit_pb_RetrieverClassification__Output | null);
}
