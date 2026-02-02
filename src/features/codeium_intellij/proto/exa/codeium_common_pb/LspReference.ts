// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Range as _exa_codeium_common_pb_Range, Range__Output as _exa_codeium_common_pb_Range__Output } from '../../exa/codeium_common_pb/Range';

export interface LspReference {
  'uri'?: (string);
  'range'?: (_exa_codeium_common_pb_Range | null);
  'snippet'?: (string);
  '_snippet'?: "snippet";
}

export interface LspReference__Output {
  'uri': (string);
  'range': (_exa_codeium_common_pb_Range__Output | null);
  'snippet'?: (string);
  '_snippet'?: "snippet";
}
