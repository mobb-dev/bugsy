// Original file: exa/language_server_pb/language_server.proto

import type { State as _exa_language_server_pb_State, State__Output as _exa_language_server_pb_State__Output } from '../../exa/language_server_pb/State';
import type { CompletionItem as _exa_language_server_pb_CompletionItem, CompletionItem__Output as _exa_language_server_pb_CompletionItem__Output } from '../../exa/language_server_pb/CompletionItem';
import type { RequestInfo as _exa_language_server_pb_RequestInfo, RequestInfo__Output as _exa_language_server_pb_RequestInfo__Output } from '../../exa/language_server_pb/RequestInfo';
import type { LatencyInfo as _exa_language_server_pb_LatencyInfo, LatencyInfo__Output as _exa_language_server_pb_LatencyInfo__Output } from '../../exa/language_server_pb/LatencyInfo';
import type { CodeRange as _exa_language_server_pb_CodeRange, CodeRange__Output as _exa_language_server_pb_CodeRange__Output } from '../../exa/language_server_pb/CodeRange';

export interface GetCompletionsResponse {
  'state'?: (_exa_language_server_pb_State | null);
  'completionItems'?: (_exa_language_server_pb_CompletionItem)[];
  'requestInfo'?: (_exa_language_server_pb_RequestInfo | null);
  'latencyInfo'?: (_exa_language_server_pb_LatencyInfo | null);
  'modelTag'?: (string);
  'promptId'?: (string);
  'filteredCompletionItems'?: (_exa_language_server_pb_CompletionItem)[];
  'codeRanges'?: (_exa_language_server_pb_CodeRange)[];
}

export interface GetCompletionsResponse__Output {
  'state': (_exa_language_server_pb_State__Output | null);
  'completionItems': (_exa_language_server_pb_CompletionItem__Output)[];
  'requestInfo': (_exa_language_server_pb_RequestInfo__Output | null);
  'latencyInfo': (_exa_language_server_pb_LatencyInfo__Output | null);
  'modelTag': (string);
  'promptId': (string);
  'filteredCompletionItems': (_exa_language_server_pb_CompletionItem__Output)[];
  'codeRanges': (_exa_language_server_pb_CodeRange__Output)[];
}
