// Original file: exa/language_server_pb/language_server.proto

import type { RawGetChatMessageResponse as _exa_language_server_pb_RawGetChatMessageResponse, RawGetChatMessageResponse__Output as _exa_language_server_pb_RawGetChatMessageResponse__Output } from '../../exa/language_server_pb/RawGetChatMessageResponse';
import type { DeepWikiModelType as _exa_codeium_common_pb_DeepWikiModelType, DeepWikiModelType__Output as _exa_codeium_common_pb_DeepWikiModelType__Output } from '../../exa/codeium_common_pb/DeepWikiModelType';

export interface GetDeepWikiResponse {
  'response'?: (_exa_language_server_pb_RawGetChatMessageResponse | null);
  'requestId'?: (string);
  'modelType'?: (_exa_codeium_common_pb_DeepWikiModelType);
  'followupQuestions'?: (string);
  'isArticleDone'?: (boolean);
}

export interface GetDeepWikiResponse__Output {
  'response': (_exa_language_server_pb_RawGetChatMessageResponse__Output | null);
  'requestId': (string);
  'modelType': (_exa_codeium_common_pb_DeepWikiModelType__Output);
  'followupQuestions': (string);
  'isArticleDone': (boolean);
}
