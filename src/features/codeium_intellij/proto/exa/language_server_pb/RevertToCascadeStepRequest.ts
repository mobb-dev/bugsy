// Original file: exa/language_server_pb/language_server.proto

import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';

export interface RevertToCascadeStepRequest {
  'cascadeId'?: (string);
  'stepIndex'?: (number);
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'keepChanges'?: (boolean);
}

export interface RevertToCascadeStepRequest__Output {
  'cascadeId': (string);
  'stepIndex': (number);
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'keepChanges': (boolean);
}
