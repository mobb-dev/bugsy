// Original file: buf/validate/validate.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface DurationRules {
  'const'?: (_google_protobuf_Duration | null);
  'lt'?: (_google_protobuf_Duration | null);
  'lte'?: (_google_protobuf_Duration | null);
  'gt'?: (_google_protobuf_Duration | null);
  'gte'?: (_google_protobuf_Duration | null);
  'in'?: (_google_protobuf_Duration)[];
  'notIn'?: (_google_protobuf_Duration)[];
  'example'?: (_google_protobuf_Duration)[];
  'lessThan'?: "lt"|"lte";
  'greaterThan'?: "gt"|"gte";
}

export interface DurationRules__Output {
  'const': (_google_protobuf_Duration__Output | null);
  'lt'?: (_google_protobuf_Duration__Output | null);
  'lte'?: (_google_protobuf_Duration__Output | null);
  'gt'?: (_google_protobuf_Duration__Output | null);
  'gte'?: (_google_protobuf_Duration__Output | null);
  'in': (_google_protobuf_Duration__Output)[];
  'notIn': (_google_protobuf_Duration__Output)[];
  'example': (_google_protobuf_Duration__Output)[];
  'lessThan'?: "lt"|"lte";
  'greaterThan'?: "gt"|"gte";
}
