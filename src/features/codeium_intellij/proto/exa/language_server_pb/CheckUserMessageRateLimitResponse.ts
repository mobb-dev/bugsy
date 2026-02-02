// Original file: exa/language_server_pb/language_server.proto

import type { Long } from '@grpc/proto-loader';

export interface CheckUserMessageRateLimitResponse {
  'hasCapacity'?: (boolean);
  'message'?: (string);
  'messagesRemaining'?: (number);
  'maxMessages'?: (number);
  'resetsInSeconds'?: (number | string | Long);
}

export interface CheckUserMessageRateLimitResponse__Output {
  'hasCapacity': (boolean);
  'message': (string);
  'messagesRemaining': (number);
  'maxMessages': (number);
  'resetsInSeconds': (string);
}
