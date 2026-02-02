// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ContextSnippetType as _exa_codeium_common_pb_ContextSnippetType, ContextSnippetType__Output as _exa_codeium_common_pb_ContextSnippetType__Output } from '../../exa/codeium_common_pb/ContextSnippetType';
import type { Long } from '@grpc/proto-loader';

export interface ContextSubrange {
  'snippetType'?: (_exa_codeium_common_pb_ContextSnippetType);
  'startOffset'?: (number | string | Long);
  'endOffset'?: (number | string | Long);
}

export interface ContextSubrange__Output {
  'snippetType': (_exa_codeium_common_pb_ContextSnippetType__Output);
  'startOffset': (string);
  'endOffset': (string);
}
