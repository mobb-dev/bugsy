// Original file: exa/codeium_common_pb/codeium_common.proto

import type { Long } from '@grpc/proto-loader';

export interface PromptStageLatency {
  'name'?: (string);
  'latencyMs'?: (number | string | Long);
}

export interface PromptStageLatency__Output {
  'name': (string);
  'latencyMs': (string);
}
