// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { DocumentLinesElement as _exa_codeium_common_pb_DocumentLinesElement, DocumentLinesElement__Output as _exa_codeium_common_pb_DocumentLinesElement__Output } from '../../exa/codeium_common_pb/DocumentLinesElement';

export interface DocumentOutlineElement {
  'codeContextItem'?: (_exa_codeium_common_pb_CodeContextItem | null);
  'documentLinesElement'?: (_exa_codeium_common_pb_DocumentLinesElement | null);
  'text'?: (string);
  'element'?: "codeContextItem"|"documentLinesElement"|"text";
}

export interface DocumentOutlineElement__Output {
  'codeContextItem'?: (_exa_codeium_common_pb_CodeContextItem__Output | null);
  'documentLinesElement'?: (_exa_codeium_common_pb_DocumentLinesElement__Output | null);
  'text'?: (string);
  'element'?: "codeContextItem"|"documentLinesElement"|"text";
}
