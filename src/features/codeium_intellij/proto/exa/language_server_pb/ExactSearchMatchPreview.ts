// Original file: exa/language_server_pb/language_server.proto

import type { Range as _exa_codeium_common_pb_Range, Range__Output as _exa_codeium_common_pb_Range__Output } from '../../exa/codeium_common_pb/Range';

export interface ExactSearchMatchPreview {
  'text'?: (string);
  'ranges'?: (_exa_codeium_common_pb_Range)[];
}

export interface ExactSearchMatchPreview__Output {
  'text': (string);
  'ranges': (_exa_codeium_common_pb_Range__Output)[];
}
