// Original file: exa/cortex_pb/cortex.proto

import type { CortexWorkflowState as _exa_cortex_pb_CortexWorkflowState, CortexWorkflowState__Output as _exa_cortex_pb_CortexWorkflowState__Output } from '../../exa/cortex_pb/CortexWorkflowState';
import type { GraphExecutionState as _exa_codeium_common_pb_GraphExecutionState, GraphExecutionState__Output as _exa_codeium_common_pb_GraphExecutionState__Output } from '../../exa/codeium_common_pb/GraphExecutionState';

export interface CortexRunState {
  'workflowState'?: (_exa_cortex_pb_CortexWorkflowState | null);
  'executionState'?: (_exa_codeium_common_pb_GraphExecutionState | null);
  'done'?: (boolean);
}

export interface CortexRunState__Output {
  'workflowState': (_exa_cortex_pb_CortexWorkflowState__Output | null);
  'executionState': (_exa_codeium_common_pb_GraphExecutionState__Output | null);
  'done': (boolean);
}
