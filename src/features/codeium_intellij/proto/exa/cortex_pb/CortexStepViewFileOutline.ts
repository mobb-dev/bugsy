// Original file: exa/cortex_pb/cortex.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface CortexStepViewFileOutline {
  'absolutePathUri'?: (string);
  'cciOffset'?: (number);
  'ccis'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'totalCciCount'?: (number);
  'numLines'?: (number);
  'numBytes'?: (number);
  'contents'?: (string);
  'contentLinesTruncated'?: (number);
  'outlineItems'?: (string)[];
  'numItemsScanned'?: (number);
  'triggeredMemories'?: (string);
  'rawContent'?: (string);
}

export interface CortexStepViewFileOutline__Output {
  'absolutePathUri': (string);
  'cciOffset': (number);
  'ccis': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'totalCciCount': (number);
  'numLines': (number);
  'numBytes': (number);
  'contents': (string);
  'contentLinesTruncated': (number);
  'outlineItems': (string)[];
  'numItemsScanned': (number);
  'triggeredMemories': (string);
  'rawContent': (string);
}
