// Original file: exa/cortex_pb/cortex.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface CortexMemoryMetadata {
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'lastModified'?: (_google_protobuf_Timestamp | null);
  'lastAccessed'?: (_google_protobuf_Timestamp | null);
  'tags'?: (string)[];
  'userTriggered'?: (boolean);
}

export interface CortexMemoryMetadata__Output {
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'lastModified': (_google_protobuf_Timestamp__Output | null);
  'lastAccessed': (_google_protobuf_Timestamp__Output | null);
  'tags': (string)[];
  'userTriggered': (boolean);
}
