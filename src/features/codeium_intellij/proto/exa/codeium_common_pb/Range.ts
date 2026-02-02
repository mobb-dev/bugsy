// Original file: exa/codeium_common_pb/codeium_common.proto

import type { DocumentPosition as _exa_codeium_common_pb_DocumentPosition, DocumentPosition__Output as _exa_codeium_common_pb_DocumentPosition__Output } from '../../exa/codeium_common_pb/DocumentPosition';
import type { Long } from '@grpc/proto-loader';

export interface Range {
  'startOffset'?: (number | string | Long);
  'endOffset'?: (number | string | Long);
  'startPosition'?: (_exa_codeium_common_pb_DocumentPosition | null);
  'endPosition'?: (_exa_codeium_common_pb_DocumentPosition | null);
}

export interface Range__Output {
  'startOffset': (string);
  'endOffset': (string);
  'startPosition': (_exa_codeium_common_pb_DocumentPosition__Output | null);
  'endPosition': (_exa_codeium_common_pb_DocumentPosition__Output | null);
}
