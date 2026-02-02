// Original file: exa/language_server_pb/language_server.proto

import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';

export interface UpdateEnterpriseExperimentsFromUrlResponse {
  'success'?: (boolean);
  'errorMessage'?: (string);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
}

export interface UpdateEnterpriseExperimentsFromUrlResponse__Output {
  'success': (boolean);
  'errorMessage': (string);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
}
