// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { CompletionStatistics as _exa_codeium_common_pb_CompletionStatistics, CompletionStatistics__Output as _exa_codeium_common_pb_CompletionStatistics__Output } from '../../exa/codeium_common_pb/CompletionStatistics';

export interface CompletionByDateEntry {
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'completionStatistics'?: (_exa_codeium_common_pb_CompletionStatistics | null);
}

export interface CompletionByDateEntry__Output {
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'completionStatistics': (_exa_codeium_common_pb_CompletionStatistics__Output | null);
}
