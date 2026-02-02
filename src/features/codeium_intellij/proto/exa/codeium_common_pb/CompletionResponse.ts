// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Completion as _exa_codeium_common_pb_Completion, Completion__Output as _exa_codeium_common_pb_Completion__Output } from '../../exa/codeium_common_pb/Completion';
import type { CompletionProfile as _exa_codeium_common_pb_CompletionProfile, CompletionProfile__Output as _exa_codeium_common_pb_CompletionProfile__Output } from '../../exa/codeium_common_pb/CompletionProfile';
import type { Long } from '@grpc/proto-loader';

export interface CompletionResponse {
  'completions'?: (_exa_codeium_common_pb_Completion)[];
  'maxTokens'?: (number | string | Long);
  'temperature'?: (number | string);
  'topK'?: (number | string | Long);
  'topP'?: (number | string);
  'stopPatterns'?: (string)[];
  'promptLength'?: (number | string | Long);
  'promptId'?: (string);
  'modelTag'?: (string);
  'completionProfile'?: (_exa_codeium_common_pb_CompletionProfile | null);
  '_completionProfile'?: "completionProfile";
}

export interface CompletionResponse__Output {
  'completions': (_exa_codeium_common_pb_Completion__Output)[];
  'maxTokens': (string);
  'temperature': (number);
  'topK': (string);
  'topP': (number);
  'stopPatterns': (string)[];
  'promptLength': (string);
  'promptId': (string);
  'modelTag': (string);
  'completionProfile'?: (_exa_codeium_common_pb_CompletionProfile__Output | null);
  '_completionProfile'?: "completionProfile";
}
