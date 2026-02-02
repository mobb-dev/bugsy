// Original file: exa/index_pb/index.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface IndexConfig {
  'pruneTime'?: (_google_protobuf_Timestamp | null);
  'pruneInterval'?: (_google_protobuf_Duration | null);
  'enablePrune'?: (boolean);
  'enableSmallestRepoFirst'?: (boolean);
  'enableRoundRobin'?: (boolean);
}

export interface IndexConfig__Output {
  'pruneTime': (_google_protobuf_Timestamp__Output | null);
  'pruneInterval': (_google_protobuf_Duration__Output | null);
  'enablePrune': (boolean);
  'enableSmallestRepoFirst': (boolean);
  'enableRoundRobin': (boolean);
}
