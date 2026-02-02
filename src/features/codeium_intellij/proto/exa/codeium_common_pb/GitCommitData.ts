// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';

export interface GitCommitData {
  'sha'?: (string);
  'shortSha'?: (string);
  'subject'?: (string);
  'author'?: (string);
  'timestamp'?: (_google_protobuf_Timestamp | null);
  'insertions'?: (number);
  'deletions'?: (number);
}

export interface GitCommitData__Output {
  'sha': (string);
  'shortSha': (string);
  'subject': (string);
  'author': (string);
  'timestamp': (_google_protobuf_Timestamp__Output | null);
  'insertions': (number);
  'deletions': (number);
}
