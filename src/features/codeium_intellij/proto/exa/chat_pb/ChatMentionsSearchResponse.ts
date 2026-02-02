// Original file: exa/chat_pb/chat.proto

import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from '../../exa/codeium_common_pb/CodeContextItem';
import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from '../../exa/codeium_common_pb/GitRepoInfo';

export interface ChatMentionsSearchResponse {
  'cciItems'?: (_exa_codeium_common_pb_CodeContextItem)[];
  'repoInfos'?: (_exa_codeium_common_pb_GitRepoInfo)[];
}

export interface ChatMentionsSearchResponse__Output {
  'cciItems': (_exa_codeium_common_pb_CodeContextItem__Output)[];
  'repoInfos': (_exa_codeium_common_pb_GitRepoInfo__Output)[];
}
