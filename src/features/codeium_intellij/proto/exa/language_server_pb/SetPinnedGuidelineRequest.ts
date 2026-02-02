// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { Guideline as _exa_codeium_common_pb_Guideline, Guideline__Output as _exa_codeium_common_pb_Guideline__Output } from '../../exa/codeium_common_pb/Guideline';

export interface SetPinnedGuidelineRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'pinnedGuideline'?: (_exa_codeium_common_pb_Guideline | null);
}

export interface SetPinnedGuidelineRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'pinnedGuideline': (_exa_codeium_common_pb_Guideline__Output | null);
}
