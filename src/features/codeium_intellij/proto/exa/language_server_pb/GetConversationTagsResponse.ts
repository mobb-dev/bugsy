// Original file: exa/language_server_pb/language_server.proto

import type { ConversationTagList as _exa_language_server_pb_ConversationTagList, ConversationTagList__Output as _exa_language_server_pb_ConversationTagList__Output } from '../../exa/language_server_pb/ConversationTagList';

export interface GetConversationTagsResponse {
  'conversationTags'?: ({[key: string]: _exa_language_server_pb_ConversationTagList});
}

export interface GetConversationTagsResponse__Output {
  'conversationTags': ({[key: string]: _exa_language_server_pb_ConversationTagList__Output});
}
