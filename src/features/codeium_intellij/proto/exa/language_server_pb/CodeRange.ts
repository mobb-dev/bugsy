// Original file: exa/language_server_pb/language_server.proto

import type { CodeSource as _exa_codeium_common_pb_CodeSource, CodeSource__Output as _exa_codeium_common_pb_CodeSource__Output } from '../../exa/codeium_common_pb/CodeSource';
import type { CompletionType as _exa_codeium_common_pb_CompletionType, CompletionType__Output as _exa_codeium_common_pb_CompletionType__Output } from '../../exa/codeium_common_pb/CompletionType';
import type { ProviderSource as _exa_codeium_common_pb_ProviderSource, ProviderSource__Output as _exa_codeium_common_pb_ProviderSource__Output } from '../../exa/codeium_common_pb/ProviderSource';
import type { Long } from '@grpc/proto-loader';

export interface CodeRange {
  'source'?: (_exa_codeium_common_pb_CodeSource);
  'startOffset'?: (number | string | Long);
  'endOffset'?: (number | string | Long);
  'modified'?: (boolean);
  'completionId'?: (string);
  'completionType'?: (_exa_codeium_common_pb_CompletionType);
  'providerSource'?: (_exa_codeium_common_pb_ProviderSource);
}

export interface CodeRange__Output {
  'source': (_exa_codeium_common_pb_CodeSource__Output);
  'startOffset': (string);
  'endOffset': (string);
  'modified': (boolean);
  'completionId': (string);
  'completionType': (_exa_codeium_common_pb_CompletionType__Output);
  'providerSource': (_exa_codeium_common_pb_ProviderSource__Output);
}
