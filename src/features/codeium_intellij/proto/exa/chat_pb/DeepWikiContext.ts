// Original file: exa/chat_pb/chat.proto

import type { DeepWikiHoverContext as _exa_chat_pb_DeepWikiHoverContext, DeepWikiHoverContext__Output as _exa_chat_pb_DeepWikiHoverContext__Output } from '../../exa/chat_pb/DeepWikiHoverContext';
import type { FunctionCallInfo as _exa_chat_pb_FunctionCallInfo, FunctionCallInfo__Output as _exa_chat_pb_FunctionCallInfo__Output } from '../../exa/chat_pb/FunctionCallInfo';

export interface DeepWikiContext {
  'enclosingHoverContext'?: (_exa_chat_pb_DeepWikiHoverContext | null);
  'functionCallInfo'?: (_exa_chat_pb_FunctionCallInfo | null);
}

export interface DeepWikiContext__Output {
  'enclosingHoverContext': (_exa_chat_pb_DeepWikiHoverContext__Output | null);
  'functionCallInfo': (_exa_chat_pb_FunctionCallInfo__Output | null);
}
