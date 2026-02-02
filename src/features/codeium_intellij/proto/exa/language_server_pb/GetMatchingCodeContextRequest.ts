// Original file: exa/language_server_pb/language_server.proto

import type { CodeContextType as _exa_codeium_common_pb_CodeContextType, CodeContextType__Output as _exa_codeium_common_pb_CodeContextType__Output } from '../../exa/codeium_common_pb/CodeContextType';

export interface GetMatchingCodeContextRequest {
  'query'?: (string);
  'fuzzyMatch'?: (boolean);
  'allowedTypes'?: (_exa_codeium_common_pb_CodeContextType)[];
  'maxItems'?: (number);
  'caseInsensitive'?: (boolean);
}

export interface GetMatchingCodeContextRequest__Output {
  'query': (string);
  'fuzzyMatch': (boolean);
  'allowedTypes': (_exa_codeium_common_pb_CodeContextType__Output)[];
  'maxItems': (number);
  'caseInsensitive': (boolean);
}
