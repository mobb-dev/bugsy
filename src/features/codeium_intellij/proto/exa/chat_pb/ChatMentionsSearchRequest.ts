// Original file: exa/chat_pb/chat.proto

import type { CodeContextType as _exa_codeium_common_pb_CodeContextType, CodeContextType__Output as _exa_codeium_common_pb_CodeContextType__Output } from '../../exa/codeium_common_pb/CodeContextType';

export interface ChatMentionsSearchRequest {
  'query'?: (string);
  'allowedTypes'?: (_exa_codeium_common_pb_CodeContextType)[];
  'includeRepoInfo'?: (boolean);
}

export interface ChatMentionsSearchRequest__Output {
  'query': (string);
  'allowedTypes': (_exa_codeium_common_pb_CodeContextType__Output)[];
  'includeRepoInfo': (boolean);
}
