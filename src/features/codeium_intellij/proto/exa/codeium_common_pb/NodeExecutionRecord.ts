// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { GraphExecutionState as _exa_codeium_common_pb_GraphExecutionState, GraphExecutionState__Output as _exa_codeium_common_pb_GraphExecutionState__Output } from '../../exa/codeium_common_pb/GraphExecutionState';
import type { Long } from '@grpc/proto-loader';

export interface NodeExecutionRecord {
  'nodeName'?: (string);
  'startTime'?: (_google_protobuf_Timestamp | null);
  'endTime'?: (_google_protobuf_Timestamp | null);
  'subgraphExecution'?: (_exa_codeium_common_pb_GraphExecutionState | null);
  'graphStateJson'?: (Buffer | Uint8Array | string);
  'graphStateJsonNumBytes'?: (number | string | Long);
}

export interface NodeExecutionRecord__Output {
  'nodeName': (string);
  'startTime': (_google_protobuf_Timestamp__Output | null);
  'endTime': (_google_protobuf_Timestamp__Output | null);
  'subgraphExecution': (_exa_codeium_common_pb_GraphExecutionState__Output | null);
  'graphStateJson': (Buffer);
  'graphStateJsonNumBytes': (string);
}
