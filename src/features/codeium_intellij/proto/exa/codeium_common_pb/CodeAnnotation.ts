// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface CodeAnnotation {
  'id'?: (string);
  'uri'?: (string);
  'line'?: (number);
  'content'?: (string);
  'createdAt'?: (_google_protobuf_Timestamp | null);
}

export interface CodeAnnotation__Output {
  'id': (string);
  'uri': (string);
  'line': (number);
  'content': (string);
  'createdAt': (_google_protobuf_Timestamp__Output | null);
}
