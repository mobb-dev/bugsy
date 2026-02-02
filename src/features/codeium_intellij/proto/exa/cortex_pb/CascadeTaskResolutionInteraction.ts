// Original file: exa/cortex_pb/cortex.proto

import type { TaskResolution as _exa_cortex_pb_TaskResolution, TaskResolution__Output as _exa_cortex_pb_TaskResolution__Output } from '../../exa/cortex_pb/TaskResolution';

export interface CascadeTaskResolutionInteraction {
  'confirm'?: (boolean);
  'resolution'?: (_exa_cortex_pb_TaskResolution | null);
}

export interface CascadeTaskResolutionInteraction__Output {
  'confirm': (boolean);
  'resolution': (_exa_cortex_pb_TaskResolution__Output | null);
}
