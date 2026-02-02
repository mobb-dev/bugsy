// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { ChatStats as _exa_codeium_common_pb_ChatStats, ChatStats__Output as _exa_codeium_common_pb_ChatStats__Output } from '../../exa/codeium_common_pb/ChatStats';

export interface ChatStatsByDateEntry {
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'chatStats'?: (_exa_codeium_common_pb_ChatStats | null);
}

export interface ChatStatsByDateEntry__Output {
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'chatStats': (_exa_codeium_common_pb_ChatStats__Output | null);
}
