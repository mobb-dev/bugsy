// Original file: exa/language_server_pb/language_server.proto

import type { UnleashContext as _exa_codeium_common_pb_UnleashContext, UnleashContext__Output as _exa_codeium_common_pb_UnleashContext__Output } from '../../exa/codeium_common_pb/UnleashContext';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';

export interface GetUnleashDataResponse {
  'context'?: (_exa_codeium_common_pb_UnleashContext | null);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
}

export interface GetUnleashDataResponse__Output {
  'context': (_exa_codeium_common_pb_UnleashContext__Output | null);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
}
