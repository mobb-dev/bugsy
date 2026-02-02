// Original file: exa/language_server_pb/language_server.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';

export interface GetMatchingCodeContextResponse {
  'matchedItems'?: (_exa_codeium_common_pb_CodeContextItem)[];
}

export interface GetMatchingCodeContextResponse__Output {
  'matchedItems': (_exa_codeium_common_pb_CodeContextItem__Output)[];
}
