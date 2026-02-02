// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface CompletionLatencyInfo {
  'apiServerLatencyMs'?: (number | string | Long);
  'languageServerLatencyMs'?: (number | string | Long);
  'networkLatencyMs'?: (number | string | Long);
  'apiServerFirstByteLatencyMs'?: (number | string | Long);
  'languageServerFirstByteLatencyMs'?: (number | string | Long);
  'networkFirstByteLatencyMs'?: (number | string | Long);
  'apiServerFirstLineLatencyMs'?: (number | string | Long);
  'languageServerFirstLineLatencyMs'?: (number | string | Long);
  'networkFirstLineLatencyMs'?: (number | string | Long);
}

export interface CompletionLatencyInfo__Output {
  'apiServerLatencyMs': (string);
  'languageServerLatencyMs': (string);
  'networkLatencyMs': (string);
  'apiServerFirstByteLatencyMs': (string);
  'languageServerFirstByteLatencyMs': (string);
  'networkFirstByteLatencyMs': (string);
  'apiServerFirstLineLatencyMs': (string);
  'languageServerFirstLineLatencyMs': (string);
  'networkFirstLineLatencyMs': (string);
}
