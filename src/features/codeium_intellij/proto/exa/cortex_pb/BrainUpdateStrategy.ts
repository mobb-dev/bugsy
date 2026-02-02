// Original file: exa/cortex_pb/cortex.proto

import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../google/protobuf/Empty';
import type { ForcedBrainUpdateConfig as _exa_cortex_pb_ForcedBrainUpdateConfig, ForcedBrainUpdateConfig__Output as _exa_cortex_pb_ForcedBrainUpdateConfig__Output } from '../../exa/cortex_pb/ForcedBrainUpdateConfig';
import type { DynamicBrainUpdateConfig as _exa_cortex_pb_DynamicBrainUpdateConfig, DynamicBrainUpdateConfig__Output as _exa_cortex_pb_DynamicBrainUpdateConfig__Output } from '../../exa/cortex_pb/DynamicBrainUpdateConfig';

export interface BrainUpdateStrategy {
  'executorForced'?: (_google_protobuf_Empty | null);
  'invocationForced'?: (_exa_cortex_pb_ForcedBrainUpdateConfig | null);
  'executorForcedAndWithDiscretion'?: (_google_protobuf_Empty | null);
  'dynamicUpdate'?: (_exa_cortex_pb_DynamicBrainUpdateConfig | null);
  'strategy'?: "executorForced"|"invocationForced"|"dynamicUpdate"|"executorForcedAndWithDiscretion";
}

export interface BrainUpdateStrategy__Output {
  'executorForced'?: (_google_protobuf_Empty__Output | null);
  'invocationForced'?: (_exa_cortex_pb_ForcedBrainUpdateConfig__Output | null);
  'executorForcedAndWithDiscretion'?: (_google_protobuf_Empty__Output | null);
  'dynamicUpdate'?: (_exa_cortex_pb_DynamicBrainUpdateConfig__Output | null);
  'strategy'?: "executorForced"|"invocationForced"|"dynamicUpdate"|"executorForcedAndWithDiscretion";
}
