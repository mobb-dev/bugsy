// Original file: exa/index_pb/index.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface ProgressBar {
  'progress'?: (number | string);
  'text'?: (string);
  'remainingTime'?: (_google_protobuf_Duration | null);
}

export interface ProgressBar__Output {
  'progress': (number);
  'text': (string);
  'remainingTime': (_google_protobuf_Duration__Output | null);
}
