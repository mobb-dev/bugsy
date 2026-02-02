// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ContextSuggestionSource as _exa_language_server_pb_ContextSuggestionSource, ContextSuggestionSource__Output as _exa_language_server_pb_ContextSuggestionSource__Output } from '../../exa/language_server_pb/ContextSuggestionSource';
import type { Long } from '@grpc/proto-loader';

export interface GetSuggestedContextScopeItemsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'suggestionSources'?: (_exa_language_server_pb_ContextSuggestionSource)[];
  'query'?: (string);
  'autoExpandFileLimit'?: (number | string | Long);
  'maxItems'?: (number | string | Long);
}

export interface GetSuggestedContextScopeItemsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'suggestionSources': (_exa_language_server_pb_ContextSuggestionSource__Output)[];
  'query': (string);
  'autoExpandFileLimit': (string);
  'maxItems': (string);
}
