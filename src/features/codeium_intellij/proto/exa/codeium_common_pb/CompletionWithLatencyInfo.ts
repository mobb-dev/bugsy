// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Completion as _exa_codeium_common_pb_Completion, Completion__Output as _exa_codeium_common_pb_Completion__Output } from '../../exa/codeium_common_pb/Completion';
import type { CompletionLatencyInfo as _exa_codeium_common_pb_CompletionLatencyInfo, CompletionLatencyInfo__Output as _exa_codeium_common_pb_CompletionLatencyInfo__Output } from '../../exa/codeium_common_pb/CompletionLatencyInfo';

export interface CompletionWithLatencyInfo {
  'completion'?: (_exa_codeium_common_pb_Completion | null);
  'latencyInfo'?: (_exa_codeium_common_pb_CompletionLatencyInfo | null);
}

export interface CompletionWithLatencyInfo__Output {
  'completion': (_exa_codeium_common_pb_Completion__Output | null);
  'latencyInfo': (_exa_codeium_common_pb_CompletionLatencyInfo__Output | null);
}
