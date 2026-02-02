// Original file: exa/chat_pb/chat.proto

import type { Long } from '@grpc/proto-loader';

export interface DeepWikiSymbolRange {
  'startLine'?: (number | string | Long);
  'startColumn'?: (number | string | Long);
  'endLine'?: (number | string | Long);
  'endColumn'?: (number | string | Long);
}

export interface DeepWikiSymbolRange__Output {
  'startLine': (string);
  'startColumn': (string);
  'endLine': (string);
  'endColumn': (string);
}
