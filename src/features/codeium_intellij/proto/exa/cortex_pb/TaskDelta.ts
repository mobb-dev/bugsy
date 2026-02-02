// Original file: exa/cortex_pb/cortex.proto

import type { TaskDeltaType as _exa_cortex_pb_TaskDeltaType, TaskDeltaType__Output as _exa_cortex_pb_TaskDeltaType__Output } from '../../exa/cortex_pb/TaskDeltaType';
import type { TaskStatus as _exa_cortex_pb_TaskStatus, TaskStatus__Output as _exa_cortex_pb_TaskStatus__Output } from '../../exa/cortex_pb/TaskStatus';

export interface TaskDelta {
  'type'?: (_exa_cortex_pb_TaskDeltaType);
  'id'?: (string);
  'content'?: (string);
  'status'?: (_exa_cortex_pb_TaskStatus);
  'parentId'?: (string);
  'prevSiblingId'?: (string);
  'fromParent'?: (string);
  'fromPrevSibling'?: (string);
}

export interface TaskDelta__Output {
  'type': (_exa_cortex_pb_TaskDeltaType__Output);
  'id': (string);
  'content': (string);
  'status': (_exa_cortex_pb_TaskStatus__Output);
  'parentId': (string);
  'prevSiblingId': (string);
  'fromParent': (string);
  'fromPrevSibling': (string);
}
