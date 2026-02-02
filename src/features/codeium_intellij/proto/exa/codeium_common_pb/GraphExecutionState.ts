// Original file: exa/codeium_common_pb/codeium_common.proto

import type { NodeExecutionRecord as _exa_codeium_common_pb_NodeExecutionRecord, NodeExecutionRecord__Output as _exa_codeium_common_pb_NodeExecutionRecord__Output } from '../../exa/codeium_common_pb/NodeExecutionRecord';

export interface GraphExecutionState {
  'current'?: (_exa_codeium_common_pb_NodeExecutionRecord | null);
  'history'?: (_exa_codeium_common_pb_NodeExecutionRecord)[];
}

export interface GraphExecutionState__Output {
  'current': (_exa_codeium_common_pb_NodeExecutionRecord__Output | null);
  'history': (_exa_codeium_common_pb_NodeExecutionRecord__Output)[];
}
