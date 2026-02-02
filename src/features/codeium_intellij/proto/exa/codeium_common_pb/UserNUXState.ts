// Original file: exa/codeium_common_pb/codeium_common.proto

import type { UserNUXEvent as _exa_codeium_common_pb_UserNUXEvent, UserNUXEvent__Output as _exa_codeium_common_pb_UserNUXEvent__Output } from '../../exa/codeium_common_pb/UserNUXEvent';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface UserNUXState {
  'event'?: (_exa_codeium_common_pb_UserNUXEvent);
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface UserNUXState__Output {
  'event': (_exa_codeium_common_pb_UserNUXEvent__Output);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}
