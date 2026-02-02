// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ModelInfo as _exa_codeium_common_pb_ModelInfo, ModelInfo__Output as _exa_codeium_common_pb_ModelInfo__Output } from '../../exa/codeium_common_pb/ModelInfo';

export interface ModelConfig {
  'generationModel'?: (_exa_codeium_common_pb_ModelInfo | null);
  'contextCheckModel'?: (_exa_codeium_common_pb_ModelInfo | null);
}

export interface ModelConfig__Output {
  'generationModel': (_exa_codeium_common_pb_ModelInfo__Output | null);
  'contextCheckModel': (_exa_codeium_common_pb_ModelInfo__Output | null);
}
