// Original file: exa/chat_pb/chat.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { DeepWikiRequestType as _exa_chat_pb_DeepWikiRequestType, DeepWikiRequestType__Output as _exa_chat_pb_DeepWikiRequestType__Output } from '../../exa/chat_pb/DeepWikiRequestType';
import type { DeepWikiSymbolType as _exa_chat_pb_DeepWikiSymbolType, DeepWikiSymbolType__Output as _exa_chat_pb_DeepWikiSymbolType__Output } from '../../exa/chat_pb/DeepWikiSymbolType';

export interface GetDeepWikiRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'requestType'?: (_exa_chat_pb_DeepWikiRequestType);
  'symbolName'?: (string);
  'symbolUri'?: (string);
  'context'?: (string);
  'symbolType'?: (_exa_chat_pb_DeepWikiSymbolType);
  'language'?: (string);
}

export interface GetDeepWikiRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'requestType': (_exa_chat_pb_DeepWikiRequestType__Output);
  'symbolName': (string);
  'symbolUri': (string);
  'context': (string);
  'symbolType': (_exa_chat_pb_DeepWikiSymbolType__Output);
  'language': (string);
}
