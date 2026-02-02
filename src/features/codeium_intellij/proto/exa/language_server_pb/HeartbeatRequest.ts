// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ErrorTrace as _exa_codeium_common_pb_ErrorTrace, ErrorTrace__Output as _exa_codeium_common_pb_ErrorTrace__Output } from '../../exa/codeium_common_pb/ErrorTrace';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';

export interface HeartbeatRequest {
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'previousErrorTraces'?: (_exa_codeium_common_pb_ErrorTrace)[];
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
}

export interface HeartbeatRequest__Output {
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'previousErrorTraces': (_exa_codeium_common_pb_ErrorTrace__Output)[];
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
}
