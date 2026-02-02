// Original file: exa/language_server_pb/language_server.proto

import type { TextOrScopeItem as _exa_codeium_common_pb_TextOrScopeItem, TextOrScopeItem__Output as _exa_codeium_common_pb_TextOrScopeItem__Output } from '../../exa/codeium_common_pb/TextOrScopeItem';
import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from '../../exa/codeium_common_pb/Metadata';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from '../../exa/codeium_common_pb/ExperimentConfig';
import type { CascadeConfig as _exa_cortex_pb_CascadeConfig, CascadeConfig__Output as _exa_cortex_pb_CascadeConfig__Output } from '../../exa/cortex_pb/CascadeConfig';
import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from '../../exa/codeium_common_pb/ImageData';
import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from '../../exa/cortex_pb/CortexTrajectoryStep';

export interface SendUserCascadeMessageRequest {
  'cascadeId'?: (string);
  'items'?: (_exa_codeium_common_pb_TextOrScopeItem)[];
  'metadata'?: (_exa_codeium_common_pb_Metadata | null);
  'experimentConfig'?: (_exa_codeium_common_pb_ExperimentConfig | null);
  'cascadeConfig'?: (_exa_cortex_pb_CascadeConfig | null);
  'images'?: (_exa_codeium_common_pb_ImageData)[];
  'recipeIds'?: (string)[];
  'blocking'?: (boolean);
  'additionalSteps'?: (_exa_cortex_pb_CortexTrajectoryStep)[];
}

export interface SendUserCascadeMessageRequest__Output {
  'cascadeId': (string);
  'items': (_exa_codeium_common_pb_TextOrScopeItem__Output)[];
  'metadata': (_exa_codeium_common_pb_Metadata__Output | null);
  'experimentConfig': (_exa_codeium_common_pb_ExperimentConfig__Output | null);
  'cascadeConfig': (_exa_cortex_pb_CascadeConfig__Output | null);
  'images': (_exa_codeium_common_pb_ImageData__Output)[];
  'recipeIds': (string)[];
  'blocking': (boolean);
  'additionalSteps': (_exa_cortex_pb_CortexTrajectoryStep__Output)[];
}
