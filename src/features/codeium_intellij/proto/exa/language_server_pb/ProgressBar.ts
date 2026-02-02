// Original file: exa/language_server_pb/language_server.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface ProgressBar {
  'progress'?: (number | string);
  'text'?: (string);
  'hidden'?: (boolean);
  'remainingTime'?: (_google_protobuf_Duration | null);
}

export interface ProgressBar__Output {
  'progress': (number);
  'text': (string);
  'hidden': (boolean);
  'remainingTime': (_google_protobuf_Duration__Output | null);
}
