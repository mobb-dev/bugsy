// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CompletionsRequest as _exa_codeium_common_pb_CompletionsRequest, CompletionsRequest__Output as _exa_codeium_common_pb_CompletionsRequest__Output } from '../../exa/codeium_common_pb/CompletionsRequest';
import type { StreamingEvalSuffixInfo as _exa_codeium_common_pb_StreamingEvalSuffixInfo, StreamingEvalSuffixInfo__Output as _exa_codeium_common_pb_StreamingEvalSuffixInfo__Output } from '../../exa/codeium_common_pb/StreamingEvalSuffixInfo';
import type { Long } from '@grpc/proto-loader';

export interface StreamingCompletionInfo {
  'completionIds'?: (string)[];
  'maxTokens'?: (number | string | Long);
  'temperature'?: (number | string);
  'topK'?: (number | string | Long);
  'topP'?: (number | string);
  'stopPatterns'?: (string)[];
  'promptLength'?: (number | string | Long);
  'modelTag'?: (string);
  'promptId'?: (string);
  'completionsRequest'?: (_exa_codeium_common_pb_CompletionsRequest | null);
  'evalSuffixInfo'?: (_exa_codeium_common_pb_StreamingEvalSuffixInfo | null);
}

export interface StreamingCompletionInfo__Output {
  'completionIds': (string)[];
  'maxTokens': (string);
  'temperature': (number);
  'topK': (string);
  'topP': (number);
  'stopPatterns': (string)[];
  'promptLength': (string);
  'modelTag': (string);
  'promptId': (string);
  'completionsRequest': (_exa_codeium_common_pb_CompletionsRequest__Output | null);
  'evalSuffixInfo': (_exa_codeium_common_pb_StreamingEvalSuffixInfo__Output | null);
}
