// Original file: exa/codeium_common_pb/codeium_common.proto

import type { AuthSource as _exa_codeium_common_pb_AuthSource, AuthSource__Output as _exa_codeium_common_pb_AuthSource__Output } from '../../exa/codeium_common_pb/AuthSource';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface Metadata {
  'ideName'?: (string);
  'extensionVersion'?: (string);
  'apiKey'?: (string);
  'locale'?: (string);
  'os'?: (string);
  'disableTelemetry'?: (boolean);
  'ideVersion'?: (string);
  'hardware'?: (string);
  'requestId'?: (number | string | Long);
  'sessionId'?: (string);
  'sourceAddress'?: (string);
  'extensionName'?: (string);
  'userAgent'?: (string);
  'url'?: (string);
  'authSource'?: (_exa_codeium_common_pb_AuthSource);
  'lsTimestamp'?: (_google_protobuf_Timestamp | null);
  'extensionPath'?: (string);
  'userId'?: (string);
  'userJwt'?: (string);
  'forceTeamId'?: (string);
  'deviceFingerprint'?: (string);
  'triggerId'?: (string);
  'planName'?: (string);
  'id'?: (string);
  'ideType'?: (string);
  'impersonateTier'?: (string);
}

export interface Metadata__Output {
  'ideName': (string);
  'extensionVersion': (string);
  'apiKey': (string);
  'locale': (string);
  'os': (string);
  'disableTelemetry': (boolean);
  'ideVersion': (string);
  'hardware': (string);
  'requestId': (string);
  'sessionId': (string);
  'sourceAddress': (string);
  'extensionName': (string);
  'userAgent': (string);
  'url': (string);
  'authSource': (_exa_codeium_common_pb_AuthSource__Output);
  'lsTimestamp': (_google_protobuf_Timestamp__Output | null);
  'extensionPath': (string);
  'userId': (string);
  'userJwt': (string);
  'forceTeamId': (string);
  'deviceFingerprint': (string);
  'triggerId': (string);
  'planName': (string);
  'id': (string);
  'ideType': (string);
  'impersonateTier': (string);
}
