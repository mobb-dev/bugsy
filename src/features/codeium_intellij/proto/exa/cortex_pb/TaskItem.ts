// Original file: exa/cortex_pb/cortex.proto

import type { TaskStatus as _exa_cortex_pb_TaskStatus, TaskStatus__Output as _exa_cortex_pb_TaskStatus__Output } from '../../exa/cortex_pb/TaskStatus';

export interface TaskItem {
  'id'?: (string);
  'content'?: (string);
  'status'?: (_exa_cortex_pb_TaskStatus);
  'parentId'?: (string);
  'prevSiblingId'?: (string);
}

export interface TaskItem__Output {
  'id': (string);
  'content': (string);
  'status': (_exa_cortex_pb_TaskStatus__Output);
  'parentId': (string);
  'prevSiblingId': (string);
}
