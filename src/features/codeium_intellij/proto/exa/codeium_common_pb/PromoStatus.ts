// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface PromoStatus {
  'isActive'?: (boolean);
  'endDate'?: (_google_protobuf_Timestamp | null);
  'label'?: (string);
}

export interface PromoStatus__Output {
  'isActive': (boolean);
  'endDate': (_google_protobuf_Timestamp__Output | null);
  'label': (string);
}
