// Original file: exa/language_server_pb/language_server.proto

import type { Range as _exa_codeium_common_pb_Range, Range__Output as _exa_codeium_common_pb_Range__Output } from '../../exa/codeium_common_pb/Range';
import type { ExactSearchMatchPreview as _exa_language_server_pb_ExactSearchMatchPreview, ExactSearchMatchPreview__Output as _exa_language_server_pb_ExactSearchMatchPreview__Output } from '../../exa/language_server_pb/ExactSearchMatchPreview';

export interface ExactSearchResult {
  'absolutePath'?: (string);
  'ranges'?: (_exa_codeium_common_pb_Range)[];
  'preview'?: (_exa_language_server_pb_ExactSearchMatchPreview | null);
  'relativePath'?: (string);
  'resultId'?: (string);
}

export interface ExactSearchResult__Output {
  'absolutePath': (string);
  'ranges': (_exa_codeium_common_pb_Range__Output)[];
  'preview': (_exa_language_server_pb_ExactSearchMatchPreview__Output | null);
  'relativePath': (string);
  'resultId': (string);
}
