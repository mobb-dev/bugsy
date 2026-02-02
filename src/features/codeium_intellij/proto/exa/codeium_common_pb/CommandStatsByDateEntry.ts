// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { CommandStats as _exa_codeium_common_pb_CommandStats, CommandStats__Output as _exa_codeium_common_pb_CommandStats__Output } from '../../exa/codeium_common_pb/CommandStats';

export interface CommandStatsByDateEntry {
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'commandStats'?: (_exa_codeium_common_pb_CommandStats | null);
}

export interface CommandStatsByDateEntry__Output {
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'commandStats': (_exa_codeium_common_pb_CommandStats__Output | null);
}
