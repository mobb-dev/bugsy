// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface ChatStats {
  'chatsSent'?: (number | string | Long);
  'activeDeveloperDays'?: (number);
}

export interface ChatStats__Output {
  'chatsSent': (string);
  'activeDeveloperDays': (number);
}
