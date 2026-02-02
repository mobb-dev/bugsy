// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { LastUpdateType as _exa_codeium_common_pb_LastUpdateType, LastUpdateType__Output as _exa_codeium_common_pb_LastUpdateType__Output } from '../../exa/codeium_common_pb/LastUpdateType';

export interface LastUpdateRecord {
  'time'?: (_google_protobuf_Timestamp | null);
  'type'?: (_exa_codeium_common_pb_LastUpdateType);
}

export interface LastUpdateRecord__Output {
  'time': (_google_protobuf_Timestamp__Output | null);
  'type': (_exa_codeium_common_pb_LastUpdateType__Output);
}
