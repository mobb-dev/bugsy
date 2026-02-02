// Original file: exa/codeium_common_pb/codeium_common.proto

import type { DocumentOutlineElement as _exa_codeium_common_pb_DocumentOutlineElement, DocumentOutlineElement__Output as _exa_codeium_common_pb_DocumentOutlineElement__Output } from '../../exa/codeium_common_pb/DocumentOutlineElement';
import type { Long } from '@grpc/proto-loader';

export interface DocumentOutline {
  'elements'?: (_exa_codeium_common_pb_DocumentOutlineElement)[];
  'startIndex'?: (number | string | Long);
}

export interface DocumentOutline__Output {
  'elements': (_exa_codeium_common_pb_DocumentOutlineElement__Output)[];
  'startIndex': (string);
}
