// Original file: exa/cortex_pb/cortex.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface CortexStepViewCodeItem {
  'absoluteUri'?: (string);
  'nodePaths'?: (string)[];
  'ccis'?: (_exa_codeium_common_pb_CodeContextItem)[];
}

export interface CortexStepViewCodeItem__Output {
  'absoluteUri': (string);
  'nodePaths': (string)[];
  'ccis': (_exa_codeium_common_pb_CodeContextItem__Output)[];
}
