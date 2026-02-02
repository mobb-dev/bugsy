// Original file: exa/cortex_pb/cortex.proto

import type { PlanEntryDeltaSummary as _exa_cortex_pb_PlanEntryDeltaSummary, PlanEntryDeltaSummary__Output as _exa_cortex_pb_PlanEntryDeltaSummary__Output } from '../../exa/cortex_pb/PlanEntryDeltaSummary';
import type { TaskEntryDeltaSummary as _exa_cortex_pb_TaskEntryDeltaSummary, TaskEntryDeltaSummary__Output as _exa_cortex_pb_TaskEntryDeltaSummary__Output } from '../../exa/cortex_pb/TaskEntryDeltaSummary';

export interface BrainEntryDeltaSummary {
  'plan'?: (_exa_cortex_pb_PlanEntryDeltaSummary | null);
  'task'?: (_exa_cortex_pb_TaskEntryDeltaSummary | null);
  'summary'?: "plan"|"task";
}

export interface BrainEntryDeltaSummary__Output {
  'plan'?: (_exa_cortex_pb_PlanEntryDeltaSummary__Output | null);
  'task'?: (_exa_cortex_pb_TaskEntryDeltaSummary__Output | null);
  'summary'?: "plan"|"task";
}
