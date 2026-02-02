// Original file: exa/chat_pb/chat.proto

import type { DeepWikiSymbolRange as _exa_chat_pb_DeepWikiSymbolRange, DeepWikiSymbolRange__Output as _exa_chat_pb_DeepWikiSymbolRange__Output } from '../../exa/chat_pb/DeepWikiSymbolRange';
import type { DeepWikiSymbolType as _exa_chat_pb_DeepWikiSymbolType, DeepWikiSymbolType__Output as _exa_chat_pb_DeepWikiSymbolType__Output } from '../../exa/chat_pb/DeepWikiSymbolType';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface DeepWikiSymbolContext {
  'symbolName'?: (string);
  'symbolUri'?: (string);
  'symbolRange'?: (_exa_chat_pb_DeepWikiSymbolRange | null);
  'symbolType'?: (_exa_chat_pb_DeepWikiSymbolType);
  'fileContext'?: (string);
  'usageContext'?: (string);
  'traceContext'?: (string);
  'quickGrepContext'?: (string);
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface DeepWikiSymbolContext__Output {
  'symbolName': (string);
  'symbolUri': (string);
  'symbolRange': (_exa_chat_pb_DeepWikiSymbolRange__Output | null);
  'symbolType': (_exa_chat_pb_DeepWikiSymbolType__Output);
  'fileContext': (string);
  'usageContext': (string);
  'traceContext': (string);
  'quickGrepContext': (string);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}
