// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ContextScopeType as _exa_codeium_common_pb_ContextScopeType, ContextScopeType__Output as _exa_codeium_common_pb_ContextScopeType__Output } from '../../exa/codeium_common_pb/ContextScopeType';
import type { CodeContextType as _exa_codeium_common_pb_CodeContextType, CodeContextType__Output as _exa_codeium_common_pb_CodeContextType__Output } from '../../exa/codeium_common_pb/CodeContextType';

export interface GetMatchingContextScopeItemsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'allowedTypes'?: (_exa_codeium_common_pb_ContextScopeType)[];
  'query'?: (string);
  'fuzzyMatch'?: (boolean);
  'maxItems'?: (number);
  'caseInsensitive'?: (boolean);
  'allowedContextTypes'?: (_exa_codeium_common_pb_CodeContextType)[];
  'repoFilter'?: (string);
  'enablePathResolution'?: (boolean);
}

export interface GetMatchingContextScopeItemsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'allowedTypes': (_exa_codeium_common_pb_ContextScopeType__Output)[];
  'query': (string);
  'fuzzyMatch': (boolean);
  'maxItems': (number);
  'caseInsensitive': (boolean);
  'allowedContextTypes': (_exa_codeium_common_pb_CodeContextType__Output)[];
  'repoFilter': (string);
  'enablePathResolution': (boolean);
}
