// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Range as _exa_codeium_common_pb_Range, Range__Output as _exa_codeium_common_pb_Range__Output } from '../../exa/codeium_common_pb/Range';

export interface IntellisenseSuggestion {
  'range'?: (_exa_codeium_common_pb_Range | null);
  'text'?: (string);
  'label'?: (string);
  'labelDetail'?: (string);
  'description'?: (string);
  'detail'?: (string);
  'documentation'?: (string);
  'kind'?: (string);
  'selected'?: (boolean);
}

export interface IntellisenseSuggestion__Output {
  'range': (_exa_codeium_common_pb_Range__Output | null);
  'text': (string);
  'label': (string);
  'labelDetail': (string);
  'description': (string);
  'detail': (string);
  'documentation': (string);
  'kind': (string);
  'selected': (boolean);
}
