// Original file: exa/code_edit/code_edit_pb/code_edit.proto

import type { RetrieverInfo as _exa_code_edit_code_edit_pb_RetrieverInfo, RetrieverInfo__Output as _exa_code_edit_code_edit_pb_RetrieverInfo__Output } from '../../../exa/code_edit/code_edit_pb/RetrieverInfo';

export interface RetrievalMetrics {
  'retrieverInfo'?: (_exa_code_edit_code_edit_pb_RetrieverInfo | null);
  'precisionScore'?: (number | string);
  'recallScore'?: (number | string);
  'accuracyScore'?: (number | string);
  'labelRankingAveragePrecisionScore'?: (number | string);
  'rocAucScore'?: (number | string);
  'averagePrecisionScore'?: (number | string);
  'threshold'?: (number | string);
}

export interface RetrievalMetrics__Output {
  'retrieverInfo': (_exa_code_edit_code_edit_pb_RetrieverInfo__Output | null);
  'precisionScore': (number);
  'recallScore': (number);
  'accuracyScore': (number);
  'labelRankingAveragePrecisionScore': (number);
  'rocAucScore': (number);
  'averagePrecisionScore': (number);
  'threshold': (number);
}
