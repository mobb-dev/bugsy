// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ContextScope as _exa_codeium_common_pb_ContextScope, ContextScope__Output as _exa_codeium_common_pb_ContextScope__Output } from '../../exa/codeium_common_pb/ContextScope';

export interface SetPinnedContextRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'pinnedScope'?: (_exa_codeium_common_pb_ContextScope | null);
}

export interface SetPinnedContextRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'pinnedScope': (_exa_codeium_common_pb_ContextScope__Output | null);
}
