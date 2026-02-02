// Original file: exa/codeium_common_pb/codeium_common.proto

import type { PlanInfo as _exa_codeium_common_pb_PlanInfo, PlanInfo__Output as _exa_codeium_common_pb_PlanInfo__Output } from '../../exa/codeium_common_pb/PlanInfo';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { TopUpStatus as _exa_codeium_common_pb_TopUpStatus, TopUpStatus__Output as _exa_codeium_common_pb_TopUpStatus__Output } from '../../exa/codeium_common_pb/TopUpStatus';

export interface PlanStatus {
  'planInfo'?: (_exa_codeium_common_pb_PlanInfo | null);
  'planStart'?: (_google_protobuf_Timestamp | null);
  'planEnd'?: (_google_protobuf_Timestamp | null);
  'availableFlexCredits'?: (number);
  'usedFlowCredits'?: (number);
  'usedPromptCredits'?: (number);
  'usedFlexCredits'?: (number);
  'availablePromptCredits'?: (number);
  'availableFlowCredits'?: (number);
  'topUpStatus'?: (_exa_codeium_common_pb_TopUpStatus | null);
  'wasReducedByOrphanedUsage'?: (boolean);
}

export interface PlanStatus__Output {
  'planInfo': (_exa_codeium_common_pb_PlanInfo__Output | null);
  'planStart': (_google_protobuf_Timestamp__Output | null);
  'planEnd': (_google_protobuf_Timestamp__Output | null);
  'availableFlexCredits': (number);
  'usedFlowCredits': (number);
  'usedPromptCredits': (number);
  'usedFlexCredits': (number);
  'availablePromptCredits': (number);
  'availableFlowCredits': (number);
  'topUpStatus': (_exa_codeium_common_pb_TopUpStatus__Output | null);
  'wasReducedByOrphanedUsage': (boolean);
}
