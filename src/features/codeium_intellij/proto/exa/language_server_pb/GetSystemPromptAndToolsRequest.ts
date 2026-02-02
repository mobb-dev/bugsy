// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { CascadeConfig as _exa_cortex_pb_CascadeConfig, CascadeConfig__Output as _exa_cortex_pb_CascadeConfig__Output } from '../../exa/cortex_pb/CascadeConfig';

export interface GetSystemPromptAndToolsRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'cascadeConfig'?: (_exa_cortex_pb_CascadeConfig | null);
}

export interface GetSystemPromptAndToolsRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'cascadeConfig': (_exa_cortex_pb_CascadeConfig__Output | null);
}
