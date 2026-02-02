// Original file: exa/language_server_pb/language_server.proto

import type { SearchResult as _exa_language_server_pb_SearchResult, SearchResult__Output as _exa_language_server_pb_SearchResult__Output } from '../../exa/language_server_pb/SearchResult';

export interface SearchResultCluster {
  'searchResults'?: (_exa_language_server_pb_SearchResult)[];
  'representativePath'?: (string);
  'description'?: (string);
  'meanSimilarityScore'?: (number | string);
  'searchId'?: (string);
  'resultId'?: (string);
}

export interface SearchResultCluster__Output {
  'searchResults': (_exa_language_server_pb_SearchResult__Output)[];
  'representativePath': (string);
  'description': (string);
  'meanSimilarityScore': (number);
  'searchId': (string);
  'resultId': (string);
}
