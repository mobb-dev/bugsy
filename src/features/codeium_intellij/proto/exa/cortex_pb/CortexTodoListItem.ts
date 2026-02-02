// Original file: exa/cortex_pb/cortex.proto

import type { CortexTodoListItemStatus as _exa_cortex_pb_CortexTodoListItemStatus, CortexTodoListItemStatus__Output as _exa_cortex_pb_CortexTodoListItemStatus__Output } from '../../exa/cortex_pb/CortexTodoListItemStatus';
import type { CortexTodoListItemPriority as _exa_cortex_pb_CortexTodoListItemPriority, CortexTodoListItemPriority__Output as _exa_cortex_pb_CortexTodoListItemPriority__Output } from '../../exa/cortex_pb/CortexTodoListItemPriority';

export interface CortexTodoListItem {
  'id'?: (string);
  'content'?: (string);
  'status'?: (_exa_cortex_pb_CortexTodoListItemStatus);
  'priority'?: (_exa_cortex_pb_CortexTodoListItemPriority);
}

export interface CortexTodoListItem__Output {
  'id': (string);
  'content': (string);
  'status': (_exa_cortex_pb_CortexTodoListItemStatus__Output);
  'priority': (_exa_cortex_pb_CortexTodoListItemPriority__Output);
}
