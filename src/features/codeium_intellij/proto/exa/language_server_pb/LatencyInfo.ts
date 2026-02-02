// Original file: exa/language_server_pb/language_server.proto

import type { PromptStageLatency as _exa_codeium_common_pb_PromptStageLatency, PromptStageLatency__Output as _exa_codeium_common_pb_PromptStageLatency__Output } from '../../exa/codeium_common_pb/PromptStageLatency';
import type { Long } from '@grpc/proto-loader';

export interface LatencyInfo {
  'clientLatencyMs'?: (number | string | Long);
  'promptLatencyMs'?: (number | string | Long);
  'promptStageLatencies'?: (_exa_codeium_common_pb_PromptStageLatency)[];
  'debounceLatencyMs'?: (number | string | Long);
  'rpcLatencyMs'?: (number | string | Long);
  'networkLatencyMs'?: (number | string | Long);
}

export interface LatencyInfo__Output {
  'clientLatencyMs': (string);
  'promptLatencyMs': (string);
  'promptStageLatencies': (_exa_codeium_common_pb_PromptStageLatency__Output)[];
  'debounceLatencyMs': (string);
  'rpcLatencyMs': (string);
  'networkLatencyMs': (string);
}
