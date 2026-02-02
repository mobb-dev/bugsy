// Original file: exa/cortex_pb/cortex.proto

import type { PlanInput as _exa_cortex_pb_PlanInput, PlanInput__Output as _exa_cortex_pb_PlanInput__Output } from '../../exa/cortex_pb/PlanInput';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface CortexPlanSummary {
  'cortexId'?: (string);
  'planInput'?: (_exa_cortex_pb_PlanInput | null);
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'done'?: (boolean);
}

export interface CortexPlanSummary__Output {
  'cortexId': (string);
  'planInput': (_exa_cortex_pb_PlanInput__Output | null);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'done': (boolean);
}
