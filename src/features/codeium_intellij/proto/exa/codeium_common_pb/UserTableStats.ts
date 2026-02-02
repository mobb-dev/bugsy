// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface UserTableStats {
  'name'?: (string);
  'email'?: (string);
  'lastUpdateTime'?: (_google_protobuf_Timestamp | null);
  'apiKey'?: (string);
  'disableCodeium'?: (boolean);
  'activeDays'?: (number);
  'role'?: (string);
  'signupTime'?: (_google_protobuf_Timestamp | null);
  'lastAutocompleteUsageTime'?: (_google_protobuf_Timestamp | null);
  'lastChatUsageTime'?: (_google_protobuf_Timestamp | null);
  'lastCommandUsageTime'?: (_google_protobuf_Timestamp | null);
  'promptCreditsUsed'?: (number | string | Long);
}

export interface UserTableStats__Output {
  'name': (string);
  'email': (string);
  'lastUpdateTime': (_google_protobuf_Timestamp__Output | null);
  'apiKey': (string);
  'disableCodeium': (boolean);
  'activeDays': (number);
  'role': (string);
  'signupTime': (_google_protobuf_Timestamp__Output | null);
  'lastAutocompleteUsageTime': (_google_protobuf_Timestamp__Output | null);
  'lastChatUsageTime': (_google_protobuf_Timestamp__Output | null);
  'lastCommandUsageTime': (_google_protobuf_Timestamp__Output | null);
  'promptCreditsUsed': (string);
}
