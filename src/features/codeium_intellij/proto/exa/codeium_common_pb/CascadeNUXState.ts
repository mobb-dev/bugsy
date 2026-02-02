// Original file: exa/codeium_common_pb/codeium_common.proto

import type { CascadeNUXEvent as _exa_codeium_common_pb_CascadeNUXEvent, CascadeNUXEvent__Output as _exa_codeium_common_pb_CascadeNUXEvent__Output } from '../../exa/codeium_common_pb/CascadeNUXEvent';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface CascadeNUXState {
  'event'?: (_exa_codeium_common_pb_CascadeNUXEvent);
  'timestamp'?: (_google_protobuf_Timestamp | null);
}

export interface CascadeNUXState__Output {
  'event': (_exa_codeium_common_pb_CascadeNUXEvent__Output);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
}
