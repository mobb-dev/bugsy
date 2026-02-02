// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { CompletionConfiguration as _exa_codeium_common_pb_CompletionConfiguration, CompletionConfiguration__Output as _exa_codeium_common_pb_CompletionConfiguration__Output } from '../../exa/codeium_common_pb/CompletionConfiguration';

export interface EditConfigurationRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'completionConfiguration'?: (_exa_codeium_common_pb_CompletionConfiguration | null);
}

export interface EditConfigurationRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'completionConfiguration': (_exa_codeium_common_pb_CompletionConfiguration__Output | null);
}
