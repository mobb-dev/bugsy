// Original file: exa/cortex_pb/cortex.proto

import type { TaskDelta as _exa_cortex_pb_TaskDelta, TaskDelta__Output as _exa_cortex_pb_TaskDelta__Output } from '../../exa/cortex_pb/TaskDelta';

export interface TaskEntryDeltaSummary {
  'deltas'?: (_exa_cortex_pb_TaskDelta)[];
  'itemsAdded'?: (number);
  'itemsPruned'?: (number);
  'itemsDeleted'?: (number);
  'itemsUpdated'?: (number);
  'itemsMoved'?: (number);
}

export interface TaskEntryDeltaSummary__Output {
  'deltas': (_exa_cortex_pb_TaskDelta__Output)[];
  'itemsAdded': (number);
  'itemsPruned': (number);
  'itemsDeleted': (number);
  'itemsUpdated': (number);
  'itemsMoved': (number);
}
