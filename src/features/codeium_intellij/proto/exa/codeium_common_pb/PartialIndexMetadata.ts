// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface PartialIndexMetadata {
  'numTotalFiles'?: (number);
  'numIndexedFiles'?: (number);
  'cutoffTimestamp'?: (_google_protobuf_Timestamp | null);
}

export interface PartialIndexMetadata__Output {
  'numTotalFiles': (number);
  'numIndexedFiles': (number);
  'cutoffTimestamp': (_google_protobuf_Timestamp__Output | null);
}
