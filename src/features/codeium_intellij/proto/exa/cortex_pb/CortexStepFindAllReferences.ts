// Original file: exa/cortex_pb/cortex.proto

import type { LspReference as _exa_codeium_common_pb_LspReference, LspReference__Output as _exa_codeium_common_pb_LspReference__Output } from '../../exa/codeium_common_pb/LspReference';

export interface CortexStepFindAllReferences {
  'absoluteUri'?: (string);
  'symbol'?: (string);
  'line'?: (number);
  'occurrenceIndex'?: (number);
  'references'?: (_exa_codeium_common_pb_LspReference)[];
}

export interface CortexStepFindAllReferences__Output {
  'absoluteUri': (string);
  'symbol': (string);
  'line': (number);
  'occurrenceIndex': (number);
  'references': (_exa_codeium_common_pb_LspReference__Output)[];
}
