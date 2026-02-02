// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { PlanInfo as _exa_codeium_common_pb_PlanInfo, PlanInfo__Output as _exa_codeium_common_pb_PlanInfo__Output } from '../../exa/codeium_common_pb/PlanInfo';

export interface GenerateCommitMessageRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'planInfo'?: (_exa_codeium_common_pb_PlanInfo | null);
}

export interface GenerateCommitMessageRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'planInfo': (_exa_codeium_common_pb_PlanInfo__Output | null);
}
