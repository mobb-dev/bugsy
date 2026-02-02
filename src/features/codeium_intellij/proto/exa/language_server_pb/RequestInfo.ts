// Original file: exa/language_server_pb/language_server.proto

import type { CompletionsRequest as _exa_codeium_common_pb_CompletionsRequest, CompletionsRequest__Output as _exa_codeium_common_pb_CompletionsRequest__Output } from '../../exa/codeium_common_pb/CompletionsRequest';
import type { CompletionType as _exa_codeium_common_pb_CompletionType, CompletionType__Output as _exa_codeium_common_pb_CompletionType__Output } from '../../exa/codeium_common_pb/CompletionType';

export interface RequestInfo {
  'promptId'?: (string);
  'completionsRequest'?: (_exa_codeium_common_pb_CompletionsRequest | null);
  'typingAsSuggestedPromptSuffix'?: (string);
  'completionType'?: (_exa_codeium_common_pb_CompletionType);
}

export interface RequestInfo__Output {
  'promptId': (string);
  'completionsRequest': (_exa_codeium_common_pb_CompletionsRequest__Output | null);
  'typingAsSuggestedPromptSuffix': (string);
  'completionType': (_exa_codeium_common_pb_CompletionType__Output);
}
