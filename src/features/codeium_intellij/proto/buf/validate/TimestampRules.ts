// Original file: buf/validate/validate.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface TimestampRules {
  'const'?: (_google_protobuf_Timestamp | null);
  'lt'?: (_google_protobuf_Timestamp | null);
  'lte'?: (_google_protobuf_Timestamp | null);
  'gt'?: (_google_protobuf_Timestamp | null);
  'gte'?: (_google_protobuf_Timestamp | null);
  'ltNow'?: (boolean);
  'gtNow'?: (boolean);
  'within'?: (_google_protobuf_Duration | null);
  'example'?: (_google_protobuf_Timestamp)[];
  'lessThan'?: "lt"|"lte"|"ltNow";
  'greaterThan'?: "gt"|"gte"|"gtNow";
}

export interface TimestampRules__Output {
  'const': (_google_protobuf_Timestamp__Output | null);
  'lt'?: (_google_protobuf_Timestamp__Output | null);
  'lte'?: (_google_protobuf_Timestamp__Output | null);
  'gt'?: (_google_protobuf_Timestamp__Output | null);
  'gte'?: (_google_protobuf_Timestamp__Output | null);
  'ltNow'?: (boolean);
  'gtNow'?: (boolean);
  'within': (_google_protobuf_Duration__Output | null);
  'example': (_google_protobuf_Timestamp__Output)[];
  'lessThan'?: "lt"|"lte"|"ltNow";
  'greaterThan'?: "gt"|"gte"|"gtNow";
}
